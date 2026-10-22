package com.material.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.material.entity.DocumentEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepo extends JpaRepository<DocumentEntity, UUID>, JpaSpecificationExecutor<DocumentEntity> {

    Optional<DocumentEntity> findByFileType(String fileType);

    Optional<DocumentEntity> findByDocumentKey(String documentKey);

    long countByFileType(String fileType);
}
