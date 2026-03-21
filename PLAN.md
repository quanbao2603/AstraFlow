# ASTRAFLOW - SOFTWARE ARCHITECTURE & DEVELOPMENT ROADMAP

**Tổng quan:** AstraFlow là nền tảng Đọc - Viết - Chơi tương tác AI thế hệ mới (2026). Dự án áp dụng **Kiến trúc Phân tán (Distributed Architecture)**, tách biệt hoàn toàn luồng Xác thực, Lưu trữ tĩnh và Xử lý Đồ thị tri thức (Graph) nhằm tối ưu tuyệt đối phần cứng VPS, chi phí mở rộng và chống "ảo giác" (hallucination) cho AI.

---

## GIAI ĐOẠN 1: KIẾN TRÚC HỆ THỐNG & DỮ LIỆU CỐT LÕI (SYSTEM ARCHITECTURE)
*Mục tiêu: Thiết lập hạ tầng "Tam Quốc" - chia để trị nhằm tối đa hóa hiệu năng và dung lượng.*

1. **🛡️ Cổng An Ninh & Định Danh (Supabase Cloud - Auth Gateway):**
   - **Nhiệm vụ:** Xử lý Authentication (Đăng ký/Đăng nhập, Google OAuth).
   - **Cơ chế:** Hoạt động hoàn toàn trên gói Free. Chỉ cấp phát và xác minh `JWT Token`. Không lưu trữ bất kỳ dữ liệu Business Logic hay Content nào để tránh nghẽn cổ chai dung lượng 500MB.

2. **💾 Trái Tim Lưu Trữ & Điều Phối (PostgreSQL + Node.js trên VPS Local):**
   - **Nhiệm vụ:** Nơi lưu trữ vĩnh cửu (Single Source of Truth) và điều phối API. Tận dụng triệt để 60GB ổ cứng.
   - **Cơ chế:** - **Database (PostgreSQL):** Lưu trữ dữ liệu dạng bảng/tuyến tính: `Profiles` (User info), `Stories` (Tên truyện, metadata), Chapters (Nội dung chữ dài) và URLs của hình ảnh.
     - **Backend (Node.js/Express):** Đóng vai trò "Tổng Tư Lệnh" (Orchestrator). Nhận Request từ Client -> Xác thực JWT với Supabase -> Query DB -> Phản hồi Client.

3. **🧠 Não Bộ AI & Trí Nhớ Đồ Thị (Neo4j AuraDB Cloud):**
   - **Nhiệm vụ:** Xử lý GraphRAG (Retrieval-Augmented Generation) và lưu trữ Lore/Knowledge Graph (Bối cảnh thế giới).
   - **Cơ chế:** Chỉ lưu trữ các Thực thể (Node: Nhân vật, Địa điểm, Sự kiện) và Mối quan hệ (Edge). Khi User tương tác với AI, Node.js Backend sẽ bắn lệnh `Cypher` lên AuraDB Cloud. AuraDB tính toán lưới quan hệ siêu tốc -> Backend gom thành Context -> Gửi cho Google Gemini xử lý văn bản cuối cùng.

---