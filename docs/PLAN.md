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

## GIAI ĐOẠN 2: LƯỢC ĐỒ CƠ SỞ DỮ LIỆU PHÂN TÁN (DECOUPLED DATABASE SCHEMA)
*Mục tiêu: Triển khai cấu trúc dữ liệu vật lý lên 3 nền tảng tách biệt, đảm bảo không có dữ liệu rác và tối ưu hóa truy vấn cho từng mục đích cụ thể.*

### 1. 🛡️ Tầng Xác Thực (Supabase Cloud)
- **Không cần viết code SQL!** - Supabase đã tự động quản lý bảng `auth.users` ẩn bên dưới hệ thống. 
- Nhiệm vụ của chúng ta trên giao diện Supabase Dashboard chỉ là:
  1. Bật tính năng **Email Signup** và **Google OAuth**.
  2. Lấy `SUPABASE_URL` và `SUPABASE_ANON_KEY` nhét vào biến môi trường (`.env`) của Frontend và Backend.
  3. Khi user đăng nhập thành công, Frontend lấy `UUID` của user gửi về Backend VPS để khởi tạo Profile.

---

### 2. 💾 Tầng Lưu Trữ Cốt Lõi (PostgreSQL trên VPS Local)
*Nhiệm vụ: Lưu trữ dữ liệu tuyến tính, nội dung dài và Metadata.*
*Thực thi: Chạy đoạn mã SQL sau trên database PostgreSQL của VPS.*

```sql
-- Kích hoạt extension để tự động tạo ID chuẩn xác nếu cần
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hàm Trigger tự động cập nhật thời gian
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- BẢNG 1: PROFILES (Lưu thông tin hiển thị, ID đồng bộ 100% với Supabase)
CREATE TABLE "Profiles" (
    "id" UUID PRIMARY KEY, 
    "email" TEXT UNIQUE NOT NULL,
    "displayName" TEXT,
    "photoURL" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_profiles_updatedAt BEFORE UPDATE ON "Profiles" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- BẢNG 2: STORIES (Lưu thông tin tổng quan của truyện)
CREATE TABLE "Stories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "authorId" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_stories_updatedAt BEFORE UPDATE ON "Stories" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- BẢNG 3: CHAPTERS (Tách riêng nội dung chữ dài dằng dặc)
CREATE TABLE "Chapters" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "storyId" UUID NOT NULL REFERENCES "Stories"("id") ON DELETE CASCADE,
    "chapterIndex" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL, 
    "wordCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_chapters_updatedAt BEFORE UPDATE ON "Chapters" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- BẢNG 4: CRAFT LESSON (Meta-rules hướng dẫn AI viết lách)
CREATE TABLE "CraftLesson" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "appliesTo" JSONB,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BẢNG 5: USER CREDITS (Quản lý hạn mức gọi AI để chống spam/cháy túi)
CREATE TABLE "UserCredits" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID UNIQUE NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "totalTokensUsed" BIGINT NOT NULL DEFAULT 0,
    "dailyTokensLimit" INTEGER NOT NULL DEFAULT 100000,
    "lastResetDate" DATE NOT NULL DEFAULT CURRENT_DATE
);
```

---

### 3. 🧠 Tầng Não Bộ AI (Neo4j AuraDB Cloud)
*Nhiệm vụ: Thay thế toàn bộ các bảng Lore cũ (`StoryCharacter`, `StoryLocation`, `StoryFaction`, `TimelineEvent`, `StoryRule`, `RequiredElement`, `VectorRecord`).*
*Thực thi: Neo4j không dùng Bảng cứng. Chúng ta chạy Cypher để tạo Ràng buộc (Constraints), thiết lập Vector Index (Trí nhớ AI), và chèn thử Dữ liệu mẫu.*

**A. Thiết lập Cấu trúc & Trí nhớ Vector (Chạy 1 lần lúc setup database):**

