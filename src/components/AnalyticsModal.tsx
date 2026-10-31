/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trophy, Activity, Target, Clock, Zap, Download, Trash2, RotateCcw } from 'lucide-react';
import { TestResultRecord, computeLifetimeStats, clearHistory } from '../types/history.ts';
import { ThemeDefinition } from '../tokens/index.ts';

interface AnalyticsModalProps {
  history: TestResultRecord[];
  onClose: () => void;
  onReplaySeed: (seed: string, mode: any) => void;
  onClearHistory: () => void;
  theme: ThemeDefinition;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  history,
  onClose,
  onReplaySeed,
  onClearHistory,
  theme,
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const lifetime = computeLifetimeStats(history);

  const filteredHistory = history.filter((r) => {
    if (filterMode === 'all') return true;
    return r.mode === filterMode;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `spacetype_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight font-display">
              Typing Analytics & History Vault
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Close analytics modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
          {/* Lifetime Statistics KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-semibold block">Best WPM</span>
              <div className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">
                {lifetime.bestWpm}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-semibold block">Average WPM</span>
              <div className="mt-1 text-2xl font-bold text-cyan-300 font-mono tabular-nums">
                {lifetime.avgWpm}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-semibold block">Avg Accuracy</span>
              <div className="mt-1 text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                {lifetime.avgAccuracy}%
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-semibold block">Completed</span>
              <div className="mt-1 text-2xl font-bold text-slate-200 font-mono tabular-nums">
                {lifetime.totalTests}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-semibold block">Practice Time</span>
              <div className="mt-1 text-2xl font-bold text-slate-200 font-mono tabular-nums">
                {Math.round(lifetime.totalSeconds / 60)}m
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-semibold block">Keystrokes</span>
              <div className="mt-1 text-2xl font-bold text-slate-200 font-mono tabular-nums">
                {lifetime.totalKeystrokes.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 font-display">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Filter Mode:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md">
                {['all', 'time', 'words', 'quote', 'code'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`px-2.5 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                      filterMode === m
                        ? 'bg-slate-800 text-cyan-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                disabled={history.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onClearHistory}
                disabled={history.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 bg-slate-950 hover:bg-rose-950/30 border border-rose-900/40 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          </div>

          {/* Test History List Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-display font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4 text-right">Net WPM</th>
                  <th className="py-3 px-4 text-right">Raw</th>
                  <th className="py-3 px-4 text-right">Accuracy</th>
                  <th className="py-3 px-4 text-right">Consistency</th>
                  <th className="py-3 px-4">Seed</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-sans">{row.dateStr}</td>
                      <td className="py-3 px-4 capitalize text-slate-300 font-sans">{row.mode}</td>
                      <td className="py-3 px-4 text-right text-white font-bold font-mono tabular-nums">
                        {row.netWpm}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono tabular-nums">
                        {row.rawWpm}
                      </td>
                      <td className="py-3 px-4 text-right text-cyan-300 font-medium font-mono tabular-nums">
                        {row.accuracy}%
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono tabular-nums">
                        {row.consistency}%
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono tabular-nums">{row.seed}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            onReplaySeed(row.seed, row.mode);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 rounded transition-colors cursor-pointer font-display font-medium"
                          title="Replay this exact seed test"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Replay</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                      No typing tests recorded in this category yet. Complete a test to see your telemetry here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
