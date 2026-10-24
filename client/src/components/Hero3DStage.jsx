import React, { useState, useRef } from 'react';
import EventCraftLogo from './EventCraftLogo.jsx';
import {
  Sparkles,
  PieChart,
  Calendar,
  CheckSquare,
  Lightbulb,
  Clock,
  ShieldAlert
} from 'lucide-react';

const REAL_MODULES = [
  { id: 'overview', icon: Sparkles, label: 'Theme & Vibe', desc: 'Curated themes & color palettes' },
  { id: 'budget', icon: PieChart, label: 'Strict Budget Math', desc: '100% balanced with 10% cushion' },
  { id: 'timeline', icon: Calendar, label: 'Adaptive Timeline', desc: 'Custom countdown to event day' },
  { id: 'vendors', icon: CheckSquare, label: 'Vendor Playbook', desc: 'Negotiation scripts & cost bands' },
  { id: 'wow', icon: Lightbulb, label: '3 Wow Moments', desc: 'Unforgettable surprise elements' },
  { id: 'runsheet', icon: Clock, label: 'Master Run Sheet', desc: 'Hour-by-hour operational cues' },
  { id: 'backup', icon: ShieldAlert, label: 'Risk Contingencies', desc: 'Top 3 risks & mitigation plans' }
];

export default function Hero3DStage() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeModule, setActiveModule] = useState(0);

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

  const currentMod = REAL_MODULES[activeModule];
  const Icon = currentMod.icon;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-3xl mx-auto my-6 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Interactive Stage Container */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-purple-600/10 dark:from-amber-950/30 dark:via-slate-900/40 dark:to-purple-950/30 border border-amber-300/60 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-out backdrop-blur-md overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-mousePos.y * 7}deg) rotateY(${mousePos.x * 9}deg)`
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: 3D Animated Logo Emblem with Rotating Golden Orbit Ring */}
          <div className="relative flex items-center justify-center shrink-0 w-36 h-36 sm:w-40 sm:h-40">
            {/* 3D Orbit Ring 1 */}
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 dark:border-amber-400/40 animate-[spin_16s_linear_infinite]"
              style={{ transform: 'rotateX(60deg)' }}
            />
            {/* 3D Orbit Ring 2 */}
            <div
              className="absolute inset-2 rounded-full border border-rose-400/40 dark:border-rose-400/30 animate-[spin_22s_linear_infinite_reverse]"
              style={{ transform: 'rotateY(60deg)' }}
            />
            {/* Glowing Center Logo Avatar */}
            <div
              className="relative z-10 transition-transform duration-300"
              style={{
                transform: `translateZ(30px) translateX(${mousePos.x * 6}px) translateY(${mousePos.y * 6}px)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <EventCraftLogo size={74} />
            </div>
          </div>

          {/* Right: Active Real Module Display */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Core Planning Pillar {activeModule + 1} of 7</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{currentMod.label}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              {currentMod.desc}
            </p>

            {/* Interactive Module Indicator Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-4">
              {REAL_MODULES.map((mod, idx) => {
                const isSelected = activeModule === idx;
                const ModIcon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(idx)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-sm scale-105'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <ModIcon className="w-3 h-3" />
                    <span>{mod.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
