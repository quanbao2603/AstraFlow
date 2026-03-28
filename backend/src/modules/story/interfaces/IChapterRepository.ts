import type { Chapter } from '../../../generated/prisma/index.js';

export interface IChapterRepository {
  create(data: {
    storyId: string;
    chapterIndex: number;
    title?: string;
    content: string;
    wordCount?: number;
  }): Promise<Chapter>;

  findByStory(storyId: string): Promise<Chapter[]>;
}
