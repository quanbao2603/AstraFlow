---
description: Quy chuẩn Tạo API Backend (Controller & Service)
---
# Creating a New Backend API

Luôn sử dụng **KAIROS PROTOCOL** để viết API chất lượng nhất ngay từ lần đầu tiên. Code API phải an toàn, bảo mật, và có Schema rõ ràng.

## 1. Cập nhật Model (Tuỳ chọn)
Nếu API cần truy xuất bảng mới, thực thi workflow `database-migration` trước.

## 2. Khởi tạo Route & Controller
Tại `backend/src/index.ts` (hoặc thư mục router):
- Định nghĩa Endpoint rõ ràng, theo định dạng chuẩn REST (`/api/[resource]`).
- Bắt lỗi Try-Catch bao bọc toàn bộ khối lệnh.

## 3. Implement Business Logic (Dùng P1_LOGOS)
- Tách bạch Logic ra Service layer nếu tác vụ vượt quá 20 dòng code (Ví dụ xử lý chuỗi Gemini phức tạp).
- Đảm bảo tham số đầu vào (req.body) luôn được Validate.

## 4. Định dạng Response Trả về
Bắt buộc Response trả về phải theo 1 chuẩn nhất quán: `{ success: boolean, data?: any, error?: string }`.

## 5. Xử lý Lỗi chuẩn xác (P11_GNOSIS)
- Request sai do Client -> Code `400 Bad Request`
- Thiếu Authentication -> Code `401 Unauthorized`
- Không tìm thấy -> Code `404 Not Found`
- LLM API / DB lỗi -> Code `500 Internal Server Error` (Kèm console.error chi tiết).
