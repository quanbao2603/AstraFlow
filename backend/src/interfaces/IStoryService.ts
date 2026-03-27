export interface IStoryService {
  getStoriesByAuthor(authorId: string): Promise<any[]>;
}
