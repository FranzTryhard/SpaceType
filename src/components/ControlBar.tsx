/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Type, Quote, Sparkles, Wrench, Shuffle, Globe } from 'lucide-react';
import { TestMode, LexiconType } from '../engine/corpus.ts';
import { generateRandomSeed } from '../engine/prng.ts';

interface ControlBarProps {
  mode: TestMode;
  setMode: (mode: TestMode) => void;
  timeLimit: number;
  setTimeLimit: (time: number) => void;
  wordLimit: number;
  setWordLimit: (words: number) => void;
  lexicon: LexiconType;
  setLexicon: (lex: LexiconType) => void;
  includePunctuation: boolean;
  setIncludePunctuation: (val: boolean) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (val: boolean) => void;
  seed: string;
  setSeed: (seed: string) => void;
  onResetTest: () => void;
  disabled?: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  mode,
  setMode,
  timeLimit,
  setTimeLimit,
  wordLimit,
  setWordLimit,
  lexicon,
  setLexicon,
  includePunctuation,
  setIncludePunctuation,
  includeNumbers,
  setIncludeNumbers,
  seed,
  setSeed,
  onResetTest,
  disabled = false,
}) => {
  const handleRollSeed = () => {
    const newSeed = generateRandomSeed();
    setSeed(newSeed);
    onResetTest();
  };

  const cycleLexicon = () => {
    const lexicons: LexiconType[] = ['standard', 'advanced', 'neo_futuristic', 'code'];
    const nextIdx = (lexicons.indexOf(lexicon) + 1) % lexicons.length;
    setLexicon(lexicons[nextIdx]);
    onResetTest();
  };

  const lexiconLabels: Record<LexiconType, string> = {
    standard: 'english',
    advanced: 'english 1k',
    neo_futuristic: 'neo-futurism',
    quotes: 'quotes',
    code: 'code syntax',
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 select-none">
      {/* 3 Floating Capsule Controls matching Monkeytype format */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-display">
        {/* Capsule 1: Punctuation & Numbers */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141226]/80 border border-slate-800/80 shadow-md">
          <button
            disabled={disabled}
            onClick={() => {
              setIncludePunctuation(!includePunctuation);
              onResetTest();
            }}
            className={`flex items-center gap-1 transition-colors cursor-pointer font-display ${
              includePunctuation ? 'text-[#5b8cff] font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <span className="font-mono">@</span>
            <span>punctuation</span>
          </button>
          <span className="text-slate-700">·</span>
          <button
            disabled={disabled}
            onClick={() => {
              setIncludeNumbers(!includeNumbers);
              onResetTest();
            }}
            className={`flex items-center gap-1 transition-colors cursor-pointer font-display ${
              includeNumbers ? 'text-[#5b8cff] font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <span className="font-mono">#</span>
            <span>numbers</span>
          </button>
        </div>

        {/* Capsule 2: Modes (time, words, quote, zen, custom) */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#141226]/80 border border-slate-800/80 shadow-md font-display">
          <button
            disabled={disabled}
            onClick={() => {
              setMode('time');
              onResetTest();
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'time' ? 'text-[#5b8cff] font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>time</span>
          </button>

          <button
            disabled={disabled}
            onClick={() => {
              setMode('words');
              onResetTest();
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'words' ? 'text-[#5b8cff] font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <Type className="w-3.5 h-3.5 font-bold" />
            <span>words</span>
          </button>

          <button
            disabled={disabled}
            onClick={() => {
              setMode('quote');
              onResetTest();
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'quote' ? 'text-[#5b8cff] font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>quote</span>
          </button>

          <button
            disabled={disabled}
            onClick={() => {
              setMode('code');
              onResetTest();
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'code' ? 'text-[#5b8cff] font-semibold' : 'text-slate-500 hover:text-slate-300 font-medium'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>code</span>
          </button>
        </div>

        {/* Capsule 3: Config Limits (10, 25, 50, 100, shuffle) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#141226]/80 border border-slate-800/80 shadow-md font-mono">
          {mode === 'time' ? (
            [15, 30, 60, 120].map((t) => (
              <button
                key={t}
                disabled={disabled}
                onClick={() => {
                  setTimeLimit(t);
                  onResetTest();
                }}
                className={`transition-colors cursor-pointer tabular-nums ${
                  timeLimit === t ? 'text-[#5b8cff] font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))
          ) : (
            [10, 25, 50, 100].map((w) => (
              <button
                key={w}
                disabled={disabled}
                onClick={() => {
                  setWordLimit(w);
                  onResetTest();
                }}
                className={`transition-colors cursor-pointer tabular-nums ${
                  wordLimit === w ? 'text-[#5b8cff] font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {w}
              </button>
            ))
          )}

          <button
            onClick={handleRollSeed}
            className="text-slate-500 hover:text-[#5b8cff] transition-colors cursor-pointer pl-1"
            title={`Seed: ${seed} (Click to shuffle)`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-label: Language indicator matching screenshot (e.g. 🌐 english) */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans hover:text-slate-300 transition-colors">
        <button
          onClick={cycleLexicon}
          className="flex items-center gap-1.5 cursor-pointer"
          title="Click to cycle dictionary"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lexiconLabels[lexicon]}</span>
        </button>
      </div>
    </div>
  );
};
