# Plan: Bộ Base Fields kiểu Ant Design Pro (MUI + RHF, 100% miễn phí)

> **Mục tiêu:** mỗi form field chỉ cần truyền `options` / `valueEnum` / `request` là dùng được ngay,
> muốn tùy biến thì có `renderOption` / `renderField`. Không import bất kỳ package `-pro` / `-premium` nào.
>
> **Triết lý:** giống Ant Design Pro — người dùng form viết càng ít code càng tốt,
> mọi sự "thông minh" (chuẩn hóa options, fetch async, hiển thị readonly) được giấu bên trong component.

---

## Kiến trúc tổng thể

```
src/atoms/fields/
├── shared/
│   ├── types.ts              # BaseOption, ValueEnum, FieldCommonProps
│   ├── normalize-options.ts  # valueEnum | array → BaseOption[]
│   ├── use-async-options.ts  # hook request() + debounce + params
│   └── clear-adornment.tsx   # nút allowClear dùng chung
├── BaseTextField.tsx         # (nâng cấp) allowClear, maxLength counter
├── BaseTextArea.tsx          # multiline + maxRows + counter
├── BaseNumberField.tsx       # chặn ký tự chữ, min/max/step
├── BaseMoneyField.tsx        # format numeral: 1.000.000 ₫
├── BaseSelect.tsx            # (nâng cấp) valueEnum, multiple, allowClear, showSearch
├── BaseAutocomplete.tsx      # showSearch thật, freeSolo (tags), async
├── BaseRadioGroup.tsx        # options, optionType="button"
├── BaseCheckboxGroup.tsx     # options (mảng giá trị)
├── BaseSwitch.tsx            # (giữ nguyên)
├── BaseDatePicker.tsx        # nâng lên @mui/x-date-pickers Community
├── BaseDateRangePicker.tsx   # 2 DatePicker + validate từ ≤ đến
├── BaseUpload.tsx            # input file + drag & drop + preview
└── index.ts                  # barrel export

src/components/hook-form/
├── FormProvider.tsx          # (đã có)
├── FormDependency.tsx        # render-prop theo watch() — tương đương ProFormDependency
└── BaseFormList.tsx          # useFieldArray — tương đương ProFormList
```

### Nguyên tắc thiết kế (bắt buộc tuân thủ)

1. **Mỗi field = 2 lớp:** lớp hiển thị thuần (chỉ nhận `value`/`onChange`, không biết gì về form) + lớp mỏng wrap `Controller` của React Hook Form.
   - *Lý do:* dùng được cả ngoài form (filter trên bảng, dialog tìm kiếm...) và dễ viết unit test.
2. **Logic thông minh dùng chung:** normalize options, async request, readonly nằm trong `shared/`, tuyệt đối không copy-paste vào từng field.
3. **Props chuẩn chung cho mọi field:** `name`, `label`, `helperText`, `disabled`, `readonly`, `allowClear`, `valueEnum`, `options`, `request`, `params`. Người dùng học 1 field là biết dùng tất cả.
4. **`readonly` → hiển thị text** thay vì input (đúng triết lý ProField của antd Pro).
5. **Styling:** không dùng Tailwind, không inline `style` — chỉ `sx` prop hoặc `styled()` (theo CODING_CONVENTIONS).
6. **TypeScript:** mọi field export type Props + type giá trị để tái sử dụng; dùng `import type` (bắt buộc bởi `verbatimModuleSyntax`).

### Bảng mapping Ant Design Pro → Base Fields

| Ant Design Pro | Base Field | Ghi chú |
|---|---|---|
| `ProFormText` | `BaseTextField` | thêm allowClear, counter |
| `ProFormTextArea` | `BaseTextArea` | multiline + counter |
| `ProFormDigit` | `BaseNumberField` | chặn ký tự chữ, min/max |
| `ProFormMoney` | `BaseMoneyField` | format `1.000.000 ₫` bằng numeral |
| `ProFormSelect` | `BaseSelect` | options/valueEnum/multiple/showSearch |
| `ProFormSelect` (search) | `BaseAutocomplete` | tìm kiếm thật, tags (freeSolo) |
| `ProFormRadio.Group` | `BaseRadioGroup` | optionType="button" |
| `ProFormCheckbox.Group` | `BaseCheckboxGroup` | giá trị dạng mảng |
| `ProFormSwitch` | `BaseSwitch` | đã có sẵn |
| `ProFormDatePicker` | `BaseDatePicker` | @mui/x-date-pickers Community |
| `ProFormDateRangePicker` | `BaseDateRangePicker` | tự viết (bản Pro của MUI X mất phí) |
| `ProFormUploadButton` | `BaseUpload` | tự viết, drag & drop |
| `ProFormDependency` | `FormDependency` | dựa trên `watch()` của RHF |
| `ProFormList` | `BaseFormList` | dựa trên `useFieldArray` của RHF |
| `ProFormCascader` | `BaseAutocomplete` (grouping) | không có bản MUI tương đương trực tiếp |

