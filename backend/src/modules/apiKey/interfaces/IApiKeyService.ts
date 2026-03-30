/**
 * IApiKeyService.ts
 * Interface định nghĩa contract cho business logic của ApiKey.
 * Controller chỉ phụ thuộc vào interface này, không phụ thuộc vào implementation cụ thể.
 */

export interface ApiKeyListItem {
  id: string;
  provider: string;
  label: string | null;
  maskedKey: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyCreatedResult {
  id: string;
  provider: string;
  label: string | null;
  isDefault: boolean;
  createdAt: Date;
}

export interface IApiKeyService {
  getUserKeys(userId: string): Promise<ApiKeyListItem[]>;
  addKey(
    userId: string,
    provider: string,
    keyPlaintext: string,
    label?: string,
    isDefault?: boolean
  ): Promise<ApiKeyCreatedResult>;
  removeKey(id: string, userId: string): Promise<boolean>;
  getDefaultKeyPlaintext(userId: string, provider?: string): Promise<{ key: string, provider: string } | null>;
}
