import type { ILLMProvider } from './interfaces/ILLMProvider.js';

/**
 * OpenAiProvider
 * Gọi API chính thức của OpenAI (https://api.openai.com/v1).
 * Dùng cho key dạng sk-... từ platform.openai.com.
 */
export class OpenAiProvider implements ILLMProvider {
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(
    private readonly defaultModel: string = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini'
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

    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('[OpenAiProvider] Error:', error.message);
      throw new Error(`[OpenAI Error] Lỗi khi gọi API: ${error.message}`);
    }
  }
}

/**
 * OpenAiCompatibleProvider
 * Gọi bất kỳ server nào tương thích chuẩn OpenAI API (LM Studio, Ollama, 9Router local, v.v.).
 * Inject base URL khi khởi tạo để có thể dùng cho nhiều backend khác nhau.
 */
export class OpenAiCompatibleProvider implements ILLMProvider {
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
        { role: 'user', content: userPrompt },
      ],
    };

    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Fallback xử lý nếu local server không hỗ trợ response_format
        if (jsonMode && errorText.includes('response_format')) {
          console.warn('[OpenAiCompatible] Server không hỗ trợ response_format = json_object. Thử lại không có tham số này...');
          delete body.response_format;
          const retryRes = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
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
      console.error('[OpenAiCompatibleProvider] Error:', error.message);
      throw new Error(`[OpenAI-Compatible Error] Lỗi khi gọi API: ${error.message}`);
    }
  }
}
