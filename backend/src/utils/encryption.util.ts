import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

if (!process.env.ENCRYPTION_KEY) {
  console.warn('WARNING: ENCRYPTION_KEY is not set in environment variables. Using a random temporary key for this session, which means previously encrypted keys will not be decryptable!');
}

const HEX_KEY = Buffer.from(ENCRYPTION_KEY, 'hex').length === 32
  ? Buffer.from(ENCRYPTION_KEY, 'hex')
  : crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substring(0, 32);

export interface EncryptedData {
  encryptedKey: string;
  iv: string;
}

/**
 * Mã hoá chuỗi plain text bằng AES-256-CBC
 */
export function encryptKey(text: string): EncryptedData {
  const iv = crypto.randomBytes(16);
  // Sử dụng buffer key dài đúng 32 byte để mã hóa
  const key = typeof HEX_KEY === 'string' ? Buffer.from(HEX_KEY, 'utf-8') : HEX_KEY;
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedKey: encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Giải mã chuỗi đã mã hóa bằng AES-256-CBC
 */
export function decryptKey(encryptedData: EncryptedData): string {
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const key = typeof HEX_KEY === 'string' ? Buffer.from(HEX_KEY, 'utf-8') : HEX_KEY;
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encryptedData.encryptedKey, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}

/**
 * Giấu một phần API Key để an toàn gửi về frontend
 * Ví dụ: sk-12...ABCD
 */
export function maskKey(key: string): string {
  if (key.length <= 8) return '****';
  const prefix = key.substring(0, 4);
  const suffix = key.substring(key.length - 4);
  return `${prefix}...${suffix}`;
}
