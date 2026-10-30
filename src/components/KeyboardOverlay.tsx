/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Keyboard,
  Fingerprint,
  Flame,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ThemeDefinition } from '../tokens/index.ts';

export interface ActiveKeystroke {
  key: string;
  isError: boolean;
  expectedKey?: string;
  timestamp: number;
}

export interface KeyboardOverlayProps {
  activeKey?: string | null;
  activeKeystroke?: ActiveKeystroke | null;
  targetKey?: string | null;
  errorKeys?: Record<string, number>;
  theme?: ThemeDefinition;
  onClearErrors?: () => void;
  className?: string;
  collapsible?: boolean;
}

// Finger assignment categories for touch typing
type FingerType = 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';

const FINGER_STYLES: Record<FingerType, { label: string; border: string; glow: string; text: string; bg: string }> = {
  'left-pinky': {
    label: 'L. Pinky',
    border: 'border-purple-500/50',
    glow: 'rgba(168, 85, 247, 0.35)',
    text: 'text-purple-300',
    bg: 'bg-purple-950/25',
  },
  'left-ring': {
    label: 'L. Ring',
    border: 'border-indigo-500/50',
    glow: 'rgba(99, 102, 241, 0.35)',
    text: 'text-indigo-300',
    bg: 'bg-indigo-950/25',
  },
  'left-middle': {
    label: 'L. Middle',
    border: 'border-cyan-500/50',
    glow: 'rgba(6, 182, 212, 0.35)',
    text: 'text-cyan-300',
    bg: 'bg-cyan-950/25',
  },
  'left-index': {
    label: 'L. Index',
    border: 'border-emerald-500/50',
    glow: 'rgba(16, 185, 129, 0.35)',
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/25',
  },
  'thumb': {
    label: 'Thumbs',
    border: 'border-blue-500/50',
    glow: 'rgba(59, 130, 246, 0.35)',
    text: 'text-blue-300',
    bg: 'bg-blue-950/25',
  },
  'right-index': {
    label: 'R. Index',
    border: 'border-emerald-500/50',
    glow: 'rgba(16, 185, 129, 0.35)',
    text: 'text-emerald-300',
    bg: 'bg-emerald-950/25',
  },
  'right-middle': {
    label: 'R. Middle',
    border: 'border-cyan-500/50',
    glow: 'rgba(6, 182, 212, 0.35)',
    text: 'text-cyan-300',
    bg: 'bg-cyan-950/25',
  },
  'right-ring': {
    label: 'R. Ring',
    border: 'border-indigo-500/50',
    glow: 'rgba(99, 102, 241, 0.35)',
    text: 'text-indigo-300',
    bg: 'bg-indigo-950/25',
  },
  'right-pinky': {
    label: 'R. Pinky',
    border: 'border-purple-500/50',
    glow: 'rgba(168, 85, 247, 0.35)',
    text: 'text-purple-300',
    bg: 'bg-purple-950/25',
  },
};

interface KeySpec {
  primary: string;
  secondary?: string;
  code?: string;
  finger: FingerType;
  width?: string; // flex width or custom class
  hasHomemark?: boolean;
}

