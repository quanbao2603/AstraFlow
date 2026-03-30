export interface ISearchProvider {
  /**
   * Tra cứu web dựa trên các từ khóa (keywords) và trả về text tổng hợp.
   * @param queries - Danh sách từ khóa
   */
  searchWeb(queries: string[]): Promise<string>;
}
