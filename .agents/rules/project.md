# Quy tắc toàn project

Workspace này gồm `BE_material/` và `FE_material/`. Dùng `docs/engineering/architecture.md` để xác định ranh giới; chỉ nạp tài liệu backend, frontend, API contract hoặc verification liên quan đến yêu cầu hiện tại.

Áp dụng convention mục tiêu cho code mới nhưng không tự refactor khu vực legacy. Giữ công việc trong phạm vi được yêu cầu. Không sửa credential, file môi trường thật, output sinh tự động hoặc file nhị phân mẫu trong `BE_material/storage/documents/` nếu không được yêu cầu rõ ràng.

Dùng skill phù hợp trong `.agents/skills/` cho quy trình triển khai và xác minh.
