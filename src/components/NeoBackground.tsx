/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { THEMES } from '../tokens/index.ts';

interface NeoBackgroundProps {
  themeId: string;
  wpm: number;
  reducedMotion: boolean;
  isActive: boolean;
}

export const NeoBackground: React.FC<NeoBackgroundProps> = ({
  themeId,
  wpm,
  reducedMotion,
  isActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = THEMES[themeId] || THEMES['neo-cyber'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (reducedMotion) {
        drawFrame(0);
      }
    };

    window.addEventListener('resize', handleResize);

    // Architectural grid configuration
    const fov = 350;
    const horizon = height * 0.45;
    let gridOffset = 0;

    // Subtle drifting geometric node particles
    const nodes = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 137.5) % width) - width / 2,
      y: (Math.sin(i * 1.5) * height * 0.35),
      z: 100 + ((i * 80) % 800),
      size: 1.5 + (i % 3),
      drift: 0.2 + (i % 5) * 0.1,
    }));

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Deep radial vignette
      const vignette = ctx.createRadialGradient(
        width / 2,
        height * 0.5,
        100,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Horizon glow line
      const horizonGlow = ctx.createLinearGradient(0, horizon - 20, 0, horizon + 40);
      horizonGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      horizonGlow.addColorStop(0.5, theme.gridLineColor.replace('0.08', '0.18'));
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, horizon - 20, width, 60);

      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme.gridLineColor;

      // 1. Perspective Grid (Floor)
      const numLines = 16;
      const spacingX = width / numLines;
      const centerX = width / 2;

      // Longitudinal lines vanishing to horizon center
      for (let i = -numLines; i <= numLines; i++) {
        const xFloor = centerX + i * spacingX * 2.2;
        ctx.beginPath();
        ctx.moveTo(centerX + (i * spacingX * 0.15), horizon);
        ctx.lineTo(xFloor, height);
        ctx.stroke();
      }

      // Latitudinal lines moving towards viewer
      const baseSpeed = isActive ? 0.8 + Math.min(wpm / 40, 2.5) : 0.3;
      if (!reducedMotion) {
        gridOffset = (gridOffset + baseSpeed) % 40;
      }

      for (let z = 1; z < 14; z++) {
        const lineZ = z * 35 - gridOffset;
        if (lineZ <= 5) continue;
        const screenY = horizon + (fov / lineZ) * 22;
        if (screenY > height) continue;

        const alpha = Math.min(0.12, (screenY - horizon) / (height - horizon) * 0.14);
        ctx.strokeStyle = theme.gridLineColor.replace('0.08', alpha.toFixed(3));
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
      }

      // 2. Subtle architectural floating nodes
      if (!reducedMotion) {
        nodes.forEach((node) => {
          node.z -= baseSpeed * 1.5;
          if (node.z <= 20) {
            node.z = 800;
          }

          const scale = fov / node.z;
          const px = centerX + node.x * scale;
          const py = horizon + node.y * scale;

          if (px > 0 && px < width && py > 0 && py < height) {
            const alpha = Math.min(0.25, (1 - node.z / 800) * 0.35);
            ctx.fillStyle = theme.accent;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, node.size * Math.max(0.6, scale * 1.2), 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby nodes with delicate wireframe
            ctx.globalAlpha = alpha * 0.4;
            ctx.strokeStyle = theme.accent;
            ctx.strokeRect(px - 3, py - 3, 6, 6);
          }
        });
      }

      ctx.restore();

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };

    if (reducedMotion) {
      drawFrame(0);
    } else {
      animationFrameId = requestAnimationFrame(drawFrame);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [themeId, wpm, reducedMotion, isActive, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block"
      style={{
        backgroundColor: theme.canvasBg,
      }}
      aria-hidden="true"
    />
  );
};
