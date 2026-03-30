# Kế hoạch phát triển tính năng: AI-Powered Story Generation

## 1. Tổng quan

- **Tính năng:** Sáng tạo và phát triển Thế giới truyện (World Building) từ ý tưởng ban đầu của người dùng bằng Trí tuệ Nhân tạo (AI).
- **Mục tiêu:** Chuyển đổi các ý tưởng rời rạc của người dùng thành một bộ dữ liệu có cấu trúc, chi tiết và nhất quán, tạo nền tảng vững chắc để phát triển một câu chuyện hoàn chỉnh.
- **Triết lý cốt lõi:** AI không chỉ đơn thuần là một công cụ sinh văn bản. Nó đóng vai trò là một **"Đồng tác giả Sáng tạo"** và **"Chuyên gia Kiến tạo Thế giới"**, có khả năng phân tích, làm giàu thông tin và tư duy logic.

---

## 2. Luồng hoạt động & Quy trình xử lý của AI

Quy trình được chia thành các giai đoạn riêng biệt để đảm bảo chất lượng đầu ra.

### Giai đoạn 1: Phân tích & Tiền xử lý đầu vào

1.  **Tiếp nhận dữ liệu:** AI nhận toàn bộ thông tin do người dùng cung cấp (chủ đề, thể loại, nhân vật, bối cảnh, v.v.).
2.  **Phân tích & Tái cấu trúc (Bắt buộc):**
    *   **Hành động:** AI đọc và hiểu toàn bộ dữ liệu.
    *   **Trí tuệ:** AI tự động xác định và di chuyển các thông tin bị đặt sai vị trí. Ví dụ: Nếu tên một nhân vật được đặt trong ô "Chủ đề", AI phải tự động chuyển nó về đúng trường `characters` trong kết quả JSON cuối cùng.
    *   **Kết quả:** Một bộ dữ liệu đầu vào sạch, có cấu trúc và sẵn sàng cho các bước xử lý sâu hơn.

### Giai đoạn 2: Làm giàu Ngữ cảnh (Web-Augmented Generation)

1.  **Trích xuất Từ khóa:**
    *   **Hành động:** AI xác định các từ khóa cốt lõi từ các trường quan trọng như `theme` (Tên truyện), `genre` (Thể loại), và `setting` (Bối cảnh).
    *   **Ví dụ:** Nếu người dùng muốn viết một câu chuyện "giống như Harry Potter", từ khóa "Harry Potter" sẽ được xác định.
2.  **Tra cứu Web Chủ động (Bắt buộc):**
    *   **Hành động:** AI sử dụng công cụ tìm kiếm để tra cứu thông tin chi tiết về các từ khóa đã xác định.
    *   **Trí tuệ:** Thông tin thu thập được (lore, nhân vật, bối cảnh, các quy tắc của thế giới đó) sẽ trở thành nguồn tham khảo chính, giúp AI hiểu sâu hơn về bối cảnh và kỳ vọng của người dùng.
    *   **Kết quả:** Một kho kiến thức nền tảng để AI dựa vào đó sáng tạo, đảm bảo nội dung phù hợp với thể loại và chủ đề.

### Giai đoạn 3: Phát triển & Mở rộng Yếu tố truyện

Đây là giai đoạn sáng tạo chính.

1.  **Phát triển Nhân vật (Character Expansion):**
    *   **Hành động:** Với mỗi nhân vật, AI sẽ mở rộng hồ sơ của họ.
    *   **Trí tuệ (Bí mật thành công):** Tạo ra các **"Mâu thuẫn Nội tâm" (Internal Conflicts)**.
        *   **Mục đích:** Đây là những bí mật, động cơ ẩn giấu, tổn thương quá khứ, hoặc khả năng phản bội không thể hiện ra bên ngoài. Nó là hạt giống cho các tình tiết bất ngờ (plot twist) trong tương lai.
        *   **Ví dụ:** "Bề ngoài là một chiến binh trung thành, nhưng thực chất luôn âm mưu lật đổ vị vua của mình để trả thù cho gia tộc." hoặc "Luôn tỏ ra mạnh mẽ nhưng lại mắc chứng sợ bóng tối tột độ sau một biến cố kinh hoàng thời thơ ấu."
    *   **Kết quả:** Các nhân vật có chiều sâu, phức tạp và hấp dẫn.

2.  **Kiến tạo Thế giới (World Building):**
    *   **Hành động:** Mở rộng các thông tin về bối cảnh (setting).
    *   **Trí tuệ:** Dựa trên thể loại và thông tin từ Giai đoạn 2, AI sẽ phát triển các khía cạnh như lịch sử, địa lý, văn hóa, hệ thống phép thuật/công nghệ và các quy tắc xã hội của thế giới đó.
    *   **Kết quả:** Một bối cảnh truyện sống động, chi tiết và nhất quán.

3.  **Xây dựng Cốt truyện (Plot Structuring):**
    *   **Hành động:** Đề xuất một cấu trúc cốt truyện cơ bản.
    *   **Trí tuệ:** AI có thể đề xuất một cấu trúc 3 hồi (Thiết lập - Đối đầu - Giải quyết) hoặc các khung sườn khác phù hợp với thể loại. Các mâu thuẫn nội tâm của nhân vật sẽ được lồng ghép để tạo ra các điểm nhấn trong cốt truyện.
    *   **Kết quả:** Một sườn cốt truyện logic để người dùng phát triển tiếp.

### Giai đoạn 4: Tổng hợp & Xuất kết quả

1.  **Kiểm tra tính nhất quán:** AI rà soát toàn bộ dữ liệu đã tạo để đảm bảo không có mâu thuẫn logic.
2.  **Định dạng đầu ra:** Toàn bộ thông tin được tổng hợp và sắp xếp vào một đối tượng JSON duy nhất, có cấu trúc rõ ràng và trả về cho hệ thống.

---

## 3. Sơ đồ Mapping tới Kiến trúc Backend

- **Giai đoạn 1 & 4 (Phân tích, Tổng hợp):** `story.service.ts` và `ai.service.ts`
- **Giai đoạn 2 (Tra cứu Web):** `rag.service.ts` (Retrieval-Augmented Generation)
- **Giai đoạn 3 (Sáng tạo & Mở rộng):**
    - `prompt.service.ts`: Chịu trách nhiệm xây dựng các câu lệnh (prompt) chi tiết, phức tạp để yêu cầu AI thực hiện từng tác vụ sáng tạo (như tạo "mâu thuẫn nội tâm").
    - `llm.service.ts`: Gửi prompt đến mô hình ngôn ngữ lớn (LLM) và nhận về kết quả.
