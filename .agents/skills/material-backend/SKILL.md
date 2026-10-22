---
name: material-backend
description: Triển khai hoặc chỉnh sửa thay đổi Spring Boot chỉ trong BE_material, gồm controller, DTO, VO, entity, repository, service, validation, security, configuration hoặc pagination. Không dùng cho công việc chỉ thuộc frontend.
---

# Phát triển backend MAU Material

Dùng quy trình này cho thay đổi chỉ thuộc backend trong `BE_material/`.

## Ngữ cảnh

Đọc `docs/engineering/backend-conventions.md`. Đọc thêm `docs/engineering/api-contracts.md` khi thay đổi ảnh hưởng đến hành vi HTTP có thể quan sát từ bên ngoài.

Trước khi sửa, kiểm tra vertical slice bị ảnh hưởng và test liên quan. Dùng code hiện tại làm bằng chứng, đồng thời xem convention mục tiêu là chuẩn cho code mới.

## Plan và checklist

Trước khi code, lập plan ngắn và checklist theo `docs/engineering/verification.md`.

Checklist backend phải bao phủ khi liên quan:

- Request boundary và validation.
- Controller.
- Service và transaction.
- Repository/query.
- Entity, DTO, VO và mapper.
- Exception handling.
- API contract và frontend consumer.
- Backend compile/test.

Không bắt đầu chỉnh sửa cho đến khi đã xác định được phạm vi và cách kiểm thử.

## Quy trình

1. Xác định request boundary, hành vi nghiệp vụ, ảnh hưởng persistence, response shape và nơi gọi.
2. Giữ transport và validation trong controller; đặt business logic và transaction boundary trong service.
3. Dùng DTO cho request và VO cho response. Không để entity, credential hoặc field chỉ phục vụ persistence lộ qua API.
4. Chỉ thêm hoặc sửa repository query và MapStruct mapping khi feature cần. Repository mới phải nằm trong `com.material.repo`.
5. Giữ đúng contract `ApiResponse<T>`, `PageVO<T>`, lỗi, upload/download và callback bên thứ ba, trừ khi task yêu cầu thay đổi rõ ràng.
6. Nếu type hoặc consumer frontend phải thay đổi, xem đây là thay đổi contract full-stack và dùng `material-fullstack` thay vì chỉ hoàn thành một nửa feature.
7. Không dọn dẹp package, entity, mapping hoặc security legacy không liên quan.

## Hoàn thành

Sau khi code:

1. Kiểm tra diff backend.
2. Đối chiếu từng mục checklist.
3. Chạy kiểm tra phù hợp theo `docs/engineering/verification.md`.
4. Sửa và chạy lại lỗi do thay đổi hiện tại gây ra.
5. Báo rõ backend test nào đã chạy, chưa chạy hoặc không tồn tại.

Không báo hoàn thành khi checklist còn mục chưa xử lý mà không có giải thích.
