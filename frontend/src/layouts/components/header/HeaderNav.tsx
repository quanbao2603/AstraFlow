import { PUBLIC_NAV_LINKS } from '../../../config/navigation';

export default function HeaderNav() {
    return (
        <div className="hidden md:flex items-center space-x-8">
            {PUBLIC_NAV_LINKS.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300"
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
}
