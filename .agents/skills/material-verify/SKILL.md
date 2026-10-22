---
name: material-verify
description: Xác minh thay đổi code MAU Material đã hoàn thành bằng các kiểm tra backend, frontend, contract hoặc integration nhỏ nhất nhưng đủ tin cậy. Dùng trước khi báo sẵn sàng hoặc khi người dùng hỏi thay đổi hiện tại đã đạt chưa.
---

# Xác minh MAU Material

Đọc `docs/engineering/verification.md` và kiểm tra các file thực sự đã thay đổi trước khi chọn bước xác minh.

## Đối chiếu plan và checklist

Trước khi chạy kiểm thử:

- Đọc plan, checklist hoặc acceptance criteria của thay đổi nếu có.
- Kiểm tra checklist có phản ánh đúng diff thực tế hay không.
- Bổ sung bước xác minh nếu diff tạo ra rủi ro chưa có trong checklist.
- Không tự mở rộng implementation; chỉ sửa lỗi trong phạm vi được cho phép.

Sau khi kiểm thử:

- Đánh dấu từng mục checklist là `Đã đạt`, `Không đạt`, `Chưa chạy` hoặc `Không khả dụng`.
- Không coi command pass là bằng chứng cho hành vi chưa được kiểm tra.
- Không báo ready khi có mục `Không đạt`.

## Quy trình

1. Phân loại thay đổi: chỉ tài liệu, chỉ backend, chỉ frontend, contract full-stack, build/configuration hoặc OnlyOffice integration.
2. Chọn kiểm tra phủ được hành vi đã đổi và bề mặt dùng chung, không mặc định chạy kiểm tra tốn kém không liên quan.
3. Chạy kiểm tra và giữ bằng chứng lỗi đầu tiên có thể hành động.
4. Nếu có quyền triển khai, sửa và chạy lại lỗi do thay đổi hiện tại gây ra. Báo lỗi baseline không liên quan mà không mở rộng phạm vi.
5. Với contract change, truy vết endpoint qua DTO/VO, TypeScript type, service adapter và consumer ngay cả khi hai phía đều build thành công.
6. Không biến “không tìm thấy test” hoặc “không có test script” thành kết quả test pass.

## Báo cáo

Tách kết quả thành `Đã đạt`, `Không đạt`, `Chưa chạy` và `Không khả dụng`. Nêu command/check đã thực hiện, bằng chứng ngắn gọn và khoảng trống tin cậy còn lại.
