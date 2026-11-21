package com.material.service.impl;

import com.material.dto.CreateMenuDTO;
import com.material.dto.MenuItemDTO;
import com.material.dto.MenuSectionsDTO;
import com.material.entity.TBL_MenuItemEntity;
import com.material.entity.TBL_MenuSectionsEntity;
import com.material.enums.CreateMenuType;
import com.material.enums.ErrorCodes;
import com.material.exception.AppException;
import com.material.mapper.MenuMapper;
import com.material.repo.MenuItemsRepo;
import com.material.repo.MenuSectionsRepo;
import com.material.service.MenuService;
import com.material.vo.MenuVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor // Tự động sinh  public  MenuServiceImpl (
@Slf4j
public class MenuServiceImpl implements MenuService {

    private final MenuMapper menuMapper;

    private final MenuSectionsRepo menuSectionsRepo;
    private final MenuItemsRepo menuItemsRepo;

    public String createMenu (CreateMenuDTO createMenuDTO) {
        CreateMenuType type = createMenuDTO.getType();

        if(type == null) {
          throw new AppException(ErrorCodes.KHONG_DUOC_DE_TRONG,"Type");
        }

        switch (type) {
         case  NHOM: {
              return createMenuSections(createMenuDTO);
            }
         case  ITEM: {
           return createMenuItems(createMenuDTO);
            }
            default:
                break;
        }

        String id = "sssss";


        return id;
    }
    public String createMenuSections (CreateMenuDTO createMenuDTO) {

      MenuSectionsDTO menuSectionsDTO =  createMenuDTO.getMenuSectionsDTO();

      if(Objects.isNull(menuSectionsDTO)) {
          throw new AppException(ErrorCodes.KHONG_DUOC_DE_TRONG,"Nhóm menu");
      }

        int maxOrder = menuSectionsRepo.maxSortOrder() + 1;
        TBL_MenuSectionsEntity entity = menuMapper.toMenuSelect(menuSectionsDTO);

        entity.setSortOrder(maxOrder);

       return menuSectionsRepo.save(entity).getId().toString();
    }

    public String createMenuItems (CreateMenuDTO createMenuDTO) {

        MenuItemDTO menuItemDTO =  createMenuDTO.getMenuItemDTO();

        if(Objects.isNull(menuItemDTO)) {
            throw new AppException(ErrorCodes.KHONG_DUOC_DE_TRONG,"MenuItemDTO Menu");
        }

        int maxOrder = menuItemsRepo.maxSortOrder() + 1;
        TBL_MenuItemEntity entity = menuMapper.toMenuItem(menuItemDTO);

        entity.setSortOrder(maxOrder);

       return menuItemsRepo.save(entity).getId().toString();
    }

    public Page<MenuVO> getListMenu (Pageable pageable) {

        Page<TBL_MenuSectionsEntity> sectionsPage = menuSectionsRepo.findAll(pageable);

        List<String> sectionsId = sectionsPage.getContent().stream().map(x -> x.getId().toString()).toList();


        List<TBL_MenuItemEntity> menuItems  = menuItemsRepo.findAllBySectionIdInOrderBySortOrderAsc(sectionsId);


        Map<String, List<MenuItemDTO>> treeSections = buildTreeBySection(menuItems);

        return sectionsPage.map(section -> {
            String secId = section.getId().toString();
            // children ở đây giờ CHỈ CHỨA CÁC MENU CẤP 1 (trong Menu cấp 1 đã có sẵn Menu cấp 2, 3...)
            List<MenuItemDTO> rootChildren = treeSections.getOrDefault(secId, new ArrayList<>());
            return MenuVO.builder()
                    .id(secId)
                    .title(section.getTitle())
                    .isActive(String.valueOf(section.getIsActive()))
                    .children(rootChildren)
                    .build();
        });
    }

    public Map<String, List<MenuItemDTO>> buildTreeBySection (List<TBL_MenuItemEntity> menuItems) {

        Map<String,MenuItemDTO> mapDto = new LinkedHashMap<>(); // LinkedHashMap giữ đúng thứ tự sort_order từ query

        Map<String, List<MenuItemDTO>> rootItemsBySection = new HashMap<>();

        for (TBL_MenuItemEntity entity : menuItems) {
            MenuItemDTO dto =  MenuItemDTO.builder()
                    .id(entity.getId().toString())
                    .sectionId(entity.getSectionId())
                    .parentId(entity.getParentId())
                    .title(entity.getTitle())
                    .path(entity.getPath())
                    .icon(entity.getIcon())
                    .sortOrder(entity.getSortOrder())
                    .isIndex(entity.getIsIndex())
                    .isHidden(entity.getIsHidden())
                    .isActive(entity.getIsActive())
                    .children(new ArrayList<>())
                    .build();

            mapDto.put(dto.getId(),dto);
        }


        for (MenuItemDTO item : mapDto.values()) {

            String parentId = item.getParentId();

            // mapDto.containsKey(parentId) Tìm trong mapDto có id nào trùng với parent này k
            if(parentId == null || !mapDto.containsKey(parentId)) {
                // Là Menu Cấp 1 -> Gom vào danh sách gốc của Section
                // computeIfAbsent Kiểm tra item.getSectionId() chưa tồn tại thì tạo một arr rỗng nếu có rôi lấy arr đã có
                rootItemsBySection
                        .computeIfAbsent(item.getSectionId(), k -> new ArrayList<>())
                        .add(item);
            }else {
                // Là Menu Con -> Móc vào children của Menu Cha
                MenuItemDTO parent = mapDto.get(parentId);
                parent.getChildren().add(item);
            }

        }



        return  rootItemsBySection;
    }
}
