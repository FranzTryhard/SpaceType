/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TelemetryPoint } from '../engine/typingEngine.ts';
import { LexiconType, TestMode } from '../engine/corpus.ts';

export interface TestResultRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  mode: TestMode;
  durationSeconds: number;
  seed: string;
  lexicon: LexiconType;
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  errorKeys: Record<string, number>;
  telemetry: TelemetryPoint[];
}

export interface LifetimeStats {
  totalTests: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalSeconds: number;
  totalKeystrokes: number;
}

const HISTORY_KEY = 'vectra_typing_history_v1';

export function loadHistory(): TestResultRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTestResult(record: TestResultRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const history = loadHistory();
    // Keep most recent 100 tests
    const updated = [record, ...history].slice(0, 100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore
  }
}

export function computeLifetimeStats(records: TestResultRecord[]): LifetimeStats {
  if (records.length === 0) {
    return {
      totalTests: 0,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      totalSeconds: 0,
      totalKeystrokes: 0,
    };
  }

  const bestWpm = Math.max(...records.map((r) => r.netWpm));
  const totalWpm = records.reduce((acc, r) => acc + r.netWpm, 0);
  const totalAcc = records.reduce((acc, r) => acc + r.accuracy, 0);
  const totalSec = records.reduce((acc, r) => acc + r.durationSeconds, 0);
  const totalKeys = records.reduce((acc, r) => acc + r.totalKeystrokes, 0);

  return {
    totalTests: records.length,
    bestWpm,
    avgWpm: Math.round(totalWpm / records.length),
    avgAccuracy: Number((totalAcc / records.length).toFixed(1)),
    totalSeconds: Math.round(totalSec),
    totalKeystrokes: totalKeys,
  };
}
