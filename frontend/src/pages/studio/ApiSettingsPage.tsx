import ApiKeyForm from '../../features/studio/components/ApiSettings/ApiKeyForm';
import ApiKeyList from '../../features/studio/components/ApiSettings/ApiKeyList';

export default function ApiSettingsPage() {
  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Cấu hình API Key</h2>
        <p className="text-slate-400">
          Thiết lập "bộ não AI" riêng cho dự án của bạn. Quản lý nhiều khóa API khác nhau cho từng cấu hình hoặc nền tảng chuyên biệt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ApiKeyForm />
        <ApiKeyList />
      </div>
    </div>
  );
}


