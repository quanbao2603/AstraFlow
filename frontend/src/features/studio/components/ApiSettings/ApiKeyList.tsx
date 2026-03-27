import { Key, Trash2 } from 'lucide-react';
import { type ApiKey, ApiKeyService } from '../../../../services/apiKey.service';

interface Props {
  keys: ApiKey[];
  loading: boolean;
  onReload: () => void;
}

export default function ApiKeyList({ keys, loading, onReload }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá khóa này không? Thao tác này có thể gián đoạn các thiết lập liên kết.')) return;
    try {
      await ApiKeyService.deleteKey(id);
      onReload();
    } catch (error: any) {
      alert(error.message || 'Xóa thất bại');
    }
  };

  const formatProviderName = (provider: string) => {
    const map: Record<string, string> = {
      'openai': 'OpenAI',
      'gemini': 'Google (Gemini)',
      'openrouter': 'OpenRouter',
      '9router': '9Router'
    };
    return map[provider] || provider;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4">Các khóa đã lưu</h3>
      
      {loading ? (
        <div className="py-10 text-center text-slate-400 animate-pulse">Đang tải danh sách khóa...</div>
      ) : keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
          <Key className="w-10 h-10 text-slate-500 mb-3 opacity-50" />
          <p className="text-slate-400 font-medium">Chưa có API Key nào được lưu</p>
          <p className="text-sm text-slate-500 mt-1">Các khóa bạn thêm sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="flex flex-row items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 transition-colors hover:border-slate-600">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{k.label || 'Không tên'}</p>
                  {k.isDefault && (
                    <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">Mặc định</span>
                  )}
                </div>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="capitalize">{formatProviderName(k.provider)}</span>
                  <span className="text-slate-500 mx-1">•</span>
                  <span className="font-mono text-slate-500">{k.maskedKey}</span>
                </p>
              </div>
              <button 
                onClick={() => handleDelete(k.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Xóa khóa này"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
