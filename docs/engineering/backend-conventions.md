# Quy chuẩn backend

Các quy chuẩn này bắt buộc với code backend mới. Sai khác hiện có chỉ là mục tiêu migration khi nằm trong phạm vi công việc được yêu cầu.

## Công nghệ và cấu trúc

- Dùng tính năng Java 17 tương thích Spring Boot 3.3 và Jakarta API.
- Giữ code dưới `com.material` theo package-by-layer hiện có.
- Dùng các package `configuration`, `controller`, `dto`, `entity`, `enums`, `event`, `exception`, `exporter`, `listener`, `mapper`, `repo`, `service`, `service.impl`, `utils` và `vo` đúng trách nhiệm hiện tại.
- Dùng constructor injection, thông thường qua Lombok `@RequiredArgsConstructor`.

## HTTP và controller

- REST path nằm dưới `/api/v1`, dùng danh từ số nhiều, segment chữ thường dạng kebab-case và HTTP method/status phù hợp.
- Controller chỉ xử lý binding, validation, khai báo authorization, gọi service và tạo response. Không query repository hoặc chứa tính toán nghiệp vụ.
- Áp dụng Jakarta Validation cho request model và `@Valid` tại request boundary.
- Mô tả endpoint công khai bằng OpenAPI annotation đang dùng trong project.
- Response JSON thông thường phải bọc trong `ApiResponse<T>`. Binary download và callback của bên thứ ba được phép giữ response theo protocol bắt buộc.

## Model và persistence

- Request/filter model dùng hậu tố `DTO`. Response model dùng hậu tố `VO` và chỉ chứa trường dành cho client.
- Ưu tiên record cho request/response bất biến khi framework binding và mapping vẫn rõ ràng.
- Entity dùng hậu tố `Entity`, tên bảng/cột snake_case và kế thừa `BaseEntity` khi cần UUID, audit field và soft-delete lifecycle chuẩn.
- Xem `DocumentContentEntity` là ngoại lệ hiện có; không tự thiết kế lại ngoài phạm vi.
- Repository mới nằm trong `com.material.repo`, dùng hậu tố `Repo` và chỉ kế thừa Spring Data interface thực sự cần. Package `repository` hiện tại là legacy.
- Dùng JPA Specification cho bộ lọc động thực sự; không dựng query trong controller.

## Service, mapping và event

- Giữ interface trong `service/` và implementation trong `service/impl/` khi project còn dùng pattern này.
- Đặt `@Transactional` cho thao tác ghi tại service; dùng `readOnly = true` cho thao tác chỉ đọc khi phù hợp.
- Dùng MapStruct cho chuyển đổi entity/DTO/VO ổn định khi nó giảm mapping thủ công mà không che khuất quyết định nghiệp vụ.
- Dùng event cho side effect tách rời sau transaction hoặc xử lý bất đồng bộ, không thay thế business transaction chính.
- Exporter chịu trách nhiệm sinh tài liệu, không điều phối HTTP.

## Lỗi và bảo mật

- Map lỗi validation theo tên field để React Hook Form có thể sử dụng.
- Dùng application exception có kiểu rõ ràng và global exception handler; không lộ stack trace hoặc dữ liệu nhạy cảm.
- Không hardcode credential mới hoặc dựa vào secret mặc định ngoài luồng local development được xác định rõ.
- Không giả định security permissive, current-user mock hoặc refresh-token hiện tại đã sẵn sàng cho production.

## Đặt tên

- Dùng các hậu tố `*Controller`, `*Service`, `*ServiceImpl`, `*Repo`, `*Entity`, `*CreateDTO`/`*UpdateDTO`/`*FilterDTO`, `*VO`, `*Enum`, `*Event`, `*Listener`, `*Exporter`, `*Mapper`, `*Config`, `*Utils` khi đúng vai trò.
- Chọn tên phản ánh hành vi domain thay vì các bước kỹ thuật.

Với schema công khai và phân trang, áp dụng thêm `api-contracts.md`.
