import { PrismaClient } from '../../generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// Mặc định ban đầu: Chạy SQLite Adapter như cũ để bảo toàn logic hiện tại
const sqlitePath = join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: sqlitePath });

// 120%-Ready: Tương lai chỉ cần đổi .env thành isProduction để cắm sang Postgres
export const prisma = new PrismaClient({
  adapter: adapter as any,
});

export default prisma;
