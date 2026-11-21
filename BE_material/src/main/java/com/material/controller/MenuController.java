package com.material.controller;

import com.material.dto.CreateMenuDTO;
import com.material.dto.MenuSectionsDTO;
import com.material.service.MenuService;
import com.material.vo.ApiResponse;
import com.material.vo.MenuVO;
import com.material.vo.PageVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
@Tag(name = "Menu app", description = "Menu app")
@Slf4j
public class MenuController {

    private final MenuService menuService;

    @PostMapping("create")
    public ApiResponse<String> createMenu(@Valid @RequestBody CreateMenuDTO createMenuDTO) {

        return  ApiResponse.ok(menuService.createMenu(createMenuDTO));
    }

    @GetMapping
    public ApiResponse<Page<MenuVO>> getListMenu (@ParameterObject Pageable pageable) {

        return ApiResponse.ok(menuService.getListMenu(pageable));
    }

}
