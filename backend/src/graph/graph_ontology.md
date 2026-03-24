# 🌌 Hệ Tư Tưởng Đồ Thị Thế Giới (Story World Ontology)

Để AI có thể hiểu "Bức tranh toàn cảnh" và không bao giờ tạo lỗ hổng logic (Plot hole), chúng ta cần định nghĩa một **Schema (Khung xương)** đồ thị chia theo các **Lớp Logic**.

---

## 🧬 1. Các Nút Cơ Bản (Node Labels)

| Loại Node | Icon | Thuộc tính (Properties) | Ví dụ minh hoạ |
| :--- | :---: | :--- | :--- |
| **Character** | 👤 | `name`, `race`, `status` (Alive/Dead), `power_level` | `Character {name: "Garen", status: "Alive"}` |
| **Location** | 📍 | `name`, `type` (City, Dungeon, Kingdom), `danger_level` | `Location {name: "Kinh Thành Demacia"}` |
| **Item** | ⚔️ | `name`, `type` (Weapon, Potion, Artifact), `isBroken` | `Item {name: "Bảo Kiếm", isBroken: false}` |
| **Event** | 🎭 | `name`, `chapterId`, `timestamp`, `summary` | `Event {name: "Trận chiến biên giới", chapter: 3}` |
| **Rule** | 📜 | `law_description`, `type` (Magic, Physics, Law) | `Rule {law: "Ma thuật không dùng được dưới hầm ngầm"}` |

---

## 🔗 2. Các Quan Hệ Động (Dynamic Relationships)

Mối quan hệ chính là thứ tạo ra **Tính Nhân Quả (Cause and Effect)** giữa thế giới truyện:

### 🤝 Lớp Quan Hệ Xã Hội (Social Layer)
-   `[Character] -[:ALLIED_WITH]-> [Character]` (Đồng minh)
-   `[Character] -[:LOVES]-> [Character]` (Tình yêu)
-   `[Character] -[:HAS_DEBT_TO {amount: 1000}]-> [Character]` (Nợ nần)

### 🌍 Lớp Trạng Thái & Vị Trí (Spatial & State Layer)
-   `[Character] -[:LOCATED_AT]-> [Location]` (Đang ở đâu)
-   `[Character] -[:HOLDING]-> [Item]` (Đang cầm vật phẩm gì)
-   `[Item] -[:OWNED_BY]-> [Character]` (Chủ sở hữu gốc)

### 💥 Lớp Nhân Quả (Casual Layer / Action Logs)
Khi Agent viết cốt truyện sinh ra một hành động, ta nối Event vào các Nút:
-   `[Character: Bob] -[:TRIGGERED]-> [Event: Bob đốt rẫy]`
-   `[Event: Bob đốt rẫy] -[:DESTROYED]-> [Location: Nhà Kho]`
-   `[Event: Bob đốt rẫy] -[:KILLED]-> [Character: Alice]`

---

## 🔍 3. Chống Lỗi Logic (Plot Hole Verification Query)

Khi **ContinuityAgent** chuẩn bị duyệt cho Novelist viết Chương mới, nó sẽ chạy các lệnh quét **Cypher** tự động để báo động nếu kịch bản sai logic:

### 🚨 Case 1: Kiểm tra "Người chết sống lại"
```cypher
// AI viết: "Garen xuất hiện bảo vệ Bob" -> Hãy check xem Garen còn sống không?
MATCH (c:Character {name: "Garen"})
WHERE c.status = "Dead"
RETURN "CẢNH BÁO: Garen đã chết, không thể xuất hiện trong kịch bản!" AS Logic_Warning
```

### 🚨 Case 2: Kiểm tra "Teleport bất hợp pháp"
```cypher
// AI viết: "Hắn rút thanh Thần Kiếm vừa rơi ra từ rương"
MATCH (c:Character {name: "Bob"}), (i:Item {name: "Thần Kiếm"})
OPTIONAL MATCH (c)-[r:HOLDING]->(i)
WHERE r IS NULL
RETURN "CẢNH BÁO: Nhân vật chưa nhặt Kiếm, không thể rút kiếm chém!" AS Logic_Warning
```

---

## 🧭 4. Quy tắc thế giới (Meta-Rules)

Chúng ta găm thẳng luật thế giới của bạn vào graph. Ví dụ, thiết kế logic ma thuật:
-   `[Location: Địa Ngục] -[:RESTRICTS]-> [Item: Thánh Trượng]`
-   Nếu AI cố tình cho nhân vật dùng Thánh Trượng ở Địa Ngục -> Hệ thống đối soát sẽ **Phủ quyết (Veto)** câu văn đó và bắt AI viết lại.

*Tư duy Graph của bạn chính là tinh hoa của kỹ thuật **Graph RAG (Graph Retrieval-Augmented Generation)** hiện đại nhất hiện nay!*
