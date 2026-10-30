/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SeededPRNG } from './prng.ts';

export const STANDARD_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not',
  'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
  'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'great', 'between',
  'need', 'large', 'under', 'system', 'point', 'world', 'high', 'place', 'water', 'again', 'where', 'right', 'still',
  'small', 'number', 'found', 'program', 'group', 'line', 'force', 'light', 'present', 'form', 'power', 'matrix',
  'field', 'sound', 'focus', 'state', 'matter', 'energy', 'order', 'motion', 'plane', 'speed', 'frame', 'shift'
];

export const ADVANCED_WORDS = [
  'ubiquitous', 'paradigm', 'equilibrium', 'trajectory', 'ephemeral', 'synthesis', 'juxtaposition',
  'asynchronous', 'concurrency', 'meticulous', 'luminescence', 'idiosyncrasy', 'resilience',
  'crystallize', 'bifurcation', 'configuration', 'dichotomy', 'proprioception', 'hyperbolic',
  'interconnected', 'monolithic', 'permeable', 'oscillation', 'reverberation', 'infrastructure',
  'stratification', 'subterranean', 'transcendence', 'unprecedented', 'vulnerability', 'wavelength',
  'coalescence', 'divergence', 'extrapolation', 'fluctuation', 'gravitational', 'heterogeneous',
  'indispensable', 'jurisdiction', 'kinematic', 'longitudinal', 'multiplicity', 'navigational',
  'perpendicular', 'quantitative', 'reciprocal', 'spatiotemporal', 'triangulation', 'unidimensional'
];

export const NEO_FUTURISTIC_WORDS = [
  'cantilever', 'geodesic', 'telemetry', 'vector', 'lattice', 'aerodynamic', 'kinetic', 'cybernetic',
  'singularity', 'superconductor', 'titanium', 'obsidian', 'resonance', 'flux', 'propulsion',
  'quantum', 'orbital', 'hyperdrive', 'parametric', 'tensile', 'exoskeleton', 'synthetic',
  'monolith', 'refraction', 'isometric', 'interstellar', 'chronometer', 'subatomic', 'algorithm',
  'nanotech', 'atmospheric', 'biomechanical', 'electromagnetic', 'fusion', 'holographic',
  'invariance', 'megastructure', 'neuromorphic', 'photonic', 'strut', 'tachyon', 'topography',
  'transceiver', 'ultrasonic', 'velocity', 'vortex', 'warp', 'zenith', 'apogee', 'scaffold',
  'polycarbonate', 'aerogel', 'graphene', 'supercluster', 'radiance', 'solarium', 'spire'
];

export interface CuratedQuote {
  id: string;
  text: string;
  author: string;
  source: string;
}

export const CURATED_QUOTES: CuratedQuote[] = [
  {
    id: 'fuller-1',
    text: 'You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.',
    author: 'Buckminster Fuller',
    source: 'Synergetics',
  },
  {
    id: 'hadid-1',
    text: 'There are 360 degrees, so why stick to one? Architecture must reflect the dynamic velocities of contemporary life.',
    author: 'Zaha Hadid',
    source: 'Architectural Monograph',
  },
  {
    id: 'gibson-1',
    text: 'The sky above the port was the color of television, tuned to a dead channel. The future is already here, it is just not evenly distributed.',
    author: 'William Gibson',
    source: 'Neuromancer',
  },
  {
    id: 'lovelace-1',
    text: 'The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.',
    author: 'Ada Lovelace',
    source: 'Notes on the Analytical Engine',
  },
  {
    id: 'clarke-1',
    text: 'Any sufficiently advanced technology is indistinguishable from magic. We stand at the threshold of cosmic computation.',
    author: 'Arthur C. Clarke',
    source: 'Profiles of the Future',
  },
  {
    id: 'sagan-1',
    text: 'Somewhere, something incredible is waiting to be known. We are a way for the cosmos to know itself.',
    author: 'Carl Sagan',
    source: 'Cosmos',
  },
  {
    id: 'wiener-1',
    text: 'We are but whirlpools in a river of ever-flowing water. We are not substance that abides, but patterns that perpetuate themselves.',
    author: 'Norbert Wiener',
    source: 'Cybernetics',
  },
  {
    id: 'wright-1',
    text: 'Space is the breath of art. When architectural form expresses function with uncompromising purity, structure becomes music.',
    author: 'Frank Lloyd Wright',
    source: 'An Organic Architecture',
  },
];

