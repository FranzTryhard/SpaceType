/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeDefinition {
  id: string;
  name: string;
  category: string;
  canvasBg: string;
  surfaceBg: string;
  surfaceBorder: string;
  accent: string;
  accentGlow: string;
  textMuted: string;
  textPrimary: string;
  caretColor: string;
  errorColor: string;
  gridLineColor: string;
}

export const THEMES: Record<string, ThemeDefinition> = {
  'neo-cyber': {
    id: 'neo-cyber',
    name: 'Deep Space',
    category: 'Neo//Type Flagship',
    canvasBg: '#0d0b1d',
    surfaceBg: '#13112a',
    surfaceBorder: 'rgba(91, 140, 255, 0.2)',
    accent: '#5b8cff', // Electric Blue
    accentGlow: 'rgba(168, 85, 247, 0.45)', // Purple Glow
    textMuted: '#6d7596',
    textPrimary: '#e0edff',
    caretColor: '#5b8cff',
    errorColor: '#f43f5e',
    gridLineColor: 'rgba(91, 140, 255, 0.08)',
  },
  'titanium-matrix': {
    id: 'titanium-matrix',
    name: 'Titanium Matrix',
    category: 'Architectural',
    canvasBg: '#090d0b',
    surfaceBg: '#121a16',
    surfaceBorder: 'rgba(52, 211, 153, 0.15)',
    accent: '#10b981', // Emerald
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    textMuted: '#607b71',
    textPrimary: '#ecfdf5',
    caretColor: '#10b981',
    errorColor: '#f87171',
    gridLineColor: 'rgba(16, 185, 129, 0.08)',
  },
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare',
    category: 'Orbital',
    canvasBg: '#0c0a09',
    surfaceBg: '#1c1614',
    surfaceBorder: 'rgba(251, 146, 60, 0.15)',
    accent: '#f97316', // Orange / Amber
    accentGlow: 'rgba(249, 115, 22, 0.4)',
    textMuted: '#78716c',
    textPrimary: '#fafaf9',
    caretColor: '#fb923c',
    errorColor: '#f43f5e',
    gridLineColor: 'rgba(249, 115, 22, 0.08)',
  },
  'monochrome-onyx': {
    id: 'monochrome-onyx',
    name: 'Onyx Minimal',
    category: 'Precision',
    canvasBg: '#09090b',
    surfaceBg: '#18181b',
    surfaceBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#ffffff',
    accentGlow: 'rgba(255, 255, 255, 0.3)',
    textMuted: '#71717a',
    textPrimary: '#ffffff',
    caretColor: '#ffffff',
    errorColor: '#f43f5e',
    gridLineColor: 'rgba(255, 255, 255, 0.06)',
  },
};

export type CaretStyle = 'line' | 'block' | 'underline' | 'glow-bar';

export type FontSizeKey = 'sm' | 'md' | 'lg' | 'xl';

export const FONT_SIZES: Record<FontSizeKey, { label: string; textClass: string; lineHeight: string; caretHeight: string }> = {
  sm: { label: 'Compact (18px)', textClass: 'text-[18px]', lineHeight: 'leading-[2.1rem]', caretHeight: 'h-6' },
  md: { label: 'Standard (22px)', textClass: 'text-[22px]', lineHeight: 'leading-[2.5rem]', caretHeight: 'h-7' },
  lg: { label: 'Expansive (28px)', textClass: 'text-[28px]', lineHeight: 'leading-[3rem]', caretHeight: 'h-8' },
  xl: { label: 'Large (34px)', textClass: 'text-[34px]', lineHeight: 'leading-[3.6rem]', caretHeight: 'h-10' },
};

export const SOUND_PROFILES = [
  { id: 'mechanical', name: 'Tactile Mechanical', description: 'Clicky switch with dual tactile spring snap' },
  { id: 'synth', name: 'Neo Synth Click', description: 'Clean digital sine chirp with smooth high-tech tone' },
  { id: 'typewriter', name: 'Vintage Typewriter', description: 'Crisp metal striker hit with mechanical carriage resonance' },
  { id: 'thock', name: 'Deep Creamy Thock', description: 'Lubricated heavy linear switches with rich deep body' },
  { id: 'cyber', name: 'Cyber Laser Pulse', description: 'Fast sci-fi frequency sweep with resonant harmonic snap' },
  { id: 'marbles', name: 'Ceramic Marbles', description: 'High-frequency glassy bubble click with clear acoustic ring' },
  { id: 'off', name: 'Muted (Silent)', description: 'Complete silence for focused typing' },
] as const;

export type SoundProfileId = (typeof SOUND_PROFILES)[number]['id'];
