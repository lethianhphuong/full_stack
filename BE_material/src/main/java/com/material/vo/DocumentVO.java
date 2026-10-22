package com.material.vo;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentVO {

    private UUID id;
    private String title;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String documentKey;
    private String downloadUrl;
    private Instant createdAt;
    private Instant updatedAt;
}
