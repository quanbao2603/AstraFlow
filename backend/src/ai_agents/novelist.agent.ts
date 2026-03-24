import type { IStoryAgent } from './agent.interface.js';

/**
 * @class NovelistAgent
 * @description Agent Nhà văn - Nhận Outline đã kiểm định tính Logic cấu trúc để viết thành chương truyện văn xuôi hoàn chỉnh.
 * @architecture [Mô hình Lai] Output: Markdown Văn Xuôi thuần (Plain text) tránh lỗi Quote Escape "".
 */
export class NovelistAgent implements IStoryAgent {
  name = 'Novelist Prose Maker';
  role = 'Main Writer';

  /**
   * @method execute
   * @param context { outline: string, verified_facts: string, writing_style: string }
   */
  async execute(context: any): Promise<any> {
    // TODO: 1. Sử dụng LLM gọt giũa văn xuôi dựa theo kịch bản sườn vững chắc
    // TODO: 2. Phủ màu phong thái văn học (Dark, Fantasy, Sci-fi...)
    return {
      chapterId: 1,
      prose: 'Nội dung cốt truyện dạng Markdown sinh bằng AI mượt mà...',
    };
  }
}
