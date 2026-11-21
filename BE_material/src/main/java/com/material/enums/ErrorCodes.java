package com.material.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCodes {
    KHONG_DUOC_DE_TRONG("400",400,"{0} Không được để trống");


    private final String code;
    private final int statusCode;
    private final String message;
}
