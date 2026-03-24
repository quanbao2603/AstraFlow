import { AgentOrchestrator } from '../ai_agents/orchestrator.js';

/**
 * @class StoryService
 * @description Lớp xử lý nghiệp vụ liên quan tới Truyện (Business & Data Actions).
 * Tách biệt hoàn toàn khỏi Request/Response HTTP. Áp dụng Single Responsibility (SRP).
 */
export class StoryService {
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
  }

  /**
   * @method createStoryInteractive
   * @description Tạo truyện mới kết hợp kích hoạt Pipeline AI sinh chương mở đầu.
   * @param title Tên truyện
   * @param promptIdea Ý tưởng thô bạo ban đầu
   */
  async createStoryInteractive(userId: string, title: string, promptIdea: string): Promise<any> {
    // TODO: 1. Tạo Metadata Story trong bảng Database (Prisma).
    // 2. Kéo Cần gạt Pipeline AI Agent
    const result = await this.orchestrator.generateChapter(promptIdea);
    const firstChapterContent = result.chapterText;
    
    // TODO: 3. Sinh thêm chapter1 trong DB liên kết.
    return {
      title,
      content: firstChapterContent,
    };
  }

  /**
   * @method getStoriesByUser
   * @description Tra cứu danh sách đã sáng tác của người đọc.
   */
  async getStoriesByUser(userId: string): Promise<any[]> {
    return [];
  }
}
