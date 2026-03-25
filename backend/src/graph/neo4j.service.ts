import neo4j, { Driver, Session, ManagedTransaction } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @class Neo4jService
 * @description Lớp cơ sở vận hành kết nối tới Graph Database Neo4j (Singleton).
 * Cung cấp các wrapper chuẩn để chạy raw CypherQueries và Transaction bảo mật.
 */
export class Neo4jService {
  private driver: Driver;

  constructor() {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  /**
   * @method runQuery
   * @description Thực thi câu lệnh Cypher đơn lẻ lên đồ thị.
   */
  async runQuery(cypher: string, params: Record<string, any> = {}): Promise<any> {
    const session = this.driver.session();
    try {
      const result = await session.run(cypher, params);
      return result.records.map(record => record.toObject());
    } catch (error) {
      console.error('Neo4j Cypher Execution Error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * @method executeWrite
   * @description Chạy giao dịch Write Transaction (Atomicity cho nhiều câu lệnh).
   */
  async executeWrite<T>(work: (tx: ManagedTransaction) => Promise<T>): Promise<T> {
    const session = this.driver.session();
    try {
      return await session.executeWrite(work);
    } catch (error) {
      console.error('Neo4j Write Transaction Error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * @method executeRead
   * @description Chạy giao dịch Read Transaction tối ưu hiệu năng.
   */
  async executeRead<T>(work: (tx: ManagedTransaction) => Promise<T>): Promise<T> {
    const session = this.driver.session();
    try {
      return await session.executeRead(work);
    } catch (error) {
      console.error('Neo4j Read Transaction Error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * @method close
   * @description Đóng kết nối driver. Giải phóng pool.
   */
  async close() {
    await this.driver.close();
  }
}

// Export Singleton Instance
export const neo4jService = new Neo4jService();
