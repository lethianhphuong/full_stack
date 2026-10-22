# Hướng dẫn cho cây thư mục frontend

Các hướng dẫn này áp dụng trong `FE_material/` và bổ sung cho `AGENTS.md` ở root.

- Đọc `../docs/engineering/frontend-conventions.md` khi thay đổi React, TypeScript, routing, form, table, state, styling hoặc service.
- Đọc `../docs/engineering/api-contracts.md` khi sử dụng hoặc thay đổi hành vi backend.
- Với feature mới: page là route wrapper mỏng; UI và business logic phía giao diện nằm trong `sections/`; UI tổ hợp tái sử dụng nằm trong `components/`; primitive nằm trong `atoms/`.
- Các page lớn hiện có là ngoại lệ legacy. Không refactor chỉ để đạt kiến trúc mục tiêu nếu người dùng không yêu cầu.
- Đặt lời gọi endpoint theo domain trong `services/`; chỉ giữ HTTP client primitive dùng chung trong `api/` khi cách tách này đang được sử dụng rõ ràng.
- Dùng `src/router/routes-config.ts` làm nguồn sự thật cho route và navigation.
- Khi xây mới, redesign, polish hoặc review chất lượng giao diện, dùng skill `material-ui-craft`. Chủ động phát hiện styling trùng lặp và code smell, nhưng chỉ refactor trong phạm vi được yêu cầu; áp dụng DRY có chọn lọc, không trừu tượng hóa sớm.
- Trước khi hoàn thành, làm theo `../docs/engineering/verification.md` để kiểm tra frontend.
