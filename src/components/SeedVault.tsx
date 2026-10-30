/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KeyRound, Play, Copy, Check } from 'lucide-react';
import { TestMode, LexiconType } from '../engine/corpus.ts';

interface SeedItem {
  seed: string;
  title: string;
  category: string;
  description: string;
  mode: TestMode;
  lexicon: LexiconType;
  benchmarkWpm: number;
}

const CURATED_SEEDS: SeedItem[] = [
  {
    seed: 'NEO-2049',
    title: 'Cybernetic Monolith',
    category: 'Neo-Futurism',
    description: 'High-density architectural and aerospace vocabulary (cantilever, geodesic, telemetry).',
    mode: 'time',
    lexicon: 'neo_futuristic',
    benchmarkWpm: 95,
  },
  {
    seed: 'AERO-8820',
    title: 'Aerodynamic Velocity',
    category: 'Speedrun',
    description: 'Fast-flow high-frequency words optimized for rhythm and top cadence speed.',
    mode: 'words',
    lexicon: 'standard',
    benchmarkWpm: 120,
  },
  {
    seed: 'TITAN-5512',
    title: 'Advanced Cognitive Lexicon',
    category: 'Vocabulary',
    description: 'Multi-syllabic academic and technical phrasing (ubiquitous, bifurcation, spatiotemporal).',
    mode: 'words',
    lexicon: 'advanced',
    benchmarkWpm: 80,
  },
  {
    seed: 'HADID-360',
    title: 'Dynamic Vectors of Life',
    category: 'Curated Quote',
    description: 'Zaha Hadid visionary architectural reflection on curvilinear space.',
    mode: 'quote',
    lexicon: 'quotes',
    benchmarkWpm: 90,
  },
  {
    seed: 'SYNTAX-404',
    title: 'Asynchronous TypeScript',
    category: 'Code Syntax',
    description: 'Real-world TypeScript statements, interfaces, and promise pipelines.',
    mode: 'code',
    lexicon: 'code',
    benchmarkWpm: 75,
  },
  {
    seed: 'FLUX-9901',
    title: 'Quantum Resonance Sprint',
    category: 'Precision',
    description: 'Strict 15-second hyper-cadence burst test to evaluate peak burst velocity.',
    mode: 'time',
    lexicon: 'neo_futuristic',
    benchmarkWpm: 110,
  },
];

interface SeedVaultProps {
  onSelectSeed: (seed: string, mode: TestMode, lexicon: LexiconType) => void;
  currentSeed: string;
}

export const SeedVault: React.FC<SeedVaultProps> = ({ onSelectSeed, currentSeed }) => {
  const [copiedSeed, setCopiedSeed] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');

  const handleCopy = (seed: string) => {
    navigator.clipboard.writeText(seed);
    setCopiedSeed(seed);
    setTimeout(() => setCopiedSeed(null), 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectSeed(customInput.trim().toUpperCase(), 'time', 'neo_futuristic');
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm font-display">
              <KeyRound className="w-4 h-4" />
              <span>Deterministic Seed Vault</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans leading-relaxed">
              Every typing test in SpaceType is generated deterministically from an immutable seed.
              Share a seed with colleagues or replay your own seed to benchmark exact progress.
            </p>
          </div>

          {/* Quick Custom Seed Input */}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 font-display">
            <input
              type="text"
              placeholder="ENTER SEED..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono uppercase tracking-wider focus:outline-hidden focus:border-cyan-400 w-36"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              Load
            </button>
          </form>
        </div>
      </div>

      {/* Benchmark Curated Seed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURATED_SEEDS.map((item) => {
          const isSelected = currentSeed === item.seed;
          return (
            <div
              key={item.seed}
              className={`p-5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-sans">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                      {item.seed}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-1 font-display">{item.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-display font-semibold block">
                    Benchmark
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-medium tabular-nums">
                    ~{item.benchmarkWpm} WPM
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-sans leading-relaxed">{item.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between font-display">
                <span className="text-[11px] text-slate-500 capitalize font-sans">
                  Mode: <span className="text-slate-300 font-medium">{item.mode}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.seed)}
                    className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy seed string"
                  >
                    {copiedSeed === item.seed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onSelectSeed(item.seed, item.mode, item.lexicon)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-cyan-400" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
