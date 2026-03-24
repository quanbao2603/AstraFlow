export const API_AGENTS = [
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'openai', name: 'OpenAI (GPT-4/3.5)' },
  { id: 'claude', name: 'Anthropic Claude' },
  { id: 'xai', name: 'xAI (Grok)' },
] as const;

export const API_ROLES = [
  { id: 'writer', name: 'Viết chính (Writer)' },
  { id: 'editor', name: 'Biên tập & Sửa lỗi (Editor)' },
  { id: 'outliner', name: 'Lên dàn ý (Outliner)' },
  { id: 'world-builder', name: 'Xây dựng thế giới' },
] as const;

export const getAgentName = (id: string): string => {
  const agent = API_AGENTS.find(a => a.id === id);
  return agent ? agent.name : id;
};

export const getRoleName = (id: string): string => {
  const role = API_ROLES.find(r => r.id === id);
  return role ? role.name : id;
};
