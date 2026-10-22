---
name: material-fullstack
description: Điều phối thay đổi MAU Material đi qua BE_material và FE_material hoặc làm thay đổi API contract giữa hai phía. Dùng cho endpoint, DTO/VO, enum, pagination, validation error, upload/download hoặc feature dùng chung.
---

# Thay đổi contract full-stack MAU Material

Dùng quy trình này khi triển khai đi qua ranh giới HTTP hoặc thay đổi cả hai ứng dụng.

## Ngữ cảnh

Đọc `docs/engineering/api-contracts.md` trước, sau đó đọc phần liên quan trong `backend-conventions.md` và `frontend-conventions.md`. Dùng `architecture.md` khi chưa rõ trách nhiệm hoặc vị trí code.

## Truy vết contract

Trước khi sửa, truy vết hành vi hiện tại từ đầu đến cuối:

```text
Controller -> request DTO -> service -> response VO
          -> ApiResponse/PageVO -> TypeScript type
          -> frontend service/adapter -> section/page sử dụng
```

Ghi nhận method, URL, parameter, validation, response status/wrapper, field/nullability, enum value, ý nghĩa ngày giờ, pagination, sorting, filtering và error mapping bị ảnh hưởng.

## Plan và checklist

Trước khi code, lập plan theo thứ tự phụ thuộc và tạo checklist riêng cho:

- Contract hiện tại.
- Contract mục tiêu và compatibility.
- Thay đổi backend.
- Type và service adapter frontend.
- Consumer frontend.
- Error/validation mapping.
- Kiểm thử backend.
- Kiểm thử frontend.
- Truy vết contract thủ công.

Không sửa một phía trước khi xác định ảnh hưởng tới phía còn lại.

## Quy trình

1. Chọn contract mong muốn và xác định có backward compatible hay không.
2. Triển khai backend trong đúng ranh giới controller/service/repository/mapping.
3. Cập nhật TypeScript model và một service/adapter boundary phía frontend để khớp wire contract.
4. Cập nhật tất cả consumer đã biết, gồm form, table, route, loading/error state và field-error mapping khi phù hợp.
5. Với upload, download hoặc OnlyOffice, giữ đúng content type, callback acknowledgement và sự khác biệt giữa URL browser, backend và container truy cập được.
6. Tìm kiếm tên field, enum value, endpoint path và response type cũ trước khi tuyên bố migration hoàn tất.
7. Tránh dọn dẹp không liên quan ở cả hai phía.

## Hoàn thành

Sau khi code:

1. Kiểm tra diff của cả backend và frontend.
2. Tìm kiếm endpoint path, field, enum và type cũ còn sót.
3. Chạy kiểm tra phù hợp ở cả hai project.
4. Truy vết contract từ Controller tới UI consumer.
5. Đối chiếu checklist và acceptance criteria.
6. Báo rõ compatibility risk và integration chưa thể chạy.

Không báo feature full-stack hoàn thành nếu mới xác minh một phía.
