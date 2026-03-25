import { Users2 } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 max-w-6xl animate-in fade-in duration-500">
      <div className="text-center py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
          <Users2 className="w-8 h-8 text-purple-400 animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Cộng đồng AstraFlow</h1>
        <p className="text-slate-400 max-w-md">
          Chức năng Cộng đồng đang được chuẩn bị. Nơi kết nối những tác giả và độc giả yêu thích truyện AI!
        </p>
      </div>
    </div>
  );
}
