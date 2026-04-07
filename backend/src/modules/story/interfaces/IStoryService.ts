export interface IStoryService {
  getStoriesByAuthor(authorId: string): Promise<any[]>;
  getStoryById(id: string): Promise<any | null>;
  createGeneratedStory(authorId: string, blueprint: any): Promise<any>;
  updateStory(id: string, authorId: string, data: any): Promise<any>;
  deleteStory(id: string, authorId: string): Promise<boolean>;
  addChapter(storyId: string, chapterIndex: number, content: string): Promise<any>;
}
