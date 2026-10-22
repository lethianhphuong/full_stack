package com.material.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.material.dto.LoginDTO;
import com.material.dto.RegisterDTO;
import com.material.service.AuthService;
import com.material.vo.ApiResponse;
import com.material.vo.AuthVO;
import com.material.vo.UserVO;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Xác thực và phân quyền tài khoản")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống bằng email và mật khẩu")
    public ApiResponse<AuthVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        return ApiResponse.ok("Đăng nhập thành công", authService.login(loginDTO));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Đăng ký tài khoản mới")
    public ApiResponse<AuthVO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        return ApiResponse.ok("Đăng ký tài khoản thành công", authService.register(registerDTO));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin người dùng đang đăng nhập")
    public ApiResponse<UserVO> getCurrentUser() {
        return ApiResponse.ok(authService.getCurrentUser());
    }
}
