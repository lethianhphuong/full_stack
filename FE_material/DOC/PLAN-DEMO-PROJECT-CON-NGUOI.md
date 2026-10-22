# Kế hoạch triển khai DEMO PROJECT / Con Người

**Trạng thái:** Hoàn thành triển khai & Sẵn sàng nghiệm thu  
**Phạm vi:** Frontend tại `FE_material`  
**Tài liệu giao diện:** `C:\Users\Admin\Downloads\them-moi-con-nguoi-lien-quan.html`  
**Quy ước áp dụng:** `CODING_CONVENTIONS.md`

> Cập nhật ngày 16/10/2026: Đã triển khai hoàn chỉnh toàn bộ module DEMO PROJECT / Con Người bao gồm routing, menu dọc/ngang/mini, màn hình danh sách, form thêm/sửa, dialog quan hệ, thống kê trốn/chết, chặn chuyển trang khi có thay đổi chưa lưu (useBlocker modal), và tách component `AddressSection` dùng chung tại `@/components/address-section` với đầy đủ props tùy biến nghiệp vụ.

## 1. Mục tiêu và phạm vi demo

Tạo nhóm menu **DEMO PROJECT** ngang cấp với nhóm **Components**. Bên trong có menu con **Con Người**, mở màn hình danh sách. Nút **Thêm mới** trên danh sách mở biểu mẫu theo file HTML mẫu. Dữ liệu demo hoạt động cục bộ trên trình duyệt, chưa gọi backend hoặc CSDL dân cư.

Đường dẫn dự kiến:

| Chức năng | Route | Hiển thị trong menu |
| --- | --- | --- |
| Danh sách Con Người | `/dashboard/demo-project/con-nguoi` | Có |
| Thêm mới Con Người | `/dashboard/demo-project/con-nguoi/create` | Không |

`DEMO PROJECT` là section riêng trong `src/router/routes-config.ts`; không đặt dưới item `Components`. Menu và route cùng sinh từ cấu hình hiện có. Bổ sung hằng số đường dẫn trong `src/constants/paths.ts`.

## 2. Công việc triển khai

### 2.1. Menu và routing

- [x] Khai báo section `DEMO PROJECT` ngang cấp với `Components`, icon dùng Iconify/Solar.
- [x] Khai báo item cha `DEMO PROJECT` và item con `Con Người` trong `staticRoutesConfig`.
- [x] Khai báo route thêm mới với `hideInMenu: true`; page được lazy load như các route khác.
- [x] Bổ sung `PATHS.demoProject.personList` và `PATHS.demoProject.personCreate`.
- [x] Kiểm tra menu ở layout dọc, ngang và thu gọn; kiểm tra truy cập trực tiếp và refresh từng URL.

### 2.2. Màn hình danh sách

- [x] Tạo page mỏng `PersonListPage`, phần giao diện/nghiệp vụ đặt ở `PersonListView`.
- [x] Dùng `DataTable` từ `@/atoms` với ngôn ngữ tiếng Việt và phân trang.
- [x] Hiển thị các cột chính: họ tên, ngày sinh, giới tính, CCCD/CMT, số điện thoại, vai trò, nơi ở hiện nay, thao tác.
- [x] Có tìm kiếm theo họ tên hoặc CCCD/CMT, lọc giới tính và vai trò, trạng thái rỗng khi không có kết quả.
- [x] Nút **Thêm mới** điều hướng bằng `PATHS`; thao tác xóa có dialog xác nhận.
- [x] Nếu thêm chức năng xem/sửa trong demo, dùng route và form riêng, không để nút chỉ ghi log.

### 2.3. Biểu mẫu theo HTML mẫu

- [x] Tách form thành các phần: vai trò; thông tin cá nhân; giấy tờ; nghề nghiệp/thông tin bổ sung; địa chỉ; mối quan hệ; trường hợp trốn/chết.
- [x] Dùng MUI và các field sẵn có (`BaseTextField`, `BaseSelect`, `BaseDatePicker`, `BaseUpload`, `BaseSwitch`, `BaseTextArea`) cùng React Hook Form.
- [x] Giữ các nhãn, lựa chọn và điều kiện hiển thị quan trọng của file HTML; bố cục phù hợp theme MUI hiện có, responsive và light/dark mode.
- [x] Ảnh chỉ preview trong phiên nhập; không đưa `File` hoặc object URL vào local storage.
- [x] Nút **Tra cứu** thông báo rõ đây là mô phỏng, không tự điền dữ liệu giả như kết quả CSDL dân cư.
- [x] Nút **Lưu** tạo bản ghi trên danh sách, hiển thị snackbar; **Đóng** quay về danh sách và cảnh báo nếu form đã thay đổi.
- [x] Bật modal xác nhận rời trang (`useBlocker` & `beforeunload`) khi người dùng chuyển trang hoặc bấm đóng mà có dữ liệu chưa lưu (`isDirty`).

### 2.4. Quan hệ và trường hợp trốn/chết

- [x] Dialog **Thêm mối quan hệ** có form và schema riêng; hỗ trợ thêm, sửa, xóa, hủy thay đổi.
- [x] Bảng quan hệ thể hiện các cột trong mẫu: họ tên, năm sinh, giới tính, CCCD/CMT, quan hệ, nơi ở hiện nay.
- [x] Phần trốn/chết chỉ hiện khi bật lựa chọn tương ứng; chọn **Trốn** và **Chết** hiện đúng các trường riêng trong mẫu.
- [x] Hỗ trợ thêm/xóa nhiều dòng trốn hoặc chết như prototype; dữ liệu của hai loại không ghi đè nhau.
- [x] Các lựa chọn **Khác** mở ô ghi cụ thể và được kiểm tra bắt buộc khi áp dụng.
- [x] Khi tắt một nhóm điều kiện, dọn dữ liệu không còn áp dụng theo quy tắc đã thống nhất trong form.

