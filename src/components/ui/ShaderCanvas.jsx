import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

const VERT_SRC = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dark;

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.05;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);

  float t = u_time * 0.14;

  // Optical silk-ribbon fold coordinates warped softly toward pointer
  float ptrDist = length(p - m);
  vec2 warp = p + (p - m) * (0.14 * exp(-ptrDist * 2.6));
  float n1 = fbm(warp * 1.45 + vec2(t * 0.45, -t * 0.3));
  float n2 = fbm(warp * 2.1 - vec2(-t * 0.35, t * 0.5) + n1 * 0.7);

  // Diagonal prismatic ridge sweeping across canvas
  float diag = p.x * 0.62 - p.y * 0.78 + (n2 - 0.5) * 0.75;
  float ribbon = exp(-abs(diag) * 4.2);
  float crest = pow(max(0.0, 1.0 - abs(diag + (n1 - 0.5) * 0.18) * 3.0), 2.4);

  // Localized specular pool following cursor smoothly
  float cursorBloom = exp(-ptrDist * ptrDist * 2.8);

  // Fine calibrated anti-banding film grain
  float grain = (hash(gl_FragCoord.xy + fract(u_time) * 60.0) - 0.5) * 0.025;

  if (u_dark > 0.5) {
    vec3 base = vec3(0.020, 0.024, 0.032);        // #050608 pitch obsidian
    vec3 slate = vec3(0.045, 0.068, 0.130);       // deep sapphire undertone
    vec3 ice = vec3(0.24, 0.50, 0.96);            // calibrated cobalt light
    vec3 warm = vec3(0.88, 0.76, 0.58);           // subtle champagne rim spark

    vec3 col = base;
    col = mix(col, slate, clamp(ribbon * 0.75 + n1 * 0.18, 0.0, 1.0));
    col += ice * (crest * 0.32 + cursorBloom * 0.14);
    col += warm * pow(crest, 3.0) * 0.12;
    col += grain;
    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  } else {
    vec3 paper = vec3(0.965, 0.961, 0.941);       // #F6F5F0 alabaster
    vec3 tint = vec3(0.87, 0.90, 0.97);
    vec3 spark = vec3(0.15, 0.38, 0.88);

    vec3 col = paper;
    col = mix(col, tint, clamp(ribbon * 0.45 + n1 * 0.12, 0.0, 0.65));
    col = mix(col, spark, clamp(cursorBloom * 0.07 + crest * 0.05, 0.0, 0.18));
    col += grain * 0.45;
    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
}`;

export function ShaderCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);
  const { theme } = useTheme();
  const isDarkRef = useRef(theme === 'dark');

  useEffect(() => {
    isDarkRef.current = theme === 'dark';
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      setFallback(true);
      return undefined;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) {
      setFallback(true);
      return undefined;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      setFallback(true);
      return undefined;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uDark = gl.getUniformLocation(prog, 'u_dark');

    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let targetX = 0.65;
    let targetY = 0.45;
    let curX = targetX;
    let curY = targetY;

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      targetY = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    let rafId = 0;
    const start = performance.now();

    const renderFrame = (now) => {
      if (visible) {
        curX += (targetX - curX) * 0.06;
        curY += (targetY - curY) * 0.06;

        gl.useProgram(prog);
        gl.uniform2f(uRes, width, height);
        gl.uniform1f(uTime, prefersReduced ? 4.2 : (now - start) * 0.001);
        gl.uniform2f(uMouse, curX, curY);
        gl.uniform1f(uDark, isDarkRef.current ? 1.0 : 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!prefersReduced) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
    };
  }, []);

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_65%_30%,rgba(59,130,246,0.18),transparent_70%)] ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full block ${className}`}
    />
  );
}

export default ShaderCanvas;
