/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NeoHeroVisual } from './NeoHeroVisual.tsx';

interface HeroViewProps {
  onStartTest: () => void;
  reducedMotion?: boolean;
}

export const HeroView: React.FC<HeroViewProps> = ({ onStartTest, reducedMotion = false }) => {
  return (
    <div className="relative w-full flex flex-col justify-center py-6 sm:py-10 lg:py-14 select-none">
      {/* Hero 2-Column Split matching exact design layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Typography & CTAs (Span 6 on large screens) */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-7 z-10">
          {/* Overline Kicker */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase font-mono">
            <span className="text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              TYPE FASTER.
            </span>
            <span className="text-[#c084fc] drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]">
              THINK CLEARER.
            </span>
          </div>

          {/* Large Hero Title in Space Grotesk */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white tracking-[-0.03em] leading-[1.08] font-display">
            Unlock Your <br />
            Typing Potential
          </h1>

          {/* Subtitle matching exact copy */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg font-sans">
            SpaceType is a modern typing test designed to help you improve your speed, accuracy,
            and focus. <br className="hidden sm:inline" />
            Simple. Fast. Futuristic.
          </p>

          {/* CTA Pill Button with soft intense blue/purple glow */}
          <div className="pt-2">
            <button
              onClick={onStartTest}
              className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full text-slate-950 font-display font-bold text-sm sm:text-base tracking-tight transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #e0edff 0%, #c4b5fd 40%, #60a5fa 100%)',
                boxShadow: '0 12px 35px rgba(96, 165, 250, 0.45), 0 0 25px rgba(168, 85, 247, 0.35)',
              }}
            >
              <span>Start Test</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right Column: 3D Visual Art (Span 6 on large screens) */}
        <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
          <NeoHeroVisual reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
};
