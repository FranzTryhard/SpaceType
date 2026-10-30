/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'test' | 'stats' | 'about';
  setActiveTab: (tab: 'home' | 'test' | 'stats' | 'about') => void;
  onStartTesting: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onStartTesting,
}) => {
  const isTestingView = activeTab === 'test';

  return (
    <header className="relative z-30 w-full border-b border-slate-800/60 bg-[#0d0b1d]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Left: Futuristic Brand Lockup */}
        <button
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-2.5 text-left select-none cursor-pointer whitespace-nowrap shrink-0 transition-opacity hover:opacity-95"
          aria-label="SpaceType Home"
        >
          {/* Cybernetic geometric keycap emblem */}
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5b8cff] to-[#a855f7] p-[1.5px] shadow-[0_0_15px_rgba(91,140,255,0.45)] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-[6.5px] bg-[#0d0b1d] flex items-center justify-center">
              <span className="font-brand font-black text-xs text-transparent bg-clip-text bg-gradient-to-br from-white via-[#b8d3ff] to-[#a855f7]">
                S
              </span>
            </div>
          </div>

          {/* Futuristic Typography in Orbitron */}
          <div className="flex items-center tracking-[0.22em] font-brand font-black text-[15px] sm:text-base uppercase">
            <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]">
              SPACE
            </span>
            <span className="mx-1 text-transparent bg-clip-text bg-gradient-to-r from-[#5b8cff] to-[#a855f7] font-sans font-light tracking-normal drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
              //
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8d3ff] to-[#e0edff] drop-shadow-[0_0_8px_rgba(91,140,255,0.4)]">
              TYPE
            </span>
          </div>
        </button>

        {/* Center: Clean Nav Links (when not on bare test screen) */}
        {!isTestingView ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'text-white border-b-2 border-white'
                  : 'hover:text-slate-200 border-b-2 border-transparent'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className="transition-colors pb-0.5 hover:text-slate-200 border-b-2 border-transparent cursor-pointer"
            >
              Test
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'stats'
                  ? 'text-white border-b-2 border-white'
                  : 'hover:text-slate-200 border-b-2 border-transparent'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'about'
                  ? 'text-white border-b-2 border-white'
                  : 'hover:text-slate-200 border-b-2 border-transparent'
              }`}
            >
              About
            </button>
          </nav>
        ) : (
          <div />
        )}

        {/* Right Action */}
        <div>
          {isTestingView ? (
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          ) : (
            <button
              onClick={onStartTesting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-purple-500/10"
            >
              <span>Start Testing</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
