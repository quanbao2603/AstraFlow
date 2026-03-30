import type { ILLMProvider } from './interfaces/ILLMProvider.js';

export class OpenAiCompatibleProvider implements ILLMProvider {
  /**
   * Khởi tạo với Base URL tương thích chuẩn OpenAI (VD: http://localhost:20128/v1)
   */
  constructor(
    private readonly baseUrl: string,
    private readonly defaultModel: string = 'local-model'
  ) {}

  async generateText(
    systemPrompt: string, 
    userPrompt: string, 
    apiKey: string, 
    jsonMode: boolean = false
  ): Promise<string> {
    const url = `${this.baseUrl}/chat/completions`;
    
    const body: any = {
      model: this.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    };

    // Chuẩn OpenAI hỗ trợ ép JSON format
    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Fallback xử lý nếu Local server không kén response_format
        if (jsonMode && errorText.includes('response_format')) {
          console.warn('[OpenAiCompatible] Server không hỗ trợ response_format = json_object. Thử lại không có tham số này...');
          delete body.response_format;
          const retryRes = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
          });
          if (!retryRes.ok) throw new Error(await retryRes.text());
          const retryData = await retryRes.json();
          return retryData.choices[0].message.content;
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error("[OpenAiCompatibleProvider] Error:", error.message);
      throw new Error(`[Local AI Error] Lỗi gọi API OpenAI-Compatible: ${error.message}`);
    }
  }
}
