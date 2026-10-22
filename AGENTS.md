# Hướng dẫn cho agent trong repository MAU Material

Repository này gồm backend Spring Boot tại `BE_material/` và frontend React/MUI tại `FE_material/`.

## Nguồn sự thật

- Dùng `docs/engineering/architecture.md` để xác định ranh giới module và phân biệt kiến trúc hiện tại với kiến trúc mục tiêu.
- Dùng `docs/engineering/backend-conventions.md` cho các thay đổi Java và Spring Boot.
- Dùng `docs/engineering/frontend-conventions.md` cho các thay đổi React, TypeScript và MUI.
- Dùng `docs/engineering/api-contracts.md` khi endpoint hoặc phía sử dụng endpoint thay đổi.
- Dùng `docs/engineering/verification.md` để chọn bước kiểm tra phù hợp trước khi báo hoàn thành.

Chỉ đọc các tài liệu liên quan đến yêu cầu hiện tại. Các file `BE_material/AGENTS.md` và `FE_material/AGENTS.md` bổ sung quy tắc riêng cho từng cây thư mục.

## Ranh giới làm việc

- Xem kiến trúc mục tiêu trong tài liệu là chuẩn cho code mới. Không tự refactor code cũ chỉ để đạt chuẩn nếu việc đó không thuộc yêu cầu.
- Thay đổi contract backend bao gồm URL, HTTP method, tham số, trường request/response, enum, phân trang, lỗi validation, nullability và định dạng ngày giờ. Phải truy vết các thay đổi này tới phía frontend sử dụng chúng.
- Không sửa file môi trường thật, thông tin xác thực, secret, output sinh tự động hoặc file nhị phân mẫu trong `BE_material/storage/documents/` nếu người dùng không yêu cầu rõ ràng.
- Giữ thay đổi trong phạm vi feature được yêu cầu. Báo cáo technical debt không liên quan thay vì tự mở rộng phạm vi.
- Trước khi hoàn thành, chạy các kiểm tra nhỏ nhất nhưng đủ tin cậy theo `docs/engineering/verification.md`; báo rõ nội dung đã chạy, kết quả và phần chưa chạy.

## Quy trình tái sử dụng

Các skill dùng chung cho Codex và Antigravity nằm trong `.agents/skills/`:

- `material-backend`: triển khai chỉ ở backend.
- `material-frontend`: triển khai chỉ ở frontend.
- `material-fullstack`: thay đổi xuyên hai phía hoặc thay đổi API contract.
- `material-verify`: kiểm tra trước khi bàn giao.
- `task-brief`: chuẩn hóa chủ động một yêu cầu lớn hoặc chưa rõ trước khi triển khai.
