package com.material.mapper;

import com.material.dto.MenuItemDTO;
import com.material.dto.MenuSectionsDTO;
import com.material.dto.UserCreateDTO;
import com.material.dto.UserUpdateDTO;
import com.material.entity.TBL_MenuItemEntity;
import com.material.entity.TBL_MenuSectionsEntity;
import com.material.entity.UserEntity;
import com.material.vo.UserVO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MenuMapper {

    TBL_MenuSectionsEntity toMenuSelect(MenuSectionsDTO menuSectionsDTO);

    TBL_MenuItemEntity toMenuItem(MenuItemDTO menuItemDTO);
}
