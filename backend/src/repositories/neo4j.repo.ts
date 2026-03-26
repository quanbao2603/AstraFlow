// src/repositories/neo4j.repo.ts
// Repository cho Neo4j AuraDB (Lưu trữ Lore / Đồ thị tri thức)
import neo4j from 'neo4j-driver';
import type { Driver, Session, QueryResult } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const NEO4J_URI = process.env.NEO4J_URI!;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME!;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD!;

let driver: Driver | null = null;

function getDriver(): Driver {
  if (!driver) {
    if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
      throw new Error('[neo4j.repo.ts] Neo4j env vars are not defined in .env');
    }
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
  }
  return driver;
}

export const neo4jRepo = {
  /**
   * Chạy một Cypher Query bất kỳ
   */
  async runCypher(cypher: string, params: Record<string, any> = {}): Promise<QueryResult> {
    const session: Session = getDriver().session();
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
      await neo4jRepo.runCypher(query);
    }
    console.log('[Neo4j] Schema constraints initialized.');
  },

  /**
   * Health check: Kiểm tra kết nối đến Neo4j
   */
  async ping(): Promise<boolean> {
    try {
      await neo4jRepo.runCypher('RETURN 1');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Đóng kết nối (dùng khi graceful shutdown)
   */
  async close(): Promise<void> {
    if (driver) {
      await driver.close();
      driver = null;
      console.log('[Neo4j] Connection closed.');
    }
  },
};

export default neo4jRepo;
