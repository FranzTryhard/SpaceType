/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaretStyle, FontSizeKey, SoundProfileId } from '../tokens/index.ts';
import { LexiconType, TestMode } from '../engine/corpus.ts';

export interface AppSettings {
  themeId: string;
  caretStyle: CaretStyle;
  fontSize: FontSizeKey;
  soundProfile: SoundProfileId;
  soundVolume: number; // Keypress volume (0.0 to 1.0)
  errorVolume: number; // Error sound volume (0.0 to 1.0)
  successVolume: number; // Success and completion sound volume (0.0 to 1.0)
  blindMode: boolean;
  quickRestartWithTab: boolean;
  smoothCaret: boolean;
  showLiveWpm: boolean;
  showLiveAcc: boolean;
  reducedMotion: boolean;
  // Test presets
  testMode: TestMode;
  timeLimit: number; // 15, 30, 60, 120
  wordLimit: number; // 10, 25, 50, 100
  lexicon: LexiconType;
  includePunctuation: boolean;
  includeNumbers: boolean;
  seed: string;
}

const SETTINGS_KEY = 'vectra_typing_settings_v1';

export function getDefaultSettings(): AppSettings {
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    themeId: 'neo-cyber',
    caretStyle: 'underline',
    fontSize: 'lg',
    soundProfile: 'mechanical',
    soundVolume: 0.5,
    errorVolume: 0.45,
    successVolume: 0.6,
    blindMode: false,
    quickRestartWithTab: true,
    smoothCaret: true,
    showLiveWpm: true,
    showLiveAcc: true,
    reducedMotion: Boolean(prefersReduced),
    testMode: 'words',
    timeLimit: 30,
    wordLimit: 25,
    lexicon: 'standard',
    includePunctuation: false,
    includeNumbers: false,
    seed: 'NEO-2049',
  };
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return getDefaultSettings();
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return getDefaultSettings();
    const parsed = JSON.parse(raw);
    const defaults = getDefaultSettings();
    return {
      ...defaults,
      ...parsed,
      errorVolume: typeof parsed.errorVolume === 'number'
        ? parsed.errorVolume
        : (typeof parsed.soundVolume === 'number' ? Math.min(1, parsed.soundVolume * 0.9) : defaults.errorVolume),
      successVolume: typeof parsed.successVolume === 'number'
        ? parsed.successVolume
        : (typeof parsed.soundVolume === 'number' ? Math.min(1, parsed.soundVolume * 1.2) : defaults.successVolume),
    };
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore localStorage write quota errors
  }
}
