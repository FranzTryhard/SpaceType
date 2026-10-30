/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sliders, Volume2, Palette, Sparkles, Monitor, Eye, Zap } from 'lucide-react';
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
  const handleTestSound = (profile: SoundProfileId, vol: number) => {
    soundEngine.playKeypress(profile, vol);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Theme Palette */}
          <div>
            <div className="flex items-center gap-2 text-slate-300 font-medium mb-3">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Neo-Futurism Color Schema</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.values(THEMES).map((theme) => {
                const isActive = settings.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateSettings({ themeId: theme.id })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 bg-slate-800/90 shadow-sm'
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
                    <span className="block text-[10px] text-slate-500 mt-0.5">{theme.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caret Style & Animation */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-medium mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Caret Style & Motion</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {(['glow-bar', 'line', 'block', 'underline'] as CaretStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => updateSettings({ caretStyle: style })}
                  className={`p-3 rounded-lg border text-left capitalize transition-all cursor-pointer ${
                    settings.caretStyle === style
                      ? 'border-cyan-400 bg-slate-800/90'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="block font-medium text-slate-200">{style.replace('-', ' ')}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block">Smooth Caret Interpolation</span>
                <span className="text-[11px] text-slate-500 block">
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
            <div className="flex items-center gap-2 text-slate-300 font-medium mb-3">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Monospace Typography Scale</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(FONT_SIZES) as FontSizeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => updateSettings({ fontSize: key })}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.fontSize === key
                      ? 'border-cyan-400 bg-slate-800/90'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="block font-medium text-slate-200">{FONT_SIZES[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Feedback */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-slate-300 font-medium mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Acoustic Keypress Synthesis</span>
              </div>
              <button
                onClick={() => handleTestSound(settings.soundProfile, settings.soundVolume)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Test Sound
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {SOUND_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    updateSettings({ soundProfile: profile.id });
                    handleTestSound(profile.id, settings.soundVolume);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.soundProfile === profile.id
                      ? 'border-cyan-400 bg-slate-800/90'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="block font-medium text-slate-200">{profile.name}</span>
                </button>
              ))}
            </div>

            {settings.soundProfile !== 'off' && (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                <span className="text-slate-300">Volume Level</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                  className="w-40 accent-cyan-400 cursor-pointer"
                />
                <span className="font-typing text-slate-400 tabular-nums w-10 text-right">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Behavior & Accessibility */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-medium mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Behavior & Accessibility</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-medium text-slate-200 block">Reduced Motion Mode</span>
                <span className="text-[11px] text-slate-500 block">
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
                <span className="font-medium text-slate-200 block">Blind Typing Mode</span>
                <span className="text-[11px] text-slate-500 block">
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
                <span className="font-medium text-slate-200 block">Quick Restart with Tab Key</span>
                <span className="text-[11px] text-slate-500 block">
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
