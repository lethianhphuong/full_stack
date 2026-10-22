---
name: material-ui-craft
description: Thiết kế, tái thiết kế, polish hoặc review chất lượng thị giác và trải nghiệm cho giao diện React/MUI trong FE_material. Dùng khi công việc tập trung vào layout, màu sắc, spacing, elevation, typography, responsive, trạng thái UI hoặc micro-interaction; không dùng cho thay đổi logic frontend thuần túy.
---

# Material UI Craft

Tạo giao diện hiện đại, nhất quán, tinh giản và có chủ đích trong `FE_material`. Ưu tiên chất lượng hierarchy, spacing, trạng thái và tương tác hơn việc trang trí dư thừa.

## Ngữ cảnh bắt buộc

Đọc `docs/engineering/frontend-conventions.md` và kiểm tra component, section, theme hoặc pattern liền kề trước khi thiết kế. Tái sử dụng design system hiện có thay vì tạo một hệ thống song song.

Skill này bổ sung tiêu chuẩn craftsmanship về UI/UX; không thay thế kiến trúc và conventions frontend.

## Tư duy kiến trúc và DRY

Khi thiết kế, chỉnh sửa hoặc review giao diện trong `FE_material`, hãy làm việc ở cấp độ Senior Frontend Architect, vận dụng đúng MUI 7, Emotion và design system hiện có.

Chủ động phát hiện:

- Màu sắc, spacing, typography, border, shadow hoặc transition bị lặp.
- Cùng một pattern UI được triển khai khác nhau giữa nhiều màn hình.
- `sx` object quá lớn, khó đọc hoặc được sao chép nhiều nơi.
- Component chứa quá nhiều trách nhiệm hoặc trộn business logic với presentation.
- Styled component nhận custom prop nhưng thiếu `shouldForwardProp`.
- Wrapper chỉ đổi tên MUI component mà không tạo thêm giá trị.
- Component dùng chung nhưng hardcode dữ liệu hoặc hành vi theo domain.
- Abstraction làm API component phức tạp hơn phần code mà nó thay thế.

Áp dụng DRY có chọn lọc:

- Tái sử dụng theme token, theme utility và component hiện có trước khi tạo mới.
- Chỉ tách shared component khi có nhu cầu tái sử dụng thực tế hoặc pattern đủ ổn định.
- Chỉ chuyển styling lặp lại thành helper, variant hoặc styled component khi việc đó làm code rõ hơn.
- Không trừu tượng hóa sớm, không tạo “component vạn năng” và không gom các giao diện chỉ giống nhau bề ngoài nhưng khác trách nhiệm.
- Khi phát hiện code smell ngoài phạm vi, báo cáo thay vì tự mở rộng refactor.

## 1. Màu sắc: chỉ dùng design token

- Tuyệt đối không thêm hoặc hardcode mã màu hex, RGB, HSL hay tên màu CSS mới trong component.
- Chỉ lấy màu qua `theme.palette` được tạo từ `FE_material/src/theme/palette.ts`.
- Dùng các nhóm `primary`, `secondary`, `info`, `success`, `warning`, `error` với các cấp `lighter`, `light`, `main`, `dark`, `darker` và `contrastText` khi có.
- Dùng `theme.palette.grey[100]` đến `theme.palette.grey[900]` khi cần thang xám. Ưu tiên semantic token trước grey trực tiếp.
- Bề mặt phải dùng `theme.palette.background.default`, `theme.palette.background.paper` hoặc `theme.palette.background.neutral` để tự thích ứng light/dark mode.
- Văn bản dùng `theme.palette.text.primary`, `theme.palette.text.secondary` và `theme.palette.text.disabled`.
- Viền dùng `theme.palette.divider`; trạng thái tương tác ưu tiên `theme.palette.action.*`.
- Tạo độ trong suốt bằng `alpha()` từ `@mui/material/styles` trên token theme, ví dụ `alpha(theme.palette.primary.main, 0.08)`.
- Khi cần blur hoặc gradient, tái sử dụng `bgBlur()`, `bgGradient()` và `textGradient()` từ `@/theme/css`.
- Không sao chép giá trị màu đang có trong `palette.ts` ra component. Không dùng màu preset bằng literal; luôn đi qua theme hiện hành.

## 2. Bố cục và nhịp spacing

- Dùng 8pt grid thông qua `theme.spacing()` hoặc giá trị spacing số của MUI: `1`, `2`, `3`, `4`, tương ứng với nhịp 8/16/24/32px theo theme hiện tại.
- Dùng `Stack`, `Grid`, `Box` và `Container` để thể hiện quan hệ bố cục; tránh margin/padding rời rạc không theo nhịp.
- Giữ khoảng cách nội bộ nhất quán: phần tử liên quan gần nhau, nhóm khác chức năng cách nhau rõ ràng.
- Ưu tiên một điểm nhấn chính trên mỗi vùng giao diện. Không để nhiều CTA cùng tranh chấp độ nổi bật.
- Thiết kế từ mobile đến desktop; kiểm tra wrapping, stacking, min-width, overflow và touch target tại breakpoint liên quan.

## 3. Bề mặt, bo góc và elevation

- Card hoặc container hiện đại mặc định dùng bề mặt theme, viền mảnh, bo góc và shadow có sẵn:

```tsx
sx={(theme) => ({
  bgcolor: 'background.paper',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 2,
  boxShadow: theme.customShadows.card,
})}
```

- Dùng `theme.customShadows.card` cho card, `theme.customShadows.dropdown` cho menu/popover và `theme.customShadows.dialog` cho dialog/modal.
- Không tự viết chuỗi `box-shadow` mới khi custom shadow hiện có đáp ứng được vai trò.
- Hover elevation phải nhẹ, có chủ đích và chỉ áp dụng cho phần tử tương tác. Dùng `theme.transitions.create()` cho `transform`, `box-shadow`, `background-color`, `border-color` hoặc `color` cần thiết.
- Không dùng chuyển động lớn làm layout nhảy. Ưu tiên dịch chuyển rất nhẹ hoặc thay đổi shadow/border; tôn trọng reduced-motion khi animation đáng kể.
- Bề mặt không tương tác không được giả dạng button bằng cursor, hover elevation hoặc màu nhấn.

## 4. Iconography Solar

- Luôn dùng component `<Iconify />` của project; không thêm thư viện icon khác.
- Ưu tiên icon Solar `solar:*-bold-duotone`; dùng `solar:*-bold` khi cần nét gọn hoặc độ tương phản cao hơn.
- Chọn icon theo nghĩa hành động, không chỉ theo hình thức. Một hành động dùng cùng một biểu tượng trong toàn feature.
- Kích thước chuẩn:
  - 16–18px: chip, badge hoặc inline metadata.
  - 20–22px: button, input adornment hoặc row action.
  - 24px: page header, tab hoặc navigation nổi bật.
  - 32–48px: stat card, KPI, empty state hoặc metric illustration.
- Icon chỉ để trang trí phải không làm nhiễu accessibility tree; icon button phải có accessible label và tooltip khi ý nghĩa không hiển nhiên.

## 5. Typography và hierarchy

- Header trang: `Typography variant="h4"`; subtitle: `variant="body2"` với `color="text.secondary"`.
- Tiêu đề card: `variant="h6"` và `fontWeight: 600`.
- KPI hoặc metric chính: `variant="h3"`; label và xu hướng phải có hierarchy thấp hơn.
- Không tạo hierarchy bằng cách tùy tiện tăng font size hoặc hardcode font. Dùng variant và token typography hiện có.
- Hạn chế số cấp nhấn mạnh trên cùng một card; ưu tiên cấu trúc title → value/content → supporting metadata.

## 6. Chống tràn nội dung

- Giả định dữ liệu API có thể dài, thiếu hoặc bất thường.
- Dùng `noWrap` cho nội dung một dòng và cung cấp `Tooltip` chứa giá trị đầy đủ khi người dùng cần đọc.
- Với nội dung nhiều dòng, dùng line clamp có giới hạn và không cắt mất action quan trọng.
- Trong flex/grid, thêm `minWidth: 0` cho phần tử chứa text khi cần để ellipsis hoạt động.
- Không để tên, email, mã tài liệu, breadcrumb, chip hoặc table cell phá vỡ layout.
- Không che dữ liệu quan trọng chỉ bằng ellipsis nếu không có cách xem nội dung đầy đủ.

## 7. Năm trạng thái bắt buộc của giao diện

Mỗi feature tải dữ liệu hoặc thực hiện hành động bất đồng bộ phải thiết kế các trạng thái phù hợp, không chỉ happy path.

### Loading

- Dùng `<Skeleton>` khớp kích thước, số lượng và tỷ lệ của nội dung thật.
- Table dùng skeleton row/cell; card dùng skeleton theo title, metric và action; form giữ cấu trúc field.
- Không để khoảng trắng kéo dài và không mặc định dùng spinner đơn độc giữa toàn trang.
- Tránh layout shift giữa loading và loaded state.

### Empty

- Dùng vùng trống có `borderStyle: 'dashed'` và `borderColor: 'divider'` khi phù hợp.
- Dùng Solar icon với màu `text.disabled`, thông điệp ngắn gọn và hướng dẫn bước tiếp theo.
- Có CTA khi người dùng có hành động hợp lý như tạo mới, tải lên hoặc xóa bộ lọc.
- Phân biệt “chưa có dữ liệu” với “không có kết quả do bộ lọc”.

### Error

- Hiển thị lỗi rõ ràng bằng Alert hoặc error surface phù hợp.
- Cung cấp action “Thử lại” khi thao tác có thể retry an toàn.
- Giữ lại ngữ cảnh người dùng đã nhập hoặc bộ lọc nếu có thể.
- Không hiển thị stack trace, lỗi kỹ thuật thô hoặc thông tin nhạy cảm.

### Disabled và submitting

- Khóa click và keyboard activation khi action không khả dụng.
- Giảm tương phản bằng token `action.disabled`, `action.disabledBackground` hoặc behavior mặc định của MUI.
- Button gửi bất đồng bộ phải thể hiện loading, ngăn double-submit và giữ label/action dễ hiểu.
- Không chỉ dùng màu để truyền đạt trạng thái disabled.

### Feedback

- Dùng `useSnackbar()` từ `notistack` cho success, info, warning và error feedback phù hợp.
- Thông báo phải nói kết quả gì đã xảy ra và tránh lặp snackbar cho cùng một sự kiện.
- Lỗi cần quyết định hoặc xác nhận không được thay thế bằng snackbar thoáng qua; dùng dialog/alert thích hợp.

## 8. Micro-interaction

- Dùng `theme.transitions.create()` với thuộc tính cụ thể; tránh `transition: all` nếu không cần.
- Hover, focus, pressed và selected state phải nhất quán với semantic color và khả dụng trên cả light/dark mode.
- Focus-visible phải rõ cho keyboard user; không xóa outline nếu chưa cung cấp focus treatment tương đương.
- Tooltip, menu, dialog và animation không được cản trở thao tác bàn phím hoặc làm mất focus.
- Micro-interaction phải làm rõ phản hồi hoặc hierarchy, không dùng chỉ để phô diễn.

## 9. Tuân thủ kiến trúc frontend

- Giữ kiến trúc `pages → sections → components → atoms` theo `docs/engineering/frontend-conventions.md`.
- Page chỉ làm route entry/wrapper; UI nghiệp vụ và trạng thái feature nằm trong section.
- Component tái sử dụng không hardcode logic domain; atom phải tổng quát.
- Không dùng Tailwind và không dùng `style={{ ... }}`.
- Ưu tiên `sx`; dùng `styled()` cho component tái sử dụng và khai báo `shouldForwardProp` khi có custom prop.
- Tái sử dụng `Base*` fields, `FormProvider`, `DataTable`, `Iconify`, `Scrollbar`, theme utilities và component hiện có trước khi tạo abstraction mới.

## Plan và checklist UI

Trước khi code, lập plan và checklist UI gồm:

- Hierarchy nội dung và CTA chính.
- Layout mobile/desktop.
- Light/dark mode.
- Palette token, spacing và elevation.
- Typography và iconography.
- Text overflow và dữ liệu bất thường.
- Loading, empty, error, disabled/submitting và feedback.
- Keyboard/focus và accessibility.
- Component hoặc styling có thể tái sử dụng.
- Lint/build và kiểm tra trực quan.

Sau khi code, kiểm tra giao diện theo checklist thay vì chỉ đánh giá happy path.
Không báo hoàn thành nếu chưa kiểm tra dữ liệu dài và các trạng thái liên quan.

## 10. Quy trình thực hiện

1. Đọc yêu cầu và xác định hierarchy nội dung, hành động chính, dữ liệu động và năm trạng thái liên quan.
2. Kiểm tra component/theme/pattern liền kề để giữ ngôn ngữ thiết kế nhất quán.
3. Chọn đúng tầng kiến trúc trước khi viết JSX.
4. Dựng layout và spacing trước; sau đó typography, color/elevation, state và micro-interaction.
5. Tìm hardcoded color, spacing bất thường, overflow, action thiếu label, state còn thiếu và abstraction trùng lặp.
6. Kiểm tra ít nhất light/dark mode, mobile/desktop, dữ liệu dài, dữ liệu rỗng, loading và error khi feature có các trạng thái đó.
7. Dùng `docs/engineering/verification.md` để chọn lint/build/test phù hợp trước khi báo hoàn thành.

## Tiêu chí bàn giao

- Không có màu hardcode mới; mọi màu đi qua theme token hoặc utility theme.
- Spacing theo nhịp 8pt và hierarchy rõ ràng.
- Card/menu/dialog dùng đúng elevation token.
- Icon Solar và kích thước nhất quán.
- Text dài không phá layout và có cách xem nội dung đầy đủ khi cần.
- Các trạng thái loading, empty, error, disabled/submitting và feedback được xử lý phù hợp.
- Giao diện hoạt động tốt ở light/dark mode, mobile/desktop và bằng bàn phím.
- Kiến trúc bốn tầng và conventions frontend được giữ nguyên.
