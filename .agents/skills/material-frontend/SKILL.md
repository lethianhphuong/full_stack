---
name: material-frontend
description: Triển khai hoặc chỉnh sửa thay đổi React/MUI chỉ trong FE_material, gồm route, page, section, component, atom, form, table, store, theme, type hoặc frontend service. Không dùng cho công việc chỉ thuộc backend.
---

# Phát triển frontend MAU Material

Dùng quy trình này cho thay đổi chỉ thuộc frontend trong `FE_material/`.

## Ngữ cảnh

Đọc `docs/engineering/frontend-conventions.md`. Đọc thêm `docs/engineering/api-contracts.md` khi feature gọi hoặc mô hình hóa hành vi backend.

Trước khi sửa, kiểm tra route, feature section, UI tái sử dụng, state, type và service boundary bị ảnh hưởng.

## Plan và checklist

Trước khi code, lập plan ngắn và checklist theo `docs/engineering/verification.md`.

Checklist frontend phải bao phủ khi liên quan:

- Vị trí code trong `pages`, `sections`, `components` hoặc `atoms`.
- Route và navigation.
- Type, service và store.
- Form, validation hoặc DataTable.
- Loading, empty, error, disabled và feedback states.
- Responsive và dữ liệu dài.
- API contract.
- Lint, type-check, build và test khả dụng.

Không bắt đầu chỉnh sửa cho đến khi đã xác định được phạm vi và cách kiểm thử.

## Quy trình

1. Đặt code mới đúng trách nhiệm: route entry trong `pages`, UI feature và điều phối trong `sections`, UI tổ hợp tái sử dụng trong `components`, primitive dùng chung trong `atoms`.
2. Giữ `src/router/routes-config.ts` làm nguồn sự thật cho route và navigation.
3. Tái sử dụng pattern MUI, `Base*` fields, FormProvider, DataTable, theme, service và store hiện có trước khi tạo abstraction khác.
4. Xử lý loading, error, empty, disabled, success và responsive state khi phù hợp với tương tác.
5. Giữ chuyển đổi dữ liệu backend trong service hoặc adapter, không rải hiểu biết về wire format trong component.
6. Nếu endpoint, DTO/VO, enum, pagination hoặc validation error phải thay đổi, chuyển sang quy trình `material-fullstack`.
7. Không refactor page legacy lớn không liên quan chỉ để đạt kiến trúc mục tiêu.

## Hoàn thành

Sau khi code:

1. Kiểm tra diff frontend.
2. Đối chiếu từng mục checklist và các trạng thái UI liên quan.
3. Chạy lint, type/build và test khả dụng theo `docs/engineering/verification.md`.
4. Sửa và chạy lại lỗi do thay đổi hiện tại gây ra.
5. Báo riêng build thành công với test coverage thực tế.

Không báo hoàn thành chỉ vì giao diện render được hoặc build pass.
