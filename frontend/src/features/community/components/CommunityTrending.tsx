import { Award, Info } from 'lucide-react';

export default function CommunityTrending() {
  return (
    <div className="w-full md:w-72 flex flex-col gap-5">
      {/* Welcome/Info Card */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
          <Info size={16} className="text-violet-400" />
          Chào mừng bạn!
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          AstraFlow Community là nơi chia sẻ kiến thức, kinh nghiệm và những tác phẩm sáng tạo từ AI. Hãy cùng nhau xây dựng một cộng đồng văn minh và đầy cảm hứng.
        </p>
      </div>

      {/* Rules Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-indigo-950/50 rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
          <Award size={16} className="text-amber-400" />
          Quy tắc Cộng đồng
        </h3>
        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
          <li>Tôn trọng người dùng khác.</li>
          <li>Sử dụng đúng kênh đính kèm.</li>
          <li>Không Spam liên kết độc hại.</li>
          <li>Tự do sáng tác lành mạnh.</li>
        </ol>
      </div>
    </div>
  );
}
