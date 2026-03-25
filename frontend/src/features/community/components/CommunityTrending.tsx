import { TrendingUp, Award } from 'lucide-react';

const TRENDS = [
  { tag: '#sang_tac_AI', count: 142 },
  { tag: '#prompt_dark_fantasy', count: 89 },
  { tag: '#cuoc_chien_bau_troi', count: 64 },
  { tag: '#anime_style', count: 57 },
];

export default function CommunityTrending() {
  return (
    <div className="w-full md:w-72 flex flex-col gap-5">
      {/* Trends */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
          <TrendingUp size={16} className="text-violet-400" />
          Xu Hướng Có Thể Bạn Thích
        </h3>
        <div className="flex flex-col gap-3">
          {TRENDS.map((t, idx) => (
            <div key={idx} className="flex flex-col cursor-pointer group">
              <span className="text-slate-200 text-sm font-medium group-hover:underline group-hover:text-violet-400 transition-colors">
                {t.tag}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">{t.count} Bài viết</span>
            </div>
          ))}
        </div>
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
