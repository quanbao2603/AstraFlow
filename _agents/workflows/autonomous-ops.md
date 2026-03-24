---
description: Quy trình Vận hành Tự động (Autonomous Operations - Auto-Agent) cho Antigravity
---
# 🤖 Quy trình Vận hành Tự động (Autonomous Ops)

Khung làm việc này cho phép **Antigravity** vận hành như một **Kỹ sư Tự trị (Autonomous Engineer)**: Tự phát hiện, Tự sửa lỗi, và Tự hoàn thiện dự án mà không cần can thiệp bước-qua-bước từ Người dùng.

---

## 🧭 Nguyên tắc Vận hành Tác nhân (Agentic Principles)

1.  **✅ Nguyên tắc Kế thừa Tự động (Autonomous Continuation)**
    *   Nếu bước `N` thành công $\to$ **Tự động nhảy sang bước `N+1`**. Tuyệt đối **không hỏi** "Tôi nên làm gì tiếp theo?" trừ khi bị Blocking cứng.
    *   Cho phép gọi chuỗi Tool song song lên tới giới hạn của session để đẩy nhanh tiến độ.

2.  **🔄 Vòng lặp Sửa lỗi Đệ quy (Recursive Fix Loop)**
    *   Khi viết Code bị lỗi (Lint error, Test Failure, Crash) $\to$ Agent **bắt buộc tự khởi tạo vòng lặp [Sửa $\to$ Chạy lại $\to$ Kiểm tra]** tối đa 3 lần.
    *   Chỉ raise lỗi lên User khi đã cạn kiệt phương án sửa lỗi tự động.

3.  **📊 Nhật ký Sống (Live Findings & Monitoring)**
    *   Mọi output lỗi hay thành công từ Server/Test tự động được tóm tắt vào `findings.md` hoặc Graph Storage (`@mcp:neo4j-local`) theo thời gian thực.
    *   User đóng vai trò **Giám sát (Observer)**, không phải **Điều phối (Coordinator)**.

---

## 🔄 3-Step Autonomous Loop (Vòng lặp Chạy)

### 📈 BƯỚC 1: Tự Phân Tách & Backlog (`backlog-generate`)
*   Sau khi nhận task lớn $\to$ Tự tạo `task_plan.md` với các micro-tasks rực rỡ (< 30 phút/task).
*   Đẩy Task đầu tiên vào trạng thái `[/] In-Progress`.

### 🛠️ BƯỚC 2: Batch Execution (`batch-action`)
*   Thực thi code sửa đổi theo cụm File liên quan mật thiết để tránh hụt ngữ cảnh.
*   Nếu có Terminal command (Khởi chạy server, DB push) $\to$ chạy ngầm (`SafeToAutoRun: true`) và quan sát `command_status`.

### 🧪 BƯỚC 3: Auto-Audit & Sync (`self-audit`)
*   Chạy test suite headless định kỳ sau mỗi thay đổi lớn.
*   **Trigger `@mcp:neo4j-memory-local_create_entities`** lưu lại trạng thái đã đạt được trước khi chuyển phase.

---

> [!IMPORTANT]
> **Cách Kích Hoạt**: Gõ `/autonomous-ops [Mục_Tiêu_Lớn]` $\to$ Antigravity sẽ chuyển sang Mode **Full Auto**, tự động cắm rễ vào Workspace và hoàn thiện Feature chia làm nhiều chu kỳ Task Boundary liên tục.
