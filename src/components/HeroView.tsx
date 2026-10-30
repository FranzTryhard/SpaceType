/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, TrendingUp, Layers, Sparkles } from 'lucide-react';
import { NeoHeroVisual } from './NeoHeroVisual.tsx';

interface HeroViewProps {
  onStartTest: () => void;
  reducedMotion?: boolean;
}

export const HeroView: React.FC<HeroViewProps> = ({ onStartTest, reducedMotion = false }) => {
  return (
    <div className="w-full flex flex-col justify-center py-6 sm:py-12">
      {/* Hero 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Kicker */}
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase font-display">
            <span className="text-[#5b8cff]">TYPE FASTER.</span>
            <span className="text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              THINK CLEARER.
            </span>
          </div>

          {/* Large Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-bold text-white tracking-[-0.03em] leading-[1.08] font-display">
            Unlock Your <br />
            Typing Potential
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg font-sans">
            SpaceType is a modern typing test designed to help you improve your speed, accuracy,
            and focus. Simple. Fast. Futuristic.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={onStartTest}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-slate-950 font-display font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #e0edff 0%, #b8d3ff 40%, #a855f7 100%)',
                boxShadow: '0 8px 30px rgba(168, 85, 247, 0.35)',
              }}
            >
              <span>Start Test</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* 3 Feature Callout Strip */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-800/60">
            {/* 1. Track Progress */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900/60 flex items-center justify-center shrink-0 text-[#5b8cff]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block font-display">Track Progress</span>
                <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug font-sans">
                  See your improvement over time
                </span>
              </div>
            </div>

            {/* 2. Multiple Modes */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900/60 flex items-center justify-center shrink-0 text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block font-display">Multiple Modes</span>
                <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug font-sans">
                  Choose from different test types
                </span>
              </div>
            </div>

            {/* 3. Detailed Analytics */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900/60 flex items-center justify-center shrink-0 text-cyan-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block font-display">Detailed Analytics</span>
                <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug font-sans">
                  Get insights and boost your skills
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visual Art & Glass Keycap */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <NeoHeroVisual reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
};
