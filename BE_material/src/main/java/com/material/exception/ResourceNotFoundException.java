package com.material.exception;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(404, String.format("%s không tồn tại với định danh: %s", resourceName, identifier));
    }

    public ResourceNotFoundException(String message) {
        super(404, message);
    }
}
