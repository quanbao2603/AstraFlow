import { PlotMasterAgent } from './plot_master.agent.js';
import { ContinuityAgent } from './continuity.agent.js';
import { NovelistAgent } from './novelist.agent.js';
import type { IStoryContext } from './agent.interface.js';

/**
 * @class AgentOrchestrator
 * @description Tổng đài Điều Phối - Chịu trách nhiệm gọi các Agent theo đúng luồng Logic Nhân - Quả (Pipeline).
 */
export class AgentOrchestrator {
  private plotMaster: PlotMasterAgent;
  private continuity: ContinuityAgent;
  private novelist: NovelistAgent;

  constructor() {
    this.plotMaster = new PlotMasterAgent();
    this.continuity = new ContinuityAgent();
    this.novelist = new NovelistAgent();
  }

  /**
   * @method generateChapter
   * @description Quy trình 3 bước sinh chương truyện chuẩn Mô Hình Lai Hybrid
   */
  async generateChapter(userPrompt: string): Promise<{ chapterText: any; graphMutations: any }> {
    console.log(`[Orchestrator] Bắt đầu sinh chương với ý tưởng: "${userPrompt}"`);

    // Khởi tạo ngữ cảnh ban đầu
    const context: IStoryContext = {
      promptIdea: userPrompt,
    };

    // --- BƯỚC 1: Plot Master (Dàn bài) ---
    const outlineJson = await this.plotMaster.execute(context);
    console.log(`[Orchestrator] Bước 1 Đạt cấu trúc:`, outlineJson);
    context.outline = outlineJson;

    // --- BƯỚC 2: Kiểm tra Logic RAG (Continuity & Graph sync) ---
    const validationResult = await this.continuity.execute(context);
    console.log(`[Orchestrator] Bước 2 Kiểm tra Logic:`, validationResult);
    context.validation = validationResult;

    // --- BƯỚC 3: Sinh Văn Xuôi (Novelist) ---
    const novelistResult = await this.novelist.execute(context);
    
    return {
      chapterText: novelistResult, // Trả ra nội dung bao gồm chapter title, content
      graphMutations: validationResult // Trả ra log để app update đồ thị thật
    };
  }
}