### 2.5. Validation và dữ liệu demo

- [x] Tạo Yup schema có type khớp `PersonFormValues`, không dùng `any` hoặc ép kiểu `as never` để bỏ qua lỗi.
- [x] Kiểm tra vai trò, họ tên, giới tính, ngày sinh, nghề nghiệp, địa chỉ hiện tại và các trường bắt buộc theo mẫu.
- [x] CCCD/CMT chỉ gồm chữ số với độ dài hợp lệ (9 hoặc 12 số); khi để trống, yêu cầu lý do không có CCCD/CMT.
- [x] Kiểm tra số điện thoại Việt Nam, ngày sinh/ngày cấp không ở tương lai, ngày bắt lại không trước ngày trốn.
- [x] Hiển thị lỗi tiếng Việt tại đúng trường; form quan hệ và từng dòng trốn/chết có validation riêng.
- [x] Dữ liệu mẫu, type và option tách khỏi UI; Zustand store có action thêm, sửa, xóa, reset và persist chỉ dữ liệu cần thiết.
- [x] ID mới dùng `crypto.randomUUID()` hoặc cơ chế tương đương để tránh trùng.

## 3. Tổ chức source đã hoàn thiện

```text
src/
├── components/address-section/      # Component địa chỉ dùng chung tái sử dụng cho nhiều màn hình
│   ├── AddressSection.tsx
│   ├── types.ts
│   ├── constants.ts
│   └── index.ts
├── pages/demo-project/
│   ├── PersonListPage.tsx
│   ├── PersonFormPage.tsx
│   └── index.ts
├── sections/demo-project/person/
│   ├── PersonForm.tsx               # Biểu mẫu chính với useBlocker xác nhận rời trang
│   ├── view/PersonListView.tsx      # Danh sách Con Người với DataTable, lọc, xóa, đặt lại data
│   ├── components/
│   │   ├── PersonalInfoSection.tsx  # Cột ảnh preview, tra cứu mô phỏng, CCCD/CMND
│   │   ├── AddressSection.tsx       # Tích hợp component địa chỉ dùng chung
│   │   ├── RelationshipDialog.tsx   # Dialog thêm/sửa mối quan hệ
│   │   ├── RelationshipTable.tsx    # Bảng danh sách mối quan hệ
│   │   ├── EscapeDeathSection.tsx   # Quản lý hình thức trốn, chết và chi tiết sự việc
│   │   └── ConfirmDialog.tsx        # Dialog xác nhận thao tác
│   ├── constants/
│   ├── schemas/
│   ├── types/
│   └── index.ts
├── store/demo-person.ts
└── router/routes-config.ts
```

## 4. Checklist theo conventions

- [x] Function component + TypeScript; type-only import dùng `import type`.
- [x] Component/file PascalCase, hook camelCase `use...`, hằng số UPPER_SNAKE_CASE, route ID kebab-case.
- [x] Import bằng alias `@/`; mỗi module có barrel export phù hợp.
- [x] Ưu tiên `sx`, `styled()` hoặc SCSS Module; không chép CSS toàn cục hay inline `style` từ prototype.
- [x] Icon dùng `Iconify`; feedback dùng `notistack`; đường dẫn dùng `PATHS`.
- [x] Không để `console.log`, TODO tạm, import thừa hoặc action giả không có phản hồi cho người dùng.
- [x] Không để một component chứa toàn bộ form; logic điều kiện và bảng con tách theo trách nhiệm.
- [x] Giao diện dùng được bằng bàn phím, có nhãn input/nút, có trạng thái lỗi và xác nhận thao tác xóa.

## 5. Kiểm tra nghiệm thu

- [x] `npm run build` hoàn thành (exit code 0).
- [x] ESLint trên toàn bộ file mới/chỉnh sửa không báo lỗi (0 error).
- [x] Kiểm tra thủ công menu, direct URL, refresh, tìm kiếm/lọc/phân trang, thêm mới, validation, quan hệ, trốn/chết, lưu/xóa và persist sau reload.
- [x] Đã kiểm tra modal cảnh báo khi chuyển trang (`useBlocker` & `beforeunload`) khi form dirty.
- [x] Component `AddressSection` dùng chung đáp ứng đầy đủ props ẩn hiện theo yêu cầu nghiệp vụ.

## 6. Tiêu chí hoàn thành

Người dùng mở được `DEMO PROJECT → Con Người`, thấy danh sách tiếng Việt, bấm **Thêm mới** để nhập được các nhóm thông tin theo HTML mẫu, lưu thành công và thấy bản ghi trên danh sách sau khi tải lại trang. Các nhóm điều kiện, mối quan hệ và trốn/chết hoạt động đúng; build và lint phần thay đổi đều đạt.

## 7. Giới hạn đã thống nhất

- Đây là demo frontend cục bộ, chưa có API tạo/sửa/xóa Con Người hoặc tích hợp CSDL dân cư.
- Dữ liệu trong local storage chỉ dùng để trình diễn, không dùng cho dữ liệu cá nhân thật.
- Giao diện HTML là tài liệu tham chiếu về trường dữ liệu và tương tác; cách thể hiện sẽ tuân theo theme/component của project FE.
