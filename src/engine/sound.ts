/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoundProfileId } from '../tokens/index.ts';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playKeypress(profile: SoundProfileId, volume: number = 0.5) {
    if (profile === 'off' || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(Math.min(1, volume * 0.4), now);
      master.connect(ctx.destination);

      if (profile === 'mechanical') {
        // Crisp dual-click mechanical tactile switch sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const clickFilter = ctx.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(2200, now);
        osc1.frequency.exponentialRampToValueAtTime(320, now + 0.025);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, now);
        osc2.frequency.exponentialRampToValueAtTime(140, now + 0.03);

        clickFilter.type = 'lowpass';
        clickFilter.frequency.setValueAtTime(3000, now);

        const env = ctx.createGain();
        env.gain.setValueAtTime(0.7, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc1.connect(clickFilter);
        osc2.connect(clickFilter);
        clickFilter.connect(env);
        env.connect(master);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.036);
        osc2.stop(now + 0.036);
      } else if (profile === 'synth') {
        // High-tech subtle neo-cyber synth ping
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

        env.gain.setValueAtTime(0.35, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(env);
        env.connect(master);

        osc.start(now);
        osc.stop(now + 0.032);
      } else if (profile === 'typewriter') {
        // Crisp striker tap
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

        env.gain.setValueAtTime(0.4, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(env);
        env.connect(master);

        osc.start(now);
        osc.stop(now + 0.046);
      }
    } catch {
      // Audio playback fails gracefully if muted or permissions restrict
    }
  }

  playError(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

      gain.gain.setValueAtTime(volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.095);
    } catch {
      // Ignore
    }
  }

  playComplete(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(volume * 0.25, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.38);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundSynthesizer();
