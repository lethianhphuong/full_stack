package com.material.dto;

import jakarta.validation.constraints.*;
import com.material.enums.UserRoleEnum;
import com.material.enums.UserStatusEnum;

public record UserCreateDTO(
    @NotBlank(message = "Tên không được để trống")
    String firstName,

    @NotBlank(message = "Họ không được để trống")
    String lastName,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    String email,

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)(\\d{9,10})$", message = "Số điện thoại không hợp lệ (VD: 0912345678)")
    String phoneNumber,

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu tối thiểu 8 ký tự")
    String password,

    String company,
    String address,
    UserRoleEnum role,
    UserStatusEnum status,
    Boolean isVerified
) {}
