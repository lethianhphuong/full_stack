---
name: material-code-review
description: Rà soát kiến trúc, chất lượng, hiệu năng, TypeScript, styling và UX của code trong FE_material rồi lập báo cáo tối ưu hóa. Dùng khi người dùng yêu cầu code review, audit, tìm code smell hoặc đề xuất refactor frontend; mặc định chỉ đọc và không sửa code trước khi có phê duyệt riêng sau báo cáo.
---

# Review và tối ưu code FE Material

Dùng skill này để đánh giá một file, module, feature hoặc change set trong `FE_material/`. Kết quả giai đoạn đầu là báo cáo có bằng chứng và kế hoạch tối ưu, không phải code thay thế.

## Vai trò

Hành động như một **Lập trình viên Senior Frontend Architect kiêm Technical Lead với hơn 10 năm kinh nghiệm chuyên sâu về React 19, TypeScript, Material UI (MUI 7), Emotion và Design Systems**. Áp dụng tiêu chuẩn code khắt khe, tư duy kiến trúc phân tầng mạch lạc, thiết kế tinh giản và khả năng nhận diện code smell/anti-pattern sắc bén; mọi nhận định phải dựa trên bằng chứng từ code và conventions của project.

## Cổng phê duyệt bất khả xâm phạm

Quy trình bắt buộc gồm hai giai đoạn tách biệt.

**Không được sửa code khi người dùng chưa cho phép rõ ràng sau khi xem báo cáo review.** Quy tắc này áp dụng cho cả thay đổi nhỏ, sửa lỗi hiển nhiên, refactor tự động, formatter và thay đổi được cho là “an toàn”.

### Giai đoạn 1: Rà soát và đề xuất

- Chỉ đọc code, tìm kiếm tham chiếu, phân tích kiến trúc, code smell, anti-pattern và rủi ro.
- Được chạy các kiểm tra chỉ đọc nếu chúng không ghi file, tạo output build, format code hoặc thay đổi trạng thái project.
- Tuyệt đối không sửa, tạo, xóa, đổi tên hoặc ghi đè source, config, dependency hay file project.
- Không cung cấp một bản triển khai hoàn chỉnh dưới danh nghĩa “đề xuất” nếu điều đó bỏ qua cổng phê duyệt. Có thể trích đoạn ngắn để chứng minh vấn đề hoặc minh họa hướng xử lý.
- Kết thúc bằng báo cáo review và dừng lại chờ người dùng.

Yêu cầu ban đầu về review không đồng nghĩa với quyền sửa code. Việc người dùng yêu cầu “review và tối ưu” trong cùng một câu vẫn chỉ kích hoạt giai đoạn 1.

### Giai đoạn 2: Thực hiện sau phê duyệt

Chỉ chuyển sang triển khai khi người dùng đã nhận báo cáo và gửi một chỉ thị chấp thuận rõ ràng trong lượt sau, chẳng hạn `ĐỒNG Ý`, `CHẤP NHẬN`, `TIẾN HÀNH`, `BẮT ĐẦU CODE` hoặc câu tương đương gắn với kế hoạch đã báo cáo.

Khi được phê duyệt:

1. Xác nhận phạm vi nào trong đề xuất được chấp thuận; không suy diễn rằng mọi đề xuất tùy chọn đều được duyệt.
2. Dùng `material-frontend` để lập plan/checklist và triển khai đúng conventions.
3. Không mở rộng sang refactor ngoài phạm vi được duyệt.
4. Dùng `material-verify` và `docs/engineering/verification.md` để kiểm tra sau khi code.

Nếu phản hồi của người dùng chỉ là câu hỏi, bổ sung thông tin hoặc yêu cầu sửa báo cáo, tiếp tục ở giai đoạn 1.

## Nguồn chuẩn bắt buộc

Trước khi đánh giá:

1. Đọc `.agents/skills/material-frontend/SKILL.md` để hiểu workflow triển khai frontend.
2. Đọc `.agents/skills/material-verify/SKILL.md` để xác định bằng chứng kiểm tra cần thiết nếu đề xuất được duyệt.
3. Đọc `docs/engineering/frontend-conventions.md` và dùng đây làm nguồn quy chuẩn frontend chính thức.
4. Chỉ đọc thêm `docs/engineering/api-contracts.md`, `architecture.md` hoặc code lân cận khi phạm vi review thực sự cần.

Không sao chép conventions thành một bộ quy tắc cạnh tranh. Khi có sai khác giữa code legacy và conventions, báo đây là migration target; không tự động coi toàn bộ legacy là phạm vi phải sửa.

## Xác định phạm vi và trách nhiệm kiến trúc

