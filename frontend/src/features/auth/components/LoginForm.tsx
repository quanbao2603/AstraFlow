import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SocialLogin } from './SocialLogin';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../../../config/routes';

interface LoginFormProps {
  onSwitchView: () => void;
}

export function LoginForm({ onSwitchView }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    formData,
    showPassword,
    togglePasswordVisibility,
    handleChange,
    isSubmitting,
    setSubmitting
  } = useAuthForm({ email: '', password: '', rememberMe: false });

  // Get the location they were trying to go to, or default to studio
  const from = location.state?.from?.pathname || ROUTES.STUDIO.ROOT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Giả lập gọi API login
      console.log('Login attempt:', formData);
      await new Promise(resolve => setTimeout(resolve, 800)); // Delay giả lập
      
      // Giả lập dữ liệu user thành công
      const mockUser = {
        id: 'u-1',
        email: formData.email,
        name: formData.email.split('@')[0],
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      login(mockToken, mockUser);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setSubmitting(false);
    }
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

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500/50" 
            />
            <span className="text-xs text-slate-400">Ghi nhớ tôi</span>
          </label>
          <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
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

