import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SocialLogin } from './SocialLogin';
import { useAuthForm } from '../hooks/useAuthForm';

interface RegisterFormProps {
  onSwitchView: () => void;
}

export function RegisterForm({ onSwitchView }: RegisterFormProps) {
  const {
    formData,
    showPassword,
    togglePasswordVisibility,
    handleChange
  } = useAuthForm({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', formData);
  };

  return (
    <>
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Tạo tài khoản mới
        </h2>
        <p className="text-slate-400 text-sm">
          Gia nhập AstraFlow và bắt đầu hành trình sáng tạo
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
            <Mail size={18} />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
            className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Đăng ký miễn phí
        </button>
      </form>

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-slate-400">
        Bạn đã có tài khoản?{' '}
        <button onClick={onSwitchView} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Đăng nhập ngay
        </button>
      </p>
    </>
  );
}

