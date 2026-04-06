/**
 * apiKeyValidator.util.ts
 * Xác thực API Key trực tiếp với provider bằng cách gửi 1 request nhỏ
 * (lấy danh sách models hoặc check auth token).
 * 
 * Providers được hỗ trợ: openai | gemini | openrouter | 9router
 */
export const validateApiKeyLive = async (
  provider: string,
  apiKey: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const prov = provider.toLowerCase();

    // ── 1. OpenAI ────────────────────────────────────────────────────────────
    if (prov === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        return {
          isValid: false,
          error: 'OpenAI API Key không hợp lệ, phân quyền sai hoặc đã hết hạn.',
        };
      }
      return { isValid: true };
    }

    // ── 2. Gemini / Google AI Studio ─────────────────────────────────────────
    if (prov === 'gemini' || prov === 'google') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      if (!res.ok) {
        return {
          isValid: false,
          error: 'Gemini API Key không hợp lệ hoặc đã bị khoá.',
        };
      }
      return { isValid: true };
    }

    // ── 3. OpenRouter ─────────────────────────────────────────────────────────
    if (prov === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        return {
          isValid: false,
          error: 'OpenRouter API Key không hợp lệ hoặc không đủ credit.',
        };
      }
      // Kiểm tra thêm response body — OpenRouter trả về { data: { label, usage, is_free_tier, ... } }
      const body = await res.json();
      if (!body?.data) {
        return {
          isValid: false,
          error: 'OpenRouter phản hồi không hợp lệ. Vui lòng thử lại.',
        };
      }
      return { isValid: true };
    }

    // ── 4. 9Router (OpenAI-Compatible Local/Remote) ───────────────────────────
    if (prov === '9router') {
      const nineRouterUrl = process.env.NINE_ROUTER_URL || 'http://localhost:20128/v1';
      try {
        const res = await fetch(`${nineRouterUrl}/models`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          // Timeout ngắn để không block quá lâu khi server local chưa chạy
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) {
          return {
            isValid: false,
            error: `Không thể kết nối 9Router tại ${nineRouterUrl}. Kiểm tra server có đang chạy không.`,
          };
        }
        return { isValid: true };
      } catch (e: any) {
        // Nếu server local chưa chạy → warn nhưng vẫn cho phép lưu key
        console.warn(`[ApiKeyValidator] 9Router server tại ${nineRouterUrl} chưa khởi động. Key được lưu nhưng chưa xác thực.`);
        return {
          isValid: true, // Cho phép lưu, không block user
        };
      }
    }

    // ── 5. Mặc định: Provider chưa được nhận diện ─────────────────────────────
    console.warn(`[ApiKeyValidator] Provider không xác định: "${provider}". Bỏ qua validation.`);
    return { isValid: true };
  } catch (error: any) {
    console.error(
      `[ApiKeyValidator] Lỗi kết nối khi check provider ${provider}:`,
      error.message
    );
    return {
      isValid: false,
      error: `Lỗi đường truyền hoặc máy chủ ${provider} đang quá tải, không thể xác thực Key lúc này.`,
    };
  }
};
