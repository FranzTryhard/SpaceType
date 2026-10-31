/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, ArrowLeft, Sliders } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'test' | 'stats' | 'about';
  setActiveTab: (tab: 'home' | 'test' | 'stats' | 'about') => void;
  onStartTesting: () => void;
  onOpenSettings?: () => void;
}

interface NavItem {
  id: 'home' | 'test' | 'stats' | 'about';
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'test', label: 'Test' },
  { id: 'stats', label: 'Stats' },
  { id: 'about', label: 'About' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onStartTesting,
  onOpenSettings,
}) => {
  const isTestingView = activeTab === 'test';

  return (
    <header className="relative z-30 w-full px-3 sm:px-6 pt-4 sm:pt-6 pb-2 select-none">
      {/* Floating Capsule Glassmorphism Container matching reference mockup */}
      <div
        className="max-w-6xl mx-auto rounded-full relative overflow-hidden backdrop-blur-2xl transition-all duration-300"
        style={{
          background:
            'linear-gradient(135deg, rgba(13, 10, 29, 0.78) 0%, rgba(8, 6, 20, 0.72) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.22)',
          boxShadow:
            '0 12px 36px -6px rgba(0, 0, 0, 0.55), 0 0 25px -4px rgba(168, 85, 247, 0.22), 0 0 35px -8px rgba(56, 189, 248, 0.16), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 2px 0 rgba(168, 85, 247, 0.12)',
        }}
      >
        {/* Ambient Cosmic Corner Glows matching reference */}
        <div
          aria-hidden="true"
          className="absolute -top-10 -left-10 w-44 h-24 rounded-full bg-purple-600/25 blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 -right-10 w-44 h-24 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
        />

        <div className="relative px-4 sm:px-7 h-14 sm:h-[66px] flex items-center justify-between gap-3 sm:gap-6">
          {/* 1. Left: SpaceType Logo Lockup */}
          <button
            onClick={() => setActiveTab('home')}
            className="group flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer whitespace-nowrap shrink-0 transition-opacity hover:opacity-95"
            aria-label="SpaceType Home"
          >
            {/* Square S logo with purple-blue gradient outline */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#38bdf8] via-[#818cf8] to-[#c084fc] p-[1.5px] shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-transform duration-200 group-hover:scale-105">
              <div className="w-full h-full rounded-[10px] bg-[#0c091d] flex items-center justify-center">
                <span className="font-display font-bold text-xs sm:text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  S
                </span>
              </div>
            </div>

            {/* SpaceType Wordmark: "Space" (white) + "Type" (purple gradient) */}
            <div className="flex items-center font-display font-bold text-base sm:text-lg tracking-tight">
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
                Space
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc] drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
                Type
              </span>
            </div>
          </button>

          {/* 2. Center: Clean Navigation Links */}
          <nav className="flex items-center gap-3 sm:gap-8 md:gap-10 text-xs sm:text-sm font-display">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-2 px-1 sm:px-1.5 transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 font-medium'
                  }`}
                >
                  <span>{item.label}</span>

                  {/* Active Indicator: Thin purple-blue glowing bar with soft underglow */}
                  {isActive && (
                    <div className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                      <span className="w-6 sm:w-9 h-[2.5px] rounded-full bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#38bdf8] shadow-[0_0_10px_rgba(168,85,247,0.9),0_0_16px_rgba(56,189,248,0.7)]" />
                      <span className="w-10 sm:w-12 h-3 -mt-2 bg-purple-500/35 blur-sm rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right: Settings Icon, Vertical Divider & Start Testing Action Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Subtle Vertical Divider */}
            <div className="h-4 sm:h-5 w-[1px] bg-slate-700/60" />

            {/* Settings Icon with Cyan Accent & Minimal Hover Glow */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1.5 sm:p-2 text-[#22d3ee] hover:text-cyan-300 rounded-full transition-all duration-200 cursor-pointer hover:bg-cyan-500/10 hover:shadow-[0_0_12px_rgba(34,211,238,0.45)] group"
                title="Configuration & Sound Packs"
                aria-label="Open settings"
              >
                <Sliders className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:rotate-45" />
              </button>
            )}

            {/* Start Testing / Back to Home Button */}
            {isTestingView ? (
              <button
                onClick={() => setActiveTab('home')}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-display font-medium text-white transition-all duration-300 cursor-pointer border border-slate-700/70 hover:border-[#818cf8]/70 bg-[#120f26]/60 hover:bg-[#181335]/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.35),0_0_10px_rgba(56,189,248,0.2)] active:scale-[0.98]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
            ) : (
              <button
                onClick={onStartTesting}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-display font-medium text-white transition-all duration-300 cursor-pointer border border-slate-700/70 hover:border-[#818cf8]/70 bg-[#120f26]/60 hover:bg-[#181335]/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.35),0_0_10px_rgba(56,189,248,0.2)] active:scale-[0.98]"
              >
                <span className="whitespace-nowrap">Start Testing</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
