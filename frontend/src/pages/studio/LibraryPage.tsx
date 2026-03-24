export default function LibraryPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Thư viện Truyện</h2>
        <div className="flex gap-4">
          <input 
            type="text"
            placeholder="Tìm kiếm..."
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Placeholder cards */}
        {[1,2,3].map(i => (
          <div key={i} className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/50 transition-colors cursor-pointer">
            <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-500 relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-violet-400 mb-1 block">Bản nháp</span>
              <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">Truyện Mới Chưa Đặt Tên {i}</h3>
              <p className="text-sm text-slate-500">Cập nhật 2 giờ trước</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
