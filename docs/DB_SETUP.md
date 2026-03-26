# Hướng dẫn Thiết lập Database AstraFlow (Tam Quốc)

Để triển khai hệ thống, bạn cần chuẩn bị 3 tầng dữ liệu sau và điền thông tin vào file `.env`.

## 1. 🛡️ Supabase (Authentication)
Dùng để đăng nhập và quản lý người dùng.

**Các bước cần làm:**
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard).
2. Vào **Settings -> API**.
3. **Thông tin cần lấy:**
   - `Project URL` (URL API).
   - `Anon Key` (Public key).
   - `JWT Secret` (Bắt buộc để Backend xác thực Token).
4. Vào **Authentication -> Providers**: Bật **Email** và **Google** (nếu có).

## 2. 💾 PostgreSQL (Core Storage)
Lưu trữ thông tin Profile, Truyện và Chương.

**Yêu cầu:**
- Một database PostgreSQL (phiên bản 13 trở lên).
- Chuỗi kết nối có dạng: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

## 3. 🧠 Neo4j AuraDB (AI Brain / Lore)
Lưu trữ bối cảnh thế giới và GraphRAG.

**Các bước cần làm:**
1. Truy cập [Neo4j Aura](https://neo4j.com/cloud/aura/).
2. Tạo một database **AuraDB Free**.
3. Tải file `credentials.txt` và lấy các thông tin:
   - `Connection URI` (Ví dụ: `neo4j+s://xxxx.databases.neo4j.io`).
   - `Username` (Mặc định là `neo4j`).
   - `Password`.

---

## Danh sách Biến Môi Trường (.env)

Sau khi có thông tin, hãy cập nhật file `.env` theo mẫu sau:

```env
# SERVER
PORT=3001

# SUPABASE (AUTH)
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET

# POSTGRES (CORE)
DATABASE_URL="postgresql://postgres:password@localhost:5432/astraflow?schema=public"

# NEO4J (LORE)
NEO4J_URI=neo4j+s://xxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password
```
