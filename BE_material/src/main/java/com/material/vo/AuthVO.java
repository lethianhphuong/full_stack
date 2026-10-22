package com.material.vo;

import lombok.Builder;

@Builder
public record AuthVO(
    String accessToken,
    String refreshToken,
    String tokenType,
    UserVO user
) {}