---

## Phase 1 — Nền tảng dùng chung

> **Lưu ý quan trọng:** đây là phase nền móng, mọi phase sau đều phụ thuộc.
> Làm kỹ phần này thì các field phía sau chỉ là "lắp ghép", không phải viết lại logic.

### 1.1 `shared/types.ts`

Định nghĩa các type dùng chung cho toàn bộ hệ thống field:

- `BaseOption = { label: string; value: string | number; disabled?: boolean; [key: string]: unknown }`
  - *Lưu ý:* `[key: string]: unknown` cho phép đính kèm dữ liệu tùy ý (avatar, mã màu...) để dùng trong `renderOption`.
- `ValueEnum = Record<string | number, string | { label: string; disabled?: boolean }>`
  - *Lưu ý:* value của enum có thể là string ngắn (`'Hoạt động'`) hoặc object đầy đủ — cả 2 đều được hỗ trợ.
- `FieldCommonProps` — nhóm props chung: `name`, `label`, `helperText`, `disabled`, `readonly`, `allowClear`.

### 1.2 `shared/normalize-options.ts`

Hàm chuẩn hóa đầu vào — trái tim của hệ thống "options thông minh":

- `normalizeOptions(optionsOrEnum): BaseOption[]`
- Nhận được 3 dạng đầu vào, luôn trả về 1 dạng duy nhất `BaseOption[]`:
  1. Mảng object: `[{ label, value }]` → giữ nguyên
  2. Mảng tuple: `[['active', 'Hoạt động']]` → convert
  3. Object enum: `{ active: 'Hoạt động' }` → convert
- *Lưu ý:* cần xử lý các trường hợp biên — mảng rỗng, value là số, value trùng nhau, `undefined`/`null`.
- Viết unit test cho các trường hợp trên.

### 1.3 `shared/use-async-options.ts`

Hook fetch options từ API — tương đương prop `request` của antd Pro:

- `useAsyncOptions(request, { debounceTime = 300, params, deps })`
- Trả về `{ options, loading, error, reload }`
- *Lưu ý kỹ thuật:*
  - Debounce bằng `setTimeout` + cleanup, **không cài thêm thư viện** (lodash debounce không cần thiết).
  - Phải abort request cũ khi unmount hoặc khi `params` thay đổi để tránh **race condition** (response cũ về sau response mới).
  - `request` trả về `Promise<BaseOption[]>` — nếu API trả về shape khác thì chuẩn hóa ở nơi gọi, không chuẩn hóa trong hook.

### 1.4 `shared/clear-adornment.tsx`

Nút xóa giá trị (allowClear) dùng chung cho TextField/Select/Autocomplete:

- Icon button đặt trong `InputAdornment` position end, bấm gọi `onChange('')`.
- *Lưu ý:* tự động ẩn khi không có giá trị, hoặc khi `disabled`/`readonly`.
- Icon dùng Iconify bộ Solar (theo convention): ví dụ `solar:close-circle-bold`.

### Nghiệm thu Phase 1

- Unit test `normalizeOptions` pass đủ các trường hợp biên.
- Demo nhỏ: 1 field dùng `useAsyncOptions` với API giả lập (setTimeout), kiểm tra loading + debounce + abort hoạt động đúng.

---

## Phase 2 — Nhóm field cơ bản

> **Lưu ý:** phase này ưu tiên **backward compatible** — `BaseTextField` hiện tại đang được dùng
> trong `UserCreateForm`, nâng cấp không được phá vỡ code cũ.

### 2.1 Nâng cấp `BaseTextField`

