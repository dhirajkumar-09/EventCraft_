import React from 'react';

/**
 * EventCraft AI Bespoke Brand Logo & Avatar
 * Combines a luxury celebratory arch, radiant crown diamond, and AI intelligence sparks
 */
export default function EventCraftLogo({ size = 40, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #b45309 0%, #e11d48 50%, #6d28d9 100%)',
        boxShadow: '0 8px 20px -4px rgba(225, 29, 72, 0.35)'
      }}
      aria-label="EventCraft AI Logo"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>
          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Celebratory Mandap / Archway Outline */}
        <path
          d="M20 78 V48 C20 31.43 33.43 18 50 18 C66.57 18 80 31.43 80 48 V78"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#shadowGlow)"
        />

        {/* Inner Decorative Arch */}
        <path
          d="M30 78 V50 C30 38.95 38.95 30 50 30 C61.05 30 70 38.95 70 50 V78"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="3 3"
          strokeOpacity="0.75"
        />

        {/* Central Crown Diamond */}
        <path
          d="M50 38 L58 48 L50 62 L42 48 Z"
          fill="url(#glowGradient)"
          filter="url(#shadowGlow)"
        />

        {/* Celebration Star Burst on Peak */}
        <path
          d="M50 8 L52.5 14 L58.5 16.5 L52.5 19 L50 25 L47.5 19 L41.5 16.5 L47.5 14 Z"
          fill="#FFFFFF"
          filter="url(#shadowGlow)"
        />

        {/* Small Ambient Sparkles */}
        <circle cx="26" cy="32" r="2.5" fill="#FEF08A" />
        <circle cx="74" cy="32" r="2.5" fill="#FEF08A" />
        <circle cx="50" cy="74" r="3" fill="url(#goldGradient)" />
      </svg>
    </div>
  );
}
