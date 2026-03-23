// src/layouts/PublicLayout.tsx
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex flex-col font-sans overflow-hidden text-white">

            {/* 1. LỚP NỀN VIDEO VŨ TRỤ CHÍNH XÁC */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed top-0 left-0 w-full h-full object-cover -z-20"
            >
                {/* Đường dẫn này giờ đã khớp 100% với public/background.mp4 của bạn */}
                <source src="/background.mp4" type="video/mp4" />
            </video>

            {/* 2. LỚP OVERLAY (Phủ đen mờ 60% để video không làm chói mắt, giúp Header kính mờ nổi bật) */}
            <div className="fixed top-0 left-0 w-full h-full bg-slate-950/60 -z-10"></div>

            {/* 3. LẮP RÁP HEADER */}
            <Header />

            {/* 4. NỘI DUNG CHÍNH (Lỗ hổng để nhét các trang khác nhau vào) */}
            <main className="flex-grow pt-32 pb-16 relative z-0">
                {children}
            </main>

            {/* 5. LẮP RÁP FOOTER */}
            <Footer />
        </div>
    );
}