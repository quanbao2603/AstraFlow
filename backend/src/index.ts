// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// DB & Clients
import { ProfileRepository } from './repositories/profile.repo.js';
import { StoryRepository } from './repositories/story.repo.js';
import neo4jRepo from './repositories/neo4j.repo.js';
import supabaseRepo from './repositories/supabase.repo.js';
import { closeNeo4jDriver } from './db/neo4j.js';

// Services
import { AuthService } from './services/auth.service.js';
import { StoryService } from './services/story.service.js';

// Controllers
import { AuthController } from './controllers/auth.controller.js';
import { StoryController } from './controllers/story.controller.js';

// Routes
import { createStoryRouter } from './routes/v1/story.routes.js';
import { createAuthRouter } from './routes/v1/auth.routes.js';
import apiKeyRoutes from './routes/apiKey.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// =======================================================
//  STARTUP: Khởi tạo Schema Neo4j
// =======================================================
neo4jRepo.initializeSchema().catch((err: any) =>
  console.error('[Neo4j] Schema init failed:', err.message)
);

// =======================================================
//  DI ROOT: Khởi tạo Dependencies
// =======================================================
const profileRepoInstance = new ProfileRepository();
const storyRepoInstance = new StoryRepository();

const authService = new AuthService(profileRepoInstance);
const storyService = new StoryService(storyRepoInstance);

const authController = new AuthController(authService);
const storyController = new StoryController(storyService);

const authRoutes = createAuthRouter(authController);
const storyRoutes = createStoryRouter(storyController);

// =======================================================
//  ROUTES
// =======================================================

// Health Check - Kiểm tra cả 3 kết nối
app.get('/', async (_req, res) => {
  const [postgres, neo4j, supabase] = await Promise.allSettled([
    profileRepoInstance.ping(),
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

// API Routes V1
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/keys', apiKeyRoutes);

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
  await closeNeo4jDriver();
  process.exit(0);
});
