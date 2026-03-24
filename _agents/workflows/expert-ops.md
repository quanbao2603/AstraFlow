---
description: Quy trình Vận hành Chuyên gia (Expert Operations) - Tích hợp Đa kỹ năng cho AstraFlow
---
# 🚀 Quy trình Vận hành Chuyên gia (Expert Ops)

Quy trình này tích hợp **hơn 1,700+ kỹ năng tối tân** tự động từ 4 kho tư liệu (`antigravity-skills`, `awesome-skills`, `rmyndharis-skills`, `superpowers`) để vận hành dự án với hiệu suất cao nhất.

---

## 📅 Giai đoạn 1: Lập Kế Hoạch & Phân Tách Context (`planning-with-files`)
Dùng khi khởi động bất kỳ tính năng (Feature/Epic) hoặc sửa lỗi phức tạp (> 3 bước).

### Các bước thực hiện:
1.  **Khởi tạo Kế Khảo**: Tạo file `task_plan.md` ở thư mục gốc dự án chia Phases rõ ràng theo mẫu:
    -   `Phase 1: Research & Audit` (Sử dụng `brainstorming` & `writing-plans` từ superpowers)
    -   `Phase 2: Core implementation`
    -   `Phase 3: Verification`
2.  **Lưu Findings**: Tạo `findings.md` để ghi chép các phát hiện về Database / APIs / Component Props ngay lập tức sau mỗi 2 bước tra cứu (Tránh drift thông tin).
3.  **Dọn dẹp Context**: Nếu RAM ngữ cảnh bị đẩy lên cao, sử dụng tip từ `context-compression` tóm lược các output cũ vào `findings.md`, sau đó reset workspace memory để tăng tốc độ.

---

## 🛠️ Giai đoạn 2: Phát Triển & Tuân Thủ Kiến Trúc (`react-best-practices` / `supabase`)
Dùng trong lúc Code để đảm bảo Zero Technical Debt. Tự động tra cứu trong 1,700+ skills cho Task tương ứng.

### Các bước thực hiện:
1.  **Tránh Code Dài (Large Components)**: Component > 50 dòng cần bóc tách các helper logic ra thư mục `utils/` hoặc hooks phụ.
2.  **Sử Dụng Middleware**: Không truy cập `req.body` trực tiếp trong Endpoint Controller mà cần bọc qua `ValidateRequest` middleware (Theo chuẩn `astraflow-ops`).
3.  **Xác Minh Schema**: Nếu DB thay đổi, luôn chạy `npx prisma db push` trước khi viết API Service để Typescript sync được Client Type mới.

---

## 🧪 Giai đoạn 3: Xác Minh Độc Lập (`webapp-testing`)
Dùng trước khi báo cáo hoàn thành cho User.

### Các bước thực hiện:
1.  **Quét Selector**: Trước khi viết test, rà soát nhanh các component xem đã có `id` hay `data-testid` chưa để Playwright dễ bắt.
2.  **Kịch Bản Verify**: Viết kịch bản test nhanh (như `test-api.js`) gọi test suite headless để check HTTP Status 200, 400 và dữ liệu JSON schema trả sang xem có khớp `{ success, data }` hay không.
3.  **Báo Cáo Walkthrough**: Cập nhật `walkthrough.md` trong file local workspace chứng minh code đã test thành công.

---

> [!TIP]
> **Cách gọi nhanh**: Gõ `/expert-ops [feature_name]` để AI tự động dựng `task_plan.md` theo khung này, tự động link các template từ 1700+ skills tối ưu nhất cho stack hiện tại.
