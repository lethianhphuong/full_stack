package com.material.exception;

import com.material.enums.ErrorCodes;
import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final int code;

    public AppException(int code, String message) {
        super(message);
        this.code = code;
    }

    public AppException(ErrorCodes errorCode, Object... args) {
        super(java.text.MessageFormat.format(errorCode.getMessage(), args));
        this.code = errorCode.getStatusCode();
    }

    public AppException(String message) {
        super(message);
        this.code = 400;
    }
}
