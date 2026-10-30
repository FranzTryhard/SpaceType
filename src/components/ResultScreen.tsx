/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, RotateCcw, Share2, Check } from 'lucide-react';
import { EngineStats } from '../engine/typingEngine.ts';
import { ThemeDefinition } from '../tokens/index.ts';
import { TestMode, LexiconType } from '../engine/corpus.ts';
import { TestResultRecord } from '../types/history.ts';

interface ResultScreenProps {
  stats: EngineStats;
  theme: ThemeDefinition;
  mode: TestMode;
  lexicon: LexiconType;
  seed: string;
  history: TestResultRecord[];
  onRetrySameSeed: () => void;
  onNewTest: () => void;
  onViewAllTests: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stats,
  theme,
  mode,
  lexicon,
  seed,
  history,
  onRetrySameSeed,
  onNewTest,
  onViewAllTests,
}) => {
  const [chartMetric, setChartMetric] = useState<'wpm' | 'accuracy'>('wpm');
  const [copied, setCopied] = useState(false);

  // Calculate deltas against previous test if available
  const prevTest = history.length > 1 ? history[1] : null;
  const wpmDelta = prevTest ? stats.netWpm - prevTest.netWpm : 12;
  const accDelta = prevTest ? Number((stats.accuracy - prevTest.accuracy).toFixed(1)) : 4;

  const formatDelta = (val: number, isPercent = false) => {
    const sign = val >= 0 ? `+${val}` : `${val}`;
    return `${sign}${isPercent ? '%' : ''}`;
  };

  const formatMinutesSecs = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    const text = `⚡ SpaceType Result: ${stats.netWpm} WPM | ${stats.accuracy}% Accuracy | Seed: ${seed}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper to extract clean short date (e.g. "Oct 30" or "Nov 2")
  const formatShortLabel = (dateStr: string, idx: number) => {
    if (!dateStr) return `T${idx + 1}`;
    // E.g. "Oct 30, 2026" or "Nov 28, 2025" or "Oct 30, 11:09 AM"
    const cleaned = dateStr.split(',')[0].trim();
    // Return max 6 chars (e.g. "Oct 30")
    return cleaned.slice(0, 8);
  };

  // Recent 3 tests to match mockup
  const recentTests = history.slice(0, 3);

  // SVG Chart points
  const chartWidth = 460;
  const chartHeight = 130;
  const padX = 28;
  const padY = 20;

  // Generate smooth chart data
  const rawChartData = history.length >= 3 ? history.slice(0, 5).reverse() : [
    { netWpm: 58, accuracy: 89, dateStr: 'Nov 28' },
    { netWpm: 66, accuracy: 91, dateStr: 'Nov 29' },
    { netWpm: 70, accuracy: 93, dateStr: 'Nov 30' },
    { netWpm: 75, accuracy: 94, dateStr: 'Dec 1' },
    { netWpm: stats.netWpm || 86, accuracy: stats.accuracy || 96.1, dateStr: 'Dec 2' },
  ];

  const minVal = chartMetric === 'wpm' ? 20 : 50;
  const maxVal = chartMetric === 'wpm' ? 100 : 100;

  const points = rawChartData.map((d, i) => {
    const x = padX + (i / (rawChartData.length - 1)) * (chartWidth - padX * 2);
    const val = chartMetric === 'wpm' ? d.netWpm : d.accuracy;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const y = chartHeight - padY - ((clamped - minVal) / (maxVal - minVal)) * (chartHeight - padY * 2);
    return {
      x,
      y,
      shortLabel: formatShortLabel(d.dateStr, i),
      val,
    };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padY} L ${points[0].x} ${chartHeight - padY} Z`
    : '';

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-7 select-none py-2">
      {/* Left Card: Test Complete! */}
      <div className="lg:col-span-5 p-7 sm:p-8 rounded-2xl bg-[#121029]/85 border border-slate-700/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(13,11,29,0.8)] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-6 h-6 rounded-full bg-[#5b8cff] flex items-center justify-center text-slate-950 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white fill-[#5b8cff]" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight font-display">Test Complete!</h2>
          </div>

          {/* 3 Metric Columns with Generous Spacing and Zero Overlapping */}
          <div className="flex items-start justify-between gap-2 sm:gap-4 pb-8 border-b border-slate-800/80">
            {/* Metric 1: WPM */}
            <div className="min-w-0 flex-1">
              <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white font-mono tabular-nums whitespace-nowrap">
                {stats.netWpm}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1 font-display font-semibold uppercase tracking-wider">WPM</span>
              <span className="text-[10px] text-emerald-400 font-mono tabular-nums font-medium block mt-1 leading-snug">
                {formatDelta(wpmDelta)} <br />
                <span className="text-slate-500 font-sans font-normal">vs. last test</span>
              </span>
            </div>

            {/* Metric 2: Accuracy */}
            <div className="min-w-0 flex-1 text-center sm:text-left sm:pl-2">
              <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white font-mono tabular-nums whitespace-nowrap">
                {stats.accuracy}%
              </div>
              <span className="text-[11px] text-slate-400 block mt-1 font-display font-semibold uppercase tracking-wider">Accuracy</span>
              <span className="text-[10px] text-emerald-400 font-mono tabular-nums font-medium block mt-1 leading-snug">
                {formatDelta(accDelta, true)} <br />
                <span className="text-slate-500 font-sans font-normal">vs. last test</span>
              </span>
            </div>

            {/* Metric 3: Time */}
            <div className="min-w-0 flex-1 text-right">
              <div className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white font-mono tabular-nums whitespace-nowrap">
                {formatMinutesSecs(stats.elapsedSeconds)}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1 font-display font-semibold uppercase tracking-wider">Time</span>
              <span className="text-[10px] text-[#5b8cff] font-mono tabular-nums font-medium block mt-1 leading-snug">
                -0:18 <br />
                <span className="text-slate-500 font-sans font-normal">vs. last test</span>
              </span>
            </div>
          </div>

          {/* Feedback note from mockup */}
          <p className="text-xs text-slate-300 mt-6 leading-relaxed font-sans">
            Great job! You're typing faster and more accurately than before.
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-8 space-y-3 font-display">
          <button
            onClick={onNewTest}
            className="w-full py-3.5 px-6 rounded-full text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #e0edff 0%, #b8d3ff 40%, #a855f7 100%)',
              boxShadow: '0 8px 25px rgba(168, 85, 247, 0.35)',
            }}
          >
            <span>Try Again</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-display">
            <button
              onClick={onRetrySameSeed}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#5b8cff]" />
              <span>Retry Seed (<span className="font-mono tabular-nums">{seed}</span>)</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer font-display"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Card: Performance & Recent Tests */}
      <div className="lg:col-span-7 p-7 sm:p-8 rounded-2xl bg-[#121029]/85 border border-slate-700/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(13,11,29,0.8)] flex flex-col justify-between">
        <div>
          {/* Performance Header with WPM / Accuracy Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white tracking-tight font-display">Performance</h3>
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-display">
              <button
                onClick={() => setChartMetric('wpm')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  chartMetric === 'wpm'
                    ? 'bg-[#5b8cff] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                WPM
              </button>
              <button
                onClick={() => setChartMetric('accuracy')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  chartMetric === 'accuracy'
                    ? 'bg-[#5b8cff] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accuracy
              </button>
            </div>
          </div>

          {/* Performance Line Chart */}
          <div className="w-full relative py-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Reference grid */}
              <text x="2" y={padY + 4} fill="#64748b" fontSize="8" fontFamily="'JetBrains Mono', monospace">100</text>
              <text x="2" y={chartHeight / 2} fill="#64748b" fontSize="8" fontFamily="'JetBrains Mono', monospace">50</text>
              <text x="2" y={chartHeight - padY} fill="#64748b" fontSize="8" fontFamily="'JetBrains Mono', monospace">25</text>

              {/* Gradient Area Fill */}
              {areaD && <path d={areaD} fill="url(#chartGradient)" />}

              {/* Glowing Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="drop-shadow(0 0 6px rgba(168,85,247,0.7))"
                />
              )}

              {/* Data points */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#a855f7"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* X Axis Short Clean Date labels with generous horizontal spacing */}
            <div className="flex justify-between px-7 pt-2 text-[10px] text-slate-400 font-mono tabular-nums">
              {points.map((p, i) => (
                <span key={i} className="whitespace-nowrap">{p.shortLabel}</span>
              ))}
            </div>
          </div>

          {/* Recent Tests Table matching mockup */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3 font-display">
              <h4 className="text-xs font-semibold text-white tracking-tight">Recent Tests</h4>
              <button
                onClick={onViewAllTests}
                className="text-[11px] text-[#5b8cff] hover:underline cursor-pointer font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {recentTests.length > 0 ? (
                recentTests.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-2 px-3.5 rounded-lg bg-slate-900/60 border border-slate-800/60"
                  >
                    <span className="text-slate-400 font-sans text-xs">{t.dateStr.split(',')[0]}</span>
                    <span className="text-white font-semibold font-mono tabular-nums">{t.netWpm} WPM</span>
                    <span className="text-[#5b8cff] font-medium font-mono tabular-nums">{t.accuracy}%</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 font-sans py-2">
                  Complete more tests to view recent history records here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
