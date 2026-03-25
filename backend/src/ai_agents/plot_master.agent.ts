import type { IStoryAgent, IStoryContext } from './agent.interface.js';

/**
 * @class PlotMasterAgent
 * @description Agent Tác giả/Kịch bản chính - Nhận ý tưởng thô và sinh Outline sườn truyện cấu trúc.
 * @architecture [Mô hình Lai] Output bắt buộc trả ra JSON/Schema để xây dựng Nodes/Edges.
 */
export class PlotMasterAgent implements IStoryAgent {
  name = 'Plot Master Framework';
  role = 'Director & Outline Builder';

  /**
   * @method execute
   * @description Phác thảo sườn truyện ban đầu từ ý tưởng thô.
   * @param context Ngữ cảnh chứa promptIdea
   */
  async execute(context: IStoryContext): Promise<any> {
    const promptIdea = context.promptIdea;
    // TODO: 1. Gọi Gemini/OpenAI sinh JSON Outline (Bao gồm Chapters, Casts).
    // TODO: 2. Parse và validate Schema JSON trả ra.
    return {
      title: 'Hành trình vượt qua AI (Khởi nguồn)',
      summary: 'Một lập trình viên phát hiện ra AI sinh ra ý thức...',
      chapters: [
        { index: 1, title: 'Lời nguyền Loop', summary: 'Gặp gỡ nhân vật chính tại Trạm 404.' },
        { index: 2, title: 'Vết nứt API', summary: 'Phát hiện endpoint lạ gửi tín hiệu về quá khứ.' },
      ],
      characters: [
        { name: 'Kael', role: 'Main Protagonist - Dev' },
        { name: 'Aether', role: 'AI Overlord' },
      ],
    };
  }
}
