/**
 * apiKey.service.ts
 * Chịu trách nhiệm DUY NHẤT: business logic liên quan đến quản lý API Keys.
 * - Validation key sống với provider
 * - Mã hoá key trước khi lưu
 * - Quản lý logic "default key" (tự động set/unset)
 * Không trực tiếp gọi DB — chỉ dùng IApiKeyRepository qua DI.
 */
import type { IApiKeyRepository } from './interfaces/IApiKeyRepository.js';
import type {
  IApiKeyService,
  ApiKeyListItem,
  ApiKeyCreatedResult,
} from './interfaces/IApiKeyService.js';
import { encryptKey } from '../../core/utils/encryption.util.js';
import { maskKey } from '../../core/utils/masking.util.js';
import { validateApiKeyLive } from '../../core/utils/apiKeyValidator.util.js';

export class ApiKeyService implements IApiKeyService {
  constructor(private readonly apiKeyRepo: IApiKeyRepository) {}

  /**
   * Lấy danh sách API keys của user (đã che giấu ký tự nhạy cảm)
   */
  async getUserKeys(userId: string): Promise<ApiKeyListItem[]> {
    const keys = await this.apiKeyRepo.findByUserId(userId);
    return keys.map((k) => ({
      id: k.id,
      provider: k.provider,
      label: k.label,
      maskedKey: maskKey(k.encryptedKey),
      isDefault: k.isDefault,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
    }));
  }

  /**
   * Thêm một API key mới:
   * 1. Validate key sống với provider
   * 2. Mã hoá key bằng AES-256
   * 3. Quản lý logic "default key"
   * 4. Lưu vào DB
   */
  async addKey(
    userId: string,
    provider: string,
    keyPlaintext: string,
    label?: string,
    isDefault: boolean = false,
  ): Promise<ApiKeyCreatedResult> {
    // 1. Kiểm tra API Key có hoạt động không (Live Validation)
    const validation = await validateApiKeyLive(provider, keyPlaintext);
    if (!validation.isValid) {
      throw new Error(validation.error || 'API Key không hợp lệ.');
    }

    // 2. Mã hoá key trước khi lưu
    const { encryptedKey, iv } = encryptKey(keyPlaintext);

    // 3. Quản lý "default key" logic
    if (isDefault) {
      // Nếu user chủ động muốn set làm default → gỡ default của tất cả key cũ cùng provider
      await this.apiKeyRepo.unsetDefaultForProvider(userId, provider);
    } else {
      // Nếu user chưa có key nào của provider này, tự động set làm default
      const existingDefault = await this.apiKeyRepo.findDefaultByProvider(userId, provider);
      if (!existingDefault) {
        isDefault = true;
      }
    }

    // 4. Lưu vào DB
    const newKey = await this.apiKeyRepo.createApiKey({
      userId,
      provider,
      label,
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
  }

  /**
   * Xoá một API key:
   * Nếu key bị xoá là key mặc định, tự động gán key cũ nhất còn lại làm mặc định mới.
   */
  async removeKey(id: string, userId: string): Promise<boolean> {
    const keyToDel = await this.apiKeyRepo.findById(id, userId);
    if (!keyToDel) {
      throw new Error('API Key không tồn tại hoặc bạn không có quyền truy cập.');
    }

    await this.apiKeyRepo.deleteById(id, userId);

    // Nếu xoá key mặc định → tìm key cũ nhất cùng provider gán làm mặc định mới
    if (keyToDel.isDefault) {
      const remainingKeys = await this.apiKeyRepo.findByUserId(userId);
      const sameProviderKeys = remainingKeys.filter((k) => k.provider === keyToDel.provider);
      const nextDefault = sameProviderKeys[sameProviderKeys.length - 1]; // Lấy cũ nhất

      if (nextDefault) {
        await this.apiKeyRepo.unsetDefaultForProvider(userId, keyToDel.provider);
        await this.apiKeyRepo.updateDefault(nextDefault.id);
      }
    }

    return true;
  }
}

