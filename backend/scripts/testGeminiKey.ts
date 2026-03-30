import { PrismaClient } from '../src/generated/prisma/index.js';
import { decryptKey } from '../src/core/utils/encryption.util.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function testKeys() {
  const keys = await prisma.apiKey.findMany({ where: { provider: 'gemini' } });
  console.log(`Found ${keys.length} Gemini keys.`);
  
  for (const k of keys) {
    try {
      const plaintext = decryptKey({ encryptedKey: k.encryptedKey, iv: k.iv });
      console.log(`Testing key: ${plaintext.substring(0, 10)}...`);
      
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${plaintext}`);
      console.log(`ListModels Status: ${listRes.status}`);
      const data = await listRes.json();
      
      if (data.models) {
        console.log(`Total Models: ${data.models.length}`);
        const names = data.models.map((m: any) => m.name).join(', ');
        console.log(`Model Names: ${names}`);
      } else {
        console.log(`Payload:`, JSON.stringify(data, null, 2));
      }
    } catch (e: any) {
      console.error('Error decrypting or fetching:', e.message);
    }
  }
}

testKeys().catch(console.error).finally(() => prisma.$disconnect());
