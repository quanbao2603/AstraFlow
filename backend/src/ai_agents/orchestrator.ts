import { PlotMasterAgent } from './plot_master.agent';
import { ContinuityAgent } from './continuity.agent';
import { NovelistAgent } from './novelist.agent';

/**
 * @class StoryOrchestrator
 * @description Bộ điều phối trung tâm - Quản lý việc kích hoạt chuỗi tác nhân AI theo trình tự Pipeline.
 * Khớp nối đầu ra của Agent A làm đầu vào của Agent B.
 */
export class StoryOrchestrator {
  private plotAgent: PlotMasterAgent;
  private continuityAgent: ContinuityAgent;
  private novelistAgent: NovelistAgent;

  constructor() {
    this.plotAgent = new PlotMasterAgent();
    this.continuityAgent = new ContinuityAgent();
    this.novelistAgent = new NovelistAgent();
  }

  /**
   * @method generateNextChapter
   * @description Chạy khép kín quy trình sinh Chương Văn Xuôi chuẩn logic.
   * @param promptIdea Ý tưởng ban đầu của người dùng
   */
  async generateNextChapter(promptIdea: string): Promise<string> {
    // 🎭 Bước 1: Plot Agent lên kịch bản sườn
    const outline = await this.plotAgent.execute({ prompt: promptIdea });

    // 🧠 Bước 2: Continuity Agent đối soát và nạp thông tin lên GraphDB Neo4j
    const verification = await this.continuityAgent.execute({ outline });

    // ✍️ Bước 3: Novelist Agent viết văn bản chương hoàn chỉnh đúng logic
    const result = await this.novelistAgent.execute({
      outline: outline.summary,
      verified_facts: verification.graphContextSnapshot,
      writing_style: 'Chuyên nghiệp, nhập tâm'
    });

    return result.prose;
  }
}
