# Quy chuẩn frontend

Tài liệu này là nguồn quy chuẩn frontend chính thức của `FE_material`. Nội dung được hợp nhất từ `CODING_CONVENTIONS.md`, `GEMINI.md` cũ và code thực tế. Quy chuẩn áp dụng bắt buộc cho code mới; sai khác hiện có chỉ là mục tiêu migration khi nằm trong phạm vi công việc được yêu cầu.

## 1. Công nghệ

- React 19+, TypeScript ~5.9 và Vite 8.
- MUI 7 với Emotion.
- Zustand 5 cho shared client state.
- React Router 7 theo kiến trúc config-driven.
- React Hook Form 7, Yup 1 và `@hookform/resolvers` cho form.
- Material React Table 3 thông qua wrapper `DataTable` của project.
- Iconify, ApexCharts/Recharts, Framer Motion, SimpleBar và OnlyOffice theo feature hiện có.
- Viết React bằng function component và TypeScript; đảm bảo responsive và ưu tiên khả năng tái sử dụng.

## 2. TypeScript, import và đặt tên

- Dùng `import type` cho type-only import vì project bật `verbatimModuleSyntax`.
- Dùng alias `@/` cho import từ `src/`; không tạo thêm alias cạnh tranh nếu chưa có quyết định kiến trúc.
- File component dùng PascalCase: `DashboardPage.tsx`, `AppWelcome.tsx`.
- File config và utility dùng kebab-case: `routes-config.ts`, `generate-nav.ts`.
- Component, type và interface dùng PascalCase.
- Hook dùng camelCase với prefix `use`; selector Zustand dùng camelCase với prefix `select`.
- Constant, đặc biệt constant layout, dùng `UPPER_SNAKE_CASE`: `NAV_WIDTH`, `HEADER_MOBILE`.
- Route ID dùng kebab-case không dấu; route title hiển thị bằng tiếng Việt có dấu.
- Dùng `index.ts` làm barrel export tại các module đang áp dụng pattern này.
- Code phải tự giải thích. Chỉ viết comment để giải thích quyết định không hiển nhiên.
- Có thể dùng dòng `// ----------------------------------------------------------------------` để chia section khi nó thực sự giúp dễ đọc; không thêm máy móc.

## 3. Kiến trúc bốn tầng UI

### `src/atoms/`

- Chứa component nguyên tử và wrapper MUI dùng chung, có tính tái sử dụng cao và không chứa business logic.
- Bao gồm `DataTable`, các field `Base*`, các override `Custom*` và primitive hiển thị/feedback.
- Atom nhận props tổng quát; không hardcode rule theo domain.
- Export qua `src/atoms/index.ts`; có thể có barrel export cục bộ khi module được tổ chức theo folder.

### `src/components/`

- Chứa UI tổ hợp từ atoms hoặc MUI, vẫn không chứa business logic theo domain.
- Ví dụ: `Iconify`, `Scrollbar`, `PageTransition`, `SettingsDrawer`, `FormProvider` và component tích hợp dùng chung.
- `src/components/index.ts` có thể re-export atoms và các component dùng chung theo pattern hiện tại.

### `src/sections/`

- Chứa feature UI và business logic phía giao diện: form, table, chart, tải dữ liệu, lọc, state phối hợp và gọi service.
- Section được page sử dụng và có thể tổ chức tiếp theo feature thành `view/`, `components/`, `hooks/`, `types/`, `schemas/`, `constants/` khi độ phức tạp cần thiết.

### `src/pages/`

- Là route entry và wrapper mỏng để tổ hợp section, layout và page-level settings như `themeCompact`.
- Router trỏ tới page, không trỏ trực tiếp vào atom hoặc component dùng chung.
- Mục tiêu 15–30 dòng là chỉ báo thiết kế, không phải giới hạn máy móc.
- Các page lớn hiện có là ngoại lệ legacy. Không tự refactor chúng chỉ để giảm số dòng nếu không thuộc yêu cầu.

## 4. Cấu trúc module