```cypher
// 1. Tạo Ràng buộc ID duy nhất cho tất cả các loại Thực thể (Nodes)
CREATE CONSTRAINT character_id IF NOT EXISTS FOR (c:Character) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT location_id IF NOT EXISTS FOR (l:Location) REQUIRE l.id IS UNIQUE;
CREATE CONSTRAINT faction_id IF NOT EXISTS FOR (f:Faction) REQUIRE f.id IS UNIQUE;
CREATE CONSTRAINT event_id IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT item_id IF NOT EXISTS FOR (i:Item) REQUIRE i.id IS UNIQUE;

// 2. Tạo Vector Index cho các Thực thể để AI có thể làm Semantic Search (GraphRAG)
// Giả sử model embedding sinh ra vector 384 chiều (VD: all-MiniLM-L6-v2)

// - Index cho Character
CREATE VECTOR INDEX character_embeddings IF NOT EXISTS
FOR (c:Character) ON (c.embedding)
OPTIONS {indexConfig: {
  `vector.dimensions`: 384,
  `vector.similarity_function`: 'cosine'
}};

// - Index cho Location
CREATE VECTOR INDEX location_embeddings IF NOT EXISTS
FOR (l:Location) ON (l.embedding)
OPTIONS {indexConfig: {
  `vector.dimensions`: 384,
  `vector.similarity_function`: 'cosine'
}};

// - Index cho Faction
CREATE VECTOR INDEX faction_embeddings IF NOT EXISTS
FOR (f:Faction) ON (f.embedding)
OPTIONS {indexConfig: {
  `vector.dimensions`: 384,
  `vector.similarity_function`: 'cosine'
}};
```

**B. Ví dụ cách Backend chèn Dữ liệu Lore vào Neo4j (Đồ thị hóa thực tế):**

```cypher
// Thay vì INSERT vào 3-4 bảng SQL khác nhau, Neo4j làm tất cả trong 1 câu lệnh!
CREATE 
  // Tạo Node Nhân vật
  (c:Character {id: "char-001", storyId: "story-123", name: "Dạ Ly", traits: ["Lạnh lùng", "Sát thủ"]}),
  
  // Tạo Node Tổ chức
  (f:Faction {id: "fac-001", storyId: "story-123", name: "Huyết Nguyệt Giáo"}),
  
  // Tạo Node Địa điểm
  (l:Location {id: "loc-001", storyId: "story-123", name: "Miếu Hoang"}),
  
  // KẾT NỐI CHÚNG LẠI VỚI NHAU (Edges/Relationships)
  (c)-[:BELONGS_TO {role: "Phản đồ"}]->(f),
  (c)-[:CURRENTLY_AT]->(l),
  (f)-[:CONTROLS]->(l)
;
```

---

## GIAI ĐOẠN 3: KIẾN TRÚC FULL-STACK & ĐIỀU PHỐI LUỒNG DỮ LIỆU (SOLID MONOLITHIC REST API)
*Mục tiêu: Xây dựng hệ thống Full-stack nguyên khối (Monolithic), tuân thủ nghiêm ngặt nguyên lý SOLID (đặc biệt là Single Responsibility và Dependency Inversion) để dễ dàng bảo trì, mở rộng và test độc lập.*

### 1. 🖥️ Kiến Trúc Frontend (Client-Side - Feature-Driven Architecture)
*Nhiệm vụ: Giao diện người dùng SPA (Single Page Application). Tách biệt hoàn toàn UI, Logic Nghiệp vụ và Data Fetching.*

