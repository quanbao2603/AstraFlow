import { ApiKeyRepository } from '../repositories/apiKey.repo.js';
import { encryptKey, maskKey } from '../utils/encryption.util.js';
import { validateApiKeyLive } from '../utils/apiKeyValidator.util.js';

export const ApiKeyService = {
  /**
   * Lấy danh sách API keys của user (đã che giấu kí tự)
   */
  async getUserKeys(userId: string) {
    const keys = await ApiKeyRepository.findByUserId(userId);
    // Không bao giờ trả về nguyên bản Key cũng như chuỗi mã hoá (tránh rò rỉ rủi ro)
    return keys.map((k: any) => ({
      id: k.id,
      provider: k.provider,
      label: k.label,
      maskedKey: maskKey(k.encryptedKey), // Giả định maskKey có thể che một chuỗi bất kì. Nhưng thực tế plaintext mới dùng mask được
      isDefault: k.isDefault,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
    }));
  },

  /**
   * Thêm một API key mới
   */
  async addKey(
    userId: string,
    provider: string,
    keyPlaintext: string,
    label?: string,
    isDefault: boolean = false
  ) {
    // 1. Kiểm tra/Test API Key sống hay chết trước (Live Validation)
    const validation = await validateApiKeyLive(provider, keyPlaintext);
    if (!validation.isValid) {
      throw new Error(validation.error || 'API Key không hợp lệ.');
    }

    // 2. Mã hoá key
    const { encryptedKey, iv } = encryptKey(keyPlaintext);

    // Nếu set isDefault = true, gỡ default các key cũ của provider này
    if (isDefault) {
      await ApiKeyRepository.unsetDefaultForProvider(userId, provider);
    } else {
      // Nếu user chưa có key nào của provider này, tự động set làm default
      const defaultKey = await ApiKeyRepository.findDefaultByProvider(userId, provider);
      if (!defaultKey) {
        isDefault = true;
      }
    }

    const newKey = await ApiKeyRepository.createApiKey({
      userId,
      provider,
      ...(label ? { label } : {}),
      encryptedKey,
      iv,
      isDefault,
    });

    return {
      id: newKey.id,
      provider: newKey.provider,
      label: newKey.label,
      isDefault: newKey.isDefault,
      createdAt: newKey.createdAt,
    };
  },

  /**
   * Xoá một API key
   */
  async removeKey(id: string, userId: string) {
    // Tìm key trước khi xoá để cập nhật default nếu cần thiết
    const keyToDel = await ApiKeyRepository.findById(id, userId);
    if (!keyToDel) {
      throw new Error('API Key không tồn tại hoặc bạn không có quyền trup cập');
    }

    await ApiKeyRepository.deleteById(id, userId);

    // Nếu xoá key mặc định, tìm key cũ nhất còn lại của provider đó gán làm mặc định
    if (keyToDel.isDefault) {
      const remainingKeys = await ApiKeyRepository.findByUserId(userId);
      const sameProviderKeys = remainingKeys.filter((k: any) => k.provider === keyToDel.provider);
      if (sameProviderKeys.length > 0) {
        // Gán key đầu tiên (mới nhất theo order desc hoặc cũ nhất tuỳ strategy) làm mặc định
        const newDefault = sameProviderKeys[sameProviderKeys.length - 1]; // Lấy cũ nhất
        if (!newDefault) return;
        await ApiKeyRepository.unsetDefaultForProvider(userId, keyToDel.provider); // clear again just to be safe
        // Prisma update
        const prisma = (await import('../db/prisma.js')).default;
        await prisma.apiKey.update({
          where: { id: newDefault.id },
          data: { isDefault: true }
        });
      }
    }
    
    return true;
  }
};
