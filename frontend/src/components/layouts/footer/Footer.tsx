import FooterBrand from './FooterBrand';
import FooterLinks from './FooterLinks';
import FooterSocials from './FooterSocials';

export default function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-slate-950/40 backdrop-blur-xl mt-auto z-10">
            <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Brand / Logo */}
                <FooterBrand />

                {/* Khu vực giữa và phải: Links & Socials */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12 text-center md:text-left">
                    <FooterLinks />
                    <FooterSocials />
                </div>
            </div>
        </footer>
    );
}