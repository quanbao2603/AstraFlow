import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ILLMProvider } from './interfaces/ILLMProvider.js';

// Thứ tự model ưu tiên: lite trước (ít tốn quota), rồi mới đến các model nặng hơn
const FALLBACK_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export class GeminiProvider implements ILLMProvider {
  /**
   * Gọi API Gemini — tự động thử fallback model khi gặp 429/404
   */
  async generateText(
    systemPrompt: string,
    userPrompt: string,
    apiKey: string,
    jsonMode: boolean = false
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(apiKey);

    const requestPayload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: jsonMode ? { responseMimeType: 'application/json' } : {},
    };

    for (const modelName of FALLBACK_MODELS) {
      try {
        console.log(`[GeminiProvider] Thử model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });
        const result = await model.generateContent(requestPayload as any);
        console.log(`[GeminiProvider] Thành công với model: ${modelName}`);
        return result.response.text();
      } catch (error: any) {
        const is404 = error.message?.includes('404') || error.message?.includes('not found');
        const is429 = error.message?.includes('429') || error.message?.includes('quota');

        if (is404) {
          console.warn(`[GeminiProvider] Model "${modelName}" không khả dụng (404), thử model tiếp theo...`);
          continue;
        }

        if (is429) {
          console.warn(`[GeminiProvider] Model "${modelName}" bị giới hạn quota (429), thử model tiếp theo...`);
          continue;
        }

        // Lỗi khác — dừng ngay, không retry
        console.error(`[GeminiProvider] Lỗi không thể retry với model "${modelName}":`, error.message);
        throw new Error(`[Gemini Error] Lỗi khi gọi API Sinh Truyện: ${error.message}`);
      }
    }

    throw new Error(
      '[Gemini Error] Tất cả model Gemini đều không khả dụng hoặc đã hết quota. ' +
      'Vui lòng kiểm tra API Key hoặc thử lại sau.'
    );
  }
}
