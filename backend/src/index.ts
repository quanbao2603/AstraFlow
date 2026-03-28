/**
 * index.ts — Entry Point
 * Chịu trách nhiệm DUY NHẤT: khởi động ứng dụng.
 * 1. Compose dependency graph (container.ts)
 * 2. Tạo Express app (app.ts)
 * 3. Start HTTP server (server.ts)
 */
import 'dotenv/config';
import { composeApp } from './container.js';
import { createApp } from './app.js';
import { startServer } from './server.js';

const { routes, healthCheck } = composeApp();
const app = createApp({ routes, healthCheck });

startServer(app);

