/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Flame, Zap, Sparkles } from 'lucide-react';
import { EngineStatus } from '../engine/typingEngine.ts';

interface StreakCounterProps {
  streak: number;
  status: EngineStatus;
  reducedMotion?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  status,
  reducedMotion = false,
}) => {
  const [justLost, setJustLost] = useState(false);
  const prevStreakRef = useRef(streak);
  const lostTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevStreakRef.current >= 3 && streak === 0 && status === 'running') {
      setJustLost(true);
      if (lostTimerRef.current) clearTimeout(lostTimerRef.current);
      lostTimerRef.current = window.setTimeout(() => {
        setJustLost(false);
      }, 700);
    } else if (streak > 0) {
      setJustLost(false);
    }
    prevStreakRef.current = streak;

    return () => {
      if (lostTimerRef.current) clearTimeout(lostTimerRef.current);
    };
  }, [streak, status]);

  if (status !== 'running') {
    return null;
  }

  if (justLost) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold border border-rose-500/50 bg-rose-950/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all animate-key-shake">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
        <span>STREAK BROKEN</span>
      </div>
    );
  }

  if (streak < 1) {
    return null;
  }

  // Tiers configuration
  let tierConfig = {
    label: `${streak}x COMBO`,
    subLabel: streak === 1 ? 'START' : 'NICE',
    icon: Zap,
    containerClasses:
      'border-sky-500/40 bg-sky-950/50 text-sky-300',
    glowStyle: {
      boxShadow: '0 0 14px rgba(56, 189, 248, 0.4), inset 0 0 8px rgba(56, 189, 248, 0.15)',
    },
    iconColor: 'text-sky-400',
    textColor: 'text-sky-200',
    extraBadge: '',
  };

  if (streak >= 10) {
    tierConfig = {
      label: `${streak}x HYPER STREAK`,
      subLabel: 'UNSTOPPABLE ⚡',
      icon: Sparkles,
      containerClasses:
        'border-pink-400/80 bg-gradient-to-r from-pink-950/70 via-purple-950/70 to-indigo-950/70',
      glowStyle: {
        boxShadow:
          '0 0 32px rgba(236, 72, 153, 0.85), 0 0 18px rgba(168, 85, 247, 0.7), inset 0 0 12px rgba(236, 72, 153, 0.35)',
      },
      iconColor: 'text-amber-300 animate-spin-slow',
      textColor:
        'text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-amber-200 to-cyan-200 font-bold',
      extraBadge: 'animate-streak-aura',
    };
  } else if (streak >= 6) {
    tierConfig = {
      label: `${streak}x SUPER STREAK`,
      subLabel: 'ON FIRE 🔥',
      icon: Flame,
      containerClasses:
        'border-amber-400/60 bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-amber-950/60',
      glowStyle: {
        boxShadow:
          '0 0 24px rgba(244, 63, 94, 0.7), 0 0 14px rgba(251, 146, 60, 0.55), inset 0 0 10px rgba(244, 63, 94, 0.25)',
      },
      iconColor: 'text-amber-400 animate-bounce-subtle',
      textColor: 'text-amber-200 font-bold',
      extraBadge: 'animate-pulse',
    };
  } else if (streak >= 3) {
    tierConfig = {
      label: `${streak}x STREAK`,
      subLabel: 'FLOW STATE',
      icon: Flame,
      containerClasses:
        'border-purple-500/50 bg-purple-950/50 text-purple-200',
      glowStyle: {
        boxShadow:
          '0 0 18px rgba(168, 85, 247, 0.55), 0 0 8px rgba(56, 189, 248, 0.35), inset 0 0 8px rgba(168, 85, 247, 0.2)',
      },
      iconColor: 'text-purple-300',
      textColor: 'text-purple-100',
      extraBadge: '',
    };
  }

  const Icon = tierConfig.icon;

  return (
    <div
      key={streak}
      style={tierConfig.glowStyle}
      className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-mono tracking-wider font-semibold select-none backdrop-blur-md transition-all duration-200 ${
        tierConfig.containerClasses
      } ${tierConfig.extraBadge} ${!reducedMotion ? 'animate-streak-pop' : ''}`}
    >
      <Icon className={`w-3.5 h-3.5 ${tierConfig.iconColor} shrink-0`} />
      <span className={tierConfig.textColor}>{tierConfig.label}</span>
      <span className="hidden sm:inline text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-sans border border-white/10">
        {tierConfig.subLabel}
      </span>
    </div>
  );
};
