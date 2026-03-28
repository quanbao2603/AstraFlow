// src/repositories/neo4j.repo.ts
import { getNeo4jDriver } from '../db/neo4j.js';
import type { Session, QueryResult } from 'neo4j-driver';

export const neo4jRepo = {
  /**
   * Chạy một Cypher Query bất kỳ
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
   * Khởi tạo Constraints / Indexes ban đầu cho đồ thị
   */
  async initializeSchema(): Promise<void> {
    const constraints = [
      `CREATE CONSTRAINT character_id IF NOT EXISTS FOR (c:Character) REQUIRE c.id IS UNIQUE`,
      `CREATE CONSTRAINT location_id IF NOT EXISTS FOR (l:Location) REQUIRE l.id IS UNIQUE`,
      `CREATE CONSTRAINT event_id IF NOT EXISTS FOR (e:Event) REQUIRE e.id IS UNIQUE`,
    ];
    for (const query of constraints) {
      await this.runCypher(query);
    }
    console.log('[Neo4j] Schema constraints initialized.');
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

  /**
   * Đóng kết nối (dùng khi graceful shutdown)
   */
  async close(): Promise<void> {
    // Logic close thực tế nằm trong db/neo4j.ts, repo này chỉ bọc lại nếu cần
    // Nhưng index.ts sẽ gọi trực tiếp closeNeo4jDriver để đảm bảo singleton được giải phóng
  },
};

export default neo4jRepo;
