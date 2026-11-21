package com.material.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuSectionsDTO {
    private String id;
    private String title;

    @Builder.Default
    private Integer sortOrder = 0;
}
