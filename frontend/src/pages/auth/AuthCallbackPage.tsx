import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase SDK tự động parse hash fragment (#access_token=...) 
        // và thiết lập session trong localStorage.
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data.session) {
          console.log('[AuthCallback] Session established:', data.session.user.email);
          navigate('/', { replace: true });
        } else {
          // Nếu không có session ngay lập tức, có thể SDK đang xử lý, 
          // nhưng thường thì getSession() sẽ trả về sau khi parse xong.
          // Thêm một fallback nhỏ hoặc chờ onAuthStateChange nếu cần.
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              subscription.unsubscribe();
              navigate('/', { replace: true });
            }
          });
          
          // Timeout sau 5s nếu không có gì xảy ra
          setTimeout(() => {
            subscription.unsubscribe();
            if (window.location.hash || window.location.search) {
               // Có thể có lỗi hoặc token ko hợp lệ
               navigate('/auth?error=timeout', { replace: true });
            }
          }, 5000);
        }
      } catch (err) {
        console.error('[AuthCallback] Error:', err);
        navigate('/auth?error=callback_failed', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium animate-pulse">Đang hoàn tất đăng nhập...</p>
      <div className="mt-8 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl max-w-sm text-center">
        <p className="text-sm text-gray-400">
          Hệ thống đang thiết lập môi trường làm việc của bạn.
        </p>
      </div>
    </div>
  );
}
