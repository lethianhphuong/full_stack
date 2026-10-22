package com.material.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.material.enums.UserRoleEnum;
import com.material.enums.UserStatusEnum;

public record UserUpdateDTO(
    @NotBlank(message = "Tên không được để trống")
    String firstName,

    @NotBlank(message = "Họ không được để trống")
    String lastName,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    String email,

    String phoneNumber,
    String avatarUrl,
    String company,
    String address,
    UserRoleEnum role,
    UserStatusEnum status,
    Boolean isVerified
) {}
