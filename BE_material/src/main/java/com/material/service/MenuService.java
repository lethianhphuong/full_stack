package com.material.service;


import com.material.dto.CreateMenuDTO;
import com.material.dto.MenuSectionsDTO;
import com.material.vo.MenuVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MenuService {

    String createMenu(CreateMenuDTO createMenuDTO);

    Page<MenuVO> getListMenu(Pageable pageable);
}
