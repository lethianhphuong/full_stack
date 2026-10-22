package com.material.vo;

import com.material.enums.UserRoleEnum;
import com.material.enums.UserStatusEnum;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record UserVO(
    UUID id,
    String firstName,
    String lastName,
    String fullName,
    String email,
    String phoneNumber,
    String avatarUrl,
    String company,
    String address,
    UserRoleEnum role,
    UserStatusEnum status,
    boolean isVerified,
    Instant createdAt
) {}
