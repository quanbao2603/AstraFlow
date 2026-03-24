# 🗺️ Bản Đồ Công Nghệ RAG Cho AI Story Writer

Trong việc xây dựng cốt truyện dài hơi và logic, **RAG (Retrieval-Augmented Generation)** không chỉ là "Tìm kiếm văn bản", mà được chia thành các thế hệ công nghệ khác nhau. 

Dưới đây là cách mà các thế hệ RAG bổ trợ cho **AstraFlow**:

---

## 🔬 1. Các Thế Hệ RAG & Ứng Dụng

### 🟢 Thế Hệ 1: Vector RAG (Semantic Search)
*   **Công nghệ:** `ChromaDB`, `Pinecone`, `pgvector`
*   **Cách thức:** Chia nhỏ truyện thành các đoạn văn, nén thành số (Vector Matrix). Khi AI viết, nó sẽ "quét" xem đoạn nào có nghĩa tương tự để đọc.
*   **Ứng dụng vào AstraFlow:** Dùng để tra cứu **Miêu tả không gian / Cảnh vật** (Vd: *"Khí hậu vùng phía Bắc như thế nào?"*), hoặc tìm các chi tiết không quá khắt khe về tính liên kết.
*   **Lưu ý:** Không thể hiểu được quan hệ gián tiếp (Ví dụ: A giết B, B là cha C => A là kẻ thù C).

---

### 🔵 Thế Hệ 2: GraphRAG (Microsoft Standard)
*   **Công nghệ:** `Neo4j` (Bạn đang dùng), `Microsoft GraphRAG`
*   **Cách thức:** Biến văn bản thành các Node (Thực thể) và Edge (Quan hệ). Traverse (duyệt cây) để tìm ra liên kết bắc cầu.
*   **Ứng dụng vào AstraFlow:** **Trái tim của tính Logic (Causality)**. 
    *   Bạn nạp: Kho báu X nằm trong rương Y, rương Y ở góc phòng Z.
    *   Nếu Nhân vật ở phòng W, đồ thị trả về **"Không thể nhặt được rương"**.
*   **Sự cập nhật tốt nhất hiện nay:** **GraphRAG của Microsoft** có thuật toán gom cụm (Leiden Algorithm) tự động tóm tắt các khu vực đồ thị để nạp vào Prompt cho AI một cách cô đặc nhất.

---

### 🔴 Thế Hệ 3: Agentic RAG (Công nghệ Mới & Tối Ưu Nhất)
*   **Công nghệ:** `Agentic Pipelines` (như lồng vào file `orchestrator.ts` của bạn)
*   **Cách thức:** AI không chỉ thụ động chờ lấy dữ liệu (Retrieve) mà tự nó cầm **Công cụ (Tools)** để Query.
*   **Quy trình vào AstraFlow:**
    1. AI muốn viết cảnh sinh tử.
    2. Agent tự gọi công cụ `query_graph("MATCH (a)-[:HELD_BY]->(weapon)")` để check vũ khí.
    3. Agent tự gọi công cụ sinh ảnh để đồng bộ cảnh vật.

---

## 🏆 ✨ Khuyến nghị Mô hình RAG Lai Đặc Thù Cho Viết Truyện

Đối với Story Writer, mô hình tối ưu nhất chính là **Graph-Vector Hybrid RAG**:

1.  **Giai đoạn Outline & Logic:** Dùng **GraphRAG (Neo4j)** để khóa khớp nhân quả, kiểm tra xem "Hành động có hợp lệ không".
2.  **Giai đoạn Novelist (Hành văn):** Dùng **Vector RAG** đi kèm để "vẽ râu vẽ tóc". (Vd: Lấy lại các đoạn miêu tả ngoại hình nhân vật từ chương 1 để Novelist diễn đạt tả cảnh mượt mà, nhất quán).

*Điều này đảm bảo truyện vừa không bị lỗ hổng logic (nhờ Graph), vừa có ngôn từ sinh động, thống nhất (nhờ Vector).*
