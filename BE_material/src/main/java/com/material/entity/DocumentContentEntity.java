package com.material.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "tbl_document_contents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentContentEntity implements Serializable {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "document_id", length = 36, nullable = false)
    private UUID documentId;

    @Lob
    @Column(name = "file_data", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] fileData;
}
