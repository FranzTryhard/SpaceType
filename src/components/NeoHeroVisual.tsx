/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface NeoHeroVisualProps {
  reducedMotion?: boolean;
}

export const NeoHeroVisual: React.FC<NeoHeroVisualProps> = ({ reducedMotion = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none"
    >
      {/* Ambient background soft glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#a855f7]/20 via-[#5b8cff]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative vertical quote right beside the 3D art */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center text-[10px] tracking-[0.25em] text-slate-400 font-medium font-sans leading-relaxed pointer-events-none z-20">
        <span className="opacity-70">BETTER</span>
        <span className="opacity-70">TYPING</span>
        <span className="opacity-70">BUILDS A</span>
        <span className="opacity-70">SHARPER</span>
        <span className="opacity-90 text-white font-semibold">YOU</span>
        <span className="w-5 h-[1px] bg-slate-600 my-2" />
      </div>

      {/* 3D Glass Torus & Orb Stage */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
        {/* Outer glowing iridescent torus ring */}
        <div
          className={`absolute inset-0 rounded-full border-[22px] border-transparent transition-transform duration-1000 ${
            reducedMotion ? '' : 'animate-[spin_24s_linear_infinite]'
          }`}
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, #5b8cff 0deg, #a855f7 120deg, #38bdf8 240deg, #5b8cff 360deg)',
            mask: 'radial-gradient(transparent 58%, black 60%)',
            WebkitMask: 'radial-gradient(transparent 58%, black 60%)',
            boxShadow: '0 0 50px rgba(168, 85, 247, 0.4), inset 0 0 30px rgba(91, 140, 255, 0.3)',
            filter: 'drop-shadow(0 15px 35px rgba(91, 140, 255, 0.35))',
          }}
        />

        {/* Inner secondary tilted translucent band */}
        <div
          className={`absolute w-60 h-60 rounded-full border-[14px] border-transparent opacity-80 ${
            reducedMotion ? '' : 'animate-[spin_18s_linear_infinite_reverse]'
          }`}
          style={{
            transform: 'rotateX(55deg) rotateY(25deg)',
            background:
              'conic-gradient(from 0deg at 50% 50%, #a855f7 0deg, #5b8cff 180deg, #a855f7 360deg)',
            mask: 'radial-gradient(transparent 62%, black 64%)',
            WebkitMask: 'radial-gradient(transparent 62%, black 64%)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Centered Floating Glass Keycap "T" */}
        <div
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-[2px] transition-transform duration-700 hover:scale-105 cursor-pointer ${
            reducedMotion ? '' : 'animate-[bounce_4s_ease-in-out_infinite]'
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(91, 140, 255, 0.2) 50%, rgba(168, 85, 247, 0.5) 100%)',
            boxShadow:
              '0 20px 40px rgba(13, 11, 29, 0.8), 0 0 30px rgba(91, 140, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.3)',
            transform: 'rotate(-12deg) skew(-4deg)',
          }}
        >
          {/* Inner frosted glass surface */}
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-white/20 via-slate-900/60 to-purple-950/80 backdrop-blur-md flex items-center justify-center border border-white/40">
            {/* Top keycap bevel highlight */}
            <div className="absolute top-1 left-2 right-2 h-2 rounded-t-lg bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            <span className="text-4xl sm:text-5xl font-bold font-sans text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)] tracking-tight">
              T
            </span>
          </div>
        </div>

        {/* Orbiting Glass Spheres */}
        <div
          className="absolute -top-3 left-10 w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-300 shadow-[0_0_15px_rgba(168,85,247,0.7)] opacity-90"
        />
        <div
          className="absolute bottom-4 right-12 w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-white shadow-[0_0_12px_rgba(91,140,255,0.8)]"
        />
        <div
          className="absolute top-1/2 -left-6 w-3.5 h-3.5 rounded-full bg-purple-400/80 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
        />

        {/* Subtle 4-point star sparkles */}
        <div className="absolute top-8 right-6 text-purple-300/80 text-xl font-thin select-none pointer-events-none">
          ✦
        </div>
      </div>
    </div>
  );
};
