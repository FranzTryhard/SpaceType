/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Layers, Box, MousePointer } from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const [inputValue, setInputValue] = useState('Input Field Preview');
  const [activeToggle, setActiveToggle] = useState(true);

  const colors = [
    { name: 'Deep Space', hex: '#0D0B1D', role: 'Canvas Background' },
    { name: 'Electric Blue', hex: '#5B8CFF', role: 'Primary Focus Accent' },
    { name: 'Purple Glow', hex: '#A855F7', role: 'Radiant Luminous Accent' },
    { name: 'Light Accent', hex: '#E0EDFF', role: 'Text & Pill Radiance' },
  ];

  const features = [
    {
      icon: Box,
      title: '3D Abstract Shapes',
      desc: 'Floating elements, gradients, and soft lighting.',
    },
    {
      icon: Layers,
      title: 'Glassmorphism UI',
      desc: 'Translucent panels with blur effects.',
    },
    {
      icon: Sparkles,
      title: 'Smooth Animations',
      desc: 'Subtle motion for a premium feel.',
    },
    {
      icon: MousePointer,
      title: 'Interactive Elements',
      desc: 'Hover effects, dynamic cursors, and micro-interactions.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 select-none py-4">
      {/* Design System Header Banner */}
      <div className="p-6 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
        <h2 className="text-xl font-bold text-white tracking-tight">SpaceType Design System</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          The official neo-futuristic design tokens, typographic hierarchy, glassmorphism layers, and
          interactive components powering the SpaceType typing engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Colors, Typography & UI Elements (7 cols) */}
        <div className="lg:col-span-7 p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
              Colors
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {colors.map((c) => (
                <div key={c.name} className="space-y-2">
                  <div
                    className="w-14 h-14 rounded-full border border-white/20 shadow-lg"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">{c.name}</span>
                    <span className="text-[11px] font-typing text-slate-400 block">{c.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="pt-6 border-t border-slate-800/80">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Typography
            </h3>
            <div className="space-y-2">
              <span className="text-lg font-bold text-white block font-sans">Space Grotesk</span>
              <p className="text-xs text-slate-400 font-sans tracking-wide leading-relaxed">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll <br />
                Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz <br />
                0123456789
              </p>
            </div>
          </div>

          {/* UI Elements */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              UI Elements
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              {/* Start Test Primary Button */}
              <button
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-slate-950 font-semibold text-xs transition-transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #e0edff 0%, #b8d3ff 40%, #a855f7 100%)',
                  boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
                }}
              >
                <span>Start Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Secondary Button */}
              <button className="px-6 py-2.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-medium hover:text-white transition-colors cursor-pointer">
                Secondary Button
              </button>

              {/* Active State Pill */}
              <button
                onClick={() => setActiveToggle(!activeToggle)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                  activeToggle
                    ? 'border-[#5b8cff] bg-[#5b8cff]/15 text-[#5b8cff]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${activeToggle ? 'bg-[#5b8cff]' : 'bg-slate-500'}`}
                />
                <span>Active State</span>
              </button>
            </div>

            {/* Input Field preview */}
            <div className="pt-2 max-w-sm">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-slate-950/80 border border-slate-700 rounded-xl text-white font-sans focus:outline-hidden focus:border-[#5b8cff] transition-colors"
                placeholder="Input field..."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Key Features / Visual Elements (5 cols) */}
        <div className="lg:col-span-5 p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl space-y-6">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
            Key Features / Visual Elements
          </h3>

          <div className="space-y-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center shrink-0 text-[#a855f7] shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtitle tag from bottom of mockup */}
          <div className="pt-6 border-t border-slate-800/80 text-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-medium font-brand">
              SPACE//TYPE — PRACTICE TODAY. TYPE BETTER TOMORROW.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
