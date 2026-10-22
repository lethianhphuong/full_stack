# Kiến trúc MAU Material

## Bản đồ repository

- `BE_material/`: Spring Boot 3.3, Java 17, Maven, Spring Web/Data JPA/Security, MapStruct, OpenAPI, Apache POI, JWT, driver H2/PostgreSQL/MySQL và tích hợp OnlyOffice.
- `FE_material/`: React 19, TypeScript 5.9, Vite 8, MUI 7, Zustand 5, React Router 7, React Hook Form, Yup, Material React Table và tích hợp OnlyOffice.
- `docs/engineering/`: nguồn quy tắc kỹ thuật chuẩn dùng chung cho con người và agent.
- `.agents/`: Rules/Workflows của Antigravity và Skills dùng chung cho Codex và Antigravity.

## Ranh giới backend

Backend dùng package-by-layer dưới `com.material`:

```text
controller -> service -> repo -> entity
        |          |       |
       dto       mapper   database
        |          |
        +-------> vo -> ApiResponse/PageVO
```

Configuration, exception, event/listener, exporter, enum và utility là các lớp hỗ trợ. Controller sở hữu HTTP concern; service sở hữu business logic và ranh giới transaction; repository sở hữu truy vấn persistence.

## Ranh giới frontend

Chiều phụ thuộc mục tiêu cho UI feature mới:

```text
router -> pages -> sections -> components -> atoms/MUI
                    |              |
                 services       UI dùng chung
                    |
                   API
```

- `pages/`: route entry và wrapper tổ hợp nhẹ.
- `sections/`: UI feature, điều phối state, form, table và gọi API.
- `components/`: UI tổ hợp tái sử dụng, không chứa business logic theo domain.
- `atoms/`: primitive dùng chung và wrapper MUI.
- `services/`: tích hợp theo domain; `store/`: client state dùng chung; `types/`: type dùng chung.

## Ngoại lệ hiện tại và technical debt

- Nhiều page frontend có hàng trăm dòng và chứa feature logic. Đây là ngoại lệ legacy, không phải mẫu cho page mới.
- Package repository backend đang tách giữa `repo/` và `repository/`; `repo/` là đích chuẩn.
- `DocumentContentEntity` không kế thừa `BaseEntity`, khác convention entity mặc định.
- Mapping chưa được xử lý nhất quán qua MapStruct.
- Authentication backend còn hành vi phục vụ phát triển, gồm authorization permissive và xử lý current-user/refresh-token chưa hoàn chỉnh.
- Coverage tự động còn ít: tại thời điểm lập baseline chưa thấy backend test; frontend test mới phủ một số utility.

Chỉ xử lý các mục này khi được yêu cầu hoặc khi chúng trực tiếp cần thiết cho một thay đổi an toàn. Nếu không, báo cáo thay vì tự mở rộng phạm vi.
