package com.material.event;

import java.util.UUID;

public record UserCreatedEvent(
    UUID userId,
    String email,
    String fullName
) {}
