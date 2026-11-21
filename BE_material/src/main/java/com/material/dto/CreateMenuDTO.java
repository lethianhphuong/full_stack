package com.material.dto;

import com.material.enums.CreateMenuType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateMenuDTO {

    @NotNull(message = "Type không được trống")
    private CreateMenuType type;

    @Valid
    private MenuItemDTO menuItemDTO;

    @Valid
    private MenuSectionsDTO menuSectionsDTO;


}
