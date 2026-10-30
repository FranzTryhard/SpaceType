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
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a synthesized keypress click matching the selected sound pack.
   */
  playKeypress(profile: SoundProfileId, volume: number = 0.5, isSpace: boolean = false) {
    if (profile === 'off' || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      const gainValue = Math.min(1, Math.max(0, volume)) * 0.45;
      master.gain.setValueAtTime(gainValue, now);
      master.connect(ctx.destination);

      if (profile === 'mechanical') {
        // Crisp dual-click mechanical switch with tactile snap
        const pitchMod = isSpace ? 0.75 : 1.0;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const clickFilter = ctx.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(2200 * pitchMod, now);
        osc1.frequency.exponentialRampToValueAtTime(320 * pitchMod, now + 0.025);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800 * pitchMod, now);
        osc2.frequency.exponentialRampToValueAtTime(140 * pitchMod, now + 0.03);

        clickFilter.type = 'lowpass';
        clickFilter.frequency.setValueAtTime(3200, now);

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
        // High-tech subtle neo-cyber sine ping
        const pitchMod = isSpace ? 0.85 : 1.0;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const env = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1500 * pitchMod, now);
        osc1.frequency.exponentialRampToValueAtTime(550 * pitchMod, now + 0.022);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2400 * pitchMod, now);
        osc2.frequency.exponentialRampToValueAtTime(900 * pitchMod, now + 0.018);

        env.gain.setValueAtTime(0.4, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

        osc1.connect(env);
        osc2.connect(env);
        env.connect(master);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.03);
        osc2.stop(now + 0.03);
      } else if (profile === 'typewriter') {
        // Crisp striker tap with mechanical noise burst
        const pitchMod = isSpace ? 0.8 : 1.0;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680 * pitchMod, now);
        osc.frequency.exponentialRampToValueAtTime(95 * pitchMod, now + 0.038);

        env.gain.setValueAtTime(0.45, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

        osc.connect(env);
        env.connect(master);

        osc.start(now);
        osc.stop(now + 0.045);
      } else if (profile === 'thock') {
        // Deep lubricated linear switch with creamy acoustic resonance
        const pitchMod = isSpace ? 0.8 : 1.0;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(240 * pitchMod, now);
        osc1.frequency.exponentialRampToValueAtTime(75 * pitchMod, now + 0.045);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(460 * pitchMod, now);
        osc2.frequency.exponentialRampToValueAtTime(120 * pitchMod, now + 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, now);
        filter.Q.setValueAtTime(2.2, now);

        env.gain.setValueAtTime(0.8, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(env);
        env.connect(master);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.05);
        osc2.stop(now + 0.05);
      } else if (profile === 'cyber') {
        // Energetic sci-fi laser blip with rapid sweep
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2800, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.032);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.setValueAtTime(3.0, now);

        env.gain.setValueAtTime(0.5, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(filter);
        filter.connect(env);
        env.connect(master);

        osc.start(now);
        osc.stop(now + 0.036);
      } else if (profile === 'marbles') {
        // High-frequency ceramic glass marble tap with ringing bell
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const env = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2640, now);
        osc1.frequency.exponentialRampToValueAtTime(1900, now + 0.025);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(3520, now);
        osc2.frequency.exponentialRampToValueAtTime(2800, now + 0.02);

        env.gain.setValueAtTime(0.35, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

        osc1.connect(env);
        osc2.connect(env);
        env.connect(master);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.03);
        osc2.stop(now + 0.03);
      }
    } catch {
      // Audio playback fails gracefully if muted or permissions restrict
    }
  }

  /**
   * Plays a distinct error tone scaled by errorVolume.
   */
  playError(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      const gainValue = Math.min(1, Math.max(0, volume)) * 0.4;
      master.gain.setValueAtTime(gainValue, now);
      master.connect(ctx.destination);

      // Low dissonant thud with dual detuned tones
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const env = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(145, now);
      osc2.frequency.exponentialRampToValueAtTime(75, now + 0.08);

      env.gain.setValueAtTime(0.6, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      osc1.connect(env);
      osc2.connect(env);
      env.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.09);
      osc2.stop(now + 0.09);
    } catch {
      // Ignore
    }
  }

  /**
   * Plays a short positive success chime (e.g. for testing success volume or milestones).
   */
  playSuccess(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      const gainValue = Math.min(1, Math.max(0, volume)) * 0.35;
      master.gain.setValueAtTime(gainValue, now);
      master.connect(ctx.destination);

      // Uplifting two-tone ascending chime
      const notes = [
        { freq: 659.25, time: 0, dur: 0.12 }, // E5
        { freq: 987.77, time: 0.08, dur: 0.2 }, // B5
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        env.gain.setValueAtTime(0.001, now + note.time);
        env.gain.exponentialRampToValueAtTime(0.6, now + note.time + 0.02);
        env.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

        osc.connect(env);
        env.connect(master);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur + 0.01);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Plays a celebratory completion chord on test finish, scaled by successVolume.
   */
  playComplete(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      const now = ctx.currentTime;
      const master = ctx.createGain();
      const gainValue = Math.min(1, Math.max(0, volume)) * 0.35;
      master.gain.setValueAtTime(gainValue, now);
      master.connect(ctx.destination);

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.5, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.38);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundSynthesizer();
