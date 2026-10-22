package com.material.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import com.material.dto.UserCreateDTO;
import com.material.dto.UserUpdateDTO;
import com.material.entity.UserEntity;
import com.material.vo.UserVO;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    UserEntity toEntity(UserCreateDTO dto);

    @Mapping(target = "fullName", expression = "java(entity.getLastName() + \" \" + entity.getFirstName())")
    UserVO toVO(UserEntity entity);

    void updateEntityFromDTO(UserUpdateDTO dto, @MappingTarget UserEntity entity);
}
