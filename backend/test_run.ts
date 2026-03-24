import fs from 'fs';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/index.js';

try {
  const adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
  const prisma = new PrismaClient({ adapter: adapter as any });
  
  console.log("Prisma Client created successfully!");
  await prisma.$connect();
  
  // TRIGGER THE QUERY
  const templates = await prisma.storyTemplate.findMany({
    where: { isPublic: { equals: true } }
  });
  console.log("Templates fetched successfully:", templates);
  
} catch (e: any) {
  const errorDetails = `
--- QUERY ERROR ---
Message: ${e.message}
Stack: ${e.stack}
Details: ${JSON.stringify(e, null, 2)}
-----------------------
`;
  fs.writeFileSync('error.log', errorDetails);
  console.log('Error written to error.log');
}
