import prisma from '../db/prisma.js';

export const ApiKeyRepository = {
  /**
   * Truy xuất toàn bộ keys của một user
   */
  async findByUserId(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Truy xuất key mặc định của một user cho một provider cụ thể
   */
  async findDefaultByProvider(userId: string, provider: string) {
    return prisma.apiKey.findFirst({
      where: { userId, provider, isDefault: true },
    });
  },

  /**
   * Cập nhật toàn bộ các key của provider này cho user thành không mặc định
   */
  async unsetDefaultForProvider(userId: string, provider: string) {
    return prisma.apiKey.updateMany({
      where: { userId, provider },
      data: { isDefault: false },
    });
  },

  /**
   * Tạo API Key mới trong DB
   */
  async createApiKey(data: {
    userId: string;
    provider: string;
    label?: string;
    encryptedKey: string;
    iv: string;
    isDefault?: boolean;
  }) {
    return prisma.apiKey.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        label: data.label,
        encryptedKey: data.encryptedKey,
        iv: data.iv,
        isDefault: data.isDefault ?? false,
      },
    });
  },

  /**
   * Tìm và xóa một API Key
   */
  async deleteById(id: string, userId: string) {
    return prisma.apiKey.delete({
      where: { id, userId },
    });
  },
  
  /**
   * Lấy chi tiết key theo id
   */
  async findById(id: string, userId: string) {
    return prisma.apiKey.findFirst({
      where: { id, userId },
    });
  }
};