* **Công nghệ cốt lõi:** React.js (Vite), Zustand (Global State), TailwindCSS, React Query (Server State).
* **Cấu trúc Thư mục (Chuẩn SOLID):**
  ```text
  astraflow-client/
  ├── src/
  │   ├── config/          # Cấu hình Axios, biến môi trường (Supabase URL).
  │   ├── components/      # [Dumb UI] UI dùng chung (Button, Modal) - Không chứa logic.
  │   ├── hooks/           # [Shared Logic] Custom hooks dùng chung.
  │   ├── store/           # [Global State] Zustand store (useAuth, useTheme).
  │   ├── features/        # [Core Business] Tách riêng theo từng nghiệp vụ (Domain):
  │   │   ├── auth/        # Tính năng Đăng nhập
  │   │   │   ├── api/     # Chỉ chứa hàm gọi Axios (DIP)
  │   │   │   ├── hooks/   # Logic xử lý (SRP)
  │   │   │   └── ui/      # UI component (LoginForm.tsx)
  │   │   ├── story/       # Tính năng CRUD Truyện
  │   │   ├── lore/        # Tính năng Quản lý Bối cảnh (Graph UI)
  │   │   └── workspace/   # Tính năng Viết truyện + Chat AI
  │   ├── pages/           # Lắp ráp components từ `features` thành Trang.
  │   ├── routes/          # Cấu hình Router (React Router DOM).
  │   └── App.tsx          # Root Component.
  ```

### 2. 🌐 Quy Hoạch URL Frontend (Client-Side Routing)
*Hệ thống URL chia làm 3 phân khu. Các route bảo mật bọc bởi `AuthGuard` kiểm tra JWT.*

* **A. Nhóm Public (Khách vãng lai):**
  - `/` : Landing Page.
  - `/auth` : Cổng Đăng nhập/Đăng ký (UI Supabase).
  - `/explore` : Khám phá truyện trending, bộ lọc.
  - `/story/:storyId` : Chi tiết bộ truyện.
  - `/read/:storyId/:chapterId` : Trình đọc truyện công khai.

* **B. Nhóm Reader (Không gian Độc giả - Yêu cầu Auth):**
  - `/bookshelf` : Tủ sách (Lịch sử đọc, Đang theo dõi).
  - `/profile/:userId` : Trang cá nhân (Truyện đã viết/theo dõi).
  - `/settings` : Cài đặt tài khoản.

* **C. Nhóm Creator Studio (Không gian Tác giả - Yêu cầu Auth):**
  - `/hub` : Bảng điều khiển tác giả.
  - `/studio/create` : Khởi tạo truyện mới.
  - `/studio/:storyId/overview` : Tổng quan bộ truyện.
  - `/studio/:storyId/lorebook` : Màn hình quản lý Bối cảnh (Graph UI).
  - `/studio/:storyId/write/:chapterId` : **(Workspace Chính)** Trình soạn thảo (Trái) & Chat AI (Phải).

---

### 3. ⚙️ Kiến Trúc Backend (Server-Side - 3-Layer Architecture)
*Nhiệm vụ: Cung cấp RESTful API, khối Monolith duy nhất xử lý toàn bộ Business Logic. Tuân thủ mô hình 3 Lớp (Controller - Service - Repository).*

* **Cấu trúc Thư mục Backend:**
  ```text
  astraflow-backend/
  ├── src/
  │   ├── config/          # Cấu hình môi trường (Prisma, Neo4j, Gemini).
  │   ├── middlewares/     # verifyToken (Giải mã JWT Supabase), errorHandler.
  │   ├── routes/          # Định tuyến các URL API.
  │   │
  │   ├── controllers/     # [LỚP 1] Nhận Request, validate, trả về JSON.
  │   │   ├── story.controller.ts
  │   │   ├── lore.controller.ts
  │   │   └── ai.controller.ts
  │   │
  │   ├── services/        # [LỚP 2] Logic Nghiệp vụ (Core Business).
  │   │   ├── story.service.ts
  │   │   ├── lore.service.ts
  │   │   └── ai.service.ts
  │   │
  │   ├── repositories/    # [LỚP 3] Giao tiếp Database (Data Access Layer).
  │   │   ├── postgres.repo.ts    # Prisma ORM (Tương tác Postgres).
  │   │   └── neo4j.repo.ts       # Cypher Query (Tương tác Neo4j).
  │   │
  │   ├── app.ts           # Khởi tạo Express App.
  │   └── server.ts        # Chạy Server.
  └── .env                 # File biến môi trường.
  ```

