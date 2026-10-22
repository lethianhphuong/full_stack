package com.material.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.material.dto.DocumentCallbackDTO;
import com.material.dto.DocumentFilterDTO;
import com.material.service.DocumentService;
import com.material.vo.ApiResponse;
import com.material.vo.DocumentConfigVO;
import com.material.vo.DocumentVO;
import com.material.vo.PageVO;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Tag(name = "Document Management", description = "Quản lý tài liệu và tích hợp OnlyOffice Editor")
@Slf4j
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tài liệu phân trang, tìm kiếm và lọc định dạng (Mặc định: page=0, size=10)")
    public ApiResponse<PageVO<DocumentVO>> getDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String fileType) {
        DocumentFilterDTO filterDTO = new DocumentFilterDTO();
        filterDTO.setPage(page);
        filterDTO.setSize(size);
        filterDTO.setSort(sort);
        filterDTO.setSearch(search);
        filterDTO.setFileType(fileType);
        return ApiResponse.ok(documentService.getDocuments(filterDTO));
    }

    @GetMapping("/stats")
    @Operation(summary = "Lấy số lượng thống kê tài liệu (kèm page, size mặc định)")
    public ApiResponse<Map<String, Object>> getDocumentStats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Long> rawStats = documentService.getDocumentStats();
        Map<String, Object> stats = new java.util.HashMap<>(rawStats);
        stats.put("page", page);
        stats.put("size", size);
        return ApiResponse.ok(stats);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết một tài liệu")
    public ApiResponse<DocumentVO> getDocumentById(@PathVariable UUID id) {
        return ApiResponse.ok(documentService.getDocumentById(id));
    }

    @GetMapping("/{id}/config")
    @Operation(summary = "Lấy cấu hình OnlyOffice Editor (URL, key, permissions, callbackUrl)")
    public ApiResponse<DocumentConfigVO> getEditorConfig(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "false") boolean readOnly) {
        return ApiResponse.ok(documentService.getEditorConfig(id, readOnly, "user-01", "Quản trị viên"));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Tải file tài liệu nhị phân (dành cho OnlyOffice Document Server hoặc tải về máy)")
    public ResponseEntity<Resource> downloadDocument(@PathVariable UUID id) {
        DocumentVO doc = documentService.getDocumentById(id);
        Resource resource = documentService.loadDocumentAsResource(id);

        String contentType = determineContentType(doc.getFileType());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
    }

    @PostMapping("/{id}/callback")
    @Operation(summary = "Webhook nhận tín hiệu lưu file từ OnlyOffice Document Server (Status 2/6)")
    public Map<String, Object> handleOnlyOfficeCallback(
            @PathVariable UUID id,
            @RequestBody DocumentCallbackDTO callbackDTO) {
        log.info("[OnlyOffice Webhook] Nhận request callback từ OnlyOffice cho document {}: status={}",
                id, callbackDTO.getStatus());

        try {
            documentService.handleCallback(id, callbackDTO);
            // OnlyOffice Document Server yêu cầu phản hồi JSON {"error": 0} để xác nhận đã lưu thành công
            return Map.of("error", 0);
        } catch (Exception ex) {
            log.error("[OnlyOffice Webhook] Lỗi khi xử lý lưu file: ", ex);
            return Map.of("error", 1);
        }
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải tài liệu mới lên máy chủ (.docx, .xlsx, .pptx, .pdf) và lưu vào Database")
    public ApiResponse<DocumentVO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title) throws IOException {
        return ApiResponse.ok("Tải file thành công", documentService.uploadDocument(file, title));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa tài liệu và nội dung file khỏi cơ sở dữ liệu")
    public ApiResponse<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ApiResponse.ok("Xóa tài liệu thành công", null);
    }

    @PostMapping("/create-empty")
    @Operation(summary = "Tạo một tài liệu mới trống (docx, xlsx, pptx)")
    public ApiResponse<DocumentVO> createEmptyDocument(
            @RequestParam String title,
            @RequestParam(defaultValue = "docx") String fileType) {
        return ApiResponse.ok("Tạo tài liệu mới thành công", documentService.createEmptyDocument(title, fileType));
    }

    private String determineContentType(String fileType) {
        return switch (fileType.toLowerCase()) {
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "pdf" -> "application/pdf";
            default -> "application/octet-stream";
        };
    }
}