```text
src/
├── api/             # HTTP client primitive và cấu hình API dùng chung
├── assets/          # Static assets
├── atoms/           # UI primitive và wrapper MUI dùng chung
│   ├── data-table/
│   ├── fields/
│   └── overrides/
├── components/      # UI tổ hợp dùng chung
│   ├── hook-form/
│   ├── iconify/
│   ├── scrollbar/
│   ├── settings/
│   └── page-transition/
├── constants/       # Hằng số ứng dụng và path
├── guards/          # Route guard khi có
├── hooks/           # Custom hook dùng chung
├── layout/          # Root layout hiện có
├── layouts/         # Feature layout: auth, dashboard, compact
├── locales/         # i18n translation khi có
├── pages/           # Route entry và wrapper
├── router/          # Route config và generator
├── sections/        # Feature UI và UI business logic
├── services/        # Tích hợp endpoint theo domain
├── store/           # Zustand store
├── styles/          # Global CSS/SCSS, variable và mixin
├── theme/           # Theme MUI và component override
├── types/           # TypeScript type dùng chung
└── utils/           # Utility tổng quát
```

Không tạo folder chỉ để khớp sơ đồ nếu feature chưa cần. Tôn trọng cách tổ chức hiện có của module liền kề.

## 5. MUI và component giao diện

- Ưu tiên component MUI từ `@mui/material` và `@mui/lab` trước khi tự xây lại cùng chức năng.
- Layout: `Box`, `Stack`, `Container`, `Grid`.
- Data display: `DataTable`, `Table`, `List`, `Card`.
- Input: các field `Base*` của project hoặc MUI input phù hợp khi không cần wrapper.
- Feedback: `CustomDialog`, `Drawer`, Snackbar qua `notistack`.
- Navigation: `Tabs`, `Breadcrumbs`, `Pagination`.
- Scrollbar tùy biến dùng component `Scrollbar`, được bọc từ `simplebar-react`.
- Chart dùng ApexCharts hoặc Recharts theo pattern của feature hiện có.
- Animation và page transition dùng Framer Motion khi chuyển động mang lại giá trị giao diện.

## 6. Icon

- Dùng wrapper `Iconify` của project với `@iconify/react`.
- Bộ icon mặc định là Solar, ưu tiên `solar:*-bold-duotone` hoặc `solar:*-bold`.
- Giữ kích thước, màu và cách đặt icon theo theme; không trộn thư viện icon mới nếu không có lý do rõ ràng.

```tsx
<Iconify icon="solar:widget-5-bold-duotone" width={24} />
```

## 7. DataTable

- Dùng `DataTable` từ `@/atoms/data-table` cho bảng dữ liệu nghiệp vụ mới thông thường.
- Wrapper này dựa trên Material React Table, có localization tiếng Việt, MUI theme và các preset dùng chung.
- Định nghĩa cột bằng `MRT_ColumnDef<T>[]` và dùng `import type` khi chỉ nhập type.

```tsx
import { DataTable, type MRT_ColumnDef } from '@/atoms';

const columns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Họ tên' },
  { accessorKey: 'email', header: 'Email' },
];

<DataTable columns={columns} data={people} enableRowSelection />;
```

Các khả năng sẵn có cần tái sử dụng thay vì tự triển khai lại:

- Sorting, filtering và pagination.
- Row selection.
- Column pinning và resizing.
- Row grouping và aggregation.
- Row actions cho CRUD.
- Server-side pagination, sorting và filtering.
- Export CSV.
- Virtualization cho tập dữ liệu lớn.

Tham khảo demo tại route `/components/data-table`. Chỉ dùng MUI Data Grid khi khả năng riêng của nó đủ để biện minh cho sự khác biệt.

Với server-side table, đồng bộ page index, sorting, filter và row count với `api-contracts.md`.

## 8. Form và validation

