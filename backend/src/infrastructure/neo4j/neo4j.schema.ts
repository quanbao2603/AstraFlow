/**
 * neo4j.schema.ts
 * Chịu trách nhiệm DUY NHẤT: khởi tạo Constraints và Indexes cho đồ thị Neo4j.
 * Được gọi một lần duy nhất khi server khởi động.
 */
import neo4jRepository from './neo4j.repository.js';

const SCHEMA_CONSTRAINTS = [
  `CREATE CONSTRAINT character_id IF NOT EXISTS FOR (c:Character) REQUIRE c.id IS UNIQUE`,
  `CREATE CONSTRAINT location_id  IF NOT EXISTS FOR (l:Location)  REQUIRE l.id IS UNIQUE`,
  `CREATE CONSTRAINT event_id     IF NOT EXISTS FOR (e:Event)     REQUIRE e.id IS UNIQUE`,
];

/**
 * Chạy tất cả Constraint queries để đảm bảo schema Neo4j đúng chuẩn.
 * Gọi hàm này một lần khi server khởi động.
 */
export async function initializeNeo4jSchema(): Promise<void> {
  for (const query of SCHEMA_CONSTRAINTS) {
    await neo4jRepository.runCypher(query);
  }
  console.log('[Neo4j] Schema constraints initialized.');
}
