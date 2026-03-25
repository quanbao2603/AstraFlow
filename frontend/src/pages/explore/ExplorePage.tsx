import { Compass } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 max-w-6xl animate-in fade-in duration-500">
      <div className="text-center py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
          <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Khám phá vũ trụ truyện</h1>
        <p className="text-slate-400 max-w-md">
          Tính năng Khám phá (Explore) đang được phát triển. Bạn sẽ sớm được duyệt hàng ngàn câu chuyện AI hấp dẫn tại đây!
        </p>
      </div>
    </div>
  );
}
