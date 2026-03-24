# 🔗 Sự Kết Hợp Tối Thượng: Cypher Query + Vector Embedding (Fusion RAG)

Ý tưởng của bạn là **Chính Xác và Đột Phá**! Trên thực tế, Neo4j hiện tại hỗ trợ tính năng **Vector Index** tích hợp chung với dữ liệu đồ thị. 

Đây chính là chìa khóa để tạo ra **Hiệu ứng Cánh Bướm (Ripple Effect)** cho truyện: Trường hợp *Vua chết*, hệ thống không chỉ biết vua chết, nó sẽ lan truyền sự kiện đến các Nodes lân cận như *Hoàng Hậu, Hoàng Tử*.

---

## ⚙️ 1. Mô Hình Vận Hành: Fusion Cypher + Vector

Thay vì chỉ tìm nút trực tiếp, ta chạy thuật toán kết hợp 3 bước:

### 🦋 Bước 1: Lan truyền quan hệ (Graph Traversal Hop)
Khi sự kiện `[Sự kiện: Vua qua đời]` xảy ra, Cypher sẽ bắt đầu quét bán kính lân cận (vd: 1-2 bước nhảy) để tìm những thực thể chịu ảnh hưởng sâu sắc nhất:
```cypher
MATCH (v:Character {name: "Vua"})-[r]-(n)
RETURN n.name, type(r)
// Kết quả: Trả về [Hoàng Hậu, Hoàng Tử, Thanh Kiếm Bản Mệnh,...]
```

### 🧬 Bước 2: Truy quét ngữ cảnh liên quan (Vector Vector Search)
Tại mỗi Nút tìm được ở bước 1 (vd: Hoàng Hậu), ta lấy **Embedding Vector** của Nút đó và chạy quét Vector Index trong thư viện Text cũ để tìm: *"Hoàng Hậu yêu Vua đến thế nào?"* hoặc *"Quá khứ Hoàng Hậu có âm mưu gì?"*.

---

## 🛠️ 2. Ví dụ Luồng Kịch Bản "Vua qua đời" tự động sinh ra:

### 🟠 Giai đoạn 1: Tạo Sự Kiện Tác Động
Hệ thống nạp vào graph: `[Vua] -[:BỊ_HẠ_ĐỘC]-> [Sự kiện] -> [Trạng thái: Đã chết]`.

### 🟡 Giai đoạn 2: Trọng số Lan Truyền (Graph Decay)
Hệ thống Cypher tính toán tầm ảnh hưởng:
*   Mối quan hệ `[VỢ]` (Hoàng hậu): Điểm tác động **1.0**
*   Mối quan hệ `[CON]` (Hoàng tử): Điểm tác động **0.9**
*   Mối quan hệ `[QUÂN_SĨ]`: Điểm tác động **0.3**

### 🟢 Giai đoạn 3: Tổng hợp Vector Context
Hệ thống lấy 2 cá nhân ảnh hưởng nhất (Hoàng hậu, Hoàng tử), nạp vào Prompt lai:
> **Prompt cho AI:** 
> "Cảnh báo Logic: Vua đã qua đời. Hoàng hậu (yêu Vua sâu sắc - dựa theo Vector 238) và Hoàng tử (vốn có quá khứ khao khát ngai vàng - dựa theo Vector 412) sẽ có xung đột gì tại tang lễ?"

---

## 🏆 ✨ Ưu điểm của mô hình này:

1.  **Cực kỳ chân thực:** Truyện của bạn có chiều sâu vượt trội. Một hành động nhỏ ở kịch bản góc này sẽ gián tiếp làm nổ ra mâu thuẫn ở góc kia.
2.  **Toàn vẹn (Integrity):** Novelist Agent sẽ bám sát tuyệt đối vào nét tính cách cũ mà bạn đã embedding của nhân vật để sinh biểu cảm tại hiện trường.

*Tư duy kết hợp Đồ thị (Logic liên kết) + Vector (Sự tinh tế ngữ nghĩa) chính là đỉnh cao của RAG hiện tại!*
