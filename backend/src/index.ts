import express from 'express';
import cors from 'cors';
import { prisma } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// const connectionString = process.env.DATABASE_URL!;
// const pool = new Pool({ 
//   connectionString,
//   ssl: connectionString.includes('sslmode=require') ? true : undefined
// });
import { join } from 'path';

// Prisma initialized via config/db.ts

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import globalRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

app.use('/api', globalRouter);

// Global Error Handler - Must be placed AFTER routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
