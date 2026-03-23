import { FOOTER_LINKS } from '../../../config/navigation';
import { FaDiscord, FaFacebook, FaYoutube } from "react-icons/fa6";

type IconMap = {
    [key: string]: React.ReactNode;
};

// BẢN ĐỒ MAPPING: Ánh xạ 'label' trong config với Icon Component
// Điều này giúp tách biệt logic hiển thị và dữ liệu
const iconMap: IconMap = {
    Discord: <FaDiscord size={24} />,
    Facebook: <FaFacebook size={24} />,
    YouTube: <FaYoutube size={24} />,
};

export default function FooterSocials() {
    return (
        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <h3 className="text-sm font-semibold leading-6 text-white tracking-wider">Kết nối</h3>

            {/* Hàng Icon lấp lánh */}
            <div className="flex items-center space-x-6 mt-4">
                {FOOTER_LINKS.socials.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        target="_blank" // Mở tab mới
                        rel="noopener noreferrer" // Bảo mật
                        aria-label={item.label} // Hỗ trợ người khiếm thị
                        className="text-slate-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    >
                        {/* Lấy icon tương ứng từ bản đồ mapping, nếu không thấy thì không hiện */}
                        {iconMap[item.label] || null}
                    </a>
                ))}
            </div>
        </div>
    );
}
