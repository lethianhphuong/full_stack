package com.material.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import com.material.dto.DocumentCallbackDTO;
import com.material.dto.DocumentFilterDTO;
import com.material.vo.DocumentConfigVO;
import com.material.vo.DocumentVO;
import com.material.vo.PageVO;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface DocumentService {

    PageVO<DocumentVO> getDocuments(DocumentFilterDTO filterDTO);

    Map<String, Long> getDocumentStats();

    List<DocumentVO> getAllDocuments();

    DocumentVO getDocumentById(UUID id);

    DocumentConfigVO getEditorConfig(UUID id, boolean readOnly, String currentUserId, String currentUserName);

    Resource loadDocumentAsResource(UUID id);

    void handleCallback(UUID id, DocumentCallbackDTO callbackDTO) throws IOException;

    DocumentVO uploadDocument(MultipartFile file, String title) throws IOException;

    void deleteDocument(UUID id);

    DocumentVO createEmptyDocument(String title, String fileType);

    void initSampleDocuments();
}
