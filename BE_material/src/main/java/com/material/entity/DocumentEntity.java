package com.material.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "tbl_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE tbl_documents SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
public class DocumentEntity extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", nullable = false, length = 20)
    private String fileType; // docx, xlsx, pptx, pdf

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "document_key", nullable = false, length = 100)
    private String documentKey;
}