// 60% ANSI Key Layout Definition
const KEYBOARD_ROWS: KeySpec[][] = [
  // Row 0: Number row
  [
    { primary: '`', secondary: '~', finger: 'left-pinky' },
    { primary: '1', secondary: '!', finger: 'left-pinky' },
    { primary: '2', secondary: '@', finger: 'left-ring' },
    { primary: '3', secondary: '#', finger: 'left-middle' },
    { primary: '4', secondary: '$', finger: 'left-index' },
    { primary: '5', secondary: '%', finger: 'left-index' },
    { primary: '6', secondary: '^', finger: 'right-index' },
    { primary: '7', secondary: '&', finger: 'right-index' },
    { primary: '8', secondary: '*', finger: 'right-middle' },
    { primary: '9', secondary: '(', finger: 'right-ring' },
    { primary: '0', secondary: ')', finger: 'right-pinky' },
    { primary: '-', secondary: '_', finger: 'right-pinky' },
    { primary: '=', secondary: '+', finger: 'right-pinky' },
    { primary: 'backspace', finger: 'right-pinky', width: 'w-14 sm:w-16' },
  ],
  // Row 1: Top letter row
  [
    { primary: 'tab', finger: 'left-pinky', width: 'w-12 sm:w-14' },
    { primary: 'q', finger: 'left-pinky' },
    { primary: 'w', finger: 'left-ring' },
    { primary: 'e', finger: 'left-middle' },
    { primary: 'r', finger: 'left-index' },
    { primary: 't', finger: 'left-index' },
    { primary: 'y', finger: 'right-index' },
    { primary: 'u', finger: 'right-index' },
    { primary: 'i', finger: 'right-middle' },
    { primary: 'o', finger: 'right-ring' },
    { primary: 'p', finger: 'right-pinky' },
    { primary: '[', secondary: '{', finger: 'right-pinky' },
    { primary: ']', secondary: '}', finger: 'right-pinky' },
    { primary: '\\', secondary: '|', finger: 'right-pinky', width: 'w-10 sm:w-12' },
  ],
  // Row 2: Home row
  [
    { primary: 'caps', finger: 'left-pinky', width: 'w-13 sm:w-15' },
    { primary: 'a', finger: 'left-pinky' },
    { primary: 's', finger: 'left-ring' },
    { primary: 'd', finger: 'left-middle' },
    { primary: 'f', finger: 'left-index', hasHomemark: true },
    { primary: 'g', finger: 'left-index' },
    { primary: 'h', finger: 'right-index' },
    { primary: 'j', finger: 'right-index', hasHomemark: true },
    { primary: 'k', finger: 'right-middle' },
    { primary: 'l', finger: 'right-ring' },
    { primary: ';', secondary: ':', finger: 'right-pinky' },
    { primary: "'", secondary: '"', finger: 'right-pinky' },
    { primary: 'enter', finger: 'right-pinky', width: 'w-14 sm:w-16' },
  ],
  // Row 3: Bottom letter row
  [
    { primary: 'shift', finger: 'left-pinky', width: 'w-16 sm:w-18' },
    { primary: 'z', finger: 'left-pinky' },
    { primary: 'x', finger: 'left-ring' },
    { primary: 'c', finger: 'left-middle' },
    { primary: 'v', finger: 'left-index' },
    { primary: 'b', finger: 'left-index' },
    { primary: 'n', finger: 'right-index' },
    { primary: 'm', finger: 'right-index' },
    { primary: ',', secondary: '<', finger: 'right-middle' },
    { primary: '.', secondary: '>', finger: 'right-ring' },
    { primary: '/', secondary: '?', finger: 'right-pinky' },
    { primary: 'shift', finger: 'right-pinky', width: 'w-18 sm:w-20' },
  ],
  // Row 4: Spacebar row
  [
    { primary: 'ctrl', finger: 'left-pinky', width: 'w-10 sm:w-11' },
    { primary: 'alt', finger: 'left-pinky', width: 'w-10 sm:w-11' },
    { primary: 'space', finger: 'thumb', width: 'flex-1 max-w-72 sm:max-w-84' },
    { primary: 'alt', finger: 'right-pinky', width: 'w-10 sm:w-11' },
    { primary: 'ctrl', finger: 'right-pinky', width: 'w-10 sm:w-11' },
  ],
];

