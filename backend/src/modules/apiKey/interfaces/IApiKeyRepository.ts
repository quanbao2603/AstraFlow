/**
 * IApiKeyRepository.ts
 * Interface định nghĩa contract cho tầng data access của ApiKey.
 * Mọi implementation (Prisma, mock cho test...) phải tuân thủ interface này.
 */

export interface CreateApiKeyData {
  userId: string;
  provider: string;
  label?: string | undefined;
  encryptedKey: string;
  iv: string;
  isDefault?: boolean;
}

export interface ApiKeyRecord {
  id: string;
  userId: string;
  provider: string;
  label: string | null;
  encryptedKey: string;
  iv: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiKeyRepository {
  findByUserId(userId: string): Promise<ApiKeyRecord[]>;
  findDefaultByProvider(userId: string, provider: string): Promise<ApiKeyRecord | null>;
  findById(id: string, userId: string): Promise<ApiKeyRecord | null>;
  createApiKey(data: CreateApiKeyData): Promise<ApiKeyRecord>;
  updateDefault(id: string): Promise<void>;
  unsetDefaultForProvider(userId: string, provider: string): Promise<void>;
  deleteById(id: string, userId: string): Promise<void>;
}