- Dùng React Hook Form, Yup và `@hookform/resolvers` cho business form mới.
- Bọc form bằng `FormProvider` của project và gửi qua `handleSubmit`.
- Field chuẩn hiện có nằm trong `src/atoms/fields/` và dùng họ tên `Base*`, gồm `BaseTextField`, `BaseTextArea`, `BaseNumberField`, `BaseMoneyField`, `BaseSelect`, `BaseAutocomplete`, `BaseRadioGroup`, `BaseCheckboxGroup`, `BaseSwitch`, `BaseDatePicker`, `BaseDateRangePicker`, `BaseUpload` và `BaseEditor`.
- Dùng `BaseFormList` và `FormDependency` từ `src/components/hook-form/` khi đúng nhu cầu.
- Không tạo một họ component `RHF*` song song khi chưa có quyết định migration rõ ràng.
- Submit bất đồng bộ phải thể hiện loading và ngăn gửi lặp; dùng loading button phù hợp với pattern hiện có.
- Thông báo kết quả qua `useSnackbar()`/`notistack` khi phù hợp.
- Map lỗi validation backend về đúng field form tại service hoặc form adapter, không rải mapping trong component con.

## 9. Styling và SCSS

Thứ tự ưu tiên:

1. `sx` prop cho style đơn giản và theme-aware.
2. `styled()` từ `@mui/material/styles` cho component tái sử dụng hoặc style theo prop.
3. SCSS Modules cho style phức tạp có nhiều selector.

Quy tắc:

- Dùng `theme.palette`, spacing, typography, breakpoint và `alpha()` thay cho hardcode khi có token phù hợp.
- Không dùng Tailwind hoặc React `style` prop.
- Khi `styled()` nhận custom prop, khai báo `shouldForwardProp` để prop không bị chuyển xuống DOM.
- Constant layout dùng `UPPER_SNAKE_CASE`.
- SCSS dùng các file hiện có trong `src/styles/`: `_variables.scss`, `_mixins.scss`, `index.scss`; cấu hình auto-import nằm trong `vite.config.ts`.

```tsx
const StyledComponent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
}));
```

## 10. Theme

Theme nằm trong `src/theme/`:

- `palette.ts`: primary, secondary, info, success, warning, error và các cấp màu liên quan.
- `typography.ts`: font family và responsive font sizes.
- `shadows.ts`: shadow chuẩn và `customShadows`.
- `overrides/`: override theo MUI component.
- `css.ts`: utility như `bgBlur()`, `bgGradient()`, `textGradient()` và `hideScroll`.

Giữ khả năng dark/light mode, color preset, contrast, RTL, font family và font-size scaling theo hệ thống settings hiện có. Không hardcode để vượt qua theme.

## 11. Zustand

- Store nằm trong `src/store/`, tách theo domain hoặc trách nhiệm.
- Export store qua `src/store/index.ts`.
- Dùng pattern `create<State & Actions>()(...)`; dùng middleware `persist` khi state thực sự cần lưu qua phiên.
- Khi persist, dùng `partialize` để không lưu state tạm hoặc dữ liệu không phù hợp.
- Selector function có prefix `select`, ví dụ `selectRoutesConfig`.
- Component nên subscribe vào phần state cần dùng thay vì lấy toàn bộ store nếu điều đó gây render không cần thiết.

```ts
const settings = usePreferencesStore();
const routesConfig = useRouterStore(selectRoutesConfig);
```

## 12. Routing

- `src/router/routes-config.ts` là Single Source of Truth cho route và navigation menu.
- Cùng route config được dùng để sinh React Router routes và navigation qua các generator hiện có.
- Page mới phải lazy-load bằng pattern đang dùng, ví dụ `element: () => import('@/pages/...')`.
- Dùng `hideInMenu: true` cho route hoạt động nhưng không xuất hiện trong menu.
- Route ID dùng kebab-case không dấu; title dùng tiếng Việt có dấu; path là relative path theo type hiện tại.
- Khi thêm route con, kiểm tra cả route generation, navigation generation, breadcrumb/path constant và quyền truy cập liên quan.

## 13. Type

- Shared type nằm trong `src/types/` và export qua `index.ts` khi dùng rộng rãi.
- Type chỉ thuộc một feature nên nằm gần feature để tránh làm `src/types/` thành kho tổng hợp.
- Dùng String literal union cho tập giá trị cố định khi phù hợp.
- Với enum từ backend, định nghĩa wire type và cấu hình hiển thị tên/màu/icon rõ ràng; không trộn nhãn hiển thị với giá trị gửi qua API.

