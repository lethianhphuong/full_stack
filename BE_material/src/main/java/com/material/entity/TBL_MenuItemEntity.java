package com.material.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "tbl_menu_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE tbl_menu_items SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
public class TBL_MenuItemEntity extends BaseEntity {

    @Column(name = "section_id", nullable = false)
    private String sectionId;

    @Column(name = "parent_id")
    private String parentId;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "path", length = 255)
    private String path;

    @Column(name = "icon", length = 100)
    private String icon;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "is_index", nullable = false)
    @Builder.Default
    private Boolean isIndex = false;
    // Menu chính

    @Column(name = "is_hidden", nullable = false)
    @Builder.Default
    private Boolean isHidden = false;
    // menu ẩn hiện trên sidebar

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = Boolean.TRUE;
    // trạng thái vô hiệu hóa menu
}