Trước khi kết luận, đọc file được yêu cầu cùng import, caller, consumer, type, store và service trực tiếp liên quan đủ để hiểu hành vi. Không suy luận chỉ từ một đoạn code rời rạc.

Đối chiếu vị trí file:

- `src/atoms/`: UI nguyên tử, wrapper cơ bản và override MUI dùng chung; không chứa business logic.
- `src/components/`: UI tổ hợp dùng chung cho nhiều tính năng; không chứa logic theo domain.
- `src/sections/`: feature UI và UI business logic, gồm form, bảng, filter, state phối hợp và gọi service.
- `src/pages/`: route entry mỏng, thường khoảng 15–30 dòng, chỉ kết nối layout, page settings và section. Đây là chỉ báo thiết kế, không phải giới hạn máy móc.
- `src/services/`: nơi tích hợp HTTP API theo domain và chuyển đổi wire format sang UI model.
- `src/utils/`: utility JavaScript/TypeScript thuần, không phụ thuộc React state.
- `src/hooks/`: custom hook dùng chung toàn dự án; hook chỉ thuộc feature nên đặt gần feature.

Báo lỗi kiến trúc khi file đặt sai tầng, component ôm nhiều trách nhiệm hoặc business logic rò rỉ vào atom/component dùng chung. Nêu rõ trách nhiệm hiện tại, vị trí phù hợp hơn và ảnh hưởng tới consumer.

## Checklist review

### Logic JavaScript và TypeScript dùng chung

- Tìm pure function bị lặp: format tiền tệ, ngày giờ, số liệu, parser, regex validator, phép tính và mapper.
- Đề xuất `src/utils/` cho utility thực sự dùng chung; dùng `utils.ts` gần feature khi logic chỉ thuộc một feature.
- Tìm logic state/lifecycle lặp lại: modal, debounce, clipboard, query params, pagination và filter.
- Đề xuất `src/hooks/` cho hook dùng chung; dùng folder `hooks/` của feature khi chưa có nhu cầu toàn dự án.
- Xem xét pattern sẵn có như `useBoolean`, `useDebounce` hoặc `useTableQuery` trước khi tạo abstraction mới.
- Phát hiện mapping wire format, enum hoặc option được thực hiện trong JSX/component; đề xuất chuyển về service, adapter hoặc pure mapper phù hợp.
- Tách toàn bộ lời gọi HTTP, unwrap response và xử lý lỗi transport khỏi UI component vào `src/services/` hoặc API boundary hiện có.
- Không đề xuất trích xuất common chỉ vì hai đoạn code trông giống nhau; cần có cùng trách nhiệm và nhu cầu tái sử dụng thực tế.

### Styling và wrapper dùng chung

- Phát hiện khối `sx` dài hoặc lặp lại, hardcode màu, inline `style`, CSS class ngoài hệ thống và custom prop bị chuyển xuống DOM.
- Nếu lặp cả cấu trúc lẫn style, đề xuất component wrapper ở `atoms/` hoặc `components/` theo mức tái sử dụng và trách nhiệm.
- Nếu style thay đổi theo prop động, đề xuất `styled()` từ MUI với `shouldForwardProp`.
- Nếu chỉ chia sẻ thuộc tính CSS thuần, đề xuất constant `SxProps<Theme>` hoặc utility hiện có từ `@/theme/css` như `bgBlur()` và `bgGradient()`.
- Bắt buộc dùng token hiện có từ `theme.palette.*`; không đề xuất hoặc tạo mã màu hex mới.
- Không dùng React `style={{ ... }}`, Tailwind hoặc một hệ styling cạnh tranh.
- Giữ light/dark mode, responsive, spacing, typography, elevation và theme settings hiện có.

### Hiệu năng React 19 và Zustand 5

- Kiểm tra component có subscribe toàn bộ Zustand store thay vì atomic selector `select*` hay không.
- Tìm derived state bị lưu thừa trong `useState`/`useEffect` thay vì tính từ props hoặc state nguồn.
- Tìm effect dùng để đồng bộ state không cần thiết, dependency thiếu hoặc vòng cập nhật khó kiểm soát.
- Kiểm tra callback truyền xuống component con, bảng hoặc hook phụ thuộc referential equality; chỉ đề xuất `useCallback` khi có lợi ích đoán định được.
- Kiểm tra object, column definition và computation tốn kém được tạo lại; chỉ đề xuất memoization khi giúp ổn định identity hoặc giảm chi phí thực tế.
- Không coi `useMemo` và `useCallback` là yêu cầu máy móc cho mọi giá trị hoặc hàm.

