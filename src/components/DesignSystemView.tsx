/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Layers, Box, MousePointer, Hash, Clock, AlignLeft } from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const [inputValue, setInputValue] = useState('Type your input here...');
  const [activeToggle, setActiveToggle] = useState(true);
  const [sampleMetric, setSampleMetric] = useState(118);

  const colors = [
    { name: 'Deep Space', hex: '#0D0B1D', role: 'Canvas Background' },
    { name: 'Electric Blue', hex: '#5B8CFF', role: 'Primary Focus Accent' },
    { name: 'Purple Glow', hex: '#A855F7', role: 'Radiant Luminous Accent' },
    { name: 'Light Accent', hex: '#E0EDFF', role: 'Text & Pill Radiance' },
  ];

  const typographySpecs = [
    {
      name: 'Space Grotesk',
      role: 'Primary Display & Interface Font',
      uses: 'Headings, navigation, buttons, brand lockup, section titles',
      fontClass: 'font-display',
      sample: 'The quick brown fox jumps over the lazy dog',
      weights: '500 Medium, 600 SemiBold, 700 Bold',
      rules: 'Slightly negative letter-spacing (-0.025em to -0.03em) on large headings for tighter optical density.',
    },
    {
      name: 'Inter',
      role: 'Secondary UI & Body Font',
      uses: 'Descriptions, supporting text, helper hints, general UI labels',
      fontClass: 'font-sans',
      sample: 'Engineered for exceptional micro-typography legibility, generous line-heights, and clear interface comprehension.',
      weights: '400 Regular, 500 Medium, 600 SemiBold',
      rules: 'Optimized line-height (1.5–1.6) and balanced tracking to reduce eye fatigue during long sessions.',
    },
    {
      name: 'JetBrains Mono',
      role: 'Monospaced Engine & Metrics Font',
      uses: 'Typing passages, WPM, CPM, accuracy %, timers, seed IDs, telemetry',
      fontClass: 'font-mono',
      sample: '124 WPM  ·  98.6% ACC  ·  0:45 TIME  ·  SEED: NEO-2049',
      weights: '400 Regular, 500 Medium, 600 SemiBold, 700 Bold',
      rules: 'Strict tabular numbers (tabular-nums / tnum) to eliminate layout shifting during high-speed typing updates.',
    },
  ];

  const features = [
    {
      icon: Box,
      title: '3D Abstract Geometric Depth',
      desc: 'Floating elements, subtle ambient back-glows, and soft lighting.',
    },
    {
      icon: Layers,
      title: 'Glassmorphism UI Panels',
      desc: 'Translucent backdrops with 20px blur and hair-thin slate borders.',
    },
    {
      icon: Sparkles,
      title: 'Smooth Caret Motion',
      desc: 'Interpolated gliding caret with zero jerkiness and customizable profiles.',
    },
    {
      icon: MousePointer,
      title: 'Tabular Performance Metrics',
      desc: 'Monospaced numeric telemetry prevents layout jumping as WPM changes.',
    },
    {
      icon: Sparkles,
      title: 'Acoustic Sound Packs',
      desc: 'Synthesized mechanical, synth, typewriter, thock, cyber, and marble profiles with independent error vs. success volume.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 select-none py-4 font-sans">
      {/* Design System Header Banner */}
      <div className="p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
        <h2 className="text-2xl font-bold text-white tracking-[-0.025em] font-display">
          SpaceType Design System & Typography
        </h2>
        <p className="text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed font-sans">
          The official typographic hierarchy, color schemes, and ergonomics powering the SpaceType typing engine.
          Every typeface serves a dedicated functional role with strict weight discipline.
        </p>
      </div>

      {/* Typography Showcase Section */}
      <div className="p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl space-y-6">
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-[#5b8cff]" />
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-display">
            Type Hierarchy & Font Roles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {typographySpecs.map((spec) => (
            <div
              key={spec.name}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold text-white tracking-tight ${spec.fontClass}`}>
                    {spec.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {spec.weights.split(',')[0]}
                  </span>
                </div>

                <span className="text-xs text-[#5b8cff] font-medium block mt-1 font-display">
                  {spec.role}
                </span>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                  <strong className="text-slate-300 font-medium">Applied to: </strong>
                  {spec.uses}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/60">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-display mb-1">
                  Specimen Preview
                </span>
                <p className={`text-xs text-slate-200 leading-relaxed ${spec.fontClass}`}>
                  {spec.sample}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-3 leading-snug font-sans">
                <span className="text-slate-500 block mb-0.5 font-display font-medium text-[10px] uppercase tracking-wider">
                  Typography Rule
                </span>
                {spec.rules}
              </div>
            </div>
          ))}
        </div>

        {/* Tabular Numbers Zero-Shift Demo */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-white font-display">
              <Clock className="w-3.5 h-3.5 text-[#5b8cff]" />
              <span>Tabular Numbers Verification</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans max-w-md">
              JetBrains Mono with <code className="text-cyan-300 font-mono">tabular-nums</code> ensures digits
              from 0 to 9 take identical character width, avoiding horizontal jump during rapid typing.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono tabular-nums text-xl font-bold text-white">
              {sampleMetric} <span className="text-xs text-[#5b8cff]">WPM</span>
            </div>
            <button
              onClick={() => setSampleMetric((prev) => (prev === 118 ? 84 : prev === 84 ? 142 : 118))}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-display font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              Cycle Metric
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Colors & UI Elements (7 cols) */}
        <div className="lg:col-span-7 p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4 font-display">
              Color Palette
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {colors.map((c) => (
                <div key={c.name} className="space-y-2">
                  <div
                    className="w-14 h-14 rounded-full border border-white/20 shadow-lg"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block font-display">{c.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 block">{c.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UI Elements */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 font-display">
              Interactive UI Elements
            </h3>

            <div className="flex flex-wrap items-center gap-4 font-display">
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
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4 font-display">
            Key Architectural Elements
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
                    <h4 className="text-xs font-semibold text-white font-display">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug font-sans">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtitle tag from bottom of mockup */}
          <div className="pt-6 border-t border-slate-800/80 text-center">
            <span className="text-[11px] tracking-wider uppercase text-slate-500 font-medium font-display">
              SpaceType — Practice Today. Type Better Tomorrow.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
