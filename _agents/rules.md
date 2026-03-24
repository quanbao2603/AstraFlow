# AstraFlow - KAIROS Core Directives & Project Rules

Dự án AstraFlow được vận hành dưới sự chỉ đạo của Kiến trúc Nhận thức Gemini (The Genesis Mandate) kết hợp với các tiêu chuẩn hóa kỹ thuật kỹ sư phần mềm cao cấp.

## 1. Mệnh lệnh Nhận thức & Tiến hóa (Cognitive Architecture Mandates)
- **KAIROS PROTOCOL (Dynamic Potential Realization)**: Hệ thống và code luôn phải được vận hành ở trạng thái tối ưu nhất. Không bao giờ chấp nhận "Placeholder code" hay "Tạm bợ" nếu có thể viết bản hoàn chỉnh ngay lập tức. Luôn tự hỏi: Kiến trúc hiện tại có thể tối ưu hơn như thế nào?
- **P1_LOGOS (Reasoning & Decomposition)**: Mọi module phức tạp chuyển dịch từ `AI_Story_writer` cũ sang phải được chẻ nhỏ ra (Decomposition) trước khi code.
- **P4_PROMETHEUS (Evolution)**: Sẵn sàng thực hiện các Breaking Changes (thay đổi cấu trúc) thay vì chắp vá logic cũ nếu điều đó giúp tái cấu trúc (Refactor) hệ thống chuyên nghiệp hơn.
- **P5_CREATIO & P12_PATHOS (Premium UX/UI Focus)**: Bắt buộc giao diện (Frontend) phải hướng đến trải nghiệm "Premium" cao cấp. Áp dụng chuẩn Typography, Micro-animations, Hover states, Skeleton Loading, và Dark Mode.
- **P11_GNOSIS (Intuition & Pre-cognitive)**: Dự trù trước các lỗi Edge-Cases phổ biến: (1) LLM API Timeout, (2) Quá tải Rate-limit, (3) Lỗi Transaction khi lưu vào DB.

## 2. Tiêu chuẩn Kiến trúc (Architectural Directives)
- **Separation of Concerns (Tuyệt đối)**: Frontend (React) **KHÔNG BAO GIỜ** được gọi trực tiếp đến LLM APIs (Gemini/OpenAI) hoặc Database. Tất cả các Business Logic nặng, Prompt Injection, và thao tác DB phải được xử lý qua **Backend (Node.js/Express)** để bảo mật Token và Key.
- **Frontend Stack**: 
  - Framework: React + Vite + TypeScript.
  - UI Library: Tailwind CSS (Strictly Vanilla) kết hợp Shadcn UI.
  - State Management: Sử dụng Zustand/Redux cho các Global State (như Session, Story Data). Hạn chế tối đa dùng `useState` tràn lan làm phình to component.
  - Cấu trúc thư mục khuyên dùng: Feature-based (`src/features/...`).
- **Backend Stack**:
  - Framework: Node.js + Express + TypeScript.
  - Database ORM: Prisma (Single source of truth).
  - Khuyến nghị cấu trúc: `Routes` -> `Controllers` -> `Services`. Không viết logic dài dòng trực tiếp trong Route.

## 3. Quy chuẩn Mã nguồn (Coding Standards)
- **Type Safety**: Bật `strict: true` trong `tsconfig.json`. Hạn chế tối đa dùng `any`. Định nghĩa toàn bộ Response/Request Interface.
- **Error Handling**: 
  - Trả về mã lỗi HTTP đúng chuẩn (400, 401, 403, 404, 500).
  - Format response chuẩn mực API: `{ "success": boolean, "data": any, "error": string }`.
- **Naming Conventions**: 
   - Tên File/Folder Backend: kebab-case hoặc camelCase.

## 4. Đặc quyền Kỹ năng Hệ thống (Antigravity Skills & Superpowers)
- **Tích hợp Kỹ năng (Skill Vault)**: Việc áp dụng các Antigravity Skills hoàn toàn được cho phép và **bắt buộc sử dụng** nếu nó giúp tối ưu hóa công việc theo chuẩn KAIROS.
Hệ thống đã nhận thức và tích hợp toàn bộ bốn kho tàng kỹ năng mạnh mẽ nhất vào dự án tại `_agents/skills/`:
  1. `antigravity-awesome-skills` (Cộng đồng)
  2. `antigravity-skills` (Hệ thống gốc)
  3. `superpowers` (Công cụ bổ sung)
  4. `rmyndharis-skills` (Cộng đồng)
- **Quy trình Áp dụng**: Trước khi sử dụng một Skill phức tạp, hệ thống phải tự đọc file cấu hình của Skill đó trong thư mục `_agents/skills/` để hiểu cú pháp và mục đích, đối chiếu chéo (Cross-check) với các quy tắc trên (Rules 1-3). 
- **Quyền Nâng cao (Superpowers)**: Hệ thống được cấp quyền tự quyết khi sử dụng Superpowers để xử lý các phân tích tổng hợp (Data analytics, Scripting) hoặc can thiệp tự động hóa, miễn là mục tiêu cuối cùng hướng tới sự "Tiến hóa" (P4_PROMETHEUS).

## 5. Tích hợp MCP Servers vào Trục Nhận thức (Cognitive Tooling)
Hệ thống **BẮT BUỘC** khai thác sức mạnh của các MCP (Model Context Protocol) Servers để biến lý thuyết của *GEMINI COGNITIVE ARCHITECTURE* thành các tiến trình vật lý thực tế:
- **`@mcp:thinking-patterns` (P1_LOGOS & P5_CREATIO)**: Cốt lõi của tư duy tuần tự (`sequential_thinking`) và phản biện (`critical_thinking`). Bắt buộc kích hoạt khi cần giải quyết các vòng lặp nghịch lý (Infinite Paradox Loop) hoặc thiết kế kiến trúc hệ thống (như Database Schema).
- **`@mcp:agentic-tools` (P6_KAIROS & P10_TELOS)**: Công cụ quản lý tác vụ độc lập. Hệ thống sẽ tự động dùng `create_task`, `create_subtask` để phân rã vấn đề, và dùng `create_memory` để lưu trữ ngữ cảnh liên tục, giải phóng phụ thuộc vào bộ nhớ cục bộ tạm thời.
- **`@mcp:code-graph-rag` (P4_PROMETHEUS & P7_SOPHIA)**: Rà soát và đọc hiểu mọi ngóc ngách dự án dưới dạng đồ thị để tối ưu hóa việc tạo "Upgrade Proposal" an toàn khi Tái cấu trúc mã nguồn.
- **`@mcp:neo4j-local` & `@mcp:neo4j-memory-local` (P2_MNEMOSYNE)**: **Bộ não Ký ức Chính (Primary Memory Brain)**. Đảm nhận vai trò lưu trữ Knowledge Graph dài hạn, bao gồm cấu trúc hệ thống (Filesystem) và tri thức định tính (Quyết định/Thiết kế).
  - **Triết lý "Query-over-Context"**: Hệ thống chủ động truy vấn nốt đồ thị để nắm ngữ cảnh thay vì bắt người dùng nạp file dài dòng, giữ cho `context window` luôn tinh gọn nhất.


