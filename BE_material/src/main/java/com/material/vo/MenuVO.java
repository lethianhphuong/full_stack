package com.material.vo;

import com.material.dto.MenuItemDTO;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuVO {

    private String id;
    private String title;
    private String isActive;

    private List<MenuItemDTO> children = new ArrayList<>();

}
