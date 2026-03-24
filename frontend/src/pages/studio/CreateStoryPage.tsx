export default function CreateStoryPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center mb-8 shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Khởi tạo Tác phẩm mới</h2>
      <p className="text-slate-400 max-w-lg mb-8 text-lg">
        Bắt đầu chặng đường kể chuyện của bạn. Hãy nhập tên truyện để hệ thống tạo không gian làm việc.
      </p>
      
      <div className="w-full max-w-md flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Nhập tựa đề truyện..." 
          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-lg focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 text-center"
        />
        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-lg transition-transform transform hover:scale-[1.02]">
          Bắt đầu Viết
        </button>
      </div>
    </div>
  );
}
