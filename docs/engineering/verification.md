# Quy trình xác minh

Chạy các kiểm tra nhỏ nhất nhưng đủ tạo bằng chứng đáng tin cho thay đổi được yêu cầu. Mở rộng kiểm tra khi contract dùng chung, build configuration, dependency hoặc code xuyên nhiều lớp thay đổi.

## Quy trình bắt buộc: Plan → Checklist → Code → Verify

Mọi thay đổi code phải đi qua bốn giai đoạn sau.

### 1. Lập plan trước khi code

Trước khi sửa file:

- Đọc đủ code và conventions liên quan.
- Xác định mục tiêu, phạm vi và nội dung không thực hiện.
- Liệt kê file hoặc module dự kiến bị ảnh hưởng.
- Xác định API contract, dữ liệu, migration hoặc rủi ro tương thích nếu có.
- Chọn trước các bước kiểm thử phù hợp.
- Với thay đổi nhỏ, plan có thể ngắn nhưng không được bỏ qua.

### 2. Tạo checklist có thể kiểm chứng

Chuyển plan thành checklist gồm các đầu việc có kết quả quan sát được:

- [ ] Khảo sát code và pattern hiện có.
- [ ] Hoàn thành từng phần triển khai.
- [ ] Cập nhật consumer hoặc contract liên quan.
- [ ] Xử lý trạng thái và edge case.
- [ ] Kiểm tra diff và phạm vi thay đổi.
- [ ] Chạy lint, build hoặc test phù hợp.
- [ ] Ghi nhận phần chưa chạy hoặc không khả dụng.

Không đánh dấu hoàn thành chỉ vì đã tạo file hoặc viết xong code. Mỗi mục chỉ hoàn thành khi kết quả đã được kiểm tra.

### 3. Code theo checklist

- Thực hiện từng mục theo thứ tự phụ thuộc hợp lý.
- Cập nhật trạng thái checklist trong quá trình làm.
- Nếu phát hiện yêu cầu mới làm thay đổi phạm vi, cập nhật plan trước khi tiếp tục.
- Không tự thêm refactor hoặc technical debt ngoài phạm vi.
- Không bỏ qua checklist chỉ vì thay đổi có vẻ đơn giản.

### 4. Kiểm thử sau khi code

Sau khi triển khai:

1. Kiểm tra diff để phát hiện file ngoài phạm vi, code thừa, debug code, hardcode hoặc thay đổi không chủ đích.
2. Chạy kiểm tra nhỏ nhất nhưng đủ tin cậy theo loại thay đổi.
3. Sửa lỗi do thay đổi hiện tại gây ra.
4. Chạy lại kiểm tra bị lỗi sau khi sửa.
5. Đối chiếu kết quả với acceptance criteria và checklist.
6. Chỉ báo hoàn thành khi mọi mục đã được xử lý hoặc được ghi rõ là `Chưa chạy`/`Không khả dụng`.

Báo cáo cuối phải gồm:

- Nội dung đã triển khai.
- Checklist hoàn thành.
- Kiểm tra đã chạy và kết quả.
- Kiểm tra chưa chạy cùng lý do.
- Rủi ro hoặc giới hạn còn lại.

## Backend

Từ `BE_material/`, ưu tiên Maven Wrapper nếu sau này project bổ sung; hiện tại dùng Maven có sẵn.

- Thay đổi code thông thường: mặc định dùng `mvn test` vì lệnh này compile test source và chạy test hiện có.
- Thay đổi packaging hoặc dependency: dùng `mvn verify` khi môi trường hỗ trợ.
- Test tập trung: chỉ dùng `-Dtest=... test` khi có test liên quan; không thay thế kiểm tra rộng hơn nếu hành vi dùng chung thay đổi.

Baseline hiện tại chưa phát hiện backend test. Phải báo rõ giới hạn này; compile thành công không đồng nghĩa có test coverage.

## Frontend

Từ `FE_material/`:

- Lint source thay đổi: `npm run lint` khi baseline lint toàn project được kỳ vọng pass.
- Kiểm tra type và production build: `npm run build`.
- Test: chỉ dùng test command hoặc test runner đã cấu hình khi thực sự có. Không báo test pass chỉ vì tồn tại test file.

`package.json` hiện chưa có script `test`, dù có một số utility test và Vite test config. Phải báo rõ sự khác biệt này.

## Chọn mức kiểm tra

- Chỉ thay đổi tài liệu/Rules/Skills: kiểm tra link Markdown, YAML frontmatter, tên skill và routing; không build ứng dụng chỉ vì các thay đổi này.
- Chỉ thay đổi backend source: chạy kiểm tra backend.
- Chỉ thay đổi frontend source: chạy kiểm tra frontend.
- Thay đổi contract hoặc full-stack: chạy kiểm tra liên quan ở cả hai project và truy vết contract thủ công.
- Thay đổi OnlyOffice: kiểm tra thêm vai trò URL, callback payload/response, loại file hỗ trợ và xử lý state/error; báo rõ nếu không có Document Server đang chạy.

## Báo cáo hoàn thành

Tách kết quả thành bốn trạng thái:

- `Đã đạt`: command/check chạy thành công.
- `Không đạt`: nêu tóm tắt lỗi có thể hành động.
- `Chưa chạy`: nêu lý do.
- `Không khả dụng`: nêu test coverage, dependency, service hoặc môi trường còn thiếu.

Sửa các lỗi do thay đổi được yêu cầu gây ra và chạy lại kiểm tra liên quan. Không âm thầm sửa lỗi baseline không liên quan hoặc tuyên bố đã xác minh toàn bộ từ bằng chứng một phần.
