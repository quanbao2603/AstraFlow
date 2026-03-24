import { PlotMasterAgent } from './plot_master.agent';
import { ContinuityAgent } from './continuity.agent';
import { NovelistAgent } from './novelist.agent';

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
  async generateChapter(userPrompt: string): Promise<{ chapterText: string; graphMutations: any }> {
    console.log(`[Orchestrator] Bắt đầu sinh chương với ý tưởng: "${userPrompt}"`);

    // --- BƯỚC 1: Plot Master (Dàn bài) ---
    // Khuyến nghị: Ép OpenAI/Gemini trả ra JSON hoàn chỉnh
    const outlineJson = await this.plotMaster.execute(userPrompt);
    console.log(`[Orchestrator] Bước 1 Đạt cấu trúc:`, outlineJson);

    // --- BƯỚC 2: Kiểm tra Logic RAG (Continuity & Graph sync) ---
    // 2a. Nạp outlineJson này lên Graph DB (Neo4j) để tạo các Nodes tạm thời.
    // 2b. Gọi Continuity Agent check plot-holes & lan truyền ripple effect.
    const validationResult = await this.continuity.execute(outlineJson);
    console.log(`[Orchestrator] Bước 2 Kiểm tra Logic:`, validationResult);

    // --- BƯỚC 3: Sinh Văn Xuôi (Novelist) ---
    // 3a. Gom thông tin cấu trúc đã Verify sạch sẽ
    // 3b. Nạp kèm Vector Context cho Novelist viết hành văn
    const chapterTextMarkdown = await this.novelist.execute(outlineJson);
    
    return {
      chapterText: chapterTextMarkdown, // Trả ra Markdown thô để tránh lỗi escapce ""
      graphMutations: validationResult // Trả ra log để app update đồ thị thật
    };
  }
}
