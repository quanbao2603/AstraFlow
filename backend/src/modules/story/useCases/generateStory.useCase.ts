import type { IApiKeyService } from '../../apiKey/interfaces/IApiKeyService.js';
import type { ILLMProvider } from '../../../infrastructure/ai/interfaces/ILLMProvider.js';
import type { ISearchProvider } from '../../../infrastructure/search/interfaces/ISearchProvider.js';
import { PromptBuilder } from '../utils/prompt.builder.js';

/**
 * GenerateStoryUseCase
 * Chịu trách nhiệm điều phối luồng 4 giai đoạn sinh truyện.
 * Bơm (inject) dependency từ hạ tầng và service ngoài.
 */
export class GenerateStoryUseCase {
  constructor(
    private readonly apiKeyService: IApiKeyService,
    private readonly llmProviders: Record<string, ILLMProvider>,
    private readonly searchProvider: ISearchProvider
  ) {}

  async execute(userId: string, inputData: any): Promise<any> {
    // 1. Kiểm tra cấu hình API Key
    const keyData = await this.apiKeyService.getDefaultKeyPlaintext(userId);
    if (!keyData) {
      throw new Error('Bạn chưa cấu hình API Key mặc định. Vui lòng thêm API Key (Gemini, 9Router,...) và đặt làm mặc định ở cài đặt Studio.');
    }
    const apiKey = keyData.key;
    const provider = keyData.provider.toLowerCase();

    // In ra log để trace
    console.log(`[GenerateStoryUseCase] Using API Key from provider: ${provider}`);

    // Chọn LLM Provider tương ứng (hoặc mặc định fallback sang OpenAI-compatible nếu không có)
    const llmProvider = this.llmProviders[provider] || this.llmProviders['openai'];
    
    if (!llmProvider) {
      throw new Error(`Hệ thống không tìm thấy provider tương ứng cho "${provider}" và cũng không có fallback.`);
    }

    // GIAI ĐOẠN 1: Tiền Phân Tích
    const preprocessSysPrompt = PromptBuilder.buildPreprocessSystemPrompt();
    const preprocessUsrPrompt = PromptBuilder.buildPreprocessUserPrompt(inputData);
    
    let structuredInput: any;
    try {
      const responseText = await llmProvider.generateText(preprocessSysPrompt, preprocessUsrPrompt, apiKey, true);
      // Clean chuỗi JSON đề phòng LLM trả về markdown
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      structuredInput = JSON.parse(cleanJson);
    } catch (e: any) {
      throw new Error(`Lỗi Giai đoạn 1 (Tiền xử lý AI): ${e.message}`);
    }

    // GIAI ĐOẠN 2: Tra cứu Web (RAG)
    const keywords: string[] = structuredInput.keywords_for_search || [];
    let webContext = '';
    if (keywords.length > 0) {
      try {
        console.log('[GenerateStoryUseCase] Bắt đầu thu thập knowledge từ keyword:', keywords);
        webContext = await this.searchProvider.searchWeb(keywords);
      } catch (e: any) {
        console.warn('[GenerateStoryUseCase] Không thể tra cứu Web, tiếp tục dùng kiến thức off-line. Lỗi:', e.message);
      }
    }

    // GIAI ĐOẠN 3 & 4: Mở rộng, Sáng tạo & Lắp ráp
    const expandSysPrompt = PromptBuilder.buildExpansionSystemPrompt(webContext);
    const expandUsrPrompt = PromptBuilder.buildExpansionUserPrompt(structuredInput);

    let finalStory: any;
    try {
       const responseText2 = await llmProvider.generateText(expandSysPrompt, expandUsrPrompt, apiKey, true);
       const cleanJson2 = responseText2.replace(/```json/g, '').replace(/```/g, '').trim();
       finalStory = JSON.parse(cleanJson2);
    } catch (e: any) {
       throw new Error(`Lỗi Giai đoạn 3 (Sinh cốt truyện): ${e.message}`);
    }

    // Gôm toàn bộ Blueprint trả về controller kết thúc orchestration.
    return {
      original_ideas: structuredInput,
      expanded_universe: finalStory,
      is_augmented_by_web: !!webContext
    };
  }
}