export const CODE_SNIPPETS = [
  'const stream = await socket.subscribe({ bufferSize: 1024, autoReconnect: true });',
  'interface Vector3D { readonly x: number; readonly y: number; readonly z: number; }',
  'export async function computeTrajectory(origin: Vector, velocity: number): Promise<Trajectory> {',
  'return nodes.filter(node => node.isActive).map(node => ({ id: node.id, latency: node.ping() }));',
  'const { width, height } = canvas.getBoundingClientRect(); ctx.clearRect(0, 0, width, height);',
  'type KineticState = "accelerating" | "coasting" | "braking" | "stationary";',
  'const payload = JSON.stringify({ timestamp: performance.now(), status: "synced" });',
  'const distance = Math.hypot(target.x - current.x, target.y - current.y);',
  'if (entropy > threshold) { triggerThermalThrottling(device.cores); }',
  'document.addEventListener("keydown", (event) => handleKeystroke(event.key));'
];

export type LexiconType = 'standard' | 'advanced' | 'neo_futuristic' | 'quotes' | 'code';
export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'custom';

export interface CorpusOptions {
  mode: TestMode;
  lexicon: LexiconType;
  wordCount?: number;
  wordLimit?: number;
  timeLimit?: number;
  includePunctuation?: boolean;
  includeNumbers?: boolean;
  seed: string;
  customText?: string;
}

export interface GeneratedContent {
  words: string[];
  seed: string;
  rawText?: string;
  quoteAuthor?: string;
  quoteSource?: string;
}

export function generateTestContent(options: CorpusOptions): GeneratedContent {
  const prng = new SeededPRNG(options.seed);
  const targetWordCount = options.wordCount || options.wordLimit || 25;

  if (options.mode === 'custom' && options.customText?.trim()) {
    const raw = options.customText.trim().replace(/\s+/g, ' ');
    return {
      words: raw.split(' ').filter(Boolean),
      seed: options.seed,
      rawText: raw,
    };
  }

  if (options.mode === 'quote') {
    const quote = prng.pick(CURATED_QUOTES);
    const words = quote.text.split(' ').filter(Boolean);
    return {
      words,
      seed: options.seed,
      rawText: quote.text,
      quoteAuthor: quote.author,
      quoteSource: quote.source,
    };
  }

  if (options.mode === 'code') {
    // Pick 2-4 snippets
    const snippetCount = options.wordCount && options.wordCount < 25 ? 1 : 2;
    const pickedSnippets: string[] = [];
    for (let i = 0; i < snippetCount; i++) {
      pickedSnippets.push(prng.pick(CODE_SNIPPETS));
    }
    const combined = pickedSnippets.join(' ');
    const words = combined.split(' ').filter(Boolean);
    return {
      words,
      seed: options.seed,
      rawText: combined,
    };
  }

  // Time or Words mode
  let pool: string[] = STANDARD_WORDS;
  if (options.lexicon === 'advanced') {
    pool = [...STANDARD_WORDS, ...ADVANCED_WORDS];
  } else if (options.lexicon === 'neo_futuristic') {
    pool = [...STANDARD_WORDS.slice(0, 50), ...NEO_FUTURISTIC_WORDS];
  }

  // Count to generate
  let count = 30;
  if (options.mode === 'words') {
    count = targetWordCount;
  } else if (options.mode === 'time') {
    // Calculate a generous buffer so user never runs out of words
    const seconds = options.timeLimit || 30;
    count = Math.max(50, Math.ceil((seconds / 60) * 150) + 30);
  }

  const punctuationMarks = [',', '.', ';', ':', '!', '?', '"', '-'];
  const generatedWords: string[] = [];

  for (let i = 0; i < count; i++) {
    let word = prng.pick(pool);

    // If punctuation is enabled
    if (options.includePunctuation && prng.next() < 0.22 && i > 0 && i < count - 1) {
      const punct = prng.pick(punctuationMarks);
      if (punct === '"') {
        word = `"${word}"`;
      } else {
        word = `${word}${punct}`;
      }
    }

    // If numbers is enabled
    if (options.includeNumbers && prng.next() < 0.12 && i > 0) {
      const numType = prng.nextInt(1, 3);
      if (numType === 1) {
        word = String(prng.nextInt(0, 99));
      } else if (numType === 2) {
        word = String(prng.nextInt(1990, 2099));
      } else {
        word = `${prng.nextInt(1, 99)}%`;
      }
    }

    generatedWords.push(word);
  }

  return {
    words: generatedWords,
    seed: options.seed,
    rawText: generatedWords.join(' '),
  };
}
