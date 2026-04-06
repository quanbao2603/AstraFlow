import type { IApiKeyService } from '../../apiKey/interfaces/IApiKeyService.js';
import type { ILLMProvider } from '../../../infrastructure/ai/interfaces/ILLMProvider.js';
import { PromptBuilder } from '../utils/prompt.builder.js';

export class GenerateNextChapterUseCase {
  constructor(
    private readonly apiKeyService: IApiKeyService,
    private readonly llmProviders: Record<string, ILLMProvider>
  ) {}

  async execute(userId: string, blueprint: any, nextChapterIndex: number, previousContext: string): Promise<string> {
    // 1. Kiểm tra cấu hình API Key
    const keyData = await this.apiKeyService.getDefaultKeyPlaintext(userId);
    if (!keyData) {
      throw new Error('Bạn chưa cấu hình API Key mặc định. Vui lòng thêm API Key và đặt làm mặc định ở cài đặt Studio.');
    }
    const apiKey = keyData.key;
    const provider = keyData.provider.toLowerCase();

    console.log(`[GenerateNextChapterUseCase] Using provider: ${provider} for Chapter ${nextChapterIndex}`);

    const llmProvider = this.llmProviders[provider] || this.llmProviders['openai'];
    if (!llmProvider) {
      throw new Error(`Hệ thống không tìm thấy provider tương ứng cho "${provider}".`);
    }

    const sysPrompt = PromptBuilder.buildNextChapterSystemPrompt();
    const usrPrompt = PromptBuilder.buildNextChapterUserPrompt(blueprint, nextChapterIndex, previousContext);

    try {
      // jsonMode: false => trả text markdown cho văn xuôi
      const chapterContent = await llmProvider.generateText(sysPrompt, usrPrompt, apiKey, false);
      return chapterContent.trim();
    } catch (e: any) {
      throw new Error(`Lỗi sinh nội dung Chương tiếp theo: ${e.message}`);
    }
  }
}
