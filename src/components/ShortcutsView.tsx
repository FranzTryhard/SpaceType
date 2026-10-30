/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Keyboard, Zap, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const ShortcutsView: React.FC = () => {
  const shortcuts = [
    { key: 'Tab', action: 'Instant Restart', desc: 'Restarts the current typing test with no delay' },
    { key: 'Esc', action: 'Reset Engine', desc: 'Resets the live timer and clears test state' },
    { key: 'Space', action: 'Commit Word', desc: 'Advances to the next word token' },
    { key: 'Backspace', action: 'Delete Character', desc: 'Erases the preceding character in active word' },
    { key: 'Ctrl + Backspace', action: 'Erase Word', desc: 'Clears the entirety of the current input word' },
    { key: 'Alt + Backspace', action: 'Erase Word (macOS)', desc: 'Clears current word input on macOS' },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
          <Keyboard className="w-4 h-4" />
          <span>Ergonomic Keyboard Shortcuts</span>
        </div>
        <p className="text-xs text-slate-400 max-w-xl">
          Engineered for zero-friction mechanical operation. Keep hands anchored on the home row
          without touching your mouse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shortcuts.map((sc) => (
          <div
            key={sc.key}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
          >
            <div>
              <span className="text-xs font-semibold text-white block">{sc.action}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{sc.desc}</span>
            </div>
            <kbd className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-md text-cyan-300 font-typing whitespace-nowrap shadow-xs">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>

      {/* Ergonomic Principles Guide */}
      <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Cadence & Ergonomic Principles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block mb-1">Consistency Over Burst</span>
            <span>
              Typing at a uniform 90 WPM cadence with 98% consistency yields fewer hand fatigue spikes than jerky 120 WPM bursts.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block mb-1">Deterministic Replays</span>
            <span>
              Replaying identical seeds trains muscle memory on recurring letter n-grams like <em>"tion"</em>, <em>"ment"</em>, and <em>"syn"</em>.
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="font-semibold text-slate-200 block mb-1">Optical Focus</span>
            <span>
              The 3-line active window prevents eye tracking jumping. Keep vision focused 1–2 words ahead of your active caret.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
