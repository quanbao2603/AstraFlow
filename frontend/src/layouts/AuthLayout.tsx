import type { ReactNode } from 'react';
import loginImg from '../assets/login.png';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      {/* Left Column - Image Display (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 mix-blend-overlay z-10" />
        <img 
          src={loginImg} 
          alt="AstraFlow Dimension" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-16 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
          <h2 className="text-4xl font-bold text-white mb-4">AstraFlow</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
            Khơi nguồn linh cảm, dệt nên những câu chuyện vô tận. Nơi trí tuệ nhân tạo hòa quyện cùng trí tưởng tượng của bạn.
          </p>
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Abstract glowing blobs for right side background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 bg-slate-900/40 p-8 sm:p-10 rounded-3xl backdrop-blur-2xl border border-white/5 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
