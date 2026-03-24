import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SocialLogin } from './SocialLogin';

interface LoginFormProps {
  onSwitchView: () => void;
}

export function LoginForm({ onSwitchView }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Chào mừng trở lại
        </h2>
        <p className="text-slate-400 text-sm">
          Đăng nhập để tiếp tục hành trình trên AstraFlow
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
            <Mail size={18} />
          </div>
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            required
            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500/50" />
            <span className="text-xs text-slate-400">Ghi nhớ tôi</span>
          </label>
          <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Đăng nhập
        </button>
      </form>

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-slate-400">
        Bạn chưa có tài khoản?{' '}
        <button onClick={onSwitchView} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Đăng ký ngay
        </button>
      </p>
    </>
  );
}
