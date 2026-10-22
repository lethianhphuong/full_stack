package com.material.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import com.material.event.UserCreatedEvent;

@Component
@Slf4j
public class UserEventListener {

    @Async
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        log.info("[Event] Người dùng mới đã được tạo: ID={}, Email={}, Tên={}",
                event.userId(), event.email(), event.fullName());
        // TODO: Gửi email chào mừng, ghi log audit hệ thống ngầm tại đây
    }
}
