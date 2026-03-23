import logo from '../../../assets/logo.png';

export default function HeaderLogo() {
    return (
        <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 group">
                <img 
                    src={logo} 
                    alt="AstraFlow Logo" 
                    className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.8)] transition-all duration-300" 
                />
                <span className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 drop-shadow-sm">
                    AstraFlow
                </span>
            </a>
        </div>
    );
}
