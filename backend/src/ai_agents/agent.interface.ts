/**
 * @interface IStoryContext
 * @description Ngữ cảnh xuyên suốt Pipeline sinh truyện giữa các Agent.
 */
export interface IStoryContext {
  /** @property Ý tưởng/Prompt thô từ người dùng */
  promptIdea?: string;
  
  /** @property Bản nháp dàn ý dạng cấu trúc (Dựng lên bởi Plot Master) */
  outline?: {
    title: string;
    summary: string;
    chapters: Array<{ index: number; title: string; summary: string }>;
    characters: Array<{ name: string; role: string }>;
  };

  /** @property Kết quả đối soát logic từ Continuity */
  validation?: {
    isLogicConsistent: boolean;
    warnings: string[];
    graphContextSnapshot?: string;
  };

  /** @property ID của Tập truyện/Chương truyện đang thao tác */
  storyId?: string;
  userId?: string;
}

/**
 * @interface IStoryAgent
 * @description Interface chuẩn hoá cho các tác nhân AI (Agents) xử lý từng bước trong chuỗi sinh truyện.
 * Áp dụng nguyên lý Single Responsibility Principle (SRP) và Interface Segregation từ SOLID.
 */
export interface IStoryAgent {
  /** @property tên của Agent (ví dụ: "Plot Master") */
  name: string;
  
  /** @property nhiệm vụ cụ thể của Agent */
  role: string;

  /**
   * @method execute
   * @description Thực thi tác vụ AI cụ thể.
   * @param context Bộ nhớ ngữ cảnh liên tục (Bao gồm Option, Outline hiện tại, Prompt).
   * @returns Kết quả sinh được (Dạng JSON thô/Object chứa kết quả để kết nối Agent tiếp theo).
   */
  execute(context: IStoryContext): Promise<any>;
}
