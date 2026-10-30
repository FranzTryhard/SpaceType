/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { THEMES, ThemeDefinition } from './tokens/index.ts';
import { AppSettings, loadSettings, saveSettings } from './types/settings.ts';
import { TestResultRecord, loadHistory, saveTestResult, clearHistory, computeLifetimeStats } from './types/history.ts';
import {
  generateTestContent,
  GeneratedContent,
  TestMode,
  LexiconType,
} from './engine/corpus.ts';
import {
  buildWordTokens,
  calculateStats,
  EngineStats,
  EngineStatus,
  TelemetryPoint,
} from './engine/typingEngine.ts';
import { soundEngine } from './engine/sound.ts';
import { NeoBackground } from './components/NeoBackground.tsx';
import { Header } from './components/Header.tsx';
import { HeroView } from './components/HeroView.tsx';
import { TypingArena } from './components/TypingArena.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { StatsView } from './components/StatsView.tsx';
import { DesignSystemView } from './components/DesignSystemView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ControlBar } from './components/ControlBar.tsx';

export default function App() {
  // Persistence
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [history, setHistory] = useState<TestResultRecord[]>(() => {
    const loaded = loadHistory();
    // If empty initial state, seed with realistic benchmark records matching mockup
    if (loaded.length === 0) {
      return [
        {
          id: 'test-seed-1',
          timestamp: Date.now() - 86400000 * 4,
          dateStr: 'Nov 28, 2025',
          netWpm: 58,
          rawWpm: 63,
          accuracy: 89,
          consistency: 91,
          mode: 'time',
          durationSeconds: 156,
          seed: 'NEO-1001',
          lexicon: 'standard',
          totalKeystrokes: 240,
          correctKeystrokes: 214,
          incorrectKeystrokes: 26,
          errorKeys: {},
          telemetry: [],
        },
        {
          id: 'test-seed-2',
          timestamp: Date.now() - 86400000 * 2,
          dateStr: 'Nov 30, 2025',
          netWpm: 70,
          rawWpm: 74,
          accuracy: 93,
          consistency: 94,
          mode: 'time',
          durationSeconds: 156,
          seed: 'AERO-4402',
          lexicon: 'neo_futuristic',
          totalKeystrokes: 295,
          correctKeystrokes: 275,
          incorrectKeystrokes: 20,
          errorKeys: {},
          telemetry: [],
        },
        {
          id: 'test-seed-3',
          timestamp: Date.now() - 86400000,
          dateStr: 'Dec 2, 2025',
          netWpm: 82,
          rawWpm: 86,
          accuracy: 96,
          consistency: 96,
          mode: 'time',
          durationSeconds: 156,
          seed: 'NEO-2049',
          lexicon: 'neo_futuristic',
          totalKeystrokes: 340,
          correctKeystrokes: 326,
          incorrectKeystrokes: 14,
          errorKeys: {},
          telemetry: [],
        },
      ];
    }
    return loaded;
  });

  // Navigation tabs matching mockup: 'home' | 'test' | 'stats' | 'about'
  const [activeTab, setActiveTab] = useState<'home' | 'test' | 'stats' | 'about'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showConfigBar, setShowConfigBar] = useState(false);

  // Active Theme
  const currentTheme: ThemeDefinition = useMemo(() => {
    return THEMES[settings.themeId] || THEMES['neo-cyber'];
  }, [settings.themeId]);

  // Content Generation State
  const [content, setContent] = useState<GeneratedContent>(() =>
    generateTestContent({
      mode: settings.testMode,
      lexicon: settings.lexicon,
      timeLimit: settings.timeLimit,
      wordLimit: settings.wordLimit,
      includePunctuation: settings.includePunctuation,
      includeNumbers: settings.includeNumbers,
      seed: settings.seed,
    })
  );

  // Engine state machine
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wordInputs, setWordInputs] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});
  const [completedStats, setCompletedStats] = useState<EngineStats | null>(null);

  // Timing refs
  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newPartial };
      saveSettings(next);
      return next;
    });
  };

  // Re-generate test
  const initTestContent = useCallback(
    (customSeed?: string, customMode?: TestMode, customLexicon?: LexiconType) => {
      const seedToUse = customSeed || settings.seed;
      const modeToUse = customMode || settings.testMode;
      const lexToUse = customLexicon || settings.lexicon;

      const newContent = generateTestContent({
        mode: modeToUse,
        lexicon: lexToUse,
        timeLimit: settings.timeLimit,
        wordLimit: settings.wordLimit,
        includePunctuation: settings.includePunctuation,
        includeNumbers: settings.includeNumbers,
        seed: seedToUse,
      });

      setContent(newContent);
      setStatus('idle');
      setCurrentWordIndex(0);
      setCurrentInput('');
      setWordInputs([]);
      setElapsedSeconds(0);
      setStreak(0);
      setTelemetry([]);
      setIntervals([]);
      setErrorKeys({});
      setCompletedStats(null);
      startTimeRef.current = null;
      lastKeyTimeRef.current = null;

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    },
    [settings]
  );

  // Finish test
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const elapsed = startTimeRef.current
      ? (performance.now() - startTimeRef.current) / 1000
      : elapsedSeconds;

    const stats = calculateStats(
      content.words,
      wordInputs,
      currentWordIndex,
      elapsed,
      intervals,
      errorKeys,
      telemetry
    );

    setStatus('completed');
    setCompletedStats(stats);
    soundEngine.playComplete(settings.successVolume);

    const record: TestResultRecord = {
      id: `test-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      netWpm: stats.netWpm,
      rawWpm: stats.rawWpm,
      accuracy: stats.accuracy,
      consistency: stats.consistency,
      mode: settings.testMode,
      durationSeconds: stats.elapsedSeconds,
      seed: content.seed,
      lexicon: settings.lexicon,
      totalKeystrokes: stats.totalKeystrokes,
      correctKeystrokes: stats.correctKeystrokes,
      incorrectKeystrokes: stats.incorrectKeystrokes,
      errorKeys: stats.errorKeys,
      telemetry: stats.telemetry,
    };

    saveTestResult(record);
    setHistory(loadHistory());
  }, [
    content.words,
    content.seed,
    wordInputs,
    currentWordIndex,
    elapsedSeconds,
    intervals,
    errorKeys,
    telemetry,
    settings.testMode,
    settings.lexicon,
    settings.soundVolume,
    settings.successVolume,
  ]);

  // Timer ticker
  useEffect(() => {
    if (status === 'running') {
      timerIntervalRef.current = window.setInterval(() => {
        if (!startTimeRef.current) return;
        const now = performance.now();
        const elapsed = (now - startTimeRef.current) / 1000;
        setElapsedSeconds(elapsed);

        if (settings.testMode === 'time' && elapsed >= settings.timeLimit) {
          finishTest();
          return;
        }

        const secFloor = Math.floor(elapsed);
        setTelemetry((prev) => {
          const lastPoint = prev[prev.length - 1];
          if (!lastPoint || lastPoint.second < secFloor) {
            const currentStats = calculateStats(
              content.words,
              wordInputs,
              currentWordIndex,
              elapsed,
              intervals,
              errorKeys,
              prev
            );
            return [
              ...prev,
              {
                second: secFloor,
                wpm: currentStats.netWpm,
                rawWpm: currentStats.rawWpm,
                accuracy: currentStats.accuracy,
                errors: currentStats.incorrectKeystrokes,
              },
            ];
          }
          return prev;
        });
      }, 100);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [
    status,
    settings.testMode,
    settings.timeLimit,
    content.words,
    wordInputs,
    currentWordIndex,
    intervals,
    errorKeys,
    finishTest,
  ]);

  // Typing character input
  const handleInputChange = (newInput: string) => {
    const now = performance.now();

    if (status === 'idle') {
      setStatus('running');
      startTimeRef.current = now;
      lastKeyTimeRef.current = now;
    } else if (lastKeyTimeRef.current) {
      const delta = now - lastKeyTimeRef.current;
      setIntervals((prev) => [...prev, delta]);
      lastKeyTimeRef.current = now;
    }

    const currentWordTarget = content.words[currentWordIndex] || '';
    const lastCharTyped = newInput[newInput.length - 1];
    const targetChar = currentWordTarget[newInput.length - 1];

    if (newInput.length > currentInput.length) {
      if (lastCharTyped === targetChar) {
        soundEngine.playKeypress(settings.soundProfile, settings.soundVolume);
        setStreak((s) => s + 1);
      } else {
        soundEngine.playError(settings.errorVolume);
        setStreak(0);
        if (targetChar) {
          setErrorKeys((prev) => ({
            ...prev,
            [targetChar]: (prev[targetChar] || 0) + 1,
          }));
        }
      }
    }

    setCurrentInput(newInput);
    setWordInputs((prev) => {
      const copy = [...prev];
      copy[currentWordIndex] = newInput;
      return copy;
    });
  };

  const handleSpacePress = () => {
    soundEngine.playKeypress(settings.soundProfile, settings.soundVolume, true);

    const isLastWord = currentWordIndex >= content.words.length - 1;
    if (isLastWord) {
      finishTest();
      return;
    }

    setCurrentWordIndex((idx) => idx + 1);
    setCurrentInput('');

    if (
      settings.testMode === 'words' &&
      currentWordIndex + 1 >= (settings.wordLimit || 25)
    ) {
      finishTest();
    }
  };

  const handleBackspacePress = (isCtrl: boolean) => {
    soundEngine.playKeypress(settings.soundProfile, settings.soundVolume);

    if (isCtrl || currentInput.length === 0) {
      if (currentInput.length > 0) {
        setCurrentInput('');
        setWordInputs((prev) => {
          const copy = [...prev];
          copy[currentWordIndex] = '';
          return copy;
        });
      } else if (currentWordIndex > 0) {
        const prevIdx = currentWordIndex - 1;
        const prevInput = wordInputs[prevIdx] || '';
        setCurrentWordIndex(prevIdx);
        setCurrentInput(prevInput);
      }
      return;
    }

    const sliced = currentInput.slice(0, -1);
    setCurrentInput(sliced);
    setWordInputs((prev) => {
      const copy = [...prev];
      copy[currentWordIndex] = sliced;
      return copy;
    });
  };

  const wordTokens = useMemo(() => {
    return buildWordTokens(content.words, currentWordIndex, wordInputs);
  }, [content.words, currentWordIndex, wordInputs]);

  const liveStats = useMemo(() => {
    return calculateStats(
      content.words,
      wordInputs,
      currentWordIndex,
      elapsedSeconds,
      intervals,
      errorKeys,
      telemetry
    );
  }, [
    content.words,
    wordInputs,
    currentWordIndex,
    elapsedSeconds,
    intervals,
    errorKeys,
    telemetry,
  ]);

  const remainingTime =
    settings.testMode === 'time'
      ? Math.max(0, settings.timeLimit - elapsedSeconds)
      : undefined;

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-x-hidden bg-[#0d0b1d] text-[#e0edff]">
      {/* Neo-Futurism Ambient Canvas */}
      <NeoBackground
        themeId={settings.themeId}
        wpm={liveStats.netWpm}
        reducedMotion={settings.reducedMotion}
        isActive={status === 'running'}
      />

      {/* Top Navigation Bar from NEO//TYPE mockup */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'test' && status === 'completed') {
            initTestContent();
          }
        }}
        onStartTesting={() => {
          setActiveTab('test');
          initTestContent();
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-6 sm:py-10 flex flex-col justify-center">
        {activeTab === 'home' && (
          <HeroView
            onStartTest={() => {
              setActiveTab('test');
              initTestContent();
            }}
            reducedMotion={settings.reducedMotion}
          />
        )}

        {activeTab === 'test' && (
          status === 'completed' && completedStats ? (
            <ResultScreen
              stats={completedStats}
              theme={currentTheme}
              mode={settings.testMode}
              lexicon={settings.lexicon}
              seed={content.seed}
              history={history}
              onRetrySameSeed={() => initTestContent(content.seed)}
              onNewTest={() => initTestContent()}
              onViewAllTests={() => setActiveTab('stats')}
            />
          ) : (
            <div className="space-y-6">
              {/* Floating Monkeytype-style Control Capsules */}
              <div
                className={`transition-opacity duration-300 ${
                  status === 'running' ? 'opacity-25 hover:opacity-100' : 'opacity-100'
                }`}
              >
                <ControlBar
                  mode={settings.testMode}
                  setMode={(m) => handleUpdateSettings({ testMode: m })}
                  timeLimit={settings.timeLimit}
                  setTimeLimit={(t) => handleUpdateSettings({ timeLimit: t })}
                  wordLimit={settings.wordLimit}
                  setWordLimit={(w) => handleUpdateSettings({ wordLimit: w })}
                  lexicon={settings.lexicon}
                  setLexicon={(l) => handleUpdateSettings({ lexicon: l })}
                  includePunctuation={settings.includePunctuation}
                  setIncludePunctuation={(p) =>
                    handleUpdateSettings({ includePunctuation: p })
                  }
                  includeNumbers={settings.includeNumbers}
                  setIncludeNumbers={(n) =>
                    handleUpdateSettings({ includeNumbers: n })
                  }
                  seed={settings.seed}
                  setSeed={(s) => handleUpdateSettings({ seed: s })}
                  onResetTest={() => initTestContent()}
                  disabled={status === 'running'}
                />
              </div>

              {/* Exact NEO//TYPE Test Card */}
              <TypingArena
                words={wordTokens}
                status={status}
                currentWordIndex={currentWordIndex}
                currentInput={currentInput}
                theme={currentTheme}
                fontSize={settings.fontSize}
                caretStyle={settings.caretStyle}
                smoothCaret={settings.smoothCaret}
                blindMode={settings.blindMode}
                showLiveWpm={settings.showLiveWpm}
                showLiveAcc={settings.showLiveAcc}
                liveWpm={liveStats.netWpm}
                liveAcc={liveStats.accuracy}
                remainingTime={remainingTime}
                elapsedSeconds={elapsedSeconds}
                totalWords={
                  settings.testMode === 'words' ? settings.wordLimit : undefined
                }
                streak={streak}
                quoteAuthor={content.quoteAuthor}
                quoteSource={content.quoteSource}
                onInputChange={handleInputChange}
                onSpacePress={handleSpacePress}
                onBackspacePress={handleBackspacePress}
                onRestartTest={() => initTestContent()}
                onOpenSettings={() => setIsSettingsOpen(true)}
                reducedMotion={settings.reducedMotion}
              />
            </div>
          )
        )}

        {activeTab === 'stats' && (
          <StatsView
            history={history}
            onReplaySeed={(seed, mode) => {
              handleUpdateSettings({ seed, testMode: mode || 'time' });
              initTestContent(seed, mode);
              setActiveTab('test');
            }}
            onClearHistory={handleClearHistory}
            onStartTest={() => {
              setActiveTab('test');
              initTestContent();
            }}
          />
        )}

        {activeTab === 'about' && <DesignSystemView />}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          updateSettings={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Bottom Subtitle Tag */}
      <footer className="relative z-10 w-full py-4 border-t border-slate-900/80 text-center text-[11px] text-slate-500 font-display font-medium tracking-wider uppercase">
        <span>SpaceType — Practice Today. Type Better Tomorrow.</span>
      </footer>
    </div>
  );
}
