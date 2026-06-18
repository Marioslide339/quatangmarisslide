import { useState } from 'react';
import { Menu, X, Sparkles, GraduationCap, Phone, ExternalLink, HelpCircle, Palette } from 'lucide-react';

interface HeaderProps {
  onAiConsultationClick: () => void;
  onScrollToGifts: () => void;
}

export default function Header({ onAiConsultationClick, onScrollToGifts }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-primary to-orange-500 p-0.5 shadow-md flex items-center justify-center animate-pulse-slow">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-display font-black text-brand-primary text-xl">
                MS
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-xl text-brand-primary tracking-tight leading-none">Maris Slide</span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mt-1">
                Tiên Phong Công Nghệ Giáo Dục Số
              </p>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-medium">
            <button
              id="nav-home"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-brand-lightrose text-brand-primary font-bold transition-all text-xs lg:text-sm"
            >
              Trang Chủ
            </button>
            
            <button
              id="nav-gifts"
              onClick={onScrollToGifts}
              className="px-3 py-2 text-gray-600 hover:text-brand-primary hover:bg-neutral-50 rounded-xl transition-all text-xs lg:text-sm"
            >
              Quà Tặng Công Nghệ
            </button>

            <a
              id="nav-course-link"
              href="https://khoahoccongnghe2-marisslide.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-gray-600 hover:text-brand-primary hover:bg-neutral-50 rounded-xl inline-flex items-center gap-1 transition-all text-xs lg:text-sm"
            >
              <GraduationCap className="w-4 h-4 text-brand-primary" />
              Khóa Học Công Nghệ
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            <a
              id="nav-design-link"
              href="https://dichvuthietke-marisslide.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-gray-600 hover:text-brand-primary hover:bg-neutral-50 rounded-xl inline-flex items-center gap-1 transition-all text-xs lg:text-sm"
            >
              <Palette className="w-4 h-4 text-brand-primary" />
              Dịch Vụ Thiết Kế
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            <button
              id="nav-ai-consult"
              onClick={onAiConsultationClick}
              className="px-3 py-2 text-gray-600 hover:text-brand-primary hover:bg-neutral-50 rounded-xl inline-flex items-center gap-1 transition-all text-xs lg:text-sm"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Trợ lý AI Tư Vấn
            </button>
          </nav>

          {/* Call-to-action button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              id="header-zalo-btn"
              href="https://zalo.me/0396581283"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-5 rounded-full bg-gradient-to-r from-brand-primary to-rose-600 hover:from-rose-600 hover:to-brand-primary text-white font-semibold text-xs lg:text-sm shadow-md hover:shadow-lg transform active:scale-95 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              Zalo Trợ Giảng: 0396.581.283
            </a>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-brand-primary hover:bg-neutral-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-b border-gray-100 bg-white/98 backdrop-blur-lg transition-all animate-fades-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button
              id="mobile-nav-home"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-brand-lightrose text-brand-primary font-bold text-sm"
            >
              Trang Chủ
            </button>
            <button
              id="mobile-nav-gifts"
              onClick={() => {
                onScrollToGifts();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-neutral-50 hover:text-brand-primary text-sm font-medium"
            >
              Quà Tặng Công Nghệ
            </button>
            <a
              id="mobile-nav-course"
              href="https://khoahoccongnghe2-marisslide.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-neutral-50 hover:text-brand-primary text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-primary" />
                Khóa Học Công Nghệ (Maris Slide)
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              id="mobile-nav-design"
              href="https://dichvuthietke-marisslide.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-neutral-50 hover:text-brand-primary text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-primary" />
                Dịch Vụ Thiết Kế Slide
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <button
              id="mobile-nav-ai"
              onClick={() => {
                onAiConsultationClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-neutral-50 hover:text-brand-primary text-sm font-medium"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Trợ lý AI Tư Vấn Học Tập
            </button>
            
            <div className="pt-4 border-t border-gray-100 mt-2">
              <a
                id="mobile-zalo-call"
                href="https://zalo.me/0396581283"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-rose-600 text-white font-bold text-sm shadow-md"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                Zalo Trợ Giảng: 0396.581.283
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
