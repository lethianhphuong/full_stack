# MAU Material - Fullstack Monorepo

Repository tích hợp toàn diện cho giải pháp quản trị doanh nghiệp **MAU Material**, kết hợp giữa **Spring Boot Backend** và **React Material UI Frontend**.

---

## 🏛️ Cấu trúc thư mục (Monorepo)

```text
MAU_Material/
├── BE_material/               # Backend Spring Boot 3 & Java 17
│   ├── src/                   # Mã nguồn REST API, Service, Repository, Entity
│   ├── storage/documents/     # Tài liệu mẫu OnlyOffice (Word, Excel, PPTX, PDF)
│   └── pom.xml
├── FE_material/               # Frontend React 19, TypeScript & Vite
│   ├── src/                   # Components, Pages, Sections, Zustand Store, Theme MUI
│   └── package.json
├── docs/                      # Hệ thống tài liệu kỹ thuật chuẩn (Single Source of Truth)
│   ├── DOCUMENT_LIST_REFACTOR_PLAN.md
│   └── engineering/
│       ├── api-contracts.md         # Khế ước API (URL, Method, Payload, Error Codes)
│       ├── architecture.md          # Phân tầng kiến trúc & ranh giới module
│       ├── backend-conventions.md   # Chuẩn thiết kế & code Spring Boot
│       ├── frontend-conventions.md  # Chuẩn React, TypeScript & MUI
│       └── verification.md          # Quy trình test & nghiệm thu tính năng
├── .agents/                   # Cấu hình AI Assistant (Rules, Skills, Workflows)
├── scripts/                   # Các script tiện ích và patch OnlyOffice
└── README.md
```

---

## 🚀 Công nghệ sử dụng

### 1. Backend (`BE_material/`)
- **Ngôn ngữ & Framework:** Java 17, Spring Boot 3.x
- **Bảo mật & Xác thực:** Spring Security, JWT (jjwt 0.12.6)
- **Cơ sở dữ liệu:** Spring Data JPA, Hibernate, MySQL Driver
- **Tài liệu API:** Springdoc OpenAPI (Swagger UI)
- **Tích hợp tài liệu:** Apache POI (Excel export), OnlyOffice Document Server integration
- **Ánh xạ đối tượng:** MapStruct 1.5.5, Lombok

### 2. Frontend (`FE_material/`)
- **Nền tảng:** React 19, TypeScript, Vite
- **UI Framework:** Material UI (MUI v7), Emotion, Framer Motion
- **Quản lý trạng thái:** Zustand
- **Bảng dữ liệu & Biểu đồ:** Material React Table v3, MUI X-Data-Grid, ApexCharts, Recharts
- **Form & Validation:** React Hook Form, Zod
- **Soạn thảo & Tài liệu:** OnlyOffice Document Editor React, React Quill New
- **HTTP Client:** Axios (cấu hình interceptor tự động bắt JWT)

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu môi trường
- **Java:** JDK 17+
- **Maven:** 3.8+
- **Node.js:** 18+ & npm/yarn/pnpm
- **Cơ sở dữ liệu:** MySQL 8.x

---

### Bước 1: Khởi động Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd BE_material
   ```
2. Cấu hình thông tin kết nối MySQL trong file `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/material_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: root
       password: "YOUR_PASSWORD"
   ```
3. Chạy ứng dụng bằng Maven:
   ```bash
   mvn spring-boot:run
   ```
   * Backend chạy tại: `http://localhost:8080`
   * Swagger UI (API Docs): `http://localhost:8080/swagger-ui.html`

---

### Bước 2: Khởi động Frontend

1. Mở một terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd FE_material
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển Vite:
   ```bash
   npm run dev
   ```
   * Frontend chạy tại: `http://localhost:5173`

---

## 📚 Quy ước & Hợp tác nhóm

Khi làm việc trong dự án, tất cả các thành viên tuân theo các nguyên tắc:

1. **Docs-as-Code (Tài liệu đi liền mã nguồn):**
   - Mọi thay đổi về endpoint hoặc kiểu dữ liệu API cần được ghi nhận tại [docs/engineering/api-contracts.md](docs/engineering/api-contracts.md) ngay trong Pull Request tương ứng.
2. **Quy chuẩn Git Commit (Conventional Commits):**
   - `feat(be): ...` cho tính năng mới ở Backend.
   - `feat(fe): ...` cho tính năng mới ở Frontend.
   - `feat(fullstack): ...` cho tính năng thay đổi cả 2 phía.
   - `fix(...)`, `docs(...)`, `chore(...)`.
3. **Quy chuẩn lập trình:**
   - Đọc kỹ [docs/engineering/backend-conventions.md](docs/engineering/backend-conventions.md) trước khi sửa đổi Java/Spring Boot.
   - Đọc kỹ [docs/engineering/frontend-conventions.md](docs/engineering/frontend-conventions.md) trước khi sửa đổi React/MUI.