- Thêm `allowClear` — dùng `clear-adornment` của Phase 1.
- Thêm `maxLength` + bộ đếm ký tự hiển thị dạng `12/255` ở góc phải helperText.
- *Lưu ý:* khi không truyền `allowClear`/`maxLength` thì hành vi giống hệt hiện tại.

### 2.2 `BaseTextArea`

- `multiline`, `minRows`/`maxRows`, counter giống TextField.
- *Lưu ý:* có thể gộp vào BaseTextField qua prop `multiline`, nhưng tách riêng giúp API rõ ràng hơn — quyết định lúc implement, ưu tiên tách riêng.

### 2.3 `BaseNumberField`

- Chặn nhập ký tự không phải số: kết hợp `onKeyDown` (chặn phím) + sanitize giá trị khi paste.
- Props: `min`, `max`, `step`, nút tăng/giảm ở adornment.
- *Lưu ý quan trọng:* giá trị lưu trong form là `number | null`, **không phải string** — tránh lỗi khi submit API. Yup schema tương ứng: `Yup.number().nullable()`.

### 2.4 `BaseRadioGroup`

- Nhận `options` / `valueEnum` qua `normalizeOptions`.
- `optionType: 'default' | 'button'` — dạng button dùng `ToggleButtonGroup` hoặc Radio styled.
- `direction: 'horizontal' | 'vertical'`.
- *Lưu ý:* wrap trong `FormControl` + `FormLabel` để có label + error message chuẩn MUI.

### 2.5 `BaseCheckboxGroup`

- Nhận `options` / `valueEnum`, giá trị trong form là **mảng** các value được chọn.
- *Lưu ý:* Yup schema gợi ý: `Yup.array().min(1, 'Chọn ít nhất 1')`.
- Toggle từng checkbox: thêm/xóa value khỏi mảng, không thay thế cả mảng.

### Nghiệm thu Phase 2

- Refactor `UserCreateForm` sang dùng cú pháp mới (options thay vì map MenuItem thủ công).
- `tsc -b` pass, form cũ vẫn chạy đúng.

---

## Phase 3 — Select nâng cao + Autocomplete

> **Lưu ý:** đây là phase phức tạp nhất về mặt API. Nguyên tắc vàng:
> **API bên ngoài của BaseSelect không đổi** — người dùng không cần biết bên trong là Select hay Autocomplete.

### 3.1 Nâng cấp `BaseSelect`

- `valueEnum` — qua `normalizeOptions` của Phase 1.
- `multiple` — giá trị dạng mảng, render `Chip` cho từng giá trị đã chọn.
- `allowClear` — dùng clear-adornment.
- `showSearch` — khi `true`, bên trong tự chuyển sang render `BaseAutocomplete`.
- *Lưu ý kỹ thuật:* `onChange` của MUI Select và Autocomplete có shape khác nhau
  (Select trả value, Autocomplete trả event + value). Phải chuẩn hóa trong BaseSelect
  để `field.onChange` luôn nhận đúng shape mà RHF/Yup mong đợi.

### 3.2 `BaseAutocomplete`

- Tìm kiếm thật: filter options theo text nhập vào (không dấu càng tốt — dùng `normalize('NFD')` để bỏ dấu tiếng Việt khi so khớp).
- `freeSolo` — chế độ tags: nhập tự do, Enter để thêm giá trị mới.
- `multiple` — render Chip, xóa được từng chip.
- Async: nhận `request` qua `useAsyncOptions`, hiển thị loading indicator trong dropdown.
- `renderOption` — giữ nguyên API như BaseSelect hiện tại để dễ di chuyển qua lại.
- *Lưu ý:* dùng `getOptionLabel`/`isOptionEqualToValue` chuẩn hóa theo `label`/`value` của `BaseOption`.

### Nghiệm thu Phase 3

- Demo chọn nhân viên: có search, fetch async giả lập, hiển thị loading, chọn được nhiều người.

---

## Phase 4 — Date & Money

> **Lưu ý quan trọng nhất phase này:** đổi kiểu giá trị ngày từ `string` sang `Date | null`
> là **breaking change** — ảnh hưởng Yup schema và payload API của `UserCreateForm` hiện tại.
> Phải chuẩn hóa ở tầng submit (format `Date` → `'yyyy-MM-dd'` trước khi gọi API).

