import { Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth/AuthContext';
import UserDropdown from './UserDropdown';
import { ROUTES } from '../../../config/routes';

export default function HeaderAuth() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <UserDropdown />;
    }

    return (
        <div className="flex items-center">
            <Link
                to={ROUTES.PUBLIC.AUTH}
                className="px-5 py-2 text-sm font-semibold text-white bg-violet-600/80 hover:bg-violet-500 rounded-xl backdrop-blur-sm border border-violet-500/50 shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)] transition-all transform hover:scale-105"
            >
                Đăng nhập để viết
            </Link>
        </div>
    );
}
