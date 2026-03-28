/**
 * apiKey.repo.ts
 * Chịu trách nhiệm DUY NHẤT: data access layer cho bảng ApiKey (Prisma/PostgreSQL).
 */
import prisma from '../../db/prisma.js';
import type {
  IApiKeyRepository,
  CreateApiKeyData,
  ApiKeyRecord,
} from './interfaces/IApiKeyRepository.js';

export class ApiKeyRepository implements IApiKeyRepository {
  /**
   * Truy xuất toàn bộ keys của một user (mới nhất trước)
   */
  async findByUserId(userId: string): Promise<ApiKeyRecord[]> {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<ApiKeyRecord[]>;
  }

  /**
   * Truy xuất key mặc định của một user cho một provider cụ thể
   */
  async findDefaultByProvider(userId: string, provider: string): Promise<ApiKeyRecord | null> {
    return prisma.apiKey.findFirst({
      where: { userId, provider, isDefault: true },
    }) as Promise<ApiKeyRecord | null>;
  }

  /**
   * Lấy chi tiết key theo id (chỉ trả về nếu thuộc về userId đó)
   */
  async findById(id: string, userId: string): Promise<ApiKeyRecord | null> {
    return prisma.apiKey.findFirst({
      where: { id, userId },
    }) as Promise<ApiKeyRecord | null>;
  }

  /**
   * Tạo API Key mới trong DB
   */
  async createApiKey(data: CreateApiKeyData): Promise<ApiKeyRecord> {
    return prisma.apiKey.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        label: data.label ?? null,
        encryptedKey: data.encryptedKey,
        iv: data.iv,
        isDefault: data.isDefault ?? false,
      },
    }) as Promise<ApiKeyRecord>;
  }

  /**
   * Đặt một key cụ thể làm mặc định (theo id)
   */
  async updateDefault(id: string): Promise<void> {
    await prisma.apiKey.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  /**
   * Gỡ bỏ trạng thái mặc định của tất cả keys trong một provider
   */
  async unsetDefaultForProvider(userId: string, provider: string): Promise<void> {
    await prisma.apiKey.updateMany({
      where: { userId, provider },
      data: { isDefault: false },
    });
  }

  /**
   * Xoá một API Key (chỉ xoá nếu thuộc về userId)
   */
  async deleteById(id: string, userId: string): Promise<void> {
    await prisma.apiKey.delete({
      where: { id, userId },
    });
  }
}

