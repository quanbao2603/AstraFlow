// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postgresRepo from './repositories/postgres.repo.js';
import neo4jRepo from './repositories/neo4j.repo.js';
import supabaseRepo from './repositories/supabase.repo.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// =======================================================
//  MIDDLEWARE: Xác thực JWT từ Supabase
// =======================================================
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const payload = supabaseRepo.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
  req.user = payload;
  next();
};

// =======================================================
//  STARTUP: Khởi tạo Schema Neo4j
// =======================================================
neo4jRepo.initializeSchema().catch((err) =>
  console.error('[Neo4j] Schema init failed:', err.message)
);

// =======================================================
//  ROUTES
// =======================================================

// Health Check - Kiểm tra cả 3 kết nối
app.get('/', async (_req, res) => {
  const [postgres, neo4j, supabase] = await Promise.allSettled([
    postgresRepo.ping(),
    neo4jRepo.ping(),
    supabaseRepo.ping(),
  ]);

  res.json({
    success: true,
    message: 'AstraFlow API v1 - Kiến Trúc Tam Quốc',
    databases: {
      postgres: postgres.status === 'fulfilled' && postgres.value ? 'CONNECTED' : 'ERROR',
      neo4j: neo4j.status === 'fulfilled' && neo4j.value ? 'CONNECTED' : 'ERROR',
      supabase: supabase.status === 'fulfilled' && supabase.value ? 'CONNECTED' : 'ERROR',
    },
  });
});

// Lấy danh sách Stories của user đang đăng nhập
app.get('/api/v1/stories', verifyToken, async (req: any, res) => {
  try {
    const stories = await postgresRepo.findStoriesByAuthor(req.user.sub);
    res.json({ success: true, data: stories });
  } catch (error: any) {
    console.error('[GET /api/v1/stories]', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Lấy thông tin user đang đăng nhập
app.get('/api/v1/auth/me', verifyToken, (req: any, res) => {
  res.json({ success: true, data: req.user });
});

// =======================================================
//  STARTUP LISTENER
// =======================================================
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
  console.log(`   - PostgreSQL (Prisma+PrismaPg): READY`);
  console.log(`   - Neo4j AuraDB:                 INITIALIZING`);
  console.log(`   - Supabase Auth:                READY`);
});

// =======================================================
//  GRACEFUL SHUTDOWN
// =======================================================
process.on('SIGTERM', async () => {
  console.log('[Server] Shutting down gracefully...');
  await neo4jRepo.close();
  process.exit(0);
});