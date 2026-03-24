export interface IApiKey {
  id: string;
  name: string;
  agent: string;
  role: string;
  key: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApiKeyFormData {
  agent: string;
  role: string;
  name: string;
  key: string;
}