### 4.1 Cài đặt

- `npm i @mui/x-date-pickers` — bản Community, **miễn phí**.
- Adapter: dùng `date-fns` (đã có sẵn trong dependencies, không cài thêm).
- Wrap `LocalizationProvider` với `AdapterDateFns` + locale `vi` vào `App.tsx` — **chỉ 1 lần duy nhất** ở root, không wrap trong từng field.
- *Lưu ý:* kiểm tra trước phiên bản `@mui/x-date-pickers` tương thích React 19 + MUI 7 trước khi cài.

### 4.2 Nâng cấp `BaseDatePicker`

- Chuyển từ native `input[type=date]` sang `DatePicker` của MUI X.
- Format hiển thị `dd/MM/yyyy`, locale tiếng Việt (thứ, tháng bằng tiếng Việt).
- Props: `minDate`, `maxDate`, `disableFuture`, `disablePast`.
- Giá trị lưu: `Date | null`.
- *Lưu ý:* cập nhật Yup schema trong `UserCreateForm` từ `Yup.string()` sang `Yup.date().nullable()`.

### 4.3 `BaseDateRangePicker`

- Vì Date Range Picker của MUI X là bản Pro (mất phí) → **tự viết** bằng 2 `DatePicker` ghép lại trong 1 field.
- Validate: ngày "từ" ≤ ngày "đến" — validate ngay trong component (tự set `minDate` cho ô "đến") + Yup `.test()` ở schema.
- Giá trị: `{ from: Date | null; to: Date | null }`.
- *Lưu ý:* khi đổi ngày "từ" mà lớn hơn ngày "đến" đang chọn → tự xóa ngày "đến" để tránh trạng thái không hợp lệ.

### 4.4 `BaseMoneyField`

- Format bằng `numeral` (đã có sẵn trong dependencies): hiển thị `1.000.000`.
- Props: `currencySymbol` (mặc định `₫`), `precision` (mặc định 0 — tiền VND không có số lẻ).
- Hành vi: khi focus hiển thị số thô để dễ nhập, khi blur hiển thị formatted.
- *Lưu ý:* giá trị lưu trong form là `number`, chỉ format ở lớp hiển thị — không lưu string đã format.

### Nghiệm thu Phase 4

- Form demo có đủ: ngày sinh (DatePicker), khoảng thời gian (RangePicker), giá tiền (MoneyField).
- Kiểm tra locale tiếng Việt hiển thị đúng.

---

## Phase 5 — Upload + Form nâng cao

### 5.1 `BaseUpload`

- Props: `multiple`, `accept` (vd: `image/*`), `maxSize` (MB), `maxFiles`.
- UI: vùng drag & drop + click để chọn file.
- Preview: ảnh hiển thị thumbnail, file khác hiển thị icon + tên + dung lượng (format KB/MB).
- Nút xóa từng file, thông báo lỗi khi vượt maxSize/maxFiles qua `notistack`.
- Giá trị trong form: `File[]`.
- *Lưu ý:* validate file ngay khi chọn (trước khi submit); dùng `URL.createObjectURL` cho preview và nhớ revoke khi xóa/unmount để tránh leak bộ nhớ.

### 5.2 `FormDependency` (tương đương ProFormDependency)

- Render-prop dựa trên `watch()` của RHF:
  ```tsx
  <FormDependency watch={['role']}>
    {({ role }) => role === 'admin' && <BaseTextField name="permission" ... />}
  </FormDependency>
  ```
- *Lưu ý:* chỉ re-render khi giá trị được watch thay đổi — dùng `useWatch` thay vì `watch` để tối ưu hiệu năng.

### 5.3 `BaseFormList` (tương đương ProFormList)

- Wrap `useFieldArray` của RHF.
- UI: mỗi item là 1 Card/Stack có viền, nút **Thêm** ở dưới, nút **Xóa** (và tùy chọn **Nhân bản**) ở mỗi item.
- Props: `name`, `renderItem(index)`, `defaultItemValue`, `maxItems`, `minItems`.
- Dùng cho: danh sách địa chỉ, danh sách kỹ năng, danh sách liên hệ...
- *Lưu ý:* dùng `useFieldArray` chứ không tự quản mảng bằng state — để RHF giữ track validation từng item.

