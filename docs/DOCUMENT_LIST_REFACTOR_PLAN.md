# Document List Refactor Plan

## Mục tiêu

- Refactor `DocumentListView` theo từng task nhỏ.
- Không để quá nhiều code trong một file.
- Không lặp lại JSX, logic hoặc cấu hình.
- Tách các UI block thành component tái sử dụng.
- Sử dụng `CustomTable`, `CustomDialog`, `Iconify` có sẵn.
- Sử dụng Axios thay cho fetch.
- Giữ nguyên behavior hiện tại.
- Sau mỗi task phải kiểm tra TypeScript/build trước khi sang task tiếp theo.

---

## Task 0 - Khảo sát hiện trạng

- [ ] Đọc toàn bộ `DocumentListView`.
- [ ] Xác định các API đang dùng.
- [ ] Xác định các type/model hiện có.
- [ ] Xác định các đoạn JSX bị lặp.
- [ ] Xác định các logic cần giữ nguyên.
- [ ] Kiểm tra Axios/API client hiện có.
- [ ] Kiểm tra script lint, type-check và build.

---

## Task 1 - Tách constants và helpers ✅

Tạo:

```text
src/sections/onlyoffice/constants/document.constants.ts
src/sections/onlyoffice/utils/document.utils.ts
```

- [x] Tách file type labels.
- [x] Tách file type colors.
- [x] Tách file type icons.
- [x] Tách action icons.
- [x] Tách sort options.
- [x] Tách view mode constants.
- [x] Tách `formatBytes`.
- [x] Tách `formatDate`.
- [x] Tách type dùng chung nếu đang khai báo trong page.
- [x] Không còn magic string lặp lại trong `DocumentListView`.

---

## Task 2 - Tạo hoặc tái sử dụng Axios apiClient ✅

Kiểm tra trước khi tạo mới:

```text
src/services/apiClient.ts
```

- [x] Tái sử dụng Axios instance nếu project đã có.
- [x] Cấu hình `baseURL`.
- [x] Cấu hình timeout.
- [x] Request interceptor.
- [x] Tự động gắn access token.
- [x] Response interceptor.
- [x] Trả trực tiếp `response.data`.
- [x] Chuẩn hóa lỗi API.
- [x] Xử lý lỗi 401.
- [x] Không xử lý lỗi cancel như lỗi hiển thị cho người dùng.
- [x] Không tạo nhiều Axios instance trùng nhau.

---

## Task 3 - Tạo document service ✅

Tạo:

```text
src/sections/onlyoffice/services/document.service.ts
```

- [x] API lấy danh sách tài liệu.
- [x] API lấy thống kê.
- [x] API xóa tài liệu.
- [x] API download tài liệu.
- [x] API upload nếu phù hợp.
- [x] API create nếu phù hợp.
- [x] Dùng Axios `params`, không tự nối query string.
- [x] Hỗ trợ `AbortSignal`.
- [x] Không gọi API trực tiếp trong component.
- [x] Không hard-code URL trong page.
- [x] Kiểm tra `response.data` theo interceptor đã cấu hình.

---

## Task 4 - Tạo hook useDocuments ✅

Tạo:

```text
src/sections/onlyoffice/hooks/useDocuments.ts
```

Hook quản lý:

- [x] Danh sách tài liệu.
- [x] Thống kê.
- [x] Loading state.
- [x] Error state.
- [x] Search keyword.
- [x] File type filter.
- [x] Sort.
- [x] Pagination.
- [x] Total elements.
- [x] Refresh.
- [x] Delete document.
- [x] Debounce search.
- [x] Abort request cũ.
- [x] Không cập nhật state sau khi component unmount.
- [x] Không gọi API dư thừa.

---

## Task 5 - Tách component file type ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentFileIcon.tsx
src/sections/onlyoffice/components/DocumentFileTypeChip.tsx
```

### DocumentFileIcon

- [x] Nhận `fileType`.
- [x] Tự lấy icon từ constants.
- [x] Tự lấy màu từ constants.
- [x] Hỗ trợ kích thước.
- [x] Dùng `Iconify`.

### DocumentFileTypeChip

- [x] Nhận `fileType`.
- [x] Tự lấy label.
- [x] Tự lấy màu.
- [x] Không lặp lại style Chip trong table/grid/card.

---

## Task 6 - Tách DocumentCard ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentCard.tsx
```

- [x] Hiển thị icon file.
- [x] Hiển thị file type.
- [x] Hiển thị tên tài liệu.
- [x] Hiển thị kích thước.
- [x] Hiển thị ngày cập nhật.
- [x] Hiển thị các action.
- [x] Nhận callback `onOpen`.
- [x] Nhận callback `onDownload`.
- [x] Nhận callback `onDelete`.
- [x] Không gọi API trực tiếp.
- [x] Không chứa logic fetch.

---

## Task 7 - Tách DocumentGrid ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentGrid.tsx
```

- [x] Render danh sách `DocumentCard`.
- [x] Hiển thị loading state.
- [x] Hiển thị empty state.
- [x] Responsive layout.
- [x] Không lặp lại layout card.
- [x] Không chứa API logic.

---

## Task 8 - Tách DocumentTable ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentTable.tsx
```

- [x] Sử dụng `CustomTable`.
- [x] Dùng `CustomTableColumn`.
- [x] Dùng `useMemo` cho columns.
- [x] Hiển thị tên tài liệu.
- [x] Hiển thị file type.
- [x] Hiển thị kích thước.
- [x] Hiển thị ngày cập nhật.
- [x] Hiển thị action buttons.
- [x] Dùng `DocumentFileIcon`.
- [x] Dùng `DocumentFileTypeChip`.
- [x] Action không làm trigger row click.
- [x] Không gọi API trực tiếp.

