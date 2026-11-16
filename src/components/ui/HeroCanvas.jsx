import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Crisp interactive geometric constellation & shockwave field.
 * Zero blurry fbm fog — pure vector nodes, hairline filaments, magnetic cursor attraction,
 * and expanding circular pulses when users click anywhere on the Hero canvas.
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
    const waves = [];

    const buildParticles = () => {
      const count = width < 640 ? 40 : 84;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.9
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    const mouse = { x: width * 0.65, y: height * 0.45, active: false };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        mouse.x >= 0 && mouse.x <= rect.width && mouse.y >= 0 && mouse.y <= rect.height;
    };

    const onPointerDown = (e) => {
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        waves.push({ x, y, r: 6, alpha: 0.65 });
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
        ctx.clearRect(0, 0, width, height);

        // Subtle crisp blueprint dot matrix background
        const gridStep = 44;
        ctx.fillStyle = dark ? 'rgba(244, 244, 240, 0.07)' : 'rgba(17, 17, 16, 0.06)';
        for (let gx = gridStep / 2; gx < width; gx += gridStep) {
          for (let gy = gridStep / 2; gy < height; gy += gridStep) {
            ctx.fillRect(gx - 0.6, gy - 0.6, 1.2, 1.2);
          }
        }

        // Update particles
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
              if (dist > 0 && dist < 170) {
                const force = (170 - dist) / 170;
                p.x += (dx / dist) * force * 0.9;
                p.y += (dy / dist) * force * 0.9;
              }
            }
          }

          // Connect close particles with hairline filaments
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 135) {
              const alpha = (1 - dist / 135) * (dark ? 0.18 : 0.12);
              ctx.strokeStyle = dark
                ? `rgba(96, 165, 250, ${alpha.toFixed(3)})`
                : `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
              ctx.lineWidth = 0.85;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }

          // Illuminate filament straight toward pointer
          if (mouse.active) {
            const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (mDist < 190) {
              const alpha = (1 - mDist / 190) * (dark ? 0.42 : 0.28);
              ctx.strokeStyle = dark
                ? `rgba(147, 197, 253, ${alpha.toFixed(3)})`
                : `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }

          // Node dot
          const nearMouse = mouse.active && Math.hypot(p.x - mouse.x, p.y - mouse.y) < 150;
          ctx.fillStyle = nearMouse
            ? dark
              ? 'rgba(147, 197, 253, 0.95)'
              : 'rgba(37, 99, 235, 0.9)'
            : dark
            ? 'rgba(244, 244, 240, 0.35)'
            : 'rgba(17, 17, 16, 0.24)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, nearMouse ? p.r * 1.45 : p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Expanding crisp click ripples
        for (let w = waves.length - 1; w >= 0; w--) {
          const wave = waves[w];
          wave.r += 5.5;
          wave.alpha *= 0.945;
          if (wave.alpha < 0.02) {
            waves.splice(w, 1);
            continue;
          }
          ctx.strokeStyle = dark
            ? `rgba(96, 165, 250, ${wave.alpha.toFixed(3)})`
            : `rgba(37, 99, 235, ${wave.alpha.toFixed(3)})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (!prefersReduced) {
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
