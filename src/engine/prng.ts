/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * High-speed, deterministic 32-bit seedable PRNG (Mulberry32)
 */
export function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

export class SeededPRNG {
  private state: number;
  public readonly seedString: string;

  constructor(seed: string | number) {
    if (typeof seed === 'string') {
      this.seedString = seed.trim() || 'VECTRA-0001';
      this.state = hashSeed(this.seedString);
    } else {
      this.seedString = String(seed);
      this.state = (seed >>> 0) || 1337;
    }
  }

  /**
   * Returns a pseudo-random floating point number in [0, 1)
   */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a pseudo-random integer in [min, max] inclusive
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Randomly picks one item from an array
   */
  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('Cannot pick from empty array');
    return arr[Math.floor(this.next() * arr.length)];
  }

  /**
   * Shuffles an array in place using Fisher-Yates
   */
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

const SEED_PREFIXES = ['NEO', 'AERO', 'CYBER', 'VECTRA', 'FLUX', 'ORBIT', 'TITAN', 'PRISM', 'QUANTUM', 'KINETIC'];

export function generateRandomSeed(): string {
  const prefix = SEED_PREFIXES[Math.floor(Math.random() * SEED_PREFIXES.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}
