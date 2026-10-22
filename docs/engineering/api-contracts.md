# Hợp đồng API

Tài liệu này là nguồn sở hữu contract dùng chung giữa `BE_material` và `FE_material`.

## Response JSON chuẩn

Endpoint JSON thông thường trả `ApiResponse<T>` với:

- `success`: kết quả thao tác.
- `code`: mã số application/HTTP theo API hiện tại.
- `message`: thông báo phù hợp cho người dùng.
- `data`: payload có type rõ ràng; chỉ nullable khi endpoint chủ đích không có payload.
- `timestamp`: thời điểm từ server.

Không bọc binary download hoặc callback acknowledgement của bên thứ ba nếu protocol yêu cầu cấu trúc khác.

## Phân trang

Resource phân trang trả `PageVO<T>` gồm `content`, `page`, `size`, `totalElements`, `totalPages`, `isLast`. Page index bắt đầu từ 0, trừ khi một versioned contract thay đổi rõ ràng hành vi này.

Table server-side phía frontend phải chuyển đổi pagination, sorting và filtering một cách tường minh, không dựa ngầm vào default của thư viện.

## Validation và lỗi

- Lỗi validation request phải giữ tên field backend để có thể map tới field React Hook Form.
- Khi tên field backend và frontend khác nhau, định nghĩa chuyển đổi tại frontend service hoặc form adapter, không rải logic này trong UI component.
- Không lộ exception nội bộ, stack trace, password, token hoặc field chỉ phục vụ persistence.

## Checklist thay đổi contract

Khi thay đổi contract, truy vết và kiểm tra:

1. HTTP method và URL `/api/v1/...`.
2. Path, query, header, form-data và body parameter.
3. Request validation và tên field.
4. Response wrapper và status.
5. Trường DTO/VO, type, nullability và default.
6. Giá trị enum trên wire và mapping hiển thị.
7. Định dạng ngày giờ và ý nghĩa timezone.
8. Quy tắc pagination, sorting và filtering.
9. Type TypeScript và service adapter.
10. Tất cả section/page sử dụng và backward compatibility.

Xem việc xóa, đổi tên, đổi type, đổi enum và đổi nullability là thay đổi có khả năng breaking. Phải giữ tương thích hoặc mô tả migration rõ ràng.

## File và OnlyOffice

- Validate loại và kích thước upload được hỗ trợ tại boundary phù hợp.
- Thiết lập đúng content type và filename an toàn khi download.
- Phân biệt URL browser truy cập được, backend host truy cập được và OnlyOffice Document Server trong container truy cập được.
- Giữ đúng response callback mà OnlyOffice yêu cầu và không để lộ signing material.
