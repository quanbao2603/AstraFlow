// src/db/prisma.ts
// Singleton PrismaClient sử dụng PrismaPg Driver Adapter (Prisma 7+)
import { PrismaClient } from '../generated/prisma/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  throw new Error('[prisma.ts] DATABASE_URL is not defined in .env');
}

const pool = new Pool({ connectionString });
// Cast to `any` to resolve the type conflict between the project's @types/pg
// and the bundled @types/pg inside @prisma/adapter-pg (different structural versions).
const adapter = new PrismaPg(pool as any);

const prisma = new PrismaClient({ adapter });

export default prisma;
