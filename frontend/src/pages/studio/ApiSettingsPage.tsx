export default function ApiSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">Cấu hình API Key</h2>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <label className="block text-sm font-medium text-slate-300 mb-2">Google Gemini API Key</label>
        <div className="flex gap-3">
          <input 
            type="password" 
            placeholder="AIzaSy..." 
            className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
          />
          <button className="px-6 py-2 rounded-xl bg-violet-600/80 hover:bg-violet-500 text-white font-medium transition-colors">
            Lưu Key
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-500">Khóa API được lưu trữ cục bộ trên trình duyệt của bạn và không bao giờ được gửi về máy chủ của chúng tôi.</p>
      </div>
    </div>
  );
}
