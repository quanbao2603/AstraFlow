export default function ImportStoryPage() {
  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2 text-center">Import Truyện Vào Trình Đọc</h2>
      <p className="text-slate-400 text-center mb-8">Hỗ trợ các định dạng .txt, .epub. Đọc và phân tích lore siêu tốc cùng AI.</p>
      
      <div className="border-2 border-dashed border-white/20 hover:border-violet-500/50 rounded-3xl p-16 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm transition-colors cursor-pointer group">
        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <svg className="w-10 h-10 text-slate-300 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Kéo & Thả file vào đây</h3>
        <p className="text-slate-500">hoặc click để chọn file từ máy tính duyệt</p>
      </div>
    </div>
  );
}
