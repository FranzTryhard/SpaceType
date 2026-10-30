/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface VirtualKeyboardProps {
  activeKey?: string | null;
  targetKey?: string | null;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  targetKey,
}) => {
  // Exact Monkeytype keyboard layout from user screenshot
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];

  const normalizedActive = activeKey ? activeKey.toLowerCase() : null;
  const normalizedTarget = targetKey ? targetKey.toLowerCase() : null;

  const renderKey = (key: string) => {
    const isPressed = normalizedActive === key;
    const isTarget = normalizedTarget === key && !isPressed;

    let style = 'bg-[#1e1c2e]/70 border-slate-800/80 text-slate-500';
    if (isPressed) {
      style = 'bg-[#5b8cff] border-transparent text-white shadow-[0_0_12px_rgba(91,140,255,0.7)] scale-95';
    } else if (isTarget) {
      style = 'bg-purple-950/40 border-[#a855f7]/60 text-purple-200';
    }

    return (
      <div
        key={key}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[5px] border flex items-center justify-center font-mono text-[11px] font-medium lowercase select-none transition-all duration-75 ${style}`}
      >
        {key}
      </div>
    );
  };

  const isSpacePressed = normalizedActive === ' ' || normalizedActive === 'space';

  return (
    <div className="w-full flex flex-col items-center gap-1.5 select-none pt-8">
      {/* Row 1: q w e r t y u i o p [ ] */}
      <div className="flex items-center gap-1.5">
        {row1.map((k) => renderKey(k))}
      </div>

      {/* Row 2: a s d f g h j k l ; ' */}
      <div className="flex items-center gap-1.5 pl-2">
        {row2.map((k) => renderKey(k))}
      </div>

      {/* Row 3: z x c v b n m , . / */}
      <div className="flex items-center gap-1.5 pl-4">
        {row3.map((k) => renderKey(k))}
      </div>

      {/* Row 4: Space bar with 'default' label matching screenshot */}
      <div className="flex items-center justify-center pt-0.5">
        <div
          className={`h-6 sm:h-7 w-48 sm:w-56 rounded-[5px] border flex items-center justify-center text-[10px] font-typing tracking-wider select-none transition-all duration-75 ${
            isSpacePressed
              ? 'bg-[#5b8cff] border-transparent text-white shadow-[0_0_12px_rgba(91,140,255,0.7)] scale-95'
              : 'bg-[#1e1c2e]/70 border-slate-800/80 text-slate-500'
          }`}
        >
          default
        </div>
      </div>
    </div>
  );
};
