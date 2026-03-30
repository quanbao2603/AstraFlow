export interface IStoryService {
  getStoriesByAuthor(authorId: string): Promise<any[]>;
  createGeneratedStory(authorId: string, blueprint: any): Promise<any>;
}
