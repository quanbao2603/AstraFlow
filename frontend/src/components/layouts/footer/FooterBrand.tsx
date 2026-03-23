export default function FooterBrand() {
    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            {/* Logo / Tên thương hiệu */}
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                AstraFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Studio</span>
            </span>
            
            {/* Slogan nghệ thuật */}
            <p className="mt-3 text-sm leading-relaxed text-slate-400 italic font-light">
                "Nơi biến những giấc mơ hoang đường thành sự thật."
            </p>

            {/* Copyright chuẩn form */}
            <p className="mt-6 text-xs text-slate-600 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} AstraFlow. All rights reserved.
            </p>
        </div>
    );
}
