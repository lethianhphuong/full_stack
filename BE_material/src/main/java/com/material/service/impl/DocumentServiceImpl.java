package com.material.service.impl;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.material.dto.DocumentCallbackDTO;
import com.material.dto.DocumentFilterDTO;
import com.material.entity.DocumentContentEntity;
import com.material.entity.DocumentEntity;
import com.material.exception.AppException;
import com.material.exception.ResourceNotFoundException;
import com.material.repo.DocumentRepo;
import com.material.repository.DocumentContentRepo;
import com.material.service.DocumentService;
import com.material.vo.DocumentConfigVO;
import com.material.vo.DocumentVO;
import com.material.vo.PageVO;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepo documentRepo;
    private final DocumentContentRepo documentContentRepo;

    @Value("${app.onlyoffice.document-server-url:http://localhost:8088/}")
    private String documentServerUrl;

    @Value("${app.onlyoffice.backend-host-for-docker:http://host.docker.internal:8080}")
    private String backendHostForDocker;

    @Value("${app.onlyoffice.backend-host-for-client:http://localhost:8080}")
    private String backendHostForClient;

    @PostConstruct
    public void init() {
        initSampleDocuments();
    }

    @Override
    @Transactional(readOnly = true)
    public PageVO<DocumentVO> getDocuments(DocumentFilterDTO filterDTO) {
        if (filterDTO == null) {
            filterDTO = new DocumentFilterDTO();
        }
        int pageNumber = Math.max(filterDTO.getPage(), 0);
        int pageSize = filterDTO.getSize() > 0 ? filterDTO.getSize() : 10;
        String sortStr = filterDTO.getSort() != null && !filterDTO.getSort().isBlank()
                ? filterDTO.getSort() : "createdAt,desc";
        String[] sortParts = sortStr.split(",");
        String sortProperty = sortParts[0];
        Sort.Direction sortDirection = sortParts.length > 1 && "asc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortProperty));

        final DocumentFilterDTO finalFilter = filterDTO;
        Specification<DocumentEntity> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (finalFilter.getSearch() != null && !finalFilter.getSearch().isBlank()) {
                String pattern = "%" + finalFilter.getSearch().trim().toLowerCase() + "%";
                var searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("fileName")), pattern)
                );
                predicates = cb.and(predicates, searchPredicate);
            }

            if (finalFilter.getFileType() != null && !finalFilter.getFileType().isBlank() && !"all".equalsIgnoreCase(finalFilter.getFileType())) {
                predicates = cb.and(predicates, cb.equal(cb.lower(root.get("fileType")), finalFilter.getFileType().trim().toLowerCase()));
            }

            return predicates;
        };

        Page<DocumentVO> page = documentRepo.findAll(spec, pageable).map(this::toVO);
        return PageVO.of(page, getDocumentStats());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getDocumentStats() {
        long total = documentRepo.count();
        long docx = documentRepo.countByFileType("docx");
        long xlsx = documentRepo.countByFileType("xlsx");
        long pptx = documentRepo.countByFileType("pptx");
        long pdf = documentRepo.countByFileType("pdf");

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("docx", docx);
        stats.put("xlsx", xlsx);
        stats.put("pptx", pptx);
        stats.put("pdf", pdf);
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentVO> getAllDocuments() {
        return documentRepo.findAll().stream().map(this::toVO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentVO getDocumentById(UUID id) {
        DocumentEntity doc = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu", id));
        return toVO(doc);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentConfigVO getEditorConfig(UUID id, boolean readOnly, String currentUserId, String currentUserName) {
        DocumentEntity doc = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu", id));

        String fileType = doc.getFileType().toLowerCase();
        String documentType = getDocumentType(fileType);

        // URL để OnlyOffice (trong Docker) tải file và gửi callback về Backend
        String fileDownloadUrl = String.format("%s/api/v1/documents/%s/download", backendHostForDocker, id);
        String callbackUrl = String.format("%s/api/v1/documents/%s/callback", backendHostForDocker, id);

        Map<String, Object> documentMap = new LinkedHashMap<>();
        documentMap.put("fileType", fileType);
        documentMap.put("key", doc.getDocumentKey());
        documentMap.put("title", doc.getTitle());
        documentMap.put("url", fileDownloadUrl);

        Map<String, Object> permissions = new LinkedHashMap<>();
        permissions.put("edit", !readOnly);
        permissions.put("download", true);
        permissions.put("print", true);
        permissions.put("comment", true);
        permissions.put("review", true);
        documentMap.put("permissions", permissions);

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", currentUserId != null ? currentUserId : "user-default");
        userMap.put("name", currentUserName != null ? currentUserName : "Người dùng hệ thống");

        Map<String, Object> customization = new LinkedHashMap<>();
        customization.put("autosave", true);
        customization.put("forcesave", true);
        customization.put("comments", true);
        customization.put("compactHeader", true);
        Map<String, Object> logoMap = new LinkedHashMap<>();
        logoMap.put("visible", false);
        logoMap.put("image", "");
        logoMap.put("imageEmbedded", "");
        logoMap.put("url", "");
        customization.put("logo", logoMap);
        customization.put("help", false);
        customization.put("feedback", false);
        Map<String, Object> features = new LinkedHashMap<>();
        features.put("spellcheck", false);
        customization.put("features", features);

        Map<String, Object> editorConfigMap = new LinkedHashMap<>();
        editorConfigMap.put("lang", "vi");
        editorConfigMap.put("mode", readOnly ? "view" : "edit");
        editorConfigMap.put("user", userMap);
        editorConfigMap.put("customization", customization);
        editorConfigMap.put("callbackUrl", callbackUrl);

        Map<String, Object> config = new LinkedHashMap<>();
        config.put("document", documentMap);
        config.put("documentType", documentType);
        config.put("editorConfig", editorConfigMap);

        return DocumentConfigVO.builder()
                .documentServerUrl(documentServerUrl)
                .displayName(doc.getTitle())
                .config(config)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadDocumentAsResource(UUID id) {
        DocumentEntity doc = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu", id));

        DocumentContentEntity content = documentContentRepo.findById(id)
                .orElseThrow(() -> new AppException(404, "Không tìm thấy nội dung file cho tài liệu: " + doc.getTitle()));

        return new ByteArrayResource(content.getFileData());
    }

    @Override
    @Transactional
    public void handleCallback(UUID id, DocumentCallbackDTO callbackDTO) throws IOException {
        log.info("[OnlyOffice Callback] Nhận tín hiệu từ Document Server cho Document ID: {}, Status: {}",
                id, callbackDTO.getStatus());

        // Status 2: Tài liệu sẵn sàng lưu (đóng tab/lưu tự động)
        // Status 6: Force save (bấm nút Lưu tức thì)
        if (callbackDTO.getStatus() != null && (callbackDTO.getStatus() == 2 || callbackDTO.getStatus() == 6)) {
            String downloadUrl = callbackDTO.getUrl();
            if (!StringUtils.hasText(downloadUrl)) {
                log.warn("[OnlyOffice Callback] URL tải file mới từ OnlyOffice rỗng!");
                return;
            }

            DocumentEntity doc = documentRepo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Tài liệu", id));

            byte[] newBytes;
            try (InputStream in = URI.create(downloadUrl).toURL().openStream()) {
                newBytes = in.readAllBytes();
                log.info("[OnlyOffice Callback] Đã tải về {} bytes từ OnlyOffice", newBytes.length);
            }

            // Lưu trực tiếp mảng byte vào bảng tbl_document_contents
            DocumentContentEntity content = DocumentContentEntity.builder()
                    .documentId(id)
                    .fileData(newBytes)
                    .build();
            documentContentRepo.save(content);

            // Cập nhật kích thước và documentKey mới trong tbl_documents
            doc.setFileSize((long) newBytes.length);
            doc.setDocumentKey(String.format("doc-%s-%d", id, System.currentTimeMillis()));

            documentRepo.save(doc);
            log.info("[OnlyOffice Callback] Cập nhật metadata và nội dung Byte vào MySQL thành công!");
        }
    }

    @Override
    @Transactional
    public DocumentVO uploadDocument(MultipartFile file, String title) throws IOException {
        if (file.isEmpty()) {
            throw new AppException(400, "File tải lên không được rỗng");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String ext = getFileExtension(originalFileName);
        byte[] bytes = file.getBytes();

        DocumentEntity entity = DocumentEntity.builder()
                .title(StringUtils.hasText(title) ? title : originalFileName)
                .fileName(originalFileName)
                .fileType(ext)
                .fileSize((long) bytes.length)
                .documentKey("doc-" + UUID.randomUUID())
                .build();

        DocumentEntity saved = documentRepo.save(entity);

        DocumentContentEntity content = DocumentContentEntity.builder()
                .documentId(saved.getId())
                .fileData(bytes)
                .build();
        documentContentRepo.save(content);

        log.info("[Document] Tải file lên và lưu Byte vào MySQL thành công: ID={}", saved.getId());
        return toVO(saved);
    }

    @Override
    @Transactional
    public void deleteDocument(UUID id) {
        DocumentEntity doc = documentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu", id));

        documentContentRepo.deleteById(id);
        documentRepo.delete(doc);
        log.info("[Document] Đã xóa tài liệu và nội dung Byte khỏi MySQL: ID={}", id);
    }

    @Override
    @Transactional
    public DocumentVO createEmptyDocument(String title, String fileType) {
        String ext = fileType.toLowerCase();
        String fileName = StringUtils.hasText(title) ? title : ("Tai_lieu_moi." + ext);
        if (!fileName.endsWith("." + ext)) {
            fileName += "." + ext;
        }

        Path feDocsPath = Paths.get("d:/FULL_STASK/MAU_Material/FE_material/public/docs");
        String sampleName = switch (ext) {
            case "xlsx" -> "bang-tinh-mau.xlsx";
            case "pptx" -> "bai-trinh-bay-mau.pptx";
            case "pdf" -> "bai-giang-mau.pdf";
            default -> "bao-cao-mau.docx";
        };

        byte[] bytes;
        try {
            Path source = feDocsPath.resolve(sampleName);
            if (Files.exists(source)) {
                bytes = Files.readAllBytes(source);
            } else {
                bytes = ("Tài liệu " + title).getBytes();
            }
        } catch (Exception e) {
            bytes = ("Tài liệu " + title).getBytes();
        }

        DocumentEntity entity = DocumentEntity.builder()
                .title(StringUtils.hasText(title) ? title : fileName)
                .fileName(fileName)
                .fileType(ext)
                .fileSize((long) bytes.length)
                .documentKey("doc-" + UUID.randomUUID())
                .build();

        DocumentEntity saved = documentRepo.save(entity);

        DocumentContentEntity content = DocumentContentEntity.builder()
                .documentId(saved.getId())
                .fileData(bytes)
                .build();
        documentContentRepo.save(content);

        log.info("[Document] Tạo tài liệu mới thành công: ID={}", saved.getId());
        return toVO(saved);
    }

    @Override
    @Transactional
    public void initSampleDocuments() {
        if (documentRepo.count() > 0) {
            return;
        }

        log.info("[OnlyOffice] Khởi tạo các tài liệu mẫu ban đầu lưu vào MySQL...");
        Path feDocsPath = Paths.get("d:/FULL_STASK/MAU_Material/FE_material/public/docs");

        createSampleDoc(feDocsPath, "bao-cao-mau.docx", "Báo cáo mẫu.docx", "docx");
        createSampleDoc(feDocsPath, "bang-tinh-mau.xlsx", "Bảng tính mẫu.xlsx", "xlsx");
        createSampleDoc(feDocsPath, "bai-trinh-bay-mau.pptx", "Bài trình bày mẫu.pptx", "pptx");
        createSampleDoc(feDocsPath, "bai-giang-mau.pdf", "Bài giảng mẫu.pdf", "pdf");
    }

    private void createSampleDoc(Path feDocsPath, String fileName, String title, String fileType) {
        try {
            Path sourceFile = feDocsPath.resolve(fileName);
            byte[] bytes;
            if (Files.exists(sourceFile)) {
                bytes = Files.readAllBytes(sourceFile);
            } else {
                bytes = ("Nội dung mẫu của " + title).getBytes();
            }

            DocumentEntity entity = DocumentEntity.builder()
                    .title(title)
                    .fileName(fileName)
                    .fileType(fileType)
                    .fileSize((long) bytes.length)
                    .documentKey("sample-" + fileType + "-001")
                    .build();

            DocumentEntity saved = documentRepo.save(entity);

            DocumentContentEntity content = DocumentContentEntity.builder()
                    .documentId(saved.getId())
                    .fileData(bytes)
                    .build();
            documentContentRepo.save(content);

            log.info("[OnlyOffice] Khởi tạo thành công file mẫu '{}' vào MySQL", fileName);
        } catch (Exception ex) {
            log.error("[OnlyOffice] Lỗi khi tạo file mẫu {}: {}", fileName, ex.getMessage());
        }
    }

    private String getDocumentType(String ext) {
        return switch (ext.toLowerCase()) {
            case "xlsx", "xls", "csv" -> "cell";
            case "pptx", "ppt" -> "slide";
            case "pdf" -> "pdf";
            default -> "word";
        };
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex >= 0 ? fileName.substring(dotIndex + 1) : "";
    }

    private DocumentVO toVO(DocumentEntity entity) {
        String downloadUrl = String.format("%s/api/v1/documents/%s/download", backendHostForClient, entity.getId());
        return DocumentVO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .fileName(entity.getFileName())
                .fileType(entity.getFileType())
                .fileSize(entity.getFileSize())
                .documentKey(entity.getDocumentKey())
                .downloadUrl(downloadUrl)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
