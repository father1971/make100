import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, X, Divide, RefreshCw, Delete, Timer, Play, Moon, Sun, Plane, Music, Film, Train, Ticket, Bus, TramFront, CableCar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function calculateResult(digits: string[], gaps: string[]): number {
  let expr = gaps[0];
  for (let i = 0; i < digits.length; i++) {
    expr += digits[i];
    if (i < gaps.length - 1) {
      expr += gaps[i + 1];
    }
  }
  expr = expr.replace(/,/g, '.');
  
  try {
    let openParens = (expr.match(/\(/g) || []).length;
    let closeParens = (expr.match(/\)/g) || []).length;
    if (openParens !== closeParens) return NaN;
    
    // Prevent octal literals (e.g., 012 -> 12)
    expr = expr.replace(/\b0+(?=\d)/g, '');
    
    if (!expr.trim()) return NaN;
    if (/[^0-9+\-*/().\s]/.test(expr)) return NaN;

    const result = new Function(`"use strict"; return (${expr})`)();
    return typeof result === 'number' ? result : NaN;
  } catch (e) {
    return NaN;
  }
}

function hasSolution(digits: string[]): boolean {
  const ops = ['+', '-', '*', '/', ''];
  for (let i = 0; i < 3125; i++) {
    let currentOps = [''];
    let temp = i;
    for (let j = 0; j < 5; j++) {
      currentOps.push(ops[temp % 5]);
      temp = Math.floor(temp / 5);
    }
    currentOps.push('');
    let res = calculateResult(digits, currentOps);
    if (Math.abs(res - 100) < 0.0001) return true;
  }
  return false;
}

function generateSolvableTicket(): string[] {
  while (true) {
    let num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    let digits = num.split('');
    if (hasSolution(digits)) {
      return digits;
    }
  }
}

const COUNTRIES = [
  { format: 'generic1' },
  { format: 'generic2' },
  { format: 'generic3' },
  { format: 'generic4' },
];

