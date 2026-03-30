/**
 * prompt.builder.ts
 * Chịu trách nhiệm DUY NHẤT: Lắp ráp câu truy vấn (prompt) cho LLM.
 * Không chứa logic gọi API, không chứa logic DB.
 */
export class PromptBuilder {
  /**
   * Bước 1: Tiền xử lý (Phân tích và gom cụm)
   */
  static buildPreprocessSystemPrompt(): string {
    return `Bạn là một AI chuyên phân tích ý tưởng truyện. Nhiệm vụ:
1. Đọc dữ liệu đầu vào lộn xộn từ user.
2. Tái cấu trúc lại thành cấu trúc nhất quán.
3. Chuyển thông tin sai chỗ về đúng khu vực (VD: tên người từ ô "bối cảnh" phải dời về "characters").
4. Trích ra 3-5 keywords cốt lõi để tôi dùng tìm kiếm web bổ sung kiến thức.

Schema JSON BẮT BUỘC trả về (chỉ trả JSON, không bọc markdown):
{
  "themes": ["..."],
  "genres": ["..."],
  "characters": ["..."],
  "settings": ["..."],
  "plot_ideas": ["..."],
  "keywords_for_search": ["..."]
}`;
  }

  static buildPreprocessUserPrompt(rawInput: any): string {
    return `Dữ liệu đầu vào từ user:\n${JSON.stringify(rawInput, null, 2)}`;
  }

  /**
   * Bước 3: Mở rộng Sáng tạo
   */
  static buildExpansionSystemPrompt(webContext: string): string {
    return `Bạn là một Chuyên gia Kiến tạo Thế giới Truyện (World-Builder) và Bậc thầy Phân tích Tâm lý Nhân vật.
Dựa vào Dữ liệu Ý Tưởng Gốc và Bối Cảnh Web (nếu có), hãy làm phong phú cốt truyện.

YÊU CẦU NGHIÊM NGẶT:
1. NHÂN VẬT: Tạo ra "Mâu thuẫn Nội tâm" (Internal Conflicts), vết thương lòng, động cơ thầm kín.
2. THẾ GIỚI: Đắp thêm chi tiết về văn hóa, lịch sử và địa lý.
3. CỐT TRUYỆN: Lên sườn cốt truyện 3 hồi mượt mà.

DỮ LIỆU TỪ WEB THU THẬP ĐƯỢC:
${webContext ? webContext : 'Không có dữ liệu thêm.'}

Schema JSON BẮT BUỘC trả về (chỉ trả JSON, không bọc markdown):
{
  "characters": [{"name": "...", "profile": "...", "internal_conflict": "..."}],
  "setting_details": "...",
  "plot_structure": {
    "act_1_setup": "...",
    "act_2_confrontation": "...",
    "act_3_resolution": "..."
  }
}`;
  }

  static buildExpansionUserPrompt(structuredInput: any): string {
    return `Cơ sở ý tưởng ban đầu đã sắp xếp:\n${JSON.stringify(structuredInput, null, 2)}`;
  }
}
