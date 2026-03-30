import type { ISearchProvider } from './interfaces/ISearchProvider.js';

export class TavilyProvider implements ISearchProvider {
  /**
   * Mock searchWeb until real API key is integrated
   */
  async searchWeb(queries: string[]): Promise<string> {
    console.log(`[TavilyProvider] Đang mô phỏng tra cứu thông tin cho từ khóa: ${queries.join(', ')}`);
    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Trả về dữ liệu gốc giả lập hữu ích cho cốt truyện
    return `[Mock Web Data]: Nội dung liên quan đến: ${queries.join(', ')}. Thông tin cho biết chủ thể này thường giấu giếm thân phận thực sự, bên trong nội tâm chứa nhiều mâu thuẫn về đạo đức. Bối cảnh lịch sử của sự vật/hiện tượng này luôn gắn liền với một cuộc thảm sát hoặc biến cố kinh hoàng bị che đậy bởi chính quyền trong quá khứ.`;
  }
}
