/**
 * neo4j.repository.ts
 * Chịu trách nhiệm DUY NHẤT: thực thi Cypher queries lên Neo4j và health check.
 * Khởi tạo schema: xem infrastructure/neo4j/neo4j.schema.ts
 */
import { getNeo4jDriver } from '../../db/neo4j.js';
import type { Session, QueryResult } from 'neo4j-driver';

export const neo4jRepository = {
  /**
   * Chạy một Cypher Query bất kỳ và trả về kết quả
   */
  async runCypher(cypher: string, params: Record<string, any> = {}): Promise<QueryResult> {
    const session: Session = getNeo4jDriver().session();
    try {
      return await session.run(cypher, params);
    } finally {
      await session.close();
    }
  },

  /**
   * Health check: Kiểm tra kết nối đến Neo4j
   */
  async ping(): Promise<boolean> {
    try {
      await this.runCypher('RETURN 1');
      return true;
    } catch {
      return false;
    }
  },
};

export default neo4jRepository;
