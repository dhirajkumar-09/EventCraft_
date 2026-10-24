import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Crown, Gem, Music, ShieldCheck, Flame } from 'lucide-react';

export default function Hero3DStage() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-2xl mx-auto h-56 sm:h-64 my-6 flex items-center justify-center overflow-visible select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Root Platform */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-mousePos.y * 14}deg) rotateY(${mousePos.x * 18}deg)`
        }}
      >
        {/* Glowing Base Platform Disc */}
        <div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-amber-400/40 dark:border-amber-500/30 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-600/10 dark:from-amber-600/20 dark:via-rose-900/20 dark:to-purple-900/20 blur-xs shadow-2xl shadow-amber-500/20"
          style={{
            transform: 'rotateX(75deg) translateZ(-40px)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* 3D Golden Orbit Ring 1 (Rotates continuously) */}
        <div
          className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border-[2.5px] border-dashed border-amber-400/70 dark:border-amber-300/60 animate-[spin_18s_linear_infinite]"
          style={{
            transform: 'rotateX(65deg) rotateY(25deg)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* 3D Golden Orbit Ring 2 (Counter-rotates) */}
        <div
          className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-rose-400/50 dark:border-rose-300/40 animate-[spin_24s_linear_infinite_reverse]"
          style={{
            transform: 'rotateX(55deg) rotateY(-35deg)',
            transformStyle: 'preserve-3d'
          }}
        />

        {/* Central 3D Floating Celebration Crystal Sphere */}
        <div
          className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-600 via-rose-500 to-purple-600 p-[2px] shadow-2xl shadow-amber-600/40 animate-pulse"
          style={{
            transform: 'translateZ(50px) rotateZ(12deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="w-full h-full rounded-[22px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center border border-amber-200/60 dark:border-slate-700">
            <Sparkles className="w-8 h-8 text-amber-500 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 mt-1">
              EventCraft
            </span>
            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
              3D AI Engine
            </span>
          </div>
        </div>

        {/* 3D Floating Satellite Badge 1 (Top Left): 100% Budget */}
        <div
          className="absolute -top-1 sm:top-2 left-4 sm:left-12 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/95 border border-emerald-300 dark:border-emerald-700 shadow-xl shadow-emerald-600/10 flex items-center gap-2 backdrop-blur-md transition-transform duration-300"
          style={{
            transform: `translateZ(65px) translateX(${mousePos.x * -12}px) translateY(${mousePos.y * -12}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-black text-slate-900 dark:text-white">
            100% Strict Budget Math
          </span>
        </div>

        {/* 3D Floating Satellite Badge 2 (Top Right): 3 Wow Moments */}
        <div
          className="absolute -top-1 sm:top-2 right-4 sm:right-12 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/95 border border-rose-300 dark:border-rose-700 shadow-xl shadow-rose-600/10 flex items-center gap-2 backdrop-blur-md transition-transform duration-300"
          style={{
            transform: `translateZ(75px) translateX(${mousePos.x * 14}px) translateY(${mousePos.y * -10}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-xs font-black text-slate-900 dark:text-white">
            3 Unique Wow Moments
          </span>
        </div>

        {/* 3D Floating Satellite Badge 3 (Bottom Left): Adaptive Countdown */}
        <div
          className="absolute bottom-2 sm:bottom-4 left-6 sm:left-16 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/95 border border-amber-300 dark:border-amber-700 shadow-xl shadow-amber-600/10 flex items-center gap-2 backdrop-blur-md transition-transform duration-300"
          style={{
            transform: `translateZ(55px) translateX(${mousePos.x * -10}px) translateY(${mousePos.y * 14}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-black text-slate-900 dark:text-white">
            Adaptive T-Day Milestones
          </span>
        </div>

        {/* 3D Floating Satellite Badge 4 (Bottom Right): Verified PDF Export */}
        <div
          className="absolute bottom-2 sm:bottom-4 right-6 sm:right-16 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/95 border border-purple-300 dark:border-purple-700 shadow-xl shadow-purple-600/10 flex items-center gap-2 backdrop-blur-md transition-transform duration-300"
          style={{
            transform: `translateZ(60px) translateX(${mousePos.x * 12}px) translateY(${mousePos.y * 12}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-xs font-black text-slate-900 dark:text-white">
            Structured PDF Export
          </span>
        </div>
      </div>
    </div>
  );
}
