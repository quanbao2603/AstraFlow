import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ILLMProvider } from './interfaces/ILLMProvider.js';

export class GeminiProvider implements ILLMProvider {
  /**
   * Gọi API Gemini
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
      generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
    };

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: systemPrompt 
      });
      const result = await model.generateContent(requestPayload as any);
      return result.response.text();
    } catch (error: any) {
      if (error.message?.includes('404 Not Found') || error.message?.includes('not found')) {
        console.warn("[GeminiProvider] Lỗi 404. Đang tự động quét danh sách Model khả dụng của API Key...");
        try {
          const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          if (listRes.ok) {
            const data = await listRes.json();
            // Tìm model hỗ trợ generateContent, ưu tiên gemini-1.5-flash -> gemini-1.5-pro -> gemini-pro -> bất kỳ gemini nào
            const models: any[] = data.models || [];
            const validModels = models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
            
            let bestModel = validModels.find(m => m.name.includes('gemini-1.5-flash'));
            if (!bestModel) bestModel = validModels.find(m => m.name.includes('gemini-1.5-pro'));
            if (!bestModel) bestModel = validModels.find(m => m.name.includes('gemini-pro'));
            if (!bestModel && validModels.length > 0) bestModel = validModels[0];

            if (bestModel) {
              const exactModelName = bestModel.name.replace('models/', '');
              console.log(`[GeminiProvider] Chọn được model thay thế: ${exactModelName}`);
              
              const fallbackModel = genAI.getGenerativeModel({ 
                model: exactModelName, 
                systemInstruction: systemPrompt 
              });
              const fallbackResult = await fallbackModel.generateContent(requestPayload as any);
              return fallbackResult.response.text();
            }
          }
        } catch (fallbackError: any) {
          console.error("[GeminiProvider] Không thể tự động tìm model thay thế:", fallbackError.message);
        }
      }
      
      console.error("[GeminiProvider] Error:", error.message);
      throw new Error(`[Gemini Error] Lỗi khi gọi API Sinh Truyện: ${error.message}`);
    }
  }
}
