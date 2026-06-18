import { Award, Phone, CheckCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="brand-footer" className="bg-slate-900 text-gray-300 pt-16 pb-12 border-t-4 border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core detailed layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-gray-800">
          
          {/* Logo & Promo text */}
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-orange-500 p-0.5 flex items-center justify-center font-display font-black text-white text-lg">
                M
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight leading-none block">MARIS SLIDE</span>
                <span className="text-[11px] text-brand-primary font-semibold block mt-1">Tiên phong công nghệ giáo dục</span>
              </div>
            </div>
            
            {/* The requested advertisement description */}
            <p className="text-gray-200 text-sm leading-relaxed font-normal bg-gray-800/40 p-4 rounded-2xl border border-gray-800/80">
              <strong>Maris Slide</strong>. Đơn vị chuyên đào tạo và thiết kế bài giảng ứng dụng AI, học liệu số, Viết sáng kiến kinh nghiệm đạt giải cao các cấp. 
              <span className="block mt-2 font-semibold text-brand-primary flex items-center gap-1">
                ZALO HỖ TRỢ: 0396.581.283
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-full text-brand-primary font-semibold">
                <Award className="w-3.5 h-3.5" />
                Thiết Kế Độc Quyền
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 rounded-full text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Ứng dụng AI Hàng Đầu
              </span>
            </div>
          </div>

          {/* Quick links & contact details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase border-l-2 border-brand-primary pl-2.5">
              Liên Hệ Trực Tiếp
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-primary shrink-0" />
                <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-dotted decoration-brand-primary">
                  0396.581.283 (Zalo Trợ Giảng)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="text-gray-400">marioslide.animation@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">Hỗ trợ giảng viên và nhà trường trên Toàn quốc 24/7</span>
              </li>
            </ul>
          </div>

          {/* Business Hours & QR info */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-white text-base tracking-wider uppercase border-l-2 border-brand-primary pl-2.5">
              Cam Kết Từ Maris
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Chúng tôi cam kết bảo mật 100% học liệu số độc quyền, hỗ trợ cập nhật trọn đời cho các thầy cô học viên tham gia khóa học chuyên sâu.
            </p>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-gray-700/55 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 text-slate-900 font-black text-xl select-none">
                QR
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">Quét kết nối nhanh Zalo</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Học tập - Sáng tạo - Đột phá</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {currentYear} Maris Slide. Bản quyền thuộc về đội ngũ sáng tạo nội dung giáo dục Maris Slide.</p>
          <div className="flex gap-4">
            <a href="https://khoahoccongnghe2-marisslide.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
              Tìm hiểu khóa học
            </a>
            <span>•</span>
            <span className="text-gray-600">Tiên phong công nghệ học vụ số</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
