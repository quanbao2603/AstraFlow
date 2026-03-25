import { Key } from 'lucide-react';

export default function ApiKeyList() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4">Các khóa đã lưu</h3>
      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
        <Key className="w-10 h-10 text-slate-500 mb-3 opacity-50" />
        <p className="text-slate-400 font-medium">Chưa có API Key nào được lưu</p>
        <p className="text-sm text-slate-500 mt-1">Các khóa bạn thêm sẽ xuất hiện tại đây.</p>
      </div>
    </div>
  );
}