export const KeyboardOverlay: React.FC<KeyboardOverlayProps> = ({
  activeKey,
  activeKeystroke,
  targetKey,
  errorKeys = {},
  theme,
  onClearErrors,
  className = '',
  collapsible = true,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showFingers, setShowFingers] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'60' | 'compact'>('60');

  // Compute total session error count
  const totalErrors = useMemo(() => {
    return Object.values(errorKeys).reduce((sum, count) => sum + count, 0);
  }, [errorKeys]);

  // Normalize active key character
  const normalizedActive = useMemo(() => {
    if (activeKeystroke?.key) {
      const k = activeKeystroke.key.toLowerCase();
      if (k === ' ') return 'space';
      return k;
    }
    if (activeKey) {
      const k = activeKey.toLowerCase();
      if (k === ' ') return 'space';
      return k;
    }
    return null;
  }, [activeKey, activeKeystroke]);

  // Normalize target key character
  const normalizedTarget = useMemo(() => {
    if (!targetKey) return null;
    const k = targetKey.toLowerCase();
    if (k === ' ') return 'space';
    return k;
  }, [targetKey]);

  // Is the current active keystroke an error?
  const isKeystrokeError = activeKeystroke?.isError ?? false;

  // Render an individual keycap
  const renderKey = (spec: KeySpec) => {
    const keyLower = spec.primary.toLowerCase();
    const isSpaceKey = keyLower === 'space';

    // Check if this key is active (pressed)
    const isPressed =
      normalizedActive === keyLower ||
      (isSpaceKey && (normalizedActive === ' ' || normalizedActive === 'space')) ||
      (spec.secondary && normalizedActive === spec.secondary.toLowerCase());

    // Check if this key is the upcoming target
    const isTarget =
      normalizedTarget === keyLower ||
      (isSpaceKey && (normalizedTarget === ' ' || normalizedTarget === 'space')) ||
      (spec.secondary && normalizedTarget === spec.secondary.toLowerCase());

    // Error count for this key
    const keyErrorCount =
      errorKeys[spec.primary] ||
      errorKeys[spec.primary.toUpperCase()] ||
      (spec.secondary ? errorKeys[spec.secondary] || 0 : 0) ||
      (isSpaceKey ? errorKeys[' '] || 0 : 0);

    const fingerStyle = FINGER_STYLES[spec.finger];

    // Determine visual style
    let containerStyle = 'bg-[#131126]/90 border-slate-800/80 text-slate-400 hover:border-slate-700/80 shadow-[0_2px_0_0_rgba(15,23,42,0.8)]';

    if (isPressed) {
      if (isKeystrokeError) {
        // High-impact VISUAL ERROR FEEDBACK: Crimson flash, violent shake, glowing border
        containerStyle =
          'bg-rose-600/90 border-rose-400 text-white shadow-[0_0_24px_rgba(244,63,94,0.95)] ring-2 ring-rose-400/90 translate-y-0.5 animate-key-shake animate-error-flash';
      } else {
        // High-impact SUCCESS FEEDBACK: Electric blue/cyan pulse, pressed depth
        containerStyle =
          'bg-[#5b8cff] border-[#93b4ff] text-white shadow-[0_0_18px_rgba(91,140,255,0.85)] ring-1 ring-[#5b8cff]/70 translate-y-0.5 scale-[0.98]';
      }
    } else if (isTarget) {
      if (isKeystrokeError) {
        // After an error, target key flashes with bright amber/emerald guidance
        containerStyle =
          'bg-emerald-950/60 border-emerald-400/90 text-emerald-200 ring-2 ring-emerald-400/60 shadow-[0_0_16px_rgba(52,211,153,0.7)] animate-pulse';
      } else {
        // Target key soft guide pulse
        containerStyle =
          'bg-blue-950/40 border-[#5b8cff]/80 text-[#93b4ff] ring-1 ring-[#5b8cff]/40 shadow-[0_0_12px_rgba(91,140,255,0.4)] animate-guide-pulse';
      }
    } else if (showHeatmap && keyErrorCount > 0) {
      // Heatmap underglow for error-prone keys
      containerStyle =
        'bg-[#1e1324]/90 border-rose-900/60 text-slate-300 shadow-[0_2px_0_0_rgba(244,63,94,0.2)]';
    } else if (showFingers) {
      // Finger zone tinting
      containerStyle = `${fingerStyle.bg} ${fingerStyle.border} ${fingerStyle.text} shadow-[0_2px_0_0_rgba(15,23,42,0.6)]`;
    }

    const widthClass = spec.width || 'w-7 sm:w-8.5';
    const heightClass = 'h-7 sm:h-8.5';

    return (
      <div
        key={`${spec.primary}-${spec.secondary || ''}`}
        data-key={spec.primary}
        className={`relative ${widthClass} ${heightClass} rounded-[6px] border flex flex-col items-center justify-center select-none font-mono text-[11px] sm:text-xs transition-all duration-75 ${containerStyle}`}
      >
        {/* Secondary shift character (for symbols and numbers) */}
        {spec.secondary && (
          <span className="text-[9px] sm:text-[10px] opacity-60 leading-none -mt-0.5">
            {spec.secondary}
          </span>
        )}

        {/* Primary key label */}
        <span
          className={`font-semibold tracking-tight ${
            spec.primary.length > 1 ? 'text-[9px] sm:text-[10px] uppercase font-display font-medium' : ''
          }`}
        >
          {isSpaceKey ? 'space' : spec.primary}
        </span>

        {/* Physical tactile homing bar on F and J keys */}
        {spec.hasHomemark && (
          <div
            className={`absolute bottom-1 w-2.5 sm:w-3 h-0.5 rounded-full transition-colors ${
              isPressed ? 'bg-white' : isTarget ? 'bg-[#5b8cff]' : 'bg-slate-500/80'
            }`}
          />
        )}

        {/* Mistype error count badge */}
        {showHeatmap && keyErrorCount > 0 && !isPressed && (
          <span className="absolute -top-1 -right-1 px-1 min-w-3.5 h-3.5 rounded-full bg-rose-500/90 text-white text-[8px] font-bold font-mono flex items-center justify-center shadow-xs border border-rose-400/80 tabular-nums">
            {keyErrorCount > 9 ? '9+' : keyErrorCount}
          </span>
        )}
      </div>
    );
  };

  // Filter rows if compact mode is selected
  const activeRows = layoutMode === 'compact' ? KEYBOARD_ROWS.slice(1, 4) : KEYBOARD_ROWS;

  return (
    <div
      className={`w-full max-w-3xl mx-auto flex flex-col items-center transition-all duration-200 select-none ${className}`}
    >
      {/* Keyboard Overlay Card */}
      <div className="w-full rounded-2xl bg-[#0e0c20]/95 backdrop-blur-md border border-slate-800/80 p-3 sm:p-4 shadow-2xl shadow-purple-950/20 relative overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#5b8cff]/50 to-transparent" />

        {/* Overlay Header & Toolbar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs">
          {/* Left Title & Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#5b8cff]/15 text-[#5b8cff]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-semibold text-slate-200 tracking-tight text-xs sm:text-sm">
                Tactile Keyboard Overlay
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400 font-mono">
                {layoutMode === '60' ? 'ANSI 60%' : 'Compact'}
              </span>
            </div>
          </div>

          {/* Center Feedback Banner (Lights up on mistypes) */}
          {activeKeystroke && activeKeystroke.isError && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/60 text-rose-300 text-[11px] font-mono animate-key-shake">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>
                Mistyped{' '}
                <strong className="text-white bg-rose-950/80 px-1 py-0.5 rounded border border-rose-500/40">
                  {activeKeystroke.key === ' ' ? 'Space' : activeKeystroke.key}
                </strong>
                {activeKeystroke.expectedKey && (
                  <>
                    {' '}→ expected{' '}
                    <strong className="text-emerald-300 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-500/40">
                      {activeKeystroke.expectedKey === ' ' ? 'Space' : activeKeystroke.expectedKey}
                    </strong>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Finger Guides Toggle */}
            <button
              onClick={() => setShowFingers(!showFingers)}
              title="Toggle Touch Typing Finger Zones"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-display transition-colors cursor-pointer border ${
                showFingers
                  ? 'bg-purple-950/60 border-purple-500/60 text-purple-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Fingerprint className="w-3 h-3" />
              <span className="hidden md:inline">Fingers</span>
            </button>

            {/* Error Heatmap Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              title="Toggle Error Heatmap Badges"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-display transition-colors cursor-pointer border ${
                showHeatmap
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span className="hidden md:inline">Heatmap</span>
              {totalErrors > 0 && (
                <span className="ml-0.5 px-1 rounded-full bg-rose-500/30 text-rose-300 font-mono text-[9px] tabular-nums">
                  {totalErrors}
                </span>
              )}
            </button>

            {/* Layout switch: 60% vs Compact */}
            <button
              onClick={() => setLayoutMode(layoutMode === '60' ? 'compact' : '60')}
              title="Toggle Layout Size"
              className="p-1 rounded-md bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[10px] font-mono px-1.5"
            >
              {layoutMode === '60' ? '60%' : 'Mini'}
            </button>

            {/* Clear error session */}
            {totalErrors > 0 && onClearErrors && (
              <button
                onClick={onClearErrors}
                title="Reset Key Mistake Counters"
                className="p-1 rounded-md bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Collapse toggle */}
            {collapsible && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-md bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={isOpen ? 'Collapse keyboard' : 'Expand keyboard'}
              >
                {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Keys Canvas */}
        {isOpen && (
          <div className="pt-3 flex flex-col items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1">
            {activeRows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="flex items-center gap-1 sm:gap-1.5 justify-center w-full min-w-max"
              >
                {row.map((spec) => renderKey(spec))}
              </div>
            ))}

            {/* Finger guide color legend when active */}
            {showFingers && (
              <div className="mt-3 pt-2 w-full border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Pinkies (A, Q, P, ;)
                </span>
                <span className="flex items-center gap-1 text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> Ring (S, W, O, L)
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Middle (D, E, I, K)
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Index (F, G, R, T, J, H, U, Y)
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Thumbs (Space)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
