import type { ILLMProvider } from './interfaces/ILLMProvider.js';

/**
 * OpenRouterProvider
 * Gọi API OpenRouter (https://openrouter.ai/api/v1/chat/completions).
 * OpenRouter tương thích chuẩn OpenAI nhưng yêu cầu thêm 2 header đặc biệt.
 * Cho phép truy cập hàng trăm model (GPT-4o, Claude, Mistral, v.v.) qua 1 key duy nhất.
 */
export class OpenRouterProvider implements ILLMProvider {
  private readonly baseUrl = 'https://openrouter.ai/api/v1';

  constructor(
    private readonly defaultModel: string = process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-4o-mini'
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
        { role: 'user', content: userPrompt },
      ],
    };

    // OpenRouter hỗ trợ response_format chuẩn OpenAI
    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          // Header bắt buộc của OpenRouter để tracking usage
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
          'X-Title': 'AstraFlow',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Fallback: Một số model không hỗ trợ json_object
        if (jsonMode && (errorText.includes('response_format') || response.status === 400)) {
          console.warn('[OpenRouterProvider] Model không hỗ trợ response_format. Thử lại không có tham số này...');
          delete body.response_format;
          const retryRes = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
              'X-Title': 'AstraFlow',
            },
            body: JSON.stringify(body),
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
      console.error('[OpenRouterProvider] Error:', error.message);
      throw new Error(`[OpenRouter Error] Lỗi khi gọi API: ${error.message}`);
    }
  }
}