### 4. 🛡️ Tầng Bảo Mật Cửa Ngõ (Auth Flow)
1. Frontend gọi API qua Axios, tự động đính kèm `Authorization: Bearer <JWT_TOKEN>`.
2. Backend (Middlewares) giải mã bằng `SUPABASE_JWT_SECRET`.
3. Hợp lệ -> Gắn `userId` vào `req.user` -> Chuyển tiếp vào `controllers/`.
4. Lỗi/Hết hạn -> Ném lỗi `401 Unauthorized`, chặn đứng ngay lập tức.

### 5. 🛣️ Bản Đồ API Endpoints (RESTful Contract)
**A. API Tuyến tính (PostgreSQL) -> Xử lý bởi `postgres.repo`**
- `POST /api/v1/stories` : Khởi tạo metadata truyện mới.
- `GET /api/v1/stories/:storyId` : Lấy thông tin & danh sách chương.
- `PUT /api/v1/stories/:storyId/chapters/:chapterId` : Lưu nội dung chương.
- `DELETE /api/v1/stories/:storyId` : Xóa truyện (Ngầm gọi xóa ở cả 2 DB).

**B. API Bối cảnh (Neo4j) -> Xử lý bởi `neo4j.repo`**
- `POST /api/v1/lore/nodes` : Tạo Thực thể (Nhân vật/Địa điểm) + Embedding Vector.
- `PUT /api/v1/lore/nodes/:nodeId` : Cập nhật tiểu sử thực thể.
- `POST /api/v1/lore/edges` : Tạo liên kết (VD: `[:ENEMIES_WITH]`).

**C. API Trí Tuệ Nhân Tạo (Gemini) -> Xử lý bởi `ai.service`**
- `POST /api/v1/ai/generate` :
  - *Service* gọi `neo4j.repo` lấy Context (Bối cảnh/Lore).
  - *Service* gọi Gemini API gửi Prompt + Context.
  - *Controller* trả về luồng Server-Sent Events (SSE) cho Frontend.

---

## GIAI ĐOẠN 4: THIẾT KẾ KIẾN TRÚC GRAPHRAG SÂU (DEEP GRAPHRAG PIPELINE)
*Mục tiêu: Đặc tả kỹ thuật chi tiết luồng xử lý của AI Agent (Backend). Hệ thống không chỉ biết "Đọc" Neo4j để viết truyện chuẩn xác, mà còn có cơ chế "Tự Học" (Self-learning) để cập nhật ngược lại Đồ thị sau mỗi lần sinh văn bản.*

### 🧠 Luồng Thuật Toán Cốt Lõi (Luồng `POST /api/v1/ai/generate`)

#### Bước 1: Trích xuất Thực thể & Phân tích Ý định (NER & Intent Parser)
*Không thể chỉ dùng Regex đơn giản, Backend cần một bộ lọc thông minh để hiểu User muốn gì trước khi lục lọi Database.*
- **Kỹ thuật:** Sử dụng một model LLM nhỏ/nhanh (VD: Gemini Flash) chuyên làm nhiệm vụ Named Entity Recognition (NER).
- **Input:** User Prompt: *"Dạ Ly bước vào Miếu Hoang, có ai đang phục kích cô ở đó không?"*
- **Xử lý ngầm (Pre-processing):** Backend gửi prompt này cho LLM phụ để trích xuất ra JSON định dạng chuẩn:
  ```json
  {
    "entities": ["Dạ Ly", "Miếu Hoang"],
    "intent": "action_continuation",
    "required_info": ["characters_present", "hidden_enemies"]
  }
  ```

