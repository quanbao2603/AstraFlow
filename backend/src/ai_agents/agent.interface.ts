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
   * @param context Bộ nhớ ngữ cảnh liên tục (Ví dụ: Option, Graph Node facts, Outline hiện tại).
   * @returns Thống kê hoặc kết quả sinh được (Dạng JSON thô để Agent tiếp theo sử dụng).
   */
  execute(context: any): Promise<any>;
}
