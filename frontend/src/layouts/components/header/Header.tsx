import HeaderLogo from './HeaderLogo';
import HeaderNav from './HeaderNav';
import HeaderAuth from './HeaderAuth';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50">
            {/* Lớp kính mờ vũ trụ */}
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 bg-slate-950/40 backdrop-blur-md border-b border-white/10 mt-4 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <HeaderLogo />
                <HeaderNav />
                <HeaderAuth />
            </nav>
        </header>
    );
}