// Images of cars from all over the world with precise positioning
const CAR_IMAGES = [
  {
    // Red sports car
    url: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    top: '72%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  },
  {
    // White car
    url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    top: '75%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  },
  {
    // Lamborghini
    url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200',
    top: '78%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  },
  {
    // Classic car
    url: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1200',
    top: '70%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  },
  {
    // Range Rover
    url: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200',
    top: '80%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  },
  {
    // Blue car
    url: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    top: '82%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  },
  {
    // White Porsche
    url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    top: '72%', left: '50%', baseScale: 0.55, rotateZ: '-1deg', rotateX: '5deg', bgScale: 1
  },
  {
    // Red Mustang
    url: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1200',
    top: '82%', left: '50%', baseScale: 0.55, rotateZ: '0deg', rotateX: '-5deg', bgScale: 1
  }
];

const TICKET_STYLES = [
  {
    id: 'flight',
    containerClass: 'bg-white rounded-xl shadow-2xl border-l-[12px] border-blue-600 p-5 sm:p-6',
    icon: Plane,
    iconClass: 'text-blue-600',
    title: 'BOARDING PASS',
    subtitle: 'FIRST CLASS',
    labelClass: 'text-slate-400 font-bold uppercase tracking-wider text-xs',
    numberContainerClass: 'border-y-2 border-dashed border-slate-200 my-2',
    numberClass: 'text-slate-800',
    footerLeft: 'GATE 14',
    footerRight: 'SEAT 2A',
    footerClass: 'text-slate-800 font-black uppercase text-sm',
    hasBarcode: true,
    pattern: 'radial-gradient(#e2e8f0 1px, transparent 1px)'
  },
  {
    id: 'concert',
    containerClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] p-5 sm:p-6 border border-purple-500/30 text-white',
    icon: Music,
    iconClass: 'text-pink-400',
    title: 'LIVE CONCERT',
    subtitle: 'VIP ACCESS',
    labelClass: 'text-purple-300/70 font-bold uppercase tracking-widest text-xs',
    numberContainerClass: 'bg-black/40 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner my-2',
    numberClass: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]',
    footerLeft: 'WORLD TOUR',
    footerRight: 'ROW 1',
    footerClass: 'text-white font-bold uppercase tracking-widest text-xs opacity-80',
    hasBarcode: false,
    pattern: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)'
  },
  {
    id: 'cinema',
    containerClass: 'bg-[#fdf6e3] rounded-sm shadow-xl p-5 sm:p-6 border-4 border-double border-[#d4af37] relative overflow-hidden',
    icon: Film,
    iconClass: 'text-[#d4af37]',
    title: 'CINEMA TICKET',
    subtitle: 'ADMIT ONE',
    labelClass: 'text-[#8b7322] font-bold uppercase tracking-widest text-xs',
    numberContainerClass: 'my-4',
    numberClass: 'text-[#2c3e50] drop-shadow-sm',
    footerLeft: 'ROW F',
    footerRight: 'SEAT 12',
    footerClass: 'text-[#2c3e50] font-black uppercase text-sm',
    hasBarcode: true,
    pattern: 'radial-gradient(rgba(212,175,55,0.1) 1px, transparent 1px)'
  },
  {
    id: 'train',
    containerClass: 'bg-[#e8dcc5] rounded-sm shadow-md p-5 sm:p-6 border-x-[16px] border-dashed border-[#5c4033]',
    icon: Train,
    iconClass: 'text-[#5c4033]',
    title: 'EXPRESS TRAIN',
    subtitle: 'ONE WAY',
    labelClass: 'text-[#8b6b53] font-bold uppercase tracking-widest text-xs',
    numberContainerClass: 'border-y border-[#5c4033]/30 my-2',
    numberClass: 'text-[#8b0000] opacity-90',
    footerLeft: 'PLATFORM 9',
    footerRight: 'CARRIAGE 4',
    footerClass: 'text-[#5c4033] font-bold uppercase tracking-widest text-xs',
    hasBarcode: false,
    pattern: 'radial-gradient(rgba(92,64,51,0.1) 1px, transparent 1px)'
  },
  {
    id: 'vintage-bus',
    containerClass: 'bg-[#e4d5b7] rounded-sm shadow-xl p-5 sm:p-6 border-2 border-[#8b7355] relative overflow-hidden',
    icon: Bus,
    iconClass: 'text-[#5c4a3d]',
    title: 'АВТОБУСНЫЙ БИЛЕТ',
    subtitle: 'СЕРИЯ АВ',
    labelClass: 'text-[#5c4a3d] font-serif font-bold uppercase tracking-widest text-xs',
    numberContainerClass: 'border-y-2 border-dashed border-[#8b7355] my-4 py-4',
    numberClass: 'text-[#8b0000] font-serif tracking-[0.2em]',
    footerLeft: 'КОНТРОЛЬНЫЙ',
    footerRight: 'БИЛЕТ',
    footerClass: 'text-[#5c4a3d] font-serif font-bold uppercase text-[10px] tracking-widest',
    hasBarcode: false,
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,115,85,0.05) 10px, rgba(139,115,85,0.05) 20px)'
  },
  {
    id: 'vintage-tram',
    containerClass: 'bg-[#d9cbb8] rounded-none shadow-md p-4 sm:p-6 border-x-[12px] border-dotted border-[#6b5b4e] relative',
    icon: TramFront,
    iconClass: 'text-[#3e322b]',
    title: 'ТРАМВАЙ',
    subtitle: 'РАЗОВЫЙ',
    labelClass: 'text-[#3e322b] font-serif font-bold uppercase tracking-widest text-[10px] sm:text-xs',
    numberContainerClass: 'my-5 bg-[#cbbda8] p-3 rounded-sm shadow-inner border border-[#a89a85]',
    numberClass: 'text-[#2c241f] font-serif tracking-[0.25em]',
    footerLeft: 'БЕЗ КОМПОСТЕРА',
    footerRight: 'НЕДЕЙСТВИТЕЛЕН',
    footerClass: 'text-[#3e322b] font-serif font-bold uppercase text-[9px] sm:text-[10px] tracking-wider',
    hasBarcode: false,
    pattern: 'radial-gradient(rgba(0,0,0,0.04) 2px, transparent 2px)'
  },
  {
    id: 'soviet-trolleybus',
    containerClass: 'bg-[#c2d1c0] rounded-sm shadow-lg p-5 sm:p-6 border border-[#4a5d4e] relative',
    icon: CableCar,
    iconClass: 'text-[#2f3e33]',
    title: 'ТРОЛЛЕЙБУС',
    subtitle: 'ГОРТРАНС',
    labelClass: 'text-[#2f3e33] font-serif font-bold uppercase tracking-widest text-xs',
    numberContainerClass: 'border-4 border-double border-[#4a5d4e] my-4 py-4 bg-[#b3c2b1]',
    numberClass: 'text-[#8b0000] font-serif tracking-[0.15em]',
    footerLeft: 'СОХРАНЯТЬ ДО',
    footerRight: 'КОНЦА ПОЕЗДКИ',
    footerClass: 'text-[#2f3e33] font-serif font-bold uppercase text-[9px] sm:text-[10px] tracking-widest',
    hasBarcode: false,
    pattern: 'none'
  }
];

export default function App() {
  const [digits, setDigits] = useState<string[]>([]);
  const [letters, setLetters] = useState<string[]>(['A', 'A', 'A']);
  const [gaps, setGaps] = useState<string[]>(['', '', '', '', '', '', '']);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(1);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [carBg, setCarBg] = useState(CAR_IMAGES[0]);
  const [ticketStyle, setTicketStyle] = useState(TICKET_STYLES[0]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing'>('idle');
  const [gameMode, setGameMode] = useState<'car' | 'ticket'>('car');
  const [isTelegram, setIsTelegram] = useState(false);
  
  const [carWidth, setCarWidth] = useState(800);
  const carContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setCarWidth(entry.contentRect.width);
      }
    });
    if (carContainerRef.current) {
      observer.observe(carContainerRef.current);
    }
    return () => observer.disconnect();
  }, [carBg, digits, country, gameMode]);

  const initGame = useCallback((startAsIdle = false) => {
    setDigits(generateSolvableTicket());
    
    const getRandomLetter = () => {
      const chars = 'ABCEHKMOPTXY'; // Authentic looking Latin letters used in RU plates
      return chars[Math.floor(Math.random() * chars.length)];
    };
    setLetters([getRandomLetter(), getRandomLetter(), getRandomLetter()]);

    setGaps(['', '', '', '', '', '', '']);
    setSelectedSlot(1);
    setWon(false);
    setCountry(COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]);
    setCarBg(CAR_IMAGES[Math.floor(Math.random() * CAR_IMAGES.length)]);
    setTicketStyle(TICKET_STYLES[Math.floor(Math.random() * TICKET_STYLES.length)]);
    setElapsedTime(0);
    setGameState(startAsIdle === true ? 'idle' : 'playing');
  }, []);

  useEffect(() => {
    // Initialize Telegram Web App
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegram(true);
      tg.ready();
      tg.expand();
      
      // Set theme based on Telegram settings
      // We force dark mode, so we don't need to read tg.colorScheme for the app theme
      
      // Set header color
      tg.setHeaderColor('#09090b'); // zinc-950
      
      // Setup Back Button
      tg.BackButton.onClick(() => {
        if (gameState === 'playing') {
          setGameState('idle');
        } else {
          tg.close();
        }
      });
    }
  }, [gameState]);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      if (gameState === 'playing') {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    }
  }, [gameState]);

  useEffect(() => {
    initGame(true);
  }, [initGame]);

  useEffect(() => {
    if (gameState !== 'playing' || won) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, won]);

  const handleOp = useCallback((op: string) => {
    if (selectedSlot === null || won) return;
    
    const newGaps = [...gaps];
    if (op === 'Backspace') {
      newGaps[selectedSlot] = newGaps[selectedSlot].slice(0, -1);
    } else {
      newGaps[selectedSlot] += op;
    }
    setGaps(newGaps);
  }, [selectedSlot, gaps, won]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (won) {
         if (e.key === 'Enter' || e.key === ' ') {
            initGame(false);
         }
         return;
      }
      if (selectedSlot === null) return;
      
      if (['+', '-', '*', '/', '(', ')', ','].includes(e.key)) {
        handleOp(e.key);
      } else if (e.key === '.') {
        handleOp(',');
      } else if (e.key === 'Backspace') {
        handleOp('Backspace');
      } else if (e.key === 'ArrowLeft') {
        setSelectedSlot(Math.max(0, selectedSlot - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedSlot(Math.min(6, selectedSlot + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSlot, handleOp, won, initGame, gameState]);

  const currentResult = digits.length ? calculateResult(digits, gaps) : 0;
  const isWin = Math.abs(currentResult - 100) < 0.0001;

  useEffect(() => {
    if (isWin && !won) {
      setWon(true);
      setGameState('idle');
      // Base score 500, subtract 5 points per second taken, minimum 50 points
      const calculatedPoints = Math.max(50, 500 - (elapsedTime * 5));
      setPointsEarned(calculatedPoints);
      setScore(s => s + calculatedPoints);
      setSelectedSlot(null);
    }
  }, [isWin, won, elapsedTime]);

  if (!digits.length) return null;

  const renderLicensePlate = () => {
    const numStr = digits.join('');
    
    return (
      <div className="bg-[#111] p-2 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <div className="relative bg-white text-black border-[3px] border-gray-300 rounded-lg flex items-center justify-between px-6 overflow-hidden z-10 h-24 w-[460px]">
          <div className="flex items-center" style={{ fontFamily: "'Arial Black', sans-serif" }}>
            <span className="text-[2.5rem] font-normal mr-2 mt-1">{letters[0]}</span>
            <span className="text-[4.5rem] leading-none font-black tracking-wider">{numStr.slice(0, 3)}</span>
            <span className="text-[2.5rem] font-normal ml-2 mt-1 tracking-widest">{letters[1]}{letters[2]}</span>
          </div>
          <div className="w-[3px] h-[80px] bg-black/80 mx-2"></div>
          <div className="flex items-center justify-center" style={{ fontFamily: "'Arial Black', sans-serif" }}>
            <span className="text-[3.5rem] leading-none font-black">{numStr.slice(3, 6)}</span>
          </div>
        </div>
        <div className="text-center text-white/80 text-[10px] tracking-[0.3em] mt-1.5 font-black">
          Make100
        </div>
      </div>
    );
  };

  const renderTicket = () => {
    const numStr = digits.join('');
    const Icon = ticketStyle.icon;
    
    return (
      <div className={`relative w-full max-w-sm mx-auto overflow-hidden ${ticketStyle.containerClass}`}>
        {/* Watermark / Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: ticketStyle.pattern, backgroundSize: '10px 10px' }}></div>
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Icon className={ticketStyle.iconClass} size={20} />
            <span className={ticketStyle.labelClass}>{ticketStyle.title}</span>
          </div>
          <span className={ticketStyle.labelClass}>{ticketStyle.subtitle}</span>
        </div>
        
        <div className={`py-6 sm:py-8 flex justify-center items-center relative z-10 ${ticketStyle.numberContainerClass}`}>
          <span className={`font-mono text-5xl sm:text-6xl font-black tracking-[0.2em] ml-3 ${ticketStyle.numberClass}`}>
            {numStr}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-4 relative z-10">
          <span className={ticketStyle.footerClass}>{ticketStyle.footerLeft}</span>
          <span className={ticketStyle.footerClass}>{ticketStyle.footerRight}</span>
        </div>
        
        {/* Barcode */}
        {ticketStyle.hasBarcode && (
          <div className="h-10 w-full opacity-40 mt-6 relative z-10" style={{ backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 8px, currentColor 8px, currentColor 12px, transparent 12px, transparent 14px)' }}></div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-[100dvh] dark bg-zinc-950 text-zinc-100 transition-colors duration-300 font-sans overflow-hidden relative flex flex-col items-center p-2 sm:p-4 md:p-6`}>
      <div className={`fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]`} />
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-2 sm:mb-4 z-10 flex-shrink-0">
         <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-md">Make100</h1>
         </div>

         {/* Desktop Mode Selector */}
         <div className="hidden sm:flex bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl gap-1 border border-zinc-800/50">
           <button 
             onClick={() => setGameMode('car')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${gameMode === 'car' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
           >
             Автомобиль
           </button>
           <button 
             onClick={() => setGameMode('ticket')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${gameMode === 'ticket' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
           >
             Билет
           </button>
         </div>

         <div className="flex gap-2 sm:gap-3">
           <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50 px-3 sm:px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
              <Timer className="w-4 h-4 text-zinc-400" />
              <span className="font-mono text-base sm:text-lg font-bold text-zinc-200">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
           </div>

           <div className="bg-zinc-100/90 backdrop-blur-md px-4 sm:px-5 py-2 rounded-2xl flex items-center gap-2 sm:gap-3 shadow-md border border-black/10">
              <span className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:inline">Очки</span>
              <span className="font-mono text-lg sm:text-xl font-black text-zinc-900">{score}</span>
           </div>
         </div>
      </header>

      {/* Mobile Mode Selector */}
      <div className="sm:hidden w-full max-w-4xl flex justify-center mb-2 z-10 flex-shrink-0">
         <div className="bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl flex gap-1 border border-zinc-800/50 w-full">
           <button 
             onClick={() => setGameMode('car')}
             className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${gameMode === 'car' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
           >
             Автомобиль
           </button>
           <button 
             onClick={() => setGameMode('ticket')}
             className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${gameMode === 'ticket' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
           >
             Билет
           </button>
         </div>
      </div>

      {/* Visual Block (Car or Ticket) */}
      <div className="flex-1 min-h-0 w-full max-w-4xl flex items-center justify-center mb-2 sm:mb-4 z-10 relative">
        {gameMode === 'car' ? (
          <motion.div 
            key={digits.join('') + country.format + 'car'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden"
            style={{ maxHeight: '100%', maxWidth: '100%' }}
            ref={carContainerRef}
          >
            <img 
              src={carBg.url} 
              alt="Car" 
              className="block rounded-2xl sm:rounded-3xl" 
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
            
            {/* The Plate positioned naturally on the car */}
            <div 
              className="absolute origin-center z-20"
              style={{
                top: carBg.top,
                left: carBg.left,
                transform: `translate(-50%, -50%) scale(${(carWidth / 800) * carBg.baseScale}) rotateX(${carBg.rotateX || '0deg'}) rotateZ(${carBg.rotateZ || '0deg'})`,
                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.7))',
                transformStyle: 'preserve-3d'
              }}
            >
              {renderLicensePlate()}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={digits.join('') + 'ticket'}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md max-h-full flex items-center justify-center"
          >
            <div className="scale-[0.8] sm:scale-100 origin-center w-full">
              {renderTicket()}
            </div>
          </motion.div>
        )}
      </div>

      <div className="w-full flex flex-col items-center z-10 mt-auto flex-shrink-0">
        {/* Expression Builder */}
        <div className="w-full max-w-5xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white/30 dark:border-zinc-800/60 p-2 sm:p-4 md:p-6 rounded-2xl sm:rounded-[2rem] shadow-2xl mb-2 sm:mb-4 transition-colors flex flex-col items-center">
          <div className="flex flex-nowrap justify-center items-center gap-[clamp(0.25rem,1vw,0.75rem)] text-[clamp(1.5rem,6vw,4rem)] font-mono font-black text-zinc-900 dark:text-white py-1 sm:py-2 w-full">
            <Gap idx={0} value={gaps[0]} selected={selectedSlot === 0} onClick={setSelectedSlot} />
            
            {digits.map((digit, idx) => (
              <React.Fragment key={idx}>
                <span className="text-zinc-800 dark:text-zinc-200 drop-shadow-sm select-none flex-shrink-0">{digit}</span>
                <Gap idx={idx + 1} value={gaps[idx + 1]} selected={selectedSlot === idx + 1} onClick={setSelectedSlot} />
              </React.Fragment>
            ))}
          </div>

          <div className="mt-2 sm:mt-3 md:mt-4 flex items-center justify-center text-2xl sm:text-4xl md:text-6xl font-mono font-black">
            <span className="text-zinc-300 dark:text-zinc-600 mr-3 sm:mr-6">=</span>
            <span className={`transition-colors duration-300 ${isWin ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`}>
              {Number.isNaN(currentResult) ? '?' : Number.isInteger(currentResult) ? currentResult : Number(currentResult.toFixed(2))}
            </span>
          </div>
          
          <p className="text-center text-zinc-400 dark:text-zinc-500 text-xs sm:text-sm md:text-base mt-2 md:mt-3 font-bold">Нажимайте на промежутки и вставляйте знаки</p>
        </div>

        {/* Keypad */}
        <div className="flex gap-1 sm:gap-2 flex-nowrap justify-between sm:justify-center w-full max-w-3xl px-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <OperatorButton op="+" icon={<Plus size={20} strokeWidth={3} />} onClick={() => handleOp('+')} />
          <OperatorButton op="-" icon={<Minus size={20} strokeWidth={3} />} onClick={() => handleOp('-')} />
          <OperatorButton op="*" icon={<X size={20} strokeWidth={3} />} onClick={() => handleOp('*')} />
          <OperatorButton op="/" icon={<Divide size={20} strokeWidth={3} />} onClick={() => handleOp('/')} />
          <OperatorButton op="(" icon={<span className="text-xl font-black">(</span>} onClick={() => handleOp('(')} />
          <OperatorButton op=")" icon={<span className="text-xl font-black">)</span>} onClick={() => handleOp(')')} />
          <OperatorButton op="," icon={<span className="text-xl font-black">,</span>} onClick={() => handleOp(',')} />
          <OperatorButton op="Backspace" icon={<Delete size={20} strokeWidth={2.5} />} onClick={() => handleOp('Backspace')} variant="danger" />
        </div>

        {/* Skip Button */}
        <button 
          onClick={() => initGame(false)}
          className="mt-2 sm:mt-4 flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-white/20 dark:border-zinc-800/50 text-white/80 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-zinc-800 transition-all font-bold tracking-wide backdrop-blur-md text-sm sm:text-base"
        >
          <RefreshCw size={18} />
          {gameMode === 'car' ? 'Другая машина' : 'Другой билет'}
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {gameState === 'idle' && !won && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-zinc-100 dark:border-zinc-800 relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                <Play size={36} className="ml-2" fill="currentColor" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tighter">Make100</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg leading-relaxed">Соберите 100 из цифр на номере автомобиля или билете, используя математические знаки.</p>
              <button 
                onClick={() => setGameState('playing')}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl rounded-2xl transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.35)] hover:-translate-y-1"
              >
                Старт
              </button>
            </motion.div>
          </motion.div>
        )}

        {won && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-zinc-100 dark:border-zinc-800 relative overflow-hidden"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-5xl sm:text-6xl">🎉</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-3 tracking-tighter">Идеально!</h2>
              <div className="flex flex-col items-center gap-1 mb-8">
                <p className="text-lg text-zinc-500 dark:text-zinc-400">Время: <span className="font-mono text-zinc-900 dark:text-white font-bold">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span></p>
                <p className="text-2xl sm:text-3xl text-green-500 font-black">+{pointsEarned} очков</p>
              </div>
              <button 
                onClick={() => initGame(false)}
                className="w-full py-4 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-black text-xl rounded-2xl transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] hover:-translate-y-1"
              >
                {gameMode === 'car' ? 'Следующая машина' : 'Следующий билет'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Gap({ idx, value, selected, onClick }: { idx: number, value: string, selected: boolean, onClick: (idx: number) => void }) {
  return (
    <button
      onClick={() => onClick(idx)}
      className={`w-[clamp(1.25rem,6vw,3.5rem)] h-[clamp(1.75rem,8vw,4.5rem)] rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all duration-200 outline-none font-bold flex-shrink-0 ${
        selected
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-[0_0_0_4px_rgba(249,115,22,0.15)] scale-110 z-20'
          : value
            ? 'border-zinc-800 dark:border-zinc-200 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm z-10'
            : 'border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 z-10'
      }`}
    >
      {value ? (
        <span className="text-[clamp(1rem,5vw,2.5rem)]">{value}</span>
      ) : (
        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
      )}
    </button>
  );
}

function OperatorButton({ op, icon, onClick, variant = 'default' }: { op: string, icon: React.ReactNode, onClick: () => void, variant?: 'default' | 'danger' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center flex-1 min-w-[2rem] sm:min-w-[2.5rem] max-w-[3rem] sm:max-w-[3.5rem] md:max-w-[4rem] h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl font-bold transition-all active:scale-95 border-2 flex-shrink-0 ${
        variant === 'danger'
          ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-200 dark:hover:border-red-500/40 shadow-sm'
          : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm'
      }`}
    >
      {icon}
    </button>
  );
}
