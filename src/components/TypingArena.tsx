/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { WordToken, EngineStatus } from '../engine/typingEngine.ts';
import { CaretStyle, FontSizeKey, FONT_SIZES, ThemeDefinition } from '../tokens/index.ts';
import { VirtualKeyboard } from './VirtualKeyboard.tsx';

interface TypingArenaProps {
  words: WordToken[];
  status: EngineStatus;
  currentWordIndex: number;
  currentInput: string;
  theme: ThemeDefinition;
  fontSize: FontSizeKey;
  caretStyle: CaretStyle;
  smoothCaret: boolean;
  blindMode: boolean;
  showLiveWpm: boolean;
  showLiveAcc: boolean;
  liveWpm: number;
  liveAcc: number;
  remainingTime?: number;
  elapsedSeconds: number;
  totalWords?: number;
  streak: number;
  quoteAuthor?: string;
  quoteSource?: string;
  onInputChange: (input: string) => void;
  onSpacePress: () => void;
  onBackspacePress: (isCtrl: boolean) => void;
  onRestartTest: () => void;
  onOpenSettings: () => void;
  reducedMotion: boolean;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  words,
  status,
  currentWordIndex,
  currentInput,
  theme,
  fontSize,
  caretStyle,
  smoothCaret,
  blindMode,
  showLiveWpm,
  showLiveAcc,
  liveWpm,
  liveAcc,
  remainingTime,
  elapsedSeconds,
  totalWords,
  quoteAuthor,
  quoteSource,
  onInputChange,
  onSpacePress,
  onBackspacePress,
  onRestartTest,
  reducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordsWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [isTypingActive, setIsTypingActive] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  // Monkeytype caret coordinates
  const [caretCoords, setCaretCoords] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 14,
    height: 3.5,
  });

  const [scrollOffsetY, setScrollOffsetY] = useState(0);
  const sizeConfig = FONT_SIZES[fontSize] || FONT_SIZES['lg'];

  // Focus management
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  useEffect(() => {
    focusInput();
  }, [status]);

  // Target next character for virtual keyboard
  const currentWordTarget = words[currentWordIndex]?.targetWord || '';
  const nextTargetChar = currentWordTarget[currentInput.length] || ' ';

  // Monkeytype-exact caret coordinate calculation
  const updateCaret = useCallback(() => {
    const wrapper = wordsWrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const currentWordEl = wrapper.querySelector(`[data-word-idx="${currentWordIndex}"]`) as HTMLElement | null;
    if (!currentWordEl) return;

    const charEls = currentWordEl.querySelectorAll<HTMLElement>('[data-char-idx]');
    const inputLen = currentInput.length;
    const isUnderline = caretStyle === 'underline';
    const isBlock = caretStyle === 'block';

    let targetX = 0;
    let targetY = 0;
    let targetW = 2.5;
    let targetH = 28;

    if (inputLen < charEls.length) {
      // Caret is on or under the upcoming character
      const targetCharEl = charEls[inputLen];
      const charRect = targetCharEl.getBoundingClientRect();

      targetW = isUnderline || isBlock ? charRect.width : 2.5;
      targetH = isUnderline ? 3.5 : isBlock ? charRect.height : charRect.height * 0.85;

      targetX = charRect.left - wrapperRect.left;
      targetY = isUnderline
        ? charRect.bottom - wrapperRect.top - 4
        : charRect.top - wrapperRect.top + (isBlock ? 0 : 2);
    } else {
      // Caret is after the last character of the word (or extra characters)
      if (charEls.length > 0) {
        const lastCharEl = charEls[charEls.length - 1];
        const lastRect = lastCharEl.getBoundingClientRect();

        targetW = isUnderline || isBlock ? 14 : 2.5;
        targetH = isUnderline ? 3.5 : isBlock ? lastRect.height : lastRect.height * 0.85;

        targetX = lastRect.right - wrapperRect.left;
        targetY = isUnderline
          ? lastRect.bottom - wrapperRect.top - 4
          : lastRect.top - wrapperRect.top + (isBlock ? 0 : 2);
      } else {
        const wordRect = currentWordEl.getBoundingClientRect();
        targetX = wordRect.left - wrapperRect.left;
        targetY = isUnderline ? wordRect.bottom - wrapperRect.top - 4 : wordRect.top - wrapperRect.top;
      }
    }

    setCaretCoords({
      x: Math.round(targetX * 10) / 10,
      y: Math.round(targetY * 10) / 10,
      width: Math.max(2.5, Math.round(targetW * 10) / 10),
      height: Math.max(3.5, Math.round(targetH * 10) / 10),
    });

    // Virtual viewport scroll when typing wraps to next lines
    const wordRect = currentWordEl.getBoundingClientRect();
    const wordTop = wordRect.top - wrapperRect.top;
    const lineStep = 44; // Single line height offset

    if (wordTop > lineStep * 1.5) {
      setScrollOffsetY(wordTop - lineStep);
    } else {
      setScrollOffsetY(0);
    }
  }, [currentWordIndex, currentInput, caretStyle]);

  useLayoutEffect(() => {
    updateCaret();
  }, [updateCaret]);

  useEffect(() => {
    const handleResize = () => updateCaret();
    window.addEventListener('resize', handleResize);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updateCaret);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCaret]);

  // Keydown listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveKey(e.key);
    setTimeout(() => setActiveKey(null), 120);

    // Keep caret solid and illuminated while actively typing
    setIsTypingActive(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTypingActive(false);
    }, 480);

    if (e.key === 'Tab') {
      e.preventDefault();
      onRestartTest();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      onRestartTest();
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      if (currentInput.length > 0) {
        onSpacePress();
      }
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      const isCtrl = e.ctrlKey || e.altKey || e.metaKey;
      onBackspacePress(isCtrl);
      return;
    }

    if (
      e.key === 'Enter' ||
      e.key.startsWith('Arrow') ||
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'Meta' ||
      e.key === 'CapsLock'
    ) {
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      onInputChange(currentInput + e.key);
    }
  };

  const isUnderline = caretStyle === 'underline';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none cursor-default">
      {/* Hidden input to capture physical keyboard keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute -top-96 left-0 opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Typing input field"
      />

      {/* Live subtle status indicator (only shown if test is running) */}
      <div className="w-full h-8 flex items-center justify-between px-2 text-xs font-typing text-slate-500 mb-2">
        {status === 'running' ? (
          <>
            <div className="flex items-center gap-4 text-[#5b8cff] font-medium">
              {remainingTime !== undefined && (
                <span>{Math.ceil(remainingTime)}s</span>
              )}
              {totalWords !== undefined && (
                <span>{currentWordIndex}/{totalWords}</span>
              )}
            </div>

            <div className="flex items-center gap-6 tabular-nums">
              {showLiveWpm && <span>{liveWpm} wpm</span>}
              {showLiveAcc && <span>{liveAcc}%</span>}
            </div>
          </>
        ) : (
          <div />
        )}
      </div>

      {/* Monkeytype Monospace Typing Arena */}
      <div
        ref={containerRef}
        onClick={focusInput}
        className="relative w-full overflow-hidden min-h-[140px] max-h-[180px] font-typing text-[24px] sm:text-[28px] leading-[2.6rem] sm:leading-[3rem] tracking-wide select-none cursor-text px-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {/* Words container with smooth line sliding */}
        <div
          ref={wordsWrapperRef}
          className="relative flex flex-wrap gap-x-4 sm:gap-x-5 gap-y-2 transition-transform duration-150 ease-out"
          style={{
            transform: `translateY(-${scrollOffsetY}px)`,
          }}
        >
          {words.map((word, wIdx) => {
            const isCurrent = wIdx === currentWordIndex;
            return (
              <div
                key={word.id}
                data-word-idx={wIdx}
                className="relative inline-flex items-center"
              >
                {word.chars.map((charToken, cIdx) => {
                  let charColor = '#6d7596'; // Muted slate unreached

                  if (!blindMode) {
                    if (charToken.status === 'correct') {
                      charColor = '#e0edff'; // Crisp light accent
                    } else if (charToken.status === 'incorrect') {
                      charColor = '#fb7185'; // Coral error
                    } else if (charToken.status === 'extra') {
                      charColor = '#e11d48'; // Extra error
                    }
                  } else if (charToken.status !== 'pending') {
                    charColor = '#e0edff';
                  }

                  return (
                    <span
                      key={charToken.id}
                      data-char-idx={cIdx}
                      style={{ color: charColor }}
                      className={`relative inline-block transition-colors duration-75 ${
                        charToken.isExtra ? 'underline decoration-rose-500' : ''
                      }`}
                    >
                      {charToken.char}
                    </span>
                  );
                })}
              </div>
            );
          })}

          {/* Signature Smooth Caret in Electric Blue & Purple Glow */}
          {isFocused && (
            <div
              className={`absolute top-0 left-0 pointer-events-none z-20 will-change-transform ${
                !smoothCaret || reducedMotion
                  ? ''
                  : 'transition-all duration-100 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)]'
              } ${
                status === 'idle'
                  ? 'animate-caret-fade'
                  : isTypingActive
                  ? 'opacity-100'
                  : 'animate-caret-fade'
              }`}
              style={{
                transform: `translate3d(${caretCoords.x}px, ${caretCoords.y}px, 0)`,
                width: `${caretCoords.width}px`,
                height: `${caretCoords.height}px`,
                backgroundColor: theme.caretColor || '#5b8cff',
                boxShadow: '0 0 10px rgba(91, 140, 255, 0.8), 0 0 20px rgba(168, 85, 247, 0.5)',
                borderRadius: isUnderline ? '2px' : '1.5px',
                opacity: caretStyle === 'block' ? 0.35 : 1,
              }}
            />
          )}
        </div>

        {/* Unfocused overlay prompt */}
        {!isFocused && (
          <div
            onClick={focusInput}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[#0d0b1d]/75 backdrop-blur-xs rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-2 text-[#5b8cff] text-sm font-sans font-medium">
              <Play className="w-4 h-4 fill-[#5b8cff]" />
              <span>Click or press any key to focus</span>
            </div>
          </div>
        )}
      </div>

      {/* Curated quote citation if applicable */}
      {quoteAuthor && (
        <div className="w-full text-right text-xs text-slate-500 italic pt-2">
          — {quoteAuthor} {quoteSource ? `(${quoteSource})` : ''}
        </div>
      )}

      {/* Centered Virtual Tactile Keyboard from Monkeytype screenshot */}
      <VirtualKeyboard activeKey={activeKey} targetKey={nextTargetChar} />

      {/* Quick restart hint */}
      <div className="pt-6 flex items-center gap-2 text-xs text-slate-500 font-sans">
        <button
          onClick={onRestartTest}
          className="flex items-center gap-1.5 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>restart test</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-typing ml-1 text-slate-400">
            tab
          </kbd>
        </button>
      </div>
    </div>
  );
};
