export interface ILLMProvider {
  /**
   * Sinh ra text (hoặc JSON string) dựa trên system prompt và user prompt.
   * @param systemPrompt - Chỉ dẫn định hướng cho AI (Role, format)
   * @param userPrompt - Dữ liệu hoặc yêu cầu cụ thể
   * @param apiKey - API Key thực tế của user (sau khi decrypt)
   * @param jsonMode - Ép trả về chuẩn JSON format
   */
  generateText(systemPrompt: string, userPrompt: string, apiKey: string, jsonMode?: boolean): Promise<string>;
}
