import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

const LIGHT_NODE_COLORS = [
  [37, 99, 235],   // Royal Cobalt
  [14, 165, 233],  // Sky Azure
  [16, 185, 129],  // Emerald Mint
  [217, 119, 6]    // Warm Sunlight Amber
];

const DARK_NODE_COLORS = [
  [96, 165, 250],
  [56, 189, 248],
  [52, 211, 153],
  [251, 191, 36]
];

const RIBBON_CONFIGS = [
  { yRatio: 0.24, amp: 24, freq: 0.0038, speed: 0.009, phase: 0.4, colorIdx: 0, width: 1.5 },
  { yRatio: 0.42, amp: 32, freq: 0.0031, speed: -0.007, phase: 1.7, colorIdx: 1, width: 1.3 },
  { yRatio: 0.62, amp: 26, freq: 0.0044, speed: 0.011, phase: 3.1, colorIdx: 2, width: 1.4 },
  { yRatio: 0.80, amp: 22, freq: 0.0035, speed: -0.008, phase: 4.5, colorIdx: 3, width: 1.1 }
];

/**
 * Interactive vector art canvas:
 * - Flowing chromatic harmonic silk ribbons that bend smoothly near the pointer
 * - Crisp azure/emerald node constellation with pointer magnetic repulsion & filament links
 * - Expanding chromatic multi-ring ripples wherever visitors click on the Hero
 */
export function HeroCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const isDarkRef = useRef(theme === 'dark');

  useEffect(() => {
    isDarkRef.current = theme === 'dark';
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let time = 0;
    const waves = [];

    const buildParticles = () => {
      const count = width < 768 ? 16 : 42;
      particles = Array.from({ length: count }, (_, idx) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.6 + 1.2,
        colorIdx: idx % LIGHT_NODE_COLORS.length
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: width * 0.58, y: height * 0.45, active: false };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };

    const onPointerDown = (e) => {
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        waves.push({ x, y, r: 8, alpha: 0.72, colorIdx: waves.length % 3 });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    let rafId = 0;

    const tick = () => {
      if (visible) {
        const dark = isDarkRef.current;
        const palette = dark ? DARK_NODE_COLORS : LIGHT_NODE_COLORS;
        ctx.clearRect(0, 0, width, height);

        if (!prefersReduced) {
          time += 1;
        }

        // Architectural fine blueprint crosshairs
        const step = 76;
        ctx.strokeStyle = dark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(37, 99, 235, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let gx = step; gx < width; gx += step) {
          for (let gy = step; gy < height; gy += step) {
            ctx.moveTo(gx - 3, gy);
            ctx.lineTo(gx + 3, gy);
            ctx.moveTo(gx, gy - 3);
            ctx.lineTo(gx, gy + 3);
          }
        }
        ctx.stroke();

        // Pointer ambient soft halo
        if (mouse.active) {
          const halo = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
          halo.addColorStop(
            0,
            dark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(37, 99, 235, 0.10)'
          );
          halo.addColorStop(1, 'transparent');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
          ctx.fill();
        }

        // Flowing chromatic harmonic splines (bend gracefully around pointer)
        const segmentStep = width < 640 ? 22 : 18;
        for (const rib of RIBBON_CONFIGS) {
          const [r, g, b] = palette[rib.colorIdx];
          const alpha = dark ? 0.22 : 0.24;
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.02)`);
          grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.04)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = rib.width;
          ctx.beginPath();

          const baseY = height * rib.yRatio;
          for (let x = 0; x <= width + segmentStep; x += segmentStep) {
            const wave =
              Math.sin(x * rib.freq + time * rib.speed + rib.phase) * rib.amp +
              Math.cos(x * rib.freq * 0.52 - time * rib.speed * 0.7) * (rib.amp * 0.45);
            let y = baseY + wave;

            if (mouse.active) {
              const dx = x - mouse.x;
              const dy = y - mouse.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 220) {
                const strength = Math.pow(1 - dist / 220, 2);
                y += (dy >= 0 ? 1 : -1) * strength * 42;
              }
            }

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Chromatic constellation nodes & magnetic filaments
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!prefersReduced) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            if (mouse.active) {
              const dx = p.x - mouse.x;
              const dy = p.y - mouse.y;
              const dist = Math.hypot(dx, dy);
              if (dist > 0 && dist < 160) {
                const force = (160 - dist) / 160;
                p.x += (dx / dist) * force * 0.85;
                p.y += (dy / dist) * force * 0.85;
              }
            }
          }

          const [pr, pg, pb] = palette[p.colorIdx];

          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 130) {
              const alpha = (1 - dist / 130) * (dark ? 0.2 : 0.16);
              ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${alpha.toFixed(3)})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }

          if (mouse.active) {
            const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (mDist < 190) {
              const alpha = (1 - mDist / 190) * (dark ? 0.44 : 0.36);
              ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${alpha.toFixed(3)})`;
              ctx.lineWidth = 1.1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }

          const nearMouse = mouse.active && Math.hypot(p.x - mouse.x, p.y - mouse.y) < 160;
          ctx.fillStyle = nearMouse
            ? `rgba(${pr}, ${pg}, ${pb}, 0.92)`
            : dark
            ? `rgba(${pr}, ${pg}, ${pb}, 0.42)`
            : `rgba(${pr}, ${pg}, ${pb}, 0.38)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, nearMouse ? p.r * 1.4 : p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Expanding multi-ring click shockwaves
        for (let w = waves.length - 1; w >= 0; w--) {
          const wave = waves[w];
          wave.r += 5.2;
          wave.alpha *= 0.945;
          if (wave.alpha < 0.02) {
            waves.splice(w, 1);
            continue;
          }
          const [wr, wg, wb] = palette[wave.colorIdx];
          ctx.strokeStyle = `rgba(${wr}, ${wg}, ${wb}, ${wave.alpha.toFixed(3)})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
          ctx.stroke();

          if (wave.r > 24) {
            ctx.strokeStyle = `rgba(${wr}, ${wg}, ${wb}, ${(wave.alpha * 0.45).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.r * 0.68, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      if (!prefersReduced && width >= 768) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full block ${className}`}
    />
  );
}

export default HeroCanvas;
