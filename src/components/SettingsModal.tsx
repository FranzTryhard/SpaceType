/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Sliders,
  Volume2,
  VolumeX,
  Palette,
  Sparkles,
  Monitor,
  Zap,
  Play,
  AlertCircle,
  CheckCircle2,
  Disc3,
} from 'lucide-react';
import { AppSettings } from '../types/settings.ts';
import { THEMES, SOUND_PROFILES, FONT_SIZES, CaretStyle, FontSizeKey, SoundProfileId } from '../tokens/index.ts';
import { soundEngine } from '../engine/sound.ts';

interface SettingsModalProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  updateSettings,
  onClose,
}) => {
  const handleTestKeypress = (profile?: SoundProfileId, vol?: number) => {
    const prof = profile || settings.soundProfile;
    const v = vol !== undefined ? vol : settings.soundVolume;
    soundEngine.playKeypress(prof, v);
  };

  const handleTestError = (vol?: number) => {
    const v = vol !== undefined ? vol : settings.errorVolume;
    soundEngine.playError(v);
  };

  const handleTestSuccess = (vol?: number) => {
    const v = vol !== undefined ? vol : settings.successVolume;
    soundEngine.playComplete(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight font-display">
              Engine & Ergonomics Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans">
          {/* Sound Packs & Audio Ergonomics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-300 font-semibold font-display">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Selectable Sound Packs</span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">
                Real-time Web Audio Synthesizer
              </span>
            </div>

            {/* Sound Packs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-5 font-display">
              {SOUND_PROFILES.map((profile) => {
                const isSelected = settings.soundProfile === profile.id;
                const isMuted = profile.id === 'off';

                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      updateSettings({ soundProfile: profile.id });
                      if (!isMuted) {
                        handleTestKeypress(profile.id, settings.soundVolume);
                      }
                    }}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-800/95 shadow-sm ring-1 ring-cyan-400/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/80 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <Disc3
                              className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}
                            />
                          )}
                          <span
                            className={`font-semibold block ${
                              isSelected ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {profile.name}
                          </span>
                        </div>

                        {!isMuted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestKeypress(profile.id, settings.soundVolume);
                            }}
                            className="p-1 rounded bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-cyan-300 transition-colors"
                            title="Audition sound pack"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-400 leading-snug font-sans line-clamp-2">
                        {'description' in profile ? profile.description : ''}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-sans">
                        {isMuted ? 'Muted' : 'Acoustic Synthesizer'}
                      </span>
                      {isSelected && (
                        <span className="text-cyan-400 font-semibold tracking-wider uppercase text-[9px]">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual Sound Volume Controls */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4 font-display">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs font-semibold text-white">
                  Individual Volume Levels
                </span>
                <span className="text-[11px] text-slate-400 font-sans">
                  Fine-tune keystroke clicks vs. error and victory chimes
                </span>
              </div>

              {/* Volume 1: Keypress Volume */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-[180px]">
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Keypress Sound</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    Volume for correct keystrokes & active sound pack
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.05"
                    value={settings.soundVolume}
                    disabled={settings.soundProfile === 'off'}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateSettings({ soundVolume: val });
                    }}
                    className="w-32 sm:w-40 accent-cyan-400 cursor-pointer disabled:opacity-40"
                  />
                  <span className="font-mono text-slate-300 tabular-nums w-10 text-right text-xs">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                  <button
                    type="button"
                    disabled={settings.soundProfile === 'off' || settings.soundVolume <= 0}
                    onClick={() => handleTestKeypress()}
                    className="px-2.5 py-1 text-[11px] rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Volume 2: Error Sound Volume */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                <div className="space-y-0.5 min-w-[180px]">
                  <div className="flex items-center gap-1.5 text-rose-300 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Error Sound</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    Volume for mistyped characters & acoustic warnings
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.05"
                    value={settings.errorVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateSettings({ errorVolume: val });
                    }}
                    className="w-32 sm:w-40 accent-rose-400 cursor-pointer"
                  />
                  <span className="font-mono text-slate-300 tabular-nums w-10 text-right text-xs">
                    {Math.round(settings.errorVolume * 100)}%
                  </span>
                  <button
                    type="button"
                    disabled={settings.errorVolume <= 0}
                    onClick={() => handleTestError()}
                    className="px-2.5 py-1 text-[11px] rounded bg-slate-900 border border-rose-900/40 text-rose-300 hover:text-rose-200 hover:border-rose-700 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Volume 3: Success & Finish Sound Volume */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                <div className="space-y-0.5 min-w-[180px]">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Success & Completion Sound</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    Volume for celebratory finish chords & achievements
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.05"
                    value={settings.successVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateSettings({ successVolume: val });
                    }}
                    className="w-32 sm:w-40 accent-emerald-400 cursor-pointer"
                  />
                  <span className="font-mono text-slate-300 tabular-nums w-10 text-right text-xs">
                    {Math.round(settings.successVolume * 100)}%
                  </span>
                  <button
                    type="button"
                    disabled={settings.successVolume <= 0}
                    onClick={() => handleTestSuccess()}
                    className="px-2.5 py-1 text-[11px] rounded bg-slate-900 border border-emerald-900/40 text-emerald-300 hover:text-emerald-200 hover:border-emerald-700 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Palette */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-3 font-display">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Neo-Futurism Color Schema</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-display">
              {Object.values(THEMES).map((theme) => {
                const isActive = settings.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateSettings({ themeId: theme.id })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 bg-slate-800/90 shadow-sm ring-1 ring-cyan-400/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: theme.canvasBg, border: '1px solid #475569' }}
                      />
                    </div>
                    <span className="block font-medium text-slate-200">{theme.name}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-sans">{theme.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caret Style & Animation */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-3 font-display">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Caret Style & Motion</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 font-display">
              {(['glow-bar', 'line', 'block', 'underline'] as CaretStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => updateSettings({ caretStyle: style })}
                  className={`p-3 rounded-lg border text-left capitalize transition-all cursor-pointer ${
                    settings.caretStyle === style
                      ? 'border-cyan-400 bg-slate-800/90 ring-1 ring-cyan-400/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="block font-medium text-slate-200">{style.replace('-', ' ')}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block font-display">Smooth Caret Interpolation</span>
                <span className="text-[11px] text-slate-500 block font-sans">
                  Fluid gliding caret motion between characters
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.smoothCaret}
                onChange={(e) => updateSettings({ smoothCaret: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Typography Scale */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-3 font-display">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Monospace Typography Scale</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-display">
              {(Object.keys(FONT_SIZES) as FontSizeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => updateSettings({ fontSize: key })}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.fontSize === key
                      ? 'border-cyan-400 bg-slate-800/90 ring-1 ring-cyan-400/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="block font-medium text-slate-200">{FONT_SIZES[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Behavior & Accessibility */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-3 font-display">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Behavior & Accessibility</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block font-display">Reduced Motion Mode</span>
                <span className="text-[11px] text-slate-500 block font-sans">
                  Disables background geometric grid flow and all blinking/pulsing animations
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block font-display">Blind Typing Mode</span>
                <span className="text-[11px] text-slate-500 block font-sans">
                  Suppresses red error indicators until word is completed (trains confidence)
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.blindMode}
                onChange={(e) => updateSettings({ blindMode: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block font-display">Quick Restart with Tab Key</span>
                <span className="text-[11px] text-slate-500 block font-sans">
                  Pressing Tab instantly resets the test with zero delay
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.quickRestartWithTab}
                onChange={(e) => updateSettings({ quickRestartWithTab: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
