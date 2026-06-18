import { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Trophy, Sparkles, AlertCircle, Award } from 'lucide-react';

interface Card {
  id: number;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Particle {
  id: number;
  symbol: string;
  style: any;
}

const SHAPE_PAIRS = [
  { symbol: "💡", label: "AI Giáo Dục" },
  { symbol: "💻", label: "PowerPoint" },
  { symbol: "🎓", label: "Maris Slide" },
  { symbol: "🎮", label: "Game Lớp Học" },
  { symbol: "🏆", label: "Giải Cấp Tỉnh" },
  { symbol: "📚", label: "SKKN Đạt Giải" },
  { symbol: "✨", label: "Học Liệu Số" },
  { symbol: "📱", label: "Mini-App Số" }
];

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  
  // Persistent Sound Enabled state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('maris_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Best Score tracking
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [newRecordAlert, setNewRecordAlert] = useState(false);

  // Victory Confetti particles
  const [particles, setParticles] = useState<Particle[]>([]);

  // Sound Synth via Web Audio API
  const playSound = (type: 'flip' | 'match' | 'mismatch' | 'victory') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'flip') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'match') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'mismatch') {
        osc.frequency.setValueAtTime(180, ctx.currentTime);
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
          noteOsc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          noteGain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
          noteOsc.start(ctx.currentTime + idx * 0.1);
          noteOsc.stop(ctx.currentTime + idx * 0.1 + 0.35);
        });
      }
    } catch (e) {
      // Ignored browser audio autostart constraints
    }
  };

  // Sound toggle handler
  const handleSoundToggle = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('maris_sound_enabled', String(nextVal));
  };

  // Get active pairs count based on difficulty
  const getPairsCount = (diff: typeof difficulty) => {
    if (diff === 'easy') return 3;   // 6 cards
    if (diff === 'hard') return 8;   // 16 cards
    return 6;                       // 12 cards (medium)
  };

  const initGame = (diff = difficulty) => {
    const pairsCount = getPairsCount(diff);
    const selectedPairs = SHAPE_PAIRS.slice(0, pairsCount);

    // Shuffle cards
    const shuffled = [...selectedPairs, ...selectedPairs]
      .map((item, idx) => ({
        id: idx,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    // Load best score
    const savedBest = localStorage.getItem(`maris_memory_best_${diff}`);
    setBestScore(savedBest ? parseInt(savedBest, 10) : null);

    setCards(shuffled);
    setSelectedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameState('playing');
    setParticles([]);
    setNewRecordAlert(false);
  };

  // Watch difficulty change
  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  // Generate victory particles
  const triggerVictoryParticles = () => {
    const symbols = ["⭐", "✨", "🎉", "❤️", "🎓", "🏆", "💡", "🌟"];
    const newParticles = Array.from({ length: 40 }).map((_, idx) => {
      const angle = (Math.random() * 360) + 'deg';
      const dx = (Math.random() * 320 - 160) + 'px';
      const dy = -(Math.random() * 250 + 100) + 'px';
      const delay = (Math.random() * 0.4) + 's';
      const duration = (0.8 + Math.random() * 0.8) + 's';
      const left = (15 + Math.random() * 70) + '%';
      const top = (35 + Math.random() * 30) + '%';
      return {
        id: idx,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        style: {
          left,
          top,
          animationDelay: delay,
          animationDuration: duration,
          '--dx': dx,
          '--dy': dy,
          '--angle': angle,
        }
      };
    });
    setParticles(newParticles);
  };

  const handleCardClick = (idx: number) => {
    if (gameState !== 'playing') return;
    if (cards[idx].isFlipped || cards[idx].isMatched) return;
    if (selectedIndices.length >= 2) return;

    playSound('flip');
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedIndices, idx];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newSelected;
      
      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // MATCH!
        setTimeout(() => {
          playSound('match');
          const matchedCards = [...newCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelectedIndices([]);
          
          const nextMatches = matches + 1;
          setMatches(nextMatches);

          const totalPairs = getPairsCount(difficulty);
          if (nextMatches === totalPairs) {
            setGameState('won');
            playSound('victory');
            triggerVictoryParticles();

            // Check and update highscore
            const currentMoves = moves + 1;
            const savedBest = localStorage.getItem(`maris_memory_best_${difficulty}`);
            const best = savedBest ? parseInt(savedBest, 10) : null;
            if (best === null || currentMoves < best) {
              localStorage.setItem(`maris_memory_best_${difficulty}`, String(currentMoves));
              setBestScore(currentMoves);
              setNewRecordAlert(true);
            }
          }
        }, 450);
      } else {
        // MISMATCH
        setTimeout(() => {
          playSound('mismatch');
          const resetCards = [...newCards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setSelectedIndices([]);
        }, 1000);
      }
    }
  };

  // Responsive dynamic layout styles based on difficulty
  const getGridColsClass = () => {
    if (difficulty === 'easy') return 'grid-cols-3 max-w-sm mx-auto';
    return 'grid-cols-4';
  };

  return (
    <div id="memory-game" className="bg-slate-50 border border-red-100 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm relative overflow-hidden">
      
      {/* Confetti Container */}
      {particles.map((p) => (
        <span 
          key={p.id} 
          className="star-particle text-xl sm:text-2xl" 
          style={p.style}
        >
          {p.symbol}
        </span>
      ))}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-5">
        <div>
          <h3 className="font-display font-bold text-xl text-brand-dark flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            Game Lật Bài Trí Nhớ Maris
          </h3>
          <p className="text-xs text-gray-500 mt-1">Luyện trí nhớ & khởi động không khí lớp học sôi động</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={handleSoundToggle}
            className="p-2 bg-white hover:bg-red-50 text-gray-600 rounded-lg border border-gray-200 transition-colors cursor-pointer"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-primary" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
          
          {/* Restart */}
          <button
            id="restart-game-btn"
            onClick={() => initGame(difficulty)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-red-200 text-brand-primary rounded-lg shadow-sm hover:bg-brand-lightrose transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Chơi lại
          </button>
        </div>
      </div>

      {/* Difficulty Select tabs */}
      <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-xl border border-gray-100 w-fit">
        <span className="text-[10px] uppercase font-bold text-gray-400 px-2">Cấp độ:</span>
        {(['easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            id={`btn-diff-${diff}`}
            onClick={() => setDifficulty(diff)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              difficulty === diff 
                ? 'bg-brand-primary text-white shadow-xs' 
                : 'text-gray-500 hover:text-brand-primary hover:bg-neutral-50'
            }`}
          >
            {diff === 'easy' ? 'Dễ (6 ô)' : diff === 'medium' ? 'Vừa (12 ô)' : 'Khó (16 ô)'}
          </button>
        ))}
      </div>

      {/* Grid of cards */}
      <div className={`grid gap-3 sm:gap-4 mb-6 ${getGridColsClass()}`}>
        {cards.map((card, idx) => (
          <button
            id={`card-${idx}`}
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 transform outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer ${
              card.isFlipped || card.isMatched
                ? "bg-gradient-to-br from-brand-primary to-rose-600 text-white scale-100 shadow-md rotate-y-180" 
                : "bg-white border-2 border-dashed border-red-200 text-transparent hover:border-brand-primary scale-98 active:scale-95 shadow-xs"
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="flex flex-col items-center justify-center p-1 text-center select-none">
                <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">{card.symbol}</span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-tight text-red-100 leading-none truncate max-w-full px-1">{card.label}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center select-none">
                <span className="text-brand-primary font-display font-extrabold text-base sm:text-xl">M</span>
                <span className="text-[7px] tracking-widest text-red-300 font-bold">MARIS</span>
              </div>
            )}
            
            {card.isMatched && (
              <div className="absolute top-1 right-1 bg-white/20 p-0.5 rounded-full backdrop-blur-xs">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Score and Stats board */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-red-50 text-xs sm:text-sm">
        <div id="stats-moves" className="text-gray-600 font-medium">
          Lượt thử: <span className="font-bold text-brand-primary font-mono">{moves}</span>
        </div>
        <div className="text-gray-400">|</div>
        <div id="stats-best" className="text-gray-600 font-medium">
          Kỷ lục: <span className="font-bold text-gray-800 font-mono">{bestScore !== null ? `${bestScore} lượt` : 'Chưa có'}</span>
        </div>
        <div className="text-gray-400">|</div>
        <div id="stats-matches" className="text-gray-600 font-medium">
          Cặp đúng: <span className="font-bold text-emerald-500 font-mono">{matches}/{getPairsCount(difficulty)}</span>
        </div>
      </div>

      {/* Victory Status Overlay */}
      {gameState === 'won' && (
        <div id="victory-panel" className="mt-5 p-5 bg-gradient-to-r from-brand-primary to-orange-500 rounded-2xl text-white text-center shadow-lg relative overflow-hidden animate-scale-up">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-300 animate-bounce" />
          
          {newRecordAlert ? (
            <h4 className="font-display font-black text-xl mb-1 text-yellow-300 flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 animate-pulse" />
              KỶ LỤC MỚI ĐÃ THIẾT LẬP!
            </h4>
          ) : (
            <h4 className="font-display font-extrabold text-xl mb-1">Chúc Mừng Thầy Cô Đã Hoàn Thành!</h4>
          )}
          
          <p className="text-xs text-red-50 max-w-md mx-auto mb-4">
            Thầy cô hoàn thành cấp độ <strong>{difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Vừa' : 'Khó'}</strong> với <strong>{moves} lượt</strong>. Trò chơi lật bài tương tác này giúp học sinh hào hứng học tập gấp bội lần thông thường!
          </p>
          <div className="flex justify-center gap-2.5 flex-wrap">
            <button
              id="victory-replay-btn"
              onClick={() => initGame(difficulty)}
              className="px-4 py-2 bg-white text-brand-primary font-bold text-xs rounded-xl hover:bg-amber-100 transition-colors shadow-xs cursor-pointer"
            >
              Chơi Lại Vòng Này
            </button>
            <a
              id="victory-zalo-btn"
              href="https://zalo.me/0396581283"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-brand-dark hover:bg-opacity-95 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs"
            >
              Liên hệ nhận code game
            </a>
          </div>
        </div>
      )}

      {/* pedagogical tip */}
      <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Mẹo sư phạm:</strong> Hãy tích hợp trò chơi lật mảnh ghép này vào phần kiểm tra bài cũ hoặc củng cố kiến thức. Học sinh có thể lên bảng thi đua trực tiếp, tạo tiếng cười sảng khoái và động lực học tập cực cao.
        </p>
      </div>
    </div>
  );
}
