package com.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDTO {

    private String id;

    @NotBlank(message = "Nhóm menu (sectionId) không được để trống")
    private String sectionId;

    private String parentId; // Có thể null nếu là menu cấp cao nhất

    @NotBlank(message = "Tiêu đề menu không được để trống")
    @Size(max = 100, message = "Tiêu đề không được vượt quá 100 ký tự")
    private String title;

    @Size(max = 255, message = "Đường dẫn không được vượt quá 255 ký tự")
    private String path;

    private String icon;

    @Builder.Default
    private Integer sortOrder = 0;

    @Builder.Default
    private Boolean isIndex = false;

    @Builder.Default
    private Boolean isHidden = false;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private List<MenuItemDTO> children = new ArrayList<>();
}