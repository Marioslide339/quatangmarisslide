import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Phone, 
  GraduationCap, 
  ExternalLink, 
  Send, 
  Award, 
  CheckCircle, 
  Heart, 
  Lightbulb, 
  X,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import GiftCard from './components/GiftCard';
import { giftItems, reviewsData } from './data';
import { GiftItem, ReviewMessage } from './types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  
  // AI Chat states
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'ai' | 'user', text: string }>>([
    { sender: 'ai', text: "Xin chào quý thầy cô! Em là Trợ lý AI của Maris Slide. Thầy cô cần tư vấn về thiết kế học liệu số, PowerPoint tương tác hay bí quyết soạn Sáng kiến kinh nghiệm (SKKN) đạt giải cao ạ?" }
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  // Modals & Details
  const [exploreItem, setExploreItem] = useState<GiftItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('maris_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sound Config (shares storage with MemoryGame)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('maris_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Reviews state (static + user submitted)
  const [reviews, setReviews] = useState<ReviewMessage[]>(() => {
    const saved = localStorage.getItem('maris_submitted_reviews');
    const parsed = saved ? JSON.parse(saved) : [];
    return [...parsed, ...reviewsData];
  });

  // Review Form states
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewSchool, setNewReviewSchool] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Refs
  const giftsSectionRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Category tags
  const categories = ["Tất cả", "Đã Lưu ❤️", "PowerPoint & Trò chơi", "Ứng dụng tương tác", "AI & Công nghệ", "Phần mềm", "Quản lý lớp học"];

  // Space Quiz database
  const quizQuestions = [
    {
      question: "Hành tinh nào được gán danh hiệu hành tinh Đỏ?",
      options: ["Mercury (Thủy)", "Mars (Hỏa) 🔥", "Venus (Kim)", "Jupiter (Mộc)"],
      correctIdx: 1,
      rewardText: "Chính xác! Mars (Hỏa) có màu đỏ rỉ sắt do chứa nhiều sắt ô-xít."
    },
    {
      question: "Đâu là phần mềm soạn bài giảng chuẩn E-learning quốc tế?",
      options: ["Adobe Photoshop", "Animiz Animator", "iSpring Suite 11 💻", "Microsoft Word"],
      correctIdx: 2,
      rewardText: "Chính xác! iSpring Suite 11 giúp thiết kế các trang bài giảng E-Learning trực tiếp trên PowerPoint."
    },
    {
      question: "AI hỗ trợ viết Sáng kiến kinh nghiệm (SKKN) chuẩn cấu trúc giúp gì?",
      options: ["Thay thế giáo viên hoàn toàn", "Tiết kiệm 80% thời gian, chuẩn luận điểm 💡", "Chỉ làm slide trình chiếu", "Không có tác dụng thực tế"],
      correctIdx: 1,
      rewardText: "Chính xác! Trợ lý AI giúp tối ưu hóa lập luận, cấu trúc khoa học và tiết kiệm 80% thời gian."
    }
  ];

  // Hero Interactive Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelectedIdx, setQuizSelectedIdx] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Quick Chips for AI Chat
  const quickChips = [
    { label: "Tải iSpring 11", text: "Tôi muốn tải bộ cài iSpring Suite 11 và file Việt Hóa" },
    { label: "Viết SKKN đạt giải", text: "Làm thế nào để viết Sáng kiến kinh nghiệm (SKKN) đạt giải cao bằng AI?" },
    { label: "Kho 300 game PPT", text: "Kho 300 game PowerPoint của Maris Slide có những gì?" },
    { label: "Khóa học Maris", text: "Tư vấn cho tôi về Khóa học thiết kế học liệu số & ứng dụng AI của Maris Slide" }
  ];

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages, aiTyping]);

  // Sync sound setting
  useEffect(() => {
    localStorage.setItem('maris_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Toast triggering helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Sound effects synthesiser for Quiz
  const playSoundEffect = (type: 'correct' | 'incorrect' | 'victory') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'incorrect') {
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'victory') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          noteGain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          noteOsc.start(ctx.currentTime + idx * 0.08);
          noteOsc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      }
    } catch (e) {}
  };

  const scrollToGifts = () => {
    giftsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Bookmark Toggle logic
  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    const isFav = favorites.includes(id);
    if (isFav) {
      updated = favorites.filter(favId => favId !== id);
      triggerToast("Đã bỏ lưu quà tặng!", "info");
    } else {
      updated = [...favorites, id];
      triggerToast("Đã lưu quà tặng vào mục Yêu thích! ❤️");
    }
    setFavorites(updated);
    localStorage.setItem('maris_favorites', JSON.stringify(updated));
  };

  // Sound toggle (sync with MemoryGame sound)
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('maris_sound_enabled', String(nextVal));
    triggerToast(nextVal ? "Đã bật âm thanh trò chơi 🔊" : "Đã tắt âm thanh trò chơi 🔇", "info");
  };

  // Submit chat response
  const handleAiChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;
    sendMessageToAi(userChatInput.trim());
    setUserChatInput("");
  };

  // Quick Chat trigger helper
  const handleQuickChipClick = (text: string) => {
    if (aiTyping) return;
    sendMessageToAi(text);
  };

  const sendMessageToAi = (messageText: string) => {
    setAiChatMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    setAiTyping(true);

    setTimeout(() => {
      setAiTyping(false);
      let replyText = "";
      const query = messageText.toLowerCase();
      
      if (query.includes("skkn") || query.includes("sáng kiến") || query.includes("kinh nghiệm")) {
        replyText = "Để viết Sáng kiến kinh nghiệm (SKKN) đạt giải cao, thầy cô nên lưu ý 3 điểm:\n1. Đề tài thời sự (như chuyển đổi số, STEM, AI).\n2. Số liệu thực nghiệm đối chứng rõ ràng.\n3. Sử dụng Trợ lý AI Viết SKKN của Maris Slide (Quà tặng số 5) để dựng sườn ý tưởng và lập luận sắc bén.";
      } else if (query.includes("game") || query.includes("trò chơi") || query.includes("lật bài")) {
        replyText = "Maris Slide tặng thầy cô Kho 300 game PowerPoint sinh động (Quà số 1) và Game Lật bài trí nhớ tại chỗ (Quà số 6). Thầy cô có thể đổi câu hỏi để làm hoạt động khởi động tiết học siêu lôi cuốn.";
      } else if (query.includes("ispring") || query.includes("phần mềm") || query.includes("tải")) {
        replyText = "Thầy cô tải trọn bộ soạn bài giảng số iSpring Suite 11 và Animiz (Dropbox link ở Quà số 7) kèm file dịch Việt Hóa giao diện (Quà số 8) để dễ dàng thao tác chuẩn E-learning quốc tế nhé.";
      } else if (query.includes("khóa học") || query.includes("học phí") || query.includes("lớp")) {
        replyText = "Lớp bồi dưỡng Thiết kế học liệu & Ứng dụng AI giúp thầy cô làm chủ công nghệ giảng dạy sau 5 buổi! Nhấp 'Tìm hiểu Khóa Học' trên trang chủ hoặc nhắn Zalo Trợ giảng 0396.581.283 để được tư vấn nhận voucher giảm 20% học phí hôm nay.";
      } else {
        replyText = "Cảm ơn thầy cô! Thầy cô nên tải các tài nguyên miễn phí trực tiếp bên dưới. Để gặp trực tiếp giảng viên Maris Slide hỗ trợ sửa bài thi Giáo viên Giỏi, vui lòng liên hệ Zalo: 0396.581.283.";
      }

      setAiChatMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 1000);
  };

  // Submit Review form
  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim()) {
      triggerToast("Vui lòng điền họ tên thầy cô!", "warning");
      return;
    }
    if (!newReviewComment.trim()) {
      triggerToast("Vui lòng điền nội dung nhận xét!", "warning");
      return;
    }

    const newRev: ReviewMessage = {
      id: "r_user_" + Date.now(),
      teacherName: newReviewName.trim(),
      school: newReviewSchool.trim() || "Giáo viên tự do",
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Save only user submitted reviews to localStorage
    const userOnly = updatedReviews.filter(r => r.id.startsWith('r_user_'));
    localStorage.setItem('maris_submitted_reviews', JSON.stringify(userOnly));

    // Reset Form
    setNewReviewName("");
    setNewReviewSchool("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setShowReviewModal(false);

    triggerToast("Gửi nhận xét thành công! Cảm ơn thầy cô đóng góp ❤️");
  };

  // Hero Quiz option click handler
  const handleQuizOptionClick = (optionIdx: number) => {
    if (quizSelectedIdx !== null) return; // Answered already

    setQuizSelectedIdx(optionIdx);
    const correct = optionIdx === quizQuestions[quizIdx].correctIdx;

    if (correct) {
      setQuizStatus('correct');
      setQuizScore(prev => prev + 500);
      playSoundEffect('correct');
      triggerToast("Chính xác! (+500 Điểm)", "success");
    } else {
      setQuizStatus('incorrect');
      playSoundEffect('incorrect');
      triggerToast("Sai rồi! Hãy xem gợi ý và đi tiếp.", "warning");
    }
  };

  // Next Quiz question
  const handleQuizNext = () => {
    setQuizSelectedIdx(null);
    setQuizStatus(null);
    if (quizIdx + 1 < quizQuestions.length) {
      setQuizIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      playSoundEffect('victory');
      triggerToast("Chúc mừng thầy cô đã hoàn thành Quiz! 🎉", "success");
    }
  };

  // Replay Quiz
  const resetQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizSelectedIdx(null);
    setQuizStatus(null);
    setQuizCompleted(false);
    triggerToast("Trò chơi trắc nghiệm đã được thiết lập lại!", "info");
  };

  // Filter gift cards based on category/favorites and search
  const filteredGifts = giftItems.filter(item => {
    let categoryMatches = false;
    
    if (selectedCategory === "Tất cả") {
      categoryMatches = true;
    } else if (selectedCategory === "Đã Lưu ❤️") {
      categoryMatches = favorites.includes(item.id);
    } else {
      categoryMatches = item.category.toLowerCase().includes(selectedCategory.replaceAll(" & ", " ").toLowerCase().substring(0, 8)) ||
        (selectedCategory === "AI & Công nghệ" && item.category.includes("AI")) ||
        (selectedCategory === "PowerPoint & Trò chơi" && (item.category.includes("PowerPoint") || item.category.includes("Trò Chơi")));
    }
    
    const searchMatches = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatches && searchMatches;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans select-none antialiased text-brand-dark relative">
      
      {/* Toast Notification Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none w-80 max-w-full">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-start gap-2.5 pointer-events-auto animate-toast-in relative overflow-hidden bg-white ${
              toast.type === 'success' ? 'border-emerald-100 text-emerald-800' :
              toast.type === 'warning' ? 'border-amber-100 text-amber-800' : 'border-blue-100 text-blue-800'
            }`}
          >
            <div className="flex-1 text-left">{toast.message}</div>
            
            {/* Tiny progress bar */}
            <div className={`absolute bottom-0 left-0 h-1 bg-current opacity-30 animate-toast-progress`} />
          </div>
        ))}
      </div>

      {/* Header bar */}
      <Header 
        onAiConsultationClick={() => setShowAiAssistant(true)} 
        onScrollToGifts={scrollToGifts} 
      />

      {/* Hero Container */}
      <section className="bg-gradient-to-b from-[#fff5f6] to-[#fafbfc] pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Card Wrap */}
          <div className="bg-white border border-red-50/50 rounded-[2.5rem] p-6 sm:p-10 lg:p-14 shadow-xl shadow-red-100/15 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Absolute background patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-100/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/35 rounded-full blur-3xl -z-10"></div>
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pink Tag Line */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lightrose text-brand-primary font-display font-extrabold text-[11px] uppercase tracking-wider shadow-xs border border-red-100">
                <Sparkles className="w-3.5 h-3.5" />
                Tiên Phong Công Nghệ Giáo Dục Số
              </div>
              
              {/* Grand Elegant Title */}
              <div className="space-y-2">
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-5.5xl text-brand-dark tracking-tight leading-tight">
                  KHO QUÀ TẶNG
                </h1>
                <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-[4rem] text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-orange-500 to-red-600 tracking-tight leading-none">
                  HỌC LIỆU SỐ
                </h2>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="px-4 py-1.5 rounded-full bg-[#fff0f2] text-brand-primary font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 border border-red-100">
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                  Chuyên Nghiệp
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#fef5e7] text-[#e67e22] font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 border border-amber-100">
                  <div className="w-2 h-2 rounded-full bg-[#e67e22]"></div>
                  Công Nghệ
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#e8f8f5] text-[#16a085] font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 border border-teal-100">
                  <div className="w-2 h-2 rounded-full bg-[#16a085]"></div>
                  Sinh Động
                </span>
              </div>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl text-justify font-normal">
                Chào mừng quý thầy cô đến với <strong className="text-brand-dark">Maris Slide</strong>. Chúng tôi đồng hành cùng thầy cô biến những kịch bản sư phạm khô khan thành những bài giảng số trực quan sinh động, giàu tính tương tác và đạt giải cao trong các kỳ thi giáo viên giỏi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  id="hero-explore-btn"
                  onClick={scrollToGifts}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transform active:scale-98 transition-all inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Khám Phá Quà Tặng Ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <a
                  id="hero-course-inquiry"
                  href="https://khoahoccongnghe2-marisslide.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-white border-2 border-red-100 text-brand-dark hover:border-brand-primary font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-brand-primary" />
                  Tìm hiểu Khóa Học
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-red-50">
                <div>
                  <p id="stat-customers" className="font-display font-black text-2xl sm:text-3xl text-brand-primary leading-none">3,000+</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1.5 uppercase tracking-wide">Khách hàng tin dùng</p>
                </div>
                <div>
                  <p id="stat-security" className="font-display font-black text-2xl sm:text-3xl text-brand-primary leading-none">100%</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1.5 uppercase tracking-wide">Bảo mật độc quyền</p>
                </div>
                <div>
                  <p id="stat-prizes" className="font-display font-black text-2xl sm:text-3xl text-brand-primary leading-none">1,000+</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-1.5 uppercase tracking-wide">Sản phẩm đạt giải cao</p>
                </div>
              </div>

            </div>

            {/* Right COLUMN: Fully Interactive Quiz game */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Sound control inside quiz card */}
              <button
                onClick={toggleSound}
                className="absolute -top-4 right-4 z-20 p-2 bg-slate-900/80 hover:bg-slate-900 border border-white/10 rounded-full text-white cursor-pointer shadow-md"
                title={soundEnabled ? "Tắt âm thanh Quiz" : "Bật âm thanh Quiz"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-pink-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
              </button>

              {/* Outer Glowing Wrap */}
              <div className="w-full max-w-[380px] aspect-[4/5] bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 rounded-[2.2rem] p-1.5 shadow-2xl relative group hover:scale-101 transition-all duration-300">
                
                {/* Embedded Game UI Layout */}
                <div className="w-full h-full bg-slate-950 rounded-[1.95rem] overflow-hidden flex flex-col relative">
                  
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-slate-950"></div>
                  
                  {/* Glowing neon shapes */}
                  <div className="absolute top-10 right-4 w-12 h-12 bg-pink-500/30 rounded-full blur-xl"></div>
                  <div className="absolute bottom-12 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                  
                  {/* UI Header of Mock App */}
                  <div className="p-4 flex items-center justify-between z-10 border-b border-white/5 bg-slate-950/45 backdrop-blur-xs">
                    <span className="text-[10px] text-pink-400 font-extrabold flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 animate-spin" />
                      MARIS QUIZ INTERACTIVE
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                      ĐIỂM: {quizScore}
                    </span>
                  </div>

                  {/* Inside Content */}
                  <div className="flex-1 flex flex-col justify-center items-center p-5 text-center z-10 relative">
                    
                    {quizCompleted ? (
                      /* Quiz Victory Screen */
                      <div className="space-y-4 animate-scale-up py-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/20 animate-bounce">
                          🏆
                        </div>
                        <span className="px-2.5 py-1 bg-yellow-400/20 rounded-full border border-yellow-400/30 text-yellow-300 font-extrabold text-[10px] uppercase tracking-wider block w-fit mx-auto">
                          Hoàn Thành Quiz!
                        </span>
                        <h3 className="font-display font-black text-white text-lg leading-snug">
                          Nhận Ngay Học Liệu Độc Quyền!
                        </h3>
                        <p className="text-gray-300 text-[11px] leading-relaxed max-w-[240px] mx-auto text-center">
                          Chúc mừng thầy cô đã đạt điểm tuyệt đối <strong>{quizScore} điểm</strong>! Hãy kéo xuống tải tài nguyên bản quyền ngay.
                        </p>
                        
                        <div className="flex gap-2 justify-center pt-2">
                          <button
                            onClick={resetQuiz}
                            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Chơi Lại
                          </button>
                          <button
                            onClick={scrollToGifts}
                            className="px-4 py-2 rounded-lg bg-brand-primary text-white text-[10px] font-bold shadow-md hover:bg-rose-600 transition-all cursor-pointer flex items-center gap-1"
                          >
                            Tải Quà Ngay
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Active Question screen */
                      <div className="w-full flex flex-col justify-between h-full">
                        
                        <div className="my-auto space-y-3">
                          <span className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-400/20 text-indigo-300 font-bold text-[9px] tracking-widest uppercase">
                            CÂU HỎI {quizIdx + 1}/{quizQuestions.length}
                          </span>
                          
                          <h3 className="font-display font-extrabold text-white text-sm sm:text-base leading-snug max-w-xs mx-auto">
                            {quizQuestions[quizIdx].question}
                          </h3>
                        </div>

                        {/* Interactive Buttons Grid */}
                        <div className="grid grid-cols-2 gap-2 w-full text-[10px] font-bold mt-4">
                          {quizQuestions[quizIdx].options.map((opt, oIdx) => {
                            let btnStyle = "bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10";
                            
                            if (quizSelectedIdx !== null) {
                              if (oIdx === quizQuestions[quizIdx].correctIdx) {
                                btnStyle = "bg-emerald-600 text-white border border-emerald-400/30 animate-pulse-slow";
                              } else if (oIdx === quizSelectedIdx) {
                                btnStyle = "bg-red-600 text-white border border-red-400/30";
                              } else {
                                btnStyle = "bg-white/5 text-gray-500 border border-white/5 opacity-50";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSelectedIdx !== null}
                                onClick={() => handleQuizOptionClick(oIdx)}
                                className={`py-2 px-1.5 rounded-xl transition-all duration-200 text-center flex items-center justify-center min-h-[44px] leading-tight cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation & Next step area */}
                        {quizSelectedIdx !== null && (
                          <div className="mt-4 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-left animate-scale-up">
                            <p className="text-[9px] leading-relaxed text-gray-300 mb-2">
                              {quizQuestions[quizIdx].rewardText}
                            </p>
                            <button
                              onClick={handleQuizNext}
                              className="w-full py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-[9px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              {quizIdx + 1 < quizQuestions.length ? "Tiếp Tục Câu Hỏi" : "Xem Kết Quả"}
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {/* Bottom static bar decoration */}
                  <div className="p-4 z-10 bg-slate-900/90 border-t border-white/5">
                    <div className="p-2.5 bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/[0.08] flex items-center justify-between text-left">
                      <div>
                        <h4 className="text-white font-extrabold text-[11px]">Học liệu số Maris Slide</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Tích hợp Trí tuệ nhân tạo (AI)</p>
                      </div>
                      <span className="px-2.5 py-1 bg-brand-primary text-white text-[8px] font-extrabold tracking-wider rounded-lg uppercase shadow-sm">
                        Độc Quyền
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Main Catalog section */}
      <section ref={giftsSectionRef} id="gifts-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Title decoration */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-brand-primary text-xs font-extrabold rounded-full mb-3 border border-rose-100">
            <Award className="w-3.5 h-3.5" />
            Tài Nguyên Miễn Phí Từ Maris Slide
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight">
            Quà Tặng Công Nghệ Giáo Dục
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-normal">
            Tổng hợp các phần mềm bản quyền, ứng dụng tương tác số, và file thiết kế mẫu hỗ trợ thầy cô đột phá trong hoạt động dạy và học.
          </p>
        </div>

        {/* Searching & Categories filtering */}
        <div className="bg-white border border-gray-100 p-4 sm:p-5 rounded-2xl shadow-xs mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Categories track */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none antialiased">
            {categories.map((cat) => {
              const isFavCategory = cat === "Đã Lưu ❤️";
              const countText = isFavCategory ? ` (${favorites.length})` : '';
              
              return (
                <button
                  id={`cat-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-brand-primary text-white shadow-md shadow-red-100" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-primary"
                  }`}
                >
                  {cat}{countText}
                </button>
              );
            })}
          </div>

          {/* Search Input bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id="gift-search-input"
              type="text"
              placeholder="Tìm kiếm tài nguyên nhanh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {searchQuery && (
              <button 
                id="search-clear-btn" 
                onClick={() => setSearchQuery("")} 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Resources Grid */}
        {filteredGifts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGifts.map((item) => (
              <GiftCard 
                key={item.id} 
                item={item} 
                isFavorited={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectInteractive={(id) => {
                  const gameElem = document.getElementById('memory-game-section');
                  gameElem?.scrollIntoView({ behavior: 'smooth' });
                }}
                onExploreDetail={(selectedItem) => setExploreItem(selectedItem)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-semibold">
              {selectedCategory === "Đã Lưu ❤️" 
                ? "Danh sách quà tặng yêu thích của bạn đang trống." 
                : "Không tìm thấy tài nguyên nào phù hợp với bộ lọc chính."}
            </p>
            <button 
              id="reset-filter-btn" 
              onClick={() => { setSelectedCategory("Tất cả"); setSearchQuery(""); }}
              className="text-brand-primary font-bold text-xs mt-3 bg-red-100/50 px-4 py-1.5 rounded-lg border border-red-100/50 hover:bg-brand-lightrose cursor-pointer"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        )}

      </section>



      {/* Prominent Course & Zalo inquiry block */}
      <section id="course-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-brand-dark to-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-5">
              <span className="px-3 py-1 bg-brand-primary rounded-md text-[11px] font-extrabold uppercase tracking-widest text-[#fff0f2]">
                Khóa học đặc sắc liên kết
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4.5xl leading-tight text-white tracking-tight">
                Ứng dụng AI & Công Nghệ Thiết Kế Học Liệu Số 
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Bạn muốn tự tay thiết kế những bài giảng PowerPoint chuyển động sinh động, viết những Sáng kiến kinh nghiệm (SKKN) chuẩn khoa học đạt giải cao hay làm chủ trợ lý thông minh AI hỗ trợ mọi nghiệp vụ giảng dạy? Hãy tham gia lớp bồi dưỡng đặc biệt của Maris Slide.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-primary font-bold">
                <span className="flex items-center gap-1.5 text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Tiết kiệm 80% thời gian soạn bài
                </span>
                <span className="flex items-center gap-1.5 text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Đạt chuẩn học liệu kỹ thuật số quốc tế
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center gap-3.5">
              <a
                id="btn-course-outer"
                href="https://khoahoccongnghe2-marisslide.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-4 rounded-xl bg-brand-primary hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base transition-colors shadow-lg shadow-red-500/15 flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-5 h-5" />
                Tìm Hiểu Lớp Maris Slide
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                id="btn-zalo-outer"
                href="https://zalo.me/0396581283"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-4 rounded-xl bg-white text-slate-900 hover:bg-neutral-50 font-extrabold text-sm sm:text-base transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-brand-primary" />
                Liên hệ Trợ Giảng Zalo
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Teachers Reviews list */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
                Chia Sẻ Từ Quý Thầy Cô Học Viên
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Phản hồi thực tế từ các nhà giáo trên toàn quốc đã ứng dụng hiệu quả tài nguyên Maris Slide.
              </p>
            </div>
            
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 w-fit"
            >
              Gửi Đánh Giá Của Bạn
            </button>
          </div>

          <div className="relative w-full overflow-hidden py-4 mt-4">
            {/* Fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#fafbfc] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#fafbfc] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6 animate-marquee">
              {[...reviews, ...reviews].map((rev, idx) => (
                <div 
                  id={`${rev.id}-dup-${idx}`} 
                  key={`${rev.id}-${idx}`} 
                  className="w-[280px] sm:w-[355px] shrink-0 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 select-text"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed text-left mb-6 whitespace-pre-line">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-brand-lightrose flex items-center justify-center font-display font-black text-brand-primary text-sm shadow-xs shrink-0">
                      {rev.teacherName.substring(rev.teacherName.lastIndexOf(' ') + 1)[0] || 'T'}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-brand-dark leading-none text-left">{rev.teacherName}</h4>
                      <span className="text-[10px] text-gray-500 font-medium block mt-1 text-left">{rev.school}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div id="review-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100 animate-scale-up">
            <div className="h-2 bg-gradient-to-r from-brand-primary to-orange-500" />
            
            <form onSubmit={handleReviewSubmit} className="p-6 sm:p-8 space-y-4">
              <button 
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-brand-primary hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-display font-black text-xl text-brand-dark text-center">Gửi Đánh Giá Học Viên</h3>
                <p className="text-[11px] text-gray-400 text-center mt-1">Đóng góp của thầy cô giúp cộng đồng giáo dục phát triển hơn</p>
              </div>

              {/* Star Selection */}
              <div className="flex justify-center items-center gap-1.5 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 cursor-pointer transition-transform active:scale-125"
                  >
                    <svg 
                      className={`w-7 h-7 ${star <= newReviewRating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} 
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Form Input fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Họ tên Thầy/Cô *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Cô Trần Thị Thảo"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-brand-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Đơn vị công tác (Trường / Tỉnh)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Trường Tiểu Học Lê Lợi, Nghệ An"
                    value={newReviewSchool}
                    onChange={(e) => setNewReviewSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-brand-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Nhận xét của thầy cô *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hãy chia sẻ trải nghiệm về kho quà tặng PowerPoint, ứng dụng AI hay các khóa học của Maris Slide..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-brand-primary text-sm resize-none"
                  />
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-1/3 py-3 text-center border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-neutral-50 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 text-center bg-gradient-to-r from-brand-primary to-orange-500 text-white font-bold text-xs rounded-xl hover:brightness-105 shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi Phản Hồi Ngay
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {exploreItem && (
        <div id="detail-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden border border-gray-100 flex flex-col animate-scale-up">
            
            {/* Top decorative gradient band */}
            <div className={`h-2.5 bg-gradient-to-r ${exploreItem.bannerGradient}`} />
            
            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              
              {/* Close Button */}
              <button 
                id="close-modal-btn"
                onClick={() => setExploreItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-brand-primary hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-lightrose px-3 py-1 rounded-md mb-3 inline-block">
                {exploreItem.category}
              </span>
              
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-brand-dark mb-3 pr-6">
                {exploreItem.title}
              </h3>
              
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 text-justify">
                {exploreItem.description}
              </p>

              {/* Special instructions */}
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-xs text-amber-800 space-y-2 mb-6">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  Gợi Ý Sử Dụng Bản Quyền:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-justify">
                  <li>Thầy cô hãy bấm nút tải về để được kết nối trực tiếp đến hệ thống file gốc hoặc ứng dụng chất lượng cao.</li>
                  <li>Nếu tải file PowerPoint, kiến nghị mở bằng phiên bản Office 2019/365 để đạt hiệu ứng chuyển động hoàn chỉnh nhất.</li>
                  <li>Liên hệ Zalo trợ lý 0396.581.283 khi gặp khó khăn về mật khẩu giải nén hoặc link Dropbox.</li>
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {exploreItem.tags.map((tag, idx) => (
                  <span id={`modal-tag-${idx}`} key={idx} className="text-[10px] font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  id="modal-cancel-btn"
                  onClick={() => setExploreItem(null)}
                  className="px-4 py-2.5 text-xs text-gray-500 font-bold hover:text-brand-dark cursor-pointer"
                >
                  Đóng Lại
                </button>
                
                {exploreItem.isInteractive ? (
                  <button
                    id="modal-play-btn"
                    onClick={() => {
                      setExploreItem(null);
                      const gameElem = document.getElementById('memory-game-section');
                      gameElem?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    Chơi Game Trực Tiếp
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    id="modal-download-link"
                    href={exploreItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-orange-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md"
                  >
                    Đi Đến Tải Về
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Floating Chat Box Panel (AI assistant) */}
      {showAiAssistant && (
        <div id="ai-chat-drawer" className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-scale-up">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-primary to-rose-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">
                💬
              </div>
              <div>
                <h4 className="font-display font-bold text-xs sm:text-sm leading-tight text-left">Maris AI Trợ Lý Sư Phạm</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[9px] text-red-100 font-semibold uppercase tracking-wider">Trực tuyến hỗ trợ</span>
                </div>
              </div>
            </div>
            <button 
              id="close-chat-btn" 
              onClick={() => setShowAiAssistant(false)} 
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Track */}
          <div className="flex-1 p-4 h-80 overflow-y-auto space-y-3 bg-slate-50/70 select-text">
            {aiChatMessages.map((msg, idx) => (
              <div 
                id={`chat-msg-${idx}`}
                key={idx} 
                className={`flex gap-2 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-brand-lightrose border border-red-100 text-[10px] flex items-center justify-center shrink-0">
                    🤖
                  </div>
                )}
                <div className={`p-3 rounded-2xl text-[11px] max-w-[80%] leading-relaxed shadow-xs ${
                  msg.sender === 'user' 
                    ? 'bg-brand-primary text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-red-50 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line text-left">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator bubble */}
            {aiTyping && (
              <div className="flex gap-2 items-start justify-start">
                <div className="w-6 h-6 rounded-full bg-brand-lightrose border border-red-100 text-[10px] flex items-center justify-center shrink-0">
                  🤖
                </div>
                <div className="p-3 rounded-2xl bg-white border border-red-50 rounded-tl-none shadow-xs">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips selector */}
          <div className="p-2 border-t border-gray-100/50 bg-gray-50/80 flex flex-wrap gap-1">
            {quickChips.map((chip, cIdx) => (
              <button
                key={cIdx}
                disabled={aiTyping}
                onClick={() => handleQuickChipClick(chip.text)}
                className="px-2.5 py-1 bg-white border border-gray-100 hover:border-brand-primary hover:text-brand-primary text-[10px] text-gray-600 rounded-lg transition-colors cursor-pointer font-medium"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleAiChatSubmit} className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              id="chat-input-text"
              type="text"
              disabled={aiTyping}
              placeholder="Hỏi về Viết SKKN, PowerPoint, Khóa học..."
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-brand-primary"
            />
            <button
              id="chat-submit-btn"
              type="submit"
              disabled={aiTyping}
              className="p-3 bg-brand-primary text-white rounded-xl hover:bg-rose-600 transition-colors shrink-0 cursor-pointer disabled:bg-rose-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Zalo Chat Bubble */}
      <div className="fixed bottom-6 left-6 z-30">
        <a
          id="zalo-float-bubble"
          href="https://zalo.me/0396581283"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-tr from-brand-primary to-orange-500 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transform transition-all relative group animate-bounce"
          title="Zalo Trợ Giảng"
        >
          <Phone className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
          <div className="absolute left-16 bg-white border border-gray-100 py-1.5 px-3 rounded-xl shadow-md text-[10px] sm:text-xs font-bold text-brand-dark whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            Zalo Trợ Giảng: 0396.581.283
          </div>
        </a>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