#### Bước 2: Động Cơ Truy Xuất Đồ Thị Kép (Dual-Engine Retrieval)
*Backend sử dụng JSON từ Bước 1 để truy vấn Neo4j AuraDB. Áp dụng kỹ thuật Vector Search kết hợp Graph Traversal để lấy Bối cảnh.*
- **Pha 2.1: Semantic Vector Search (Tìm Thực thể Core):**
  Sử dụng Vector Index của Neo4j để tìm các Node gần nghĩa nhất với `entities` (giúp chống sai chính tả, VD: User gõ "Dạ Li" vẫn tìm ra "Dạ Ly").
- **Pha 2.2: Graph Traversal (Truy vết Quan hệ 2-Hops):**
  Từ các Node Core tìm được, quét rộng ra 2 tầng quan hệ để lấy Lore liên quan.
- **Lệnh Cypher cốt lõi (Tầng Repository):**
  ```cypher
  // Tìm Node chính qua ID truyện và Tên/Vector
  MATCH (n) WHERE n.storyId = $storyId AND n.name IN $entityNames
  // Lấy các quan hệ trực tiếp (Hop 1) và gián tiếp (Hop 2)
  OPTIONAL MATCH path = (n)-[*1..2]-(connectedNode)
  // Lọc bớt các node rác (không có trọng số)
  WITH n, path, connectedNode 
  RETURN {
    core_entity: n.name,
    traits: n.traits,
    relationships: collect(extract(r IN relationships(path) | type(r) + " -> " + endNode(r).name))
  } AS LoreContext
  ```

#### Bước 3: Cửa Sổ Ngữ Cảnh & Nhồi Prompt (Context Window Optimization)
*LLM có giới hạn Token. Backend phải cắt gọt (Chunking) và sắp xếp mức độ ưu tiên của dữ liệu trước khi gửi cho Google Gemini (Model chính).*
- **Chiến lược Ráp Context (Tính bằng Token):**
  1. **System Directive (Cố định - 100 tokens):** "Bạn là tiểu thuyết gia thiên tài..."
  2. **Craft Lessons (Lấy từ Postgres - 300 tokens):** Các quy tắc viết lách (VD: "Không dùng từ ngữ hiện đại trong truyện Tiên hiệp").
  3. **World-Building / Lore (Lấy từ Neo4j - 800 tokens):** Kết quả JSON từ Bước 2 dịch thành văn bản tự nhiên.
  4. **Recent History (Lấy từ Postgres - 2000 tokens):** Fetch đúng 2 Chapter gần nhất hoặc 1500 chữ cuối cùng của truyện để AI giữ được "nhịp" (Tone & Voice).
  5. **User Prompt (100 tokens):** Lệnh hiện tại của tác giả.

#### Bước 4: Sinh Văn Bản Streaming & Phân Tích Hậu Kỳ (Streaming & Post-Processing)
- **Truyền phát thời gian thực (SSE):** Backend gọi Gemini API (`stream: true`). Thay vì đợi AI viết xong 1000 chữ mới trả về, Backend mở một kết nối `Server-Sent Events` đẩy từng chunk (cụm từ) về React Frontend. UI sẽ hiển thị hiệu ứng gõ phím mượt mà.
- **Vòng lặp Tự học (Human-in-the-loop Learning):**
  *Để tránh việc AI làm "rác" đồ thị Neo4j do ảo giác, chúng ta áp dụng cơ chế duyệt.*
  1. Sau khi Frontend nhận xong chữ, Backend ném đoạn văn vào Background Worker (BullMQ).
  2. Worker phân tích và phát hiện nhân vật mới (VD: "Lão ăn mày mù").
  3. Worker KHÔNG lưu thẳng vào Neo4j. Nó lưu vào bảng tạm (hoặc cache Redis) và bắn Notification về Frontend (Zustand store).
  4. UI hiển thị gợi ý: *"Phát hiện nhân vật mới: Lão ăn mày mù. Nhấn [Thêm vào Lorebook] để lưu"*. 
  5. Tác giả bấm xác nhận -> Backend mới chính thức chạy Cypher tạo Node mới trên Neo4j.