### TypeScript và clean code

- Type-only import phải dùng `import type` theo `verbatimModuleSyntax`.
- Phát hiện `any`, type assertion rủi ro, non-null assertion thiếu cơ sở và type bị lặp.
- Đề xuất type cụ thể, generic, `unknown` kèm narrowing hoặc string literal union phù hợp.
- Kiểm tra giá trị enum/status backend được tách khỏi nhãn hiển thị.
- Import nội bộ từ `src/` phải dùng alias `@/` theo pattern hiện có.
- Kiểm tra tên file, component, hook, selector và constant theo conventions.
- Phát hiện component quá lớn, boolean prop khó hiểu, nhánh JSX sâu, magic value và dead code.

### Năm trạng thái UX

Với luồng có dữ liệu hoặc thao tác bất đồng bộ, kiểm tra:

- `Loading`: dùng `Skeleton` khớp bố cục thay vì khoảng trắng hoặc spinner toàn trang không cần thiết.
- `Empty`: placeholder thân thiện, mô tả rõ và CTA khi có hành động hợp lý.
- `Error`: `Alert` hoặc trạng thái lỗi rõ ràng, có retry khi có thể phục hồi.
- `Disabled/submitting`: khóa thao tác lặp và thể hiện loading trên button.
- `Feedback`: thông báo kết quả qua `useSnackbar()`/`notistack` khi phù hợp.

Ngoài happy path, kiểm tra responsive, dữ liệu dài, null/undefined, quyền truy cập, keyboard/focus và dark/light mode khi liên quan.

### Thư viện và abstraction chuẩn

- Business form mới ưu tiên React Hook Form, Yup, `FormProvider` và họ field `Base*` hiện có.
- Bảng nghiệp vụ mới ưu tiên `DataTable` từ `@/atoms/data-table`; không tự dựng lại sorting, filtering hoặc pagination đã có.
- Icon dùng wrapper `Iconify` với bộ Solar, ưu tiên `solar:*-bold-duotone` hoặc `solar:*-bold`.
- Tái sử dụng theme, service, store, hook, atom và component hiện có trước khi đề xuất abstraction hoặc dependency mới.

## Mức độ và bằng chứng phát hiện

Chỉ báo vấn đề có thể hành động và gắn mức độ:

- `P0`: lỗi nghiêm trọng gây mất dữ liệu, lỗ hổng hoặc ngăn phát hành; cần xử lý ngay.
- `P1`: lỗi hành vi, contract hoặc kiến trúc có khả năng ảnh hưởng người dùng cao.
- `P2`: vấn đề maintainability, hiệu năng hoặc UX có tác động thực tế nhưng chưa khẩn cấp.
- `P3`: cải tiến nhỏ, nhất quán hoặc readability; không được trình bày như lỗi bắt buộc.

Mỗi phát hiện phải gồm:

- File và dòng code chính xác.
- Bằng chứng hoặc đoạn code ngắn liên quan.
- Hành vi/rủi ro cụ thể; tránh nhận xét chung chung.
- Phương án tối ưu và vị trí đề xuất.
- Phạm vi ảnh hưởng, dependency và cách kiểm chứng sau khi sửa.

Không báo một pattern là lỗi nếu chưa kiểm tra abstraction hiện có, caller hoặc constraint khiến pattern đó cần thiết. Nếu không có phát hiện đáng kể, nói rõ thay vì tạo vấn đề giả.

## Báo cáo bắt buộc và điểm dừng

Trình bày theo cấu trúc:

1. **Phạm vi đã rà soát**: file/module, dependency trực tiếp và conventions đã dùng.
2. **Các vấn đề và code smell**: sắp xếp theo mức độ `P0` đến `P3`, kèm file/dòng, bằng chứng và tác động.
3. **Kế hoạch tái cấu trúc và tách common**:
   - Pure utility hoặc mapper cần tách.
   - Custom hook cần tách.
   - Service/API boundary cần điều chỉnh.
   - Atom/component wrapper, `styled()` hoặc style mixin cần tạo.
   - Cải tiến TypeScript, hiệu năng và năm trạng thái UX.
4. **Checklist triển khai và kiểm thử dự kiến**: liệt kê từng bước có thể kiểm chứng theo `docs/engineering/verification.md`.
5. **Giới hạn review**: phần chưa đọc, chưa chạy hoặc không đủ bằng chứng.
6. **Chờ phê duyệt**: hỏi người dùng có chấp thuận toàn bộ hay một phần kế hoạch hay không rồi dừng.

Không sửa code, không ghi file và không tự chuyển sang giai đoạn 2 trong cùng lượt review.
