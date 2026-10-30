/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'extra';

export interface CharToken {
  id: string;
  char: string;
  status: CharStatus;
  isExtra?: boolean;
}

export interface WordToken {
  id: string;
  targetWord: string;
  inputWord: string;
  isCurrent: boolean;
  isFinished: boolean;
  hasError: boolean;
  chars: CharToken[];
}

export interface TelemetryPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
}

export interface EngineStats {
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  extraKeystrokes: number;
  missedKeystrokes: number;
  elapsedSeconds: number;
  errorKeys: Record<string, number>;
  telemetry: TelemetryPoint[];
}

export type EngineStatus = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Transforms an array of target words and user inputs into structured word tokens
 */
export function buildWordTokens(
  targetWords: string[],
  currentWordIndex: number,
  wordInputs: string[]
): WordToken[] {
  return targetWords.map((target, wIdx) => {
    const input = wordInputs[wIdx] ?? '';
    const isCurrent = wIdx === currentWordIndex;
    const isFinished = wIdx < currentWordIndex;

    const chars: CharToken[] = [];
    let hasError = false;

    // Compare character by character up to target length
    for (let cIdx = 0; cIdx < target.length; cIdx++) {
      const targetChar = target[cIdx];
      const inputChar = input[cIdx];

      let status: CharStatus = 'pending';
      if (inputChar !== undefined) {
        if (inputChar === targetChar) {
          status = 'correct';
        } else {
          status = 'incorrect';
          hasError = true;
        }
      } else if (isFinished) {
        // In finished words, unreached characters are errors
        status = 'incorrect';
        hasError = true;
      }

      chars.push({
        id: `w${wIdx}-c${cIdx}`,
        char: targetChar,
        status,
      });
    }

    // Extra characters typed past word length
    if (input.length > target.length) {
      hasError = true;
      for (let eIdx = target.length; eIdx < input.length; eIdx++) {
        chars.push({
          id: `w${wIdx}-extra-${eIdx}`,
          char: input[eIdx],
          status: 'extra',
          isExtra: true,
        });
      }
    }

    return {
      id: `word-${wIdx}`,
      targetWord: target,
      inputWord: input,
      isCurrent,
      isFinished,
      hasError,
      chars,
    };
  });
}

/**
 * Calculate statistical consistency from inter-keystroke intervals (in milliseconds).
 * Returns percentage 0-100 where 100% means perfectly consistent typing cadence.
 */
export function calculateConsistency(intervals: number[]): number {
  if (intervals.length < 5) return 100;

  // Filter extreme outliers (pauses > 1500ms)
  const valid = intervals.filter((t) => t > 20 && t < 1500);
  if (valid.length < 3) return 100;

  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((acc, t) => acc + Math.pow(t - mean, 2), 0) / valid.length;
  const standardDeviation = Math.sqrt(variance);

  // Coefficient of Variation
  const cv = standardDeviation / (mean || 1);
  const consistency = Math.max(0, Math.min(100, Math.round((1 - Math.min(cv, 1)) * 100)));
  return consistency;
}

/**
 * Computes live and final statistics
 */
export function calculateStats(
  targetWords: string[],
  wordInputs: string[],
  currentWordIndex: number,
  elapsedSeconds: number,
  intervals: number[],
  errorKeys: Record<string, number>,
  telemetry: TelemetryPoint[]
): EngineStats {
  const safeTime = Math.max(0.2, elapsedSeconds);
  const minutes = safeTime / 60;

  let totalKeystrokes = 0;
  let correctKeystrokes = 0;
  let incorrectKeystrokes = 0;
  let extraKeystrokes = 0;
  let missedKeystrokes = 0;

  // Tally keystrokes across all evaluated words
  for (let wIdx = 0; wIdx <= Math.min(currentWordIndex, targetWords.length - 1); wIdx++) {
    const target = targetWords[wIdx];
    const input = wordInputs[wIdx] ?? '';
    const isFinished = wIdx < currentWordIndex;

    // +1 keystroke for space if finished
    if (isFinished) {
      totalKeystrokes++;
      correctKeystrokes++;
    }

    for (let cIdx = 0; cIdx < target.length; cIdx++) {
      if (cIdx < input.length) {
        totalKeystrokes++;
        if (input[cIdx] === target[cIdx]) {
          correctKeystrokes++;
        } else {
          incorrectKeystrokes++;
        }
      } else if (isFinished) {
        missedKeystrokes++;
      }
    }

    if (input.length > target.length) {
      const extraCount = input.length - target.length;
      totalKeystrokes += extraCount;
      extraKeystrokes += extraCount;
      incorrectKeystrokes += extraCount;
    }
  }

  // Raw WPM: standard 5 characters per word
  const rawWpm = Math.round((totalKeystrokes / 5) / minutes) || 0;

  // Net WPM: ((correctKeystrokes / 5) - uncorrectedErrors) / minutes
  const netWpm = Math.max(0, Math.round(((correctKeystrokes / 5) / minutes))) || 0;

  // Accuracy %
  const accuracy = totalKeystrokes > 0
    ? Number(((correctKeystrokes / totalKeystrokes) * 100).toFixed(1))
    : 100;

  const consistency = calculateConsistency(intervals);

  return {
    netWpm,
    rawWpm,
    accuracy,
    consistency,
    totalKeystrokes,
    correctKeystrokes,
    incorrectKeystrokes,
    extraKeystrokes,
    missedKeystrokes,
    elapsedSeconds: Math.round(elapsedSeconds * 10) / 10,
    errorKeys,
    telemetry,
  };
}
