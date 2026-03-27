import { useState, useCallback, useEffect } from 'react';
import ApiKeyForm from '../../features/studio/components/ApiSettings/ApiKeyForm';
import ApiKeyList from '../../features/studio/components/ApiSettings/ApiKeyList';
import { ApiKeyService, type ApiKey } from '../../services/apiKey.service';

export default function ApiSettingsPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiKeyService.getKeys();
      setKeys(data);
    } catch (error) {
      console.error("Failed to load keys", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Cấu hình API Key</h2>
        <p className="text-slate-400">
          Thiết lập "bộ não AI" riêng cho dự án của bạn. Quản lý nhiều khóa API khác nhau cho từng cấu hình hoặc nền tảng chuyên biệt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Pass loadKeys as callback on successful insert */}
        <ApiKeyForm onSuccess={loadKeys} />
        
        {/* Pass state arrays to the list component */}
        <ApiKeyList keys={keys} loading={loading} onReload={loadKeys} />
      </div>
    </div>
  );
}
