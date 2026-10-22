---
name: task-brief
description: Chuyển một yêu cầu MAU Material lớn hoặc chưa rõ được gửi chủ động thành brief sẵn sàng triển khai. Dùng khi được gọi bằng task-brief hoặc /task-brief; không dùng cho thay đổi nhỏ đã rõ ràng.
---

# Chuẩn hóa yêu cầu

Skill này chỉ làm rõ yêu cầu và tạo brief. Không tự động triển khai.

## Cổng cho phép bắt buộc

- Sau khi tạo brief, luôn dừng lại để người dùng xem và phê duyệt.
- Chỉ được bắt đầu code khi người dùng gửi một lời cho phép rõ ràng sau khi đã nhận brief, ví dụ: “đồng ý triển khai”, “bắt đầu code” hoặc “thực hiện theo brief”.
- Không suy diễn quyền triển khai từ yêu cầu ban đầu, kể cả khi yêu cầu đó có các từ như “làm”, “tạo”, “triển khai”, “hoàn thành” hoặc “tiếp tục”. Việc gọi `task-brief` chuyển lượt hiện tại thành lượt phân tích và lập brief.
- Trong giai đoạn tạo brief, không sửa source, config, migration, dependency, tài liệu nghiệp vụ hoặc file project. Chỉ được đọc và phân tích.
- Không chạy command gây thay đổi trạng thái, build tạo output, formatter, code generator, migration hoặc thao tác bên ngoài.
- Có thể thực hiện kiểm tra chỉ đọc cần thiết để hiểu project và xác định phạm vi.

## Khảo sát

Chỉ kiểm tra đủ ngữ cảnh repository để xác định phạm vi. Dùng `docs/engineering/architecture.md` để xác định trách nhiệm; chỉ nạp tài liệu backend, frontend, API contract hoặc verification khi yêu cầu chạm đến khu vực đó.

Không tự nghĩ ra hành vi sản phẩm. Có thể đưa ra giả định kỹ thuật hợp lý khi dễ đảo ngược; phải nêu các quyết định làm thay đổi đáng kể UX, dữ liệu, khả năng tương thích, bảo mật hoặc phạm vi.

## Implementation checklist trong brief

Brief phải kèm checklist triển khai và kiểm thử dự kiến, nhưng không được thực hiện checklist trong lượt `task-brief`.

Checklist cần nêu:

- Các bước khảo sát còn cần thiết.
- Các phần code dự kiến thay đổi.
- Thứ tự phụ thuộc.
- Acceptance criteria tương ứng.
- Kiểm tra dự kiến chạy.
- Rủi ro hoặc bước không thể xác minh trong môi trường hiện tại.

Sau khi tạo plan và checklist, luôn dừng để người dùng duyệt. Việc lập checklist không được xem là quyền bắt đầu code.

## Đầu ra

Tạo brief ngắn gọn gồm:

- Mục tiêu
- Phạm vi
- Các tầng bị ảnh hưởng
- Ảnh hưởng contract
- Nội dung không thực hiện
- Tiêu chí nghiệm thu
- Cách xác minh
- Quyết định còn mở

Sau khi trình bày brief, dừng và yêu cầu người dùng phê duyệt trước khi code. Ngay cả khi không còn quyết định mở, không được tự chuyển sang workflow triển khai trong cùng lượt gọi `task-brief`.
