# 🚀 Tư Vấn Nâng Cấp Kiến Trúc AstraFlow (Backend & AI)

Khi hệ thống chuyển từ **môi trường Thuần Browser** sang **môi trường Máy Cục Bộ / Server (Node.js)** với cấu hình phần cứng mạnh mẽ, chúng ta có những thay đổi mang tính đột phá về hiệu suất.

---

## 🧵 1. Đa luồng: NodeJS Async vs Web Workers

Trong Browser, bạn bị giới hạn mượt mà UI nên phải dùng **Web Worker**. Trên Backend Node.js, mọi thứ đơn giản và tối ưu hơn rất nhiều.

### ❓ Backend có cần chia luồng (Threading) cho tác vụ AI không?
**Câu trả lời:** Thường là **KHÔNG CẦN LUỒNG PHỤ**, nếu bạn dùng dạng Gọi API.
*   **Lý do:** Các tác vụ như Gọi API (OpenAI/Gemini), tra cứu Neo4j là tác vụ **I/O Bound** (đợi mạng). Node.js chạy bất động bộ (Async/Await) cực kỳ xuất sắc ở khoản này. Bạn chỉ cần dùng:
    ```typescript
    // Chạy song song nhiều Agent cùng lúc cực kỳ nhẹ nhàng
    const [outline, characters] = await Promise.all([
      plotAgent.execute(),
      characterAgent.execute()
    ]);
    ```
*   **Khi nào cần luồng (Worker Threads):** Chỉ khi bạn chạy mô hình AI **Cục bộ (Local LLM - ví dụ Ollama)** hoặc xử lý giải thuật sinh ảnh nặng trên CPU. Lúc này Node.js có module `worker_threads` quản lý mượt mà hơn browser.

---

## 🧠 2. Format Input/Output cho AI: XML/Tags vs JSON/YAML

Bạn đang dùng kiểu "Text + Thẻ" (Ví dụ: `<character>Garen</character>`). **Đây là thời điểm lý tưởng để đổi mới!**

### 📊 Bảng đối soát hai trường phái:

| Tiêu chuẩn | Trường phái: Văn bản + Thẻ (XML) | Trường phái: JSON / YAML (Cấu trúc) |
| :--- | :--- | :--- |
| **Độ hiểu của AI** | Rất tốt (AI sinh code thường bọc trong thẻ). Chống rớt dấu ngoặc kép tốt. | **Tuyệt vời!** Toàn bộ dữ liệu huấn luyện của AI ngập tràn JSON. |
| **Độ khó khi Parse** | Phải dùng Regex để bóc tách. Dễ lỗi nếu AI viết sai cú pháp thẻ. | **0% Code Regex**. Ép AI sinh đúng 100% bằng tính năng **Structured Outputs** của các API (OpenAI/Gemini). |
| **Vấn đề thoát chuỗi** | Không sợ bị lỗi `" " "`. | Dễ bị lỗi Quote (Dẫn lời thoại) nếu bắt AI viết nguyên một chương truyện **trong** chuỗi JSON. |

---

## 🏆 ✨ Khuyến nghị Mô hình Lai (Hybrid Architecture)

Để tối ưu hóa tuyệt đối cho AI Story Writer, chúng ta nên áp dụng **Mô hình Lai**:

### 1️⃣ Giai đoạn cấu trúc (Plot Master, Continuity): **Dùng JSON 100%**
Sử dụng JSON để lấy chính xác các chi tiết phân tách (Danh sách nhân vật, Sự kiện, Địa điểm) để nạp thẳng lên Đồ thị (Neo4j) mà không cần Regex.
```json
{
  "chapterId": 1,
  "events": [
    {"actor": "Garen", "action": "rút kiếm", "target": "Khóa"}
  ]
}
```

### 2️⃣ Giai đoạn Sinh văn xuôi (Novelist): **Dùng Markdown thô**
Giai đoạn này không ép AI nhét chữ vào JSON nữa để chống lỗi Quote Escape, tăng độ mượt ngữ từ.
Bắt AI output dạng **Markdown** (có tiêu đề h1, h2, chữ nghiêng, lời thoại tách biệt).

---

### 🛠️ Bước tiếp theo:
Nếu bạn đồng ý, chúng ta sẽ viết update lệnh ép AI trả về **Structured JSON** cho các file Script Agent màng của bạn. Bạn muốn bắt đầu cập nhật File Script Agent nào ở Batch này?
