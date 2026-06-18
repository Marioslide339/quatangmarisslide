import React, { ComponentType, FC } from 'react';
import { GiftItem } from '../types';
import { 
  Presentation, 
  Trophy, 
  Cpu, 
  Users, 
  FileText, 
  Gamepad2, 
  DownloadCloud, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Heart
} from 'lucide-react';

const iconMap: Record<string, ComponentType<any>> = {
  Presentation,
  Trophy,
  Cpu,
  Users,
  FileText,
  Gamepad2,
  DownloadCloud,
  Globe
};

interface GiftCardProps {
  item: GiftItem;
  onSelectInteractive: (id: string) => void;
  onExploreDetail: (item: GiftItem) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const GiftCard: FC<GiftCardProps> = ({ item, onSelectInteractive, onExploreDetail, isFavorited = false, onToggleFavorite }) => {
  const IconComponent = iconMap[item.iconName] || Globe;

  return (
    <div 
      id={`gift-card-${item.id}`}
      className="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative Gradient Header Accents */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.bannerGradient}`} />
      
      <div>
        {/* Category & Badge */}
        <div className="flex items-center justify-between mb-4 mt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
            {item.category}
          </span>
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-primary bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100/60 animate-pulse-slow">
                <Sparkles className="w-3 h-3" />
                {item.badge}
              </span>
            )}
            <button
              id={`btn-fav-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(item.id);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-rose-50/70 transition-all cursor-pointer"
              title={isFavorited ? "Bỏ lưu quà tặng" : "Lưu quà tặng yêu thích"}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-125 duration-200 ${isFavorited ? "fill-brand-primary text-brand-primary animate-pulse-slow" : "text-gray-300"}`} />
            </button>
          </div>
        </div>

        {/* Title & Icon Box */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${item.bannerGradient} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-115 group-hover:rotate-6 transition-all duration-300`}>
            <IconComponent className="w-8 h-8 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-brand-dark group-hover:text-brand-primary transition-colors leading-tight">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed mb-6 text-justify line-clamp-3">
          {item.description}
        </p>
      </div>

      {/* Action footer */}
      <div className="pt-4 border-t border-gray-50 mt-auto">
        {item.isInteractive ? (
          <button
            id={`btn-action-${item.id}`}
            onClick={() => onSelectInteractive(item.id)}
            className="w-full py-2.5 bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold rounded-xl inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            Chơi Thử Ngay
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <a
            id={`link-action-${item.id}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 text-xs font-bold rounded-xl inline-flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              (item.id === "1" || item.id === "7" || item.id === "8")
                ? "bg-brand-primary hover:bg-rose-600 text-white" 
                : "bg-brand-lightrose text-brand-primary hover:bg-brand-primary hover:text-white"
            }`}
          >
            {(item.id === "1" || item.id === "7" || item.id === "8") ? "Tải Về" : "Khám Phá"}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default GiftCard;
