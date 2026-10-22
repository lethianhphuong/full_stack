package com.material.dto;

import com.material.enums.UserRoleEnum;
import com.material.enums.UserStatusEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserFilterDTO {
    private int page = 0;
    private int size = 10;
    private String sort = "createdAt,desc";
    private String search;
    private UserRoleEnum role;
    private UserStatusEnum status;
}
