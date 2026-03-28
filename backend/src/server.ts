/**
 * server.ts
 * Chịu trách nhiệm DUY NHẤT: quản lý vòng đời HTTP server.
 * - Nhận Express app từ ngoài vào
 * - Khởi động server (listen)
 * - Log startup info
 * - Xử lý graceful shutdown
 * Không biết gì về routes, middleware, hay business logic.
 */
import { closeNeo4jDriver } from './db/neo4j.js';
import type { Express } from 'express';
import { initializeNeo4jSchema } from './infrastructure/neo4j/neo4j.schema.js';

/**
 * Khởi động HTTP server và các tác vụ startup.
 * Đăng ký graceful shutdown handlers.
 */
export async function startServer(app: Express): Promise<void> {
  const port = process.env.PORT || 3001;

  // ── Khởi tạo Neo4j Schema (một lần khi server start) ─────────────────────
  initializeNeo4jSchema().catch((err: any) =>
    console.error('[Neo4j] Schema init failed:', err.message)
  );

  // ── Khởi động HTTP Server ─────────────────────────────────────────────────
  app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
    console.log(`   - PostgreSQL (Prisma+PrismaPg): READY`);
    console.log(`   - Neo4j AuraDB:                 INITIALIZING`);
    console.log(`   - Supabase Auth:                READY`);
  });

  // ── Graceful Shutdown ─────────────────────────────────────────────────────
  process.on('SIGTERM', async () => {
    console.log('[Server] SIGTERM received. Shutting down gracefully...');
    await closeNeo4jDriver();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[Server] SIGINT received. Shutting down gracefully...');
    await closeNeo4jDriver();
    process.exit(0);
  });
}