```ts
type ThemeMode = 'light' | 'dark';
type ThemeLayout = 'vertical' | 'horizontal' | 'mini';
```

## 14. API và service

- Base URL lấy từ `import.meta.env.VITE_API_URL`; biến môi trường đưa ra frontend phải có prefix `VITE_`.
- Giữ HTTP client primitive hoặc interceptor dùng chung trong `src/api/` khi đó là ranh giới hiện có.
- Đặt operation theo domain và chuyển đổi wire model trong `src/services/`.
- Component/section không tự lặp cấu hình base URL, header hoặc unwrap response.
- Khi contract backend thay đổi, áp dụng `api-contracts.md` và truy vết mọi consumer.

## 15. Layout

Dashboard hỗ trợ ba chế độ theo `themeLayout`:

- `vertical`: sidebar trái, chiều rộng chuẩn hiện tại 280px.
- `horizontal`: top navigation bar.
- `mini`: sidebar thu gọn, chiều rộng chuẩn hiện tại 88px.

Các layout dashboard phải render route content qua `<Outlet />` và giữ `PageTransition` theo pattern hiện có. Thay đổi kích thước hoặc hành vi layout phải đi qua constant/theme/settings thích hợp thay vì hardcode rải rác.

## 16. Trạng thái và chất lượng giao diện

- Xử lý loading, error, empty, disabled và success state khi luồng có các trạng thái đó.
- Giữ responsive trên các breakpoint liên quan; kiểm tra ít nhất bố cục mobile và desktop khi thay đổi layout.
- Dùng text tiếng Việt nhất quán với khu vực hiện có và giữ khả năng i18n nếu feature sử dụng locale.
- Không thêm abstraction hoặc dependency mới khi component/pattern hiện có đã giải quyết được yêu cầu.

## 17. Tư duy kiến trúc, code smell và DRY

Khi thiết kế, chỉnh sửa hoặc review giao diện, áp dụng tư duy Senior Frontend Architect với MUI 7, Emotion và design system hiện có.

- Chủ động phát hiện styling trùng lặp, `sx` object quá lớn, component chứa nhiều trách nhiệm và pattern UI thiếu nhất quán.
- Tái sử dụng theme token, utility và component hiện có trước khi tạo abstraction mới.
- Chỉ tách shared component, helper, variant hoặc styled component khi pattern có nhu cầu tái sử dụng thực tế và việc tách làm code rõ hơn.
- Không trừu tượng hóa sớm, không tạo component vạn năng và không gom các giao diện chỉ giống nhau về hình thức nhưng khác trách nhiệm.
- Styled component có custom prop phải dùng `shouldForwardProp`.
- Component dùng chung không được hardcode dữ liệu hoặc hành vi theo domain.
- Khi code smell nằm ngoài phạm vi yêu cầu, báo cáo thay vì tự động refactor.

## 18. Quy chuẩn Dialog và Popup (`CustomDialog`)

- Dialog mới của ứng dụng dùng `CustomDialog` từ `@/components` hoặc `@/atoms`; không import trực tiếp `@mui/material/Dialog` trong feature khi wrapper này đáp ứng được nhu cầu.
- Cấu trúc gồm header (tiêu đề và nút đóng), `DialogContent` cuộn độc lập và footer `actions` đứng yên. Với form dài, dùng `dividers` để phân tách vùng cuộn; chỉ nội dung bên trong cuộn, không để hành động chính trôi theo form.
- Nút submit đặt trong `actions` và liên kết với `<form>` qua cùng một `id`: `form="form-id" type="submit"`. `FormProvider` nhận prop `id`; dùng ID duy nhất nếu có thể có nhiều form/dialog cùng lúc.
- Thể hiện trạng thái đang gửi trên nút hành động và ngăn gửi lặp. Giữ hành vi đóng qua nút X, phím Escape và backdrop theo yêu cầu từng feature; không đánh đồng callback của nút X với `backdropClick`.
- Tùy chỉnh footer qua `actionsSx` khi cần. Màu sắc, viền và thanh cuộn dùng theme token; kiểm tra dialog ở mobile, desktop, light/dark và khi nội dung dài.
