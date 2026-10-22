package com.material.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
    @NotBlank(message = "Vui lòng nhập email")
    @Email(message = "Email không đúng định dạng")
    String email,

    @NotBlank(message = "Vui lòng nhập mật khẩu")
    String password
) {}
