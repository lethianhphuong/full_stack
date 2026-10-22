package com.material.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.material.dto.UserCreateDTO;
import com.material.dto.UserFilterDTO;
import com.material.dto.UserUpdateDTO;
import com.material.service.UserService;
import com.material.vo.ApiResponse;
import com.material.vo.PageVO;
import com.material.vo.UserVO;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Quản lý người dùng hệ thống")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Lấy danh sách người dùng phân trang và tìm kiếm (cho DataTable FE)")
    public ApiResponse<PageVO<UserVO>> getUsers(UserFilterDTO filterDTO) {
        return ApiResponse.ok(userService.getUsers(filterDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết người dùng theo ID")
    public ApiResponse<UserVO> getUserById(@PathVariable UUID id) {
        return ApiResponse.ok(userService.getUserById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Tạo mới người dùng")
    public ApiResponse<UserVO> createUser(@Valid @RequestBody UserCreateDTO createDTO) {
        return ApiResponse.ok("Tạo người dùng thành công", userService.createUser(createDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin người dùng")
    public ApiResponse<UserVO> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO updateDTO) {
        return ApiResponse.ok("Cập nhật người dùng thành công", userService.updateUser(id, updateDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa người dùng (Soft Delete)")
    public ApiResponse<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ApiResponse.ok("Xóa người dùng thành công", null);
    }

    @GetMapping("/export/excel")
    @Operation(summary = "Xuất danh sách người dùng ra file Excel")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        byte[] excelBytes = userService.exportUsersToExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users_export.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
