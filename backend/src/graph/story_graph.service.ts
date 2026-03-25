import { Neo4jService, neo4jService } from './neo4j.service.js';

/**
 * @class StoryGraphService
 * @description Lớp xử lý nghiệp vụ đồ thị cụ thể cho cốt truyện (Story-Visualizer).
 * Áp dụng nguyên lý SRP (Single Responsibility Principle) - Chỉ xử lý Cypher cho Story entities.
 */
export class StoryGraphService {
  private neo4j: Neo4jService;

  constructor(neo4j: Neo4jService = neo4jService) {
    this.neo4j = neo4j;
  }

  /**
   * @method createNode
   * @description Tạo 1 Node bất kỳ trên đồ thị (Character, Location, Event, Item).
   */
  async createNode(label: string, properties: Record<string, any>): Promise<void> {
    const query = `MERGE (n:${label} {name: $properties.name}) ON CREATE SET n += $properties ON MATCH SET n += $properties`;
    await this.neo4j.runQuery(query, { properties });
  }

  /**
   * @method createRelationship
   * @description Tạo quan hệ giữa 2 Node dựa trên tên (hoặc identifier).
   */
  async createRelationship(
    sourceLabel: string, 
    sourceName: string, 
    targetLabel: string, 
    targetName: string, 
    relationType: string,
    properties: Record<string, any> = {}
  ): Promise<void> {
    const query = `
      MATCH (a:${sourceLabel} {name: $sourceName})
      MATCH (b:${targetLabel} {name: $targetName})
      MERGE (a)-[r:${relationType}]->(b)
      ON CREATE SET r += $properties
      ON MATCH SET r += $properties
    `;
    await this.neo4j.runQuery(query, { sourceName, targetName, properties });
  }

  /**
   * @method getNeighborhood
   * @description Lấy danh sách quan hệ lân cận của 1 Node (phục vụ sinh gợi ý).
   */
  async getNeighborhood(name: string): Promise<any> {
    const query = `
      MATCH (n {name: $name})-[r]-(m)
      RETURN type(r) as relation, labels(m) as labels, m as node
    `;
    return await this.neo4j.runQuery(query, { name });
  }
}
