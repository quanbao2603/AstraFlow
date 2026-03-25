import type { IStoryAgent, IStoryContext } from './agent.interface.js';

/**
 * @class NovelistAgent
 * @description Agent Văn học - Nhận sườn bài đã kiểm duyệt và "vẽ" ra các câu chữ (Nội dung chương mở rộng).
 */
export class NovelistAgent implements IStoryAgent {
  name = 'Novelist Writer';
  role = 'Prose Generator & Chapter Writer';

  /**
   * @method execute
   * @description Sáng tác nội dung chi tiết cho một Chương.
   * @param context Ngữ cảnh chứa outline và validation
   */
  async execute(context: IStoryContext): Promise<any> {
    const outline = context.outline;
    const title = outline?.title || 'Untitled';
    
    // TODO: 1. Gọi Gemini sinh Prose theo Từng Chapter (Chỉ chương 1 lúc khởi tạo).
    return {
      chapterTitle: outline?.chapters?.[0]?.title || 'Chapter 1',
      content: `[Nội dung văn học được viết mượt mà cho truyện ${title}] ... Còi báo động rú vang tại Trạm 404, Kael chớp mắt ...`,
    };
  }
}
