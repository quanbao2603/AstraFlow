import { FOOTER_LINKS } from '../../../config/navigation';

export default function FooterLinks() {
    return (
        <div className="w-full md:w-auto">
            <h3 className="text-sm font-semibold leading-6 text-white tracking-wider">Nền tảng</h3>
            <ul role="list" className="mt-4 space-y-3">
                {FOOTER_LINKS.about.map((item) => (
                    <li key={item.label}>
                        <a href={item.href} className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">{item.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