---

## Task 9 - Tách DocumentStatsCards ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentStatsCards.tsx
```

- [x] Render từ config array.
- [x] Không copy/paste nhiều card.
- [x] Hiển thị tổng số tài liệu.
- [x] Hiển thị số lượng theo file type.
- [x] Hỗ trợ filter khi click.
- [x] Dùng component con nếu card có cấu trúc riêng.
- [x] Tái sử dụng icon/file type config.

---

## Task 10 - Tách DocumentFilterTabs ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentFilterTabs.tsx
```

- [x] Render tabs từ config.
- [x] Hiển thị label.
- [x] Hiển thị count.
- [x] Nhận `value`.
- [x] Nhận `onChange`.
- [x] Không lặp JSX cho từng tab.

---

## Task 11 - Tách DocumentToolbar ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentToolbar.tsx
```

- [x] Search input.
- [x] Clear search.
- [x] Sort select.
- [x] Refresh button.
- [x] Table/Grid toggle.
- [x] Loading state cho refresh.
- [x] Nhận callback từ page.
- [x] Không chứa API call.
- [x] Không chứa business logic.

---

## Task 12 - Tách DocumentActionsMenu ✅

Tạo:

```text
src/sections/onlyoffice/components/DocumentActionsMenu.tsx
```

- [x] Edit.
- [x] Read-only.
- [x] Download.
- [x] Delete.
- [x] Dùng action icon constants.
- [x] Có tooltip/aria-label khi cần.
- [x] Đóng menu sau khi chọn action.
- [x] Không gọi API trực tiếp.

---

## Task 13 - Tách DeleteDocumentDialog ✅

Tạo:

```text
src/sections/onlyoffice/components/DeleteDocumentDialog.tsx
```

- [x] Sử dụng `CustomDialog`.
- [x] Hiển thị tên tài liệu cần xóa.
- [x] Nút Hủy.
- [x] Nút Xóa.
- [x] Loading state.
- [x] Disable action khi đang xóa.
- [x] Không đóng khi mutation đang chạy.
- [x] Nhận callback `onConfirm`.
- [x] Không tự fetch/reload dữ liệu.

---

## Task 14 - Refactor DocumentListView ✅

Sau khi tách component:

- [x] Page chỉ quản lý state điều phối.
- [x] Page sử dụng `useDocuments`.
- [x] Page không gọi Axios trực tiếp.
- [x] Page không chứa bảng JSX chi tiết.
- [x] Page không chứa card JSX lặp.
- [x] Page không chứa dialog delete chi tiết.
- [x] Page không chứa constants/helper.
- [x] Kết nối upload dialog.
- [x] Kết nối create dialog.
- [x] Kết nối delete dialog.
- [x] Giữ nguyên các callback nghiệp vụ.
- [x] Mục tiêu page khoảng 200–300 dòng hoặc ít hơn (hiện tại: 260 dòng, giảm từ 1,174 dòng).

---

## Task 15 - Cải thiện component dùng chung ✅

### CustomTable

- [x] Kiểm tra loading state (Skeleton rows).
- [x] Kiểm tra empty state (Folder-open icon và empty message).
- [x] Bổ sung error state nếu cần.
- [x] Bổ sung retry nếu cần.
- [x] Kiểm tra accessibility.
- [x] Kiểm tra row click và action click (stopPropagation).
- [x] Kiểm tra responsive.

### CustomDialog

- [x] Kiểm tra loading action.
- [x] Disable đóng khi đang xử lý (guarded with `!loading`).
- [x] Kiểm tra `dividers`.
- [x] Kiểm tra responsive.
- [x] Kiểm tra keyboard Escape.
- [x] Kiểm tra backdrop click.

### Iconify

- [x] Chuẩn hóa kích thước icon (16, 18, 20, 22, 26, 28).
- [x] Dùng constants icon (`ACTION_ICONS`, `FILE_TYPE_ICONS`).
- [x] Bổ sung tooltip cho action quan trọng.
- [x] Bổ sung aria-label cho icon button.

---

## Task 16 - Kiểm thử sau từng task ✅

Sau mỗi task chạy:

```bash
npm run lint
npm run type-check
npm run build
```

Kiểm tra:

- [x] Load danh sách (`useDocuments`).
- [x] Search & Debounce search (400ms).
- [x] Filter file type (Tab & Stats Card click).
- [x] Sort (`newest`, `oldest`, `name`, `size`).
- [x] Pagination (`TablePagination` server-side).
- [x] Chuyển Table/Grid (`DocumentTable` / `DocumentGrid`).
- [x] Upload (`DocumentUploadDialog`).
- [x] Tạo tài liệu (`DocumentCreateDialog`).
- [x] Mở chỉnh sửa (`handleOpenInNewTab`).
- [x] Mở read-only (`handleOpenInNewTab(..., true)`).
- [x] Download (`documentService.getDownloadUrl`).
- [x] Delete (`DeleteDocumentDialog` + `deleteDocument`).
- [x] Empty state & Loading skeleton state.
- [x] API error handling & Request cancellation (`AbortController`).
- [x] Responsive layout.

---

## Quy tắc thực hiện

- Chỉ làm một task tại một thời điểm.
- Hoàn thành task nào phải kiểm tra task đó.
- Không gộp nhiều task vào một commit/thay đổi lớn.
- Không đổi API contract nếu chưa cần thiết.
- Không tạo component chỉ để tách file nhưng vẫn chứa nhiều trách nhiệm.
- Ưu tiên component thuần UI, nhận dữ liệu qua props.
- API và business logic nằm trong service/hook.
- Không lặp lại code giữa table, grid và dialog.
- Nếu phát hiện component dùng chung đã đủ khả năng thì tái sử dụng, không tạo component mới.
``
