# Hướng dẫn cho cây thư mục backend

Các hướng dẫn này áp dụng trong `BE_material/` và bổ sung cho `AGENTS.md` ở root.

- Đọc `../docs/engineering/backend-conventions.md` khi thay đổi Java hoặc Spring Boot.
- Đọc `../docs/engineering/api-contracts.md` khi endpoint, DTO, VO, enum, lỗi, cấu trúc phân trang, upload hoặc download thay đổi.
- Dùng `com.material.repo` cho repository mới. Xem package `com.material.repository` hiện tại là legacy; chỉ di chuyển khi thay đổi được yêu cầu bao gồm công việc đó và có thể thực hiện an toàn.
- Giữ controller tập trung vào HTTP và validation. Đặt business logic và ranh giới transaction trong service.
- DTO dành cho request, VO dành cho response. Không để entity hoặc dữ liệu nhạy cảm lộ qua API.
- Security hiện chứa hành vi phục vụ phát triển. Không mô tả nó là production-ready hoặc tự mở rộng phạm vi authentication.
- Áp dụng convention mục tiêu cho code mới nhưng không tự refactor code legacy không liên quan.
- Trước khi hoàn thành, làm theo `../docs/engineering/verification.md` để kiểm tra backend.
