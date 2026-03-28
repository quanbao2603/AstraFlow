/**
 * masking.util.ts
 * Chịu trách nhiệm DUY NHẤT: che giấu (mask) dữ liệu nhạy cảm trước khi trả về client.
 */

/**
 * Che giấu một phần chuỗi API Key để an toàn gửi về frontend.
 * Ví dụ: "sk-abcdef123456WXYZ" → "sk-a...WXYZ"
 */
export function maskKey(key: string): string {
  if (key.length <= 8) return '****';
  const prefix = key.substring(0, 4);
  const suffix = key.substring(key.length - 4);
  return `${prefix}...${suffix}`;
}

/**
 * Che giấu địa chỉ email.
 * Ví dụ: "user@example.com" → "us**@example.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain || local.length <= 2) return `${local?.[0] ?? '?'}**@${domain ?? ''}`;
  return `${local.substring(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`;
}