### Nghiệm thu Phase 5

- Form demo đầy đủ: upload avatar, thêm/xóa danh sách địa chỉ, field ẩn hiện theo vai trò (FormDependency).

---

## Phase 6 — Hoàn thiện

### 6.1 Chế độ `readonly` cho mọi field

- Khi `readonly`: hiển thị text/giá trị thay vì input, không border, không focus được.
- Với field có options: map value → label để hiển thị (vd: `'active'` → `'Hoạt động'`).
- Với DatePicker: hiển thị `dd/MM/yyyy`. Với Money: hiển thị formatted.
- *Lưu ý:* dùng chung 1 component `ReadonlyValue` trong `shared/` để tránh lặp logic.

### 6.2 Trang demo `/components/form-fields`

- Thêm route vào `routes-config.ts` (có thể `hideInMenu: true` hoặc thêm vào menu Components).
- Showcase toàn bộ field ở 4 trạng thái: thường, có lỗi, readonly, async loading.
- *Lưu ý:* trang này đồng thời là tài liệu sống — dev mới nhìn vào là biết cách dùng.

### 6.3 Tài liệu

- Cập nhật `CODING_CONVENTIONS.md` mục Form Handling: bảng mapping ProForm → Base, ví dụ usage chuẩn.
- JSDoc + ví dụ `@example` trong từng component (đã làm mẫu ở BaseSelect).

### 6.4 Kiểm tra cuối

- `tsc -b` pass, `npm run lint` pass.
- Responsive: trên mobile các Grid stack dọc, dropdown không tràn màn hình.
- Dark mode: kiểm tra màu sắc, border, readonly text trong dark mode.

---

## Ước lượng & thứ tự thực hiện

| Phase | Nội dung | Phụ thuộc | Ghi chú |
|---|---|---|---|
| 1 | Nền tảng shared | — | Làm kỹ, là nền móng |
| 2 | Text/Number/Radio/Checkbox | Phase 1 | Ưu tiên backward compatible |
| 3 | Select nâng cao + Autocomplete | Phase 1 | Phức tạp nhất về API |
| 4 | Date + Money | Phase 1 | Có breaking change kiểu Date |
| 5 | Upload + FormList + Dependency | Phase 1 | Độc lập với 2/3/4 |
| 6 | Readonly + demo + docs | Tất cả | Làm sau cùng |

Phase 2, 3, 4, 5 **độc lập nhau** sau khi xong Phase 1 — có thể làm song song hoặc chọn làm trước phase nào dự án đang cần gấp nhất.

## Ghi chú bổ sung (2026-08-26)

### Rich Text Editor — BaseEditor

- MUI **không có sẵn** rich text editor (kể cả bản Pro/Premium).
- Template Minimal Dashboard (MUI Store) dùng **React Quill** cho phần editor.
- **Quyết định:** `BaseEditor` dùng `react-quill-new` (bản fork hỗ trợ React 19),
  giữ nguyên API (`name`, `label`, `placeholder`, `minHeight`), giá trị lưu dạng HTML string.
- Toolbar: heading 1-4, bold/italic/underline/strike, list, align, blockquote, code-block, link, clean.
- Style Quill theo theme MUI qua `sx` (border, focus glow, màu icon toolbar).
- **Cài đặt ở máy local:** `npm i react-quill-new`, sau đó XÓA file type shim
  `src/types/react-quill-new.d.ts` (package có sẵn types).

## Rủi ro cần lưu ý

1. **Đổi kiểu giá trị DatePicker** (string → Date|null) ảnh hưởng Yup schema và payload API hiện có → bắt buộc chuẩn hóa ở tầng submit, kiểm tra lại `UserCreateForm`.
2. **`showSearch` chuyển sang Autocomplete:** shape `onChange` khác nhau → phải chuẩn hóa trong BaseSelect để API bên ngoài không đổi, tránh leak abstraction.
3. **React 19 + MUI 7:** kiểm tra tương thích phiên bản `@mui/x-date-pickers` mới nhất trước khi cài — nếu chưa tương thích thì giữ native date input thêm 1 thời gian.
4. **Memory leak ở BaseUpload:** phải `URL.revokeObjectURL` khi xóa file/unmount.
5. **Race condition ở async options:** luôn abort request cũ khi params đổi hoặc unmount.
