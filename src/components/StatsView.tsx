/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TestResultRecord, computeLifetimeStats } from '../types/history.ts';
import { Download, Trash2, RotateCcw, TrendingUp } from 'lucide-react';

interface StatsViewProps {
  history: TestResultRecord[];
  onReplaySeed: (seed: string, mode: any) => void;
  onClearHistory: () => void;
  onStartTest: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  history,
  onReplaySeed,
  onClearHistory,
  onStartTest,
}) => {
  const [metric, setMetric] = useState<'wpm' | 'accuracy'>('wpm');
  const lifetime = computeLifetimeStats(history);

  const chartWidth = 720;
  const chartHeight = 160;
  const padX = 30;
  const padY = 24;

  const chartData = history.length > 0
    ? history.slice(0, 10).reverse()
    : [
        { netWpm: 58, accuracy: 89, dateStr: 'Nov 28' },
        { netWpm: 66, accuracy: 91, dateStr: 'Nov 29' },
        { netWpm: 70, accuracy: 93, dateStr: 'Nov 30' },
        { netWpm: 75, accuracy: 94, dateStr: 'Dec 1' },
        { netWpm: 82, accuracy: 96, dateStr: 'Dec 2' },
      ];

  const maxVal = 100;
  const minVal = 20;

  const points = chartData.map((d, i) => {
    const x = padX + (i / (chartData.length - 1)) * (chartWidth - padX * 2);
    const val = metric === 'wpm' ? d.netWpm : d.accuracy;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const y = chartHeight - padY - ((clamped - minVal) / (maxVal - minVal)) * (chartHeight - padY * 2);
    return { x, y, label: d.dateStr, val };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padY} L ${points[0].x} ${chartHeight - padY} Z`
    : '';

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `neotype_stats_${Date.now()}.json`);
    dl.click();
    dl.remove();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none py-4">
      {/* Top Lifetime KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Best Record
          </span>
          <div className="mt-1 text-3xl font-bold text-white font-typing tabular-nums">
            {lifetime.bestWpm} <span className="text-sm font-sans text-slate-400">WPM</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Average Speed
          </span>
          <div className="mt-1 text-3xl font-bold text-[#5b8cff] font-typing tabular-nums">
            {lifetime.avgWpm} <span className="text-sm font-sans text-slate-400">WPM</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Avg Accuracy
          </span>
          <div className="mt-1 text-3xl font-bold text-[#a855f7] font-typing tabular-nums">
            {lifetime.avgAccuracy}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            Total Sessions
          </span>
          <div className="mt-1 text-3xl font-bold text-white font-typing tabular-nums">
            {lifetime.totalTests}
          </div>
        </div>
      </div>

      {/* Main Performance Graph Card matching mockup */}
      <div className="p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Performance Trajectory</h3>
            <span className="text-xs text-slate-400">Progression across your typing sessions</span>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setMetric('wpm')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                metric === 'wpm'
                  ? 'bg-[#5b8cff] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WPM
            </button>
            <button
              onClick={() => setMetric('accuracy')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                metric === 'accuracy'
                  ? 'bg-[#5b8cff] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Accuracy
            </button>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="w-full relative py-4">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="fullChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {areaD && <path d={areaD} fill="url(#fullChartGrad)" />}

            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 8px rgba(168,85,247,0.8))"
              />
            )}

            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#ffffff"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
            ))}
          </svg>

          <div className="flex justify-between px-6 pt-2 text-[10px] text-slate-500 font-typing">
            {points.map((p, i) => (
              <span key={i}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tests Table */}
      <div className="p-7 rounded-2xl bg-[#121029]/80 border border-slate-700/60 backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-wide">Historical Sessions</h3>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 text-xs hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-900/40 bg-rose-950/20 text-rose-300 text-xs hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-typing">
            <thead className="text-slate-400 border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3 text-right">Net WPM</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
                <th className="py-2.5 px-3 text-right">Seed</th>
                <th className="py-2.5 px-3 text-right">Replay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.length > 0 ? (
                history.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-sans">{row.dateStr}</td>
                    <td className="py-2.5 px-3 capitalize text-slate-300">{row.mode}</td>
                    <td className="py-2.5 px-3 text-right text-white font-bold tabular-nums">
                      {row.netWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#5b8cff] font-medium tabular-nums">
                      {row.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{row.seed}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onReplaySeed(row.seed, row.mode)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-md transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Replay</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No tests saved yet. Click Start Test to record your first session!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
