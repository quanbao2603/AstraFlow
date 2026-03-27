/**
 * Các hàm tiện ích dùng để xác thực API Key trực tiếp với provider
 * bằng cách gửi 1 request nhỏ (như lấy danh sách models hoặc check token).
 */
export const validateApiKeyLive = async (provider: string, apiKey: string): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const prov = provider.toLowerCase();

    // 1. OpenAI (Gọi list models)
    if (prov === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) return { isValid: false, error: 'OpenAI API Key không hợp lệ, phân quyền sai hoặc đã hết hạn.' };
      return { isValid: true };
    }

    // 2. Gemini / Google AI Studio (Dùng URL param ?key=)
    if (prov === 'gemini' || prov === 'google') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (!res.ok) return { isValid: false, error: 'Gemini API Key không hợp lệ hoặc đã bị khoá.' };
      return { isValid: true };
    }

    // 3. OpenRouter (Dùng auth/key endpoint)
    if (prov === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) return { isValid: false, error: 'OpenRouter API Key sai tỷ lệ hoặc cấu hình.' };
      return { isValid: true };
    }

    // 4. 9Router hoặc các provider khác
    if (prov === '9router') {
      // Bỏ qua validate sống nếu không có endpoint test rõ ràng, hoặc bạn có thể điền endpoint tương thích OpenAI
      // Ví dụ nếu 9Router là: fetch('https://api.9router.com/v1/models'...)
      return { isValid: true };
    }

    // Mặc định: Cho phép lưu nếu không nhận diện được provider (để tránh block)
    return { isValid: true };
  } catch (error: any) {
    console.error(`[API Key Validator] Lỗi kết nối khi check provider ${provider}:`, error.message);
    return { isValid: false, error: `Lỗi đường truyền hoặc máy chủ ${provider} đang quá tải, không thể xác thực Key lúc này.` };
  }
};
