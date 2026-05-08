// apps/web/src/components/home/HeroCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

const HEADLINE_1 = "AI 튜토리얼,";
const HEADLINE_2 = "제가 먼저 끝까지 해봅니다.";
const SUBLINE = "설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다.";
const ACCENT_WORD = "끝까지";
const MAX_DOTS = 90;
const CANVAS_BG = "#ffffff";

// ── SpaceDot: cosmic particle spawned from canvas edges ────────────────────
class SpaceDot {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  r = 0;
  life = 0;
  lifeSpeed = 0;
  maxAlpha = 0;
  isAccent = false;
  trail: Array<{ x: number; y: number }> = [];
  private trailMax = 0;

  constructor(
    private W: number,
    private H: number,
  ) {
    this.spawn();
  }

  spawn() {
    const edge = Math.floor(Math.random() * 4);
    const speed = 0.15 + Math.random() * 0.4;
    const angle = (Math.random() - 0.5) * (Math.PI / 2.4);
    this.r = 0.8 + Math.random() * 2.2;
    this.life = 0;
    this.lifeSpeed = 0.003 + Math.random() * 0.004;
    this.maxAlpha = 0.12 + Math.random() * 0.22;
    this.isAccent = Math.random() < 0.1;
    this.trail = [];
    this.trailMax = 2 + Math.floor(Math.random() * 6);

    switch (edge) {
      case 0: // top
        this.x = Math.random() * this.W;
        this.y = -this.r;
        this.vx = Math.sin(angle) * speed;
        this.vy = Math.cos(angle) * speed;
        break;
      case 1: // right
        this.x = this.W + this.r;
        this.y = Math.random() * this.H;
        this.vx = -(Math.cos(angle) * speed);
        this.vy = Math.sin(angle) * speed;
        break;
      case 2: // bottom
        this.x = Math.random() * this.W;
        this.y = this.H + this.r;
        this.vx = Math.sin(angle) * speed;
        this.vy = -(Math.cos(angle) * speed);
        break;
      default: // left
        this.x = -this.r;
        this.y = Math.random() * this.H;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        break;
    }
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailMax) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;
    this.life = Math.min(1, this.life + this.lifeSpeed);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.sin(this.life * Math.PI) * this.maxAlpha;
    if (alpha <= 0) return;

    for (let i = 0; i < this.trail.length - 1; i++) {
      const pt = this.trail[i]!;
      const trailAlpha = (i / this.trail.length) * alpha * 0.35;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, this.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = this.isAccent
        ? `rgba(184,52,28,${trailAlpha})`
        : `rgba(0,0,0,${trailAlpha})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.isAccent
      ? `rgba(184,52,28,${alpha})`
      : `rgba(0,0,0,${alpha})`;
    ctx.fill();
  }

  get isDead() {
    return this.life >= 1;
  }
}

// ── Letter: independently animated headline character ─────────────────────
class Letter {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  rotation = 0;
  alpha = 0;
  readonly phase: number;
  readonly waveAmp: number;
  readonly waveFreq: number;

  constructor(
    readonly char: string,
    readonly restX: number,
    readonly restY: number,
    readonly isAccent: boolean,
    readonly fontSize: number,
  ) {
    this.x = restX + (Math.random() - 0.5) * 320;
    this.y = restY + (Math.random() - 0.5) * 220;
    this.phase = Math.random() * Math.PI * 2;
    this.waveAmp = 1.5 + Math.random() * 3.5;
    this.waveFreq = 0.4 + Math.random() * 0.8;
  }

  update(t: number, mouseX: number, mouseY: number) {
    const waveY = this.restY + Math.sin(t * this.waveFreq + this.phase) * this.waveAmp;

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let fx = 0;
    let fy = 0;
    const repelRadius = this.fontSize * 3.8;
    if (dist < repelRadius && dist > 0) {
      const force = (repelRadius - dist) / repelRadius;
      fx = (dx / dist) * force * 6;
      fy = (dy / dist) * force * 6;
    }

    this.vx = (this.vx + (this.restX - this.x) * 0.13 + fx) * 0.74;
    this.vy = (this.vy + (waveY - this.y) * 0.13 + fy) * 0.74;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation = this.vx * 0.035;
    if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.035);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.isAccent ? "#b8341c" : "#000000";
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

// ── Build Letter array by measuring character positions on canvas ──────────
function buildLetterLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  y: number,
  W: number,
  accentWord: string,
): Letter[] {
  ctx.font = `800 ${fontSize}px Pretendard Variable, Pretendard, system-ui, sans-serif`;
  ctx.textBaseline = "middle";

  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  let curX = (W - totalWidth) / 2;

  const accentStart = text.indexOf(accentWord);
  const accentEnd = accentStart === -1 ? -1 : accentStart + accentWord.length;

  return chars.map((char, i) => {
    const charX = curX + widths[i]! / 2;
    curX += widths[i]!;
    const isAccent = accentStart !== -1 && i >= accentStart && i < accentEnd;
    return new Letter(char, charX, y, isAccent, fontSize);
  });
}

// ── HeroCanvas ─────────────────────────────────────────────────────────────
export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dots: SpaceDot[] = [];
    let letters: Letter[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    let animTime = 0;
    let lastFrame = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container!.getBoundingClientRect();
      W = rect.width;
      H = Math.min(420, W * 0.42);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLetters();
      animTime = 0;
      lastFrame = performance.now();
    }

    function buildLetters() {
      letters = [];
      if (W === 0) return;

      const size1 = Math.max(28, Math.min(54, W * 0.048));
      const size2 = Math.max(24, Math.min(48, W * 0.042));
      const lineGap = size1 * 0.22;
      const blockH = size1 + lineGap + size2;
      const startY = H / 2 - blockH / 2;

      const line1 = buildLetterLine(
        ctx!,
        HEADLINE_1,
        size1,
        startY + size1 / 2,
        W,
        ACCENT_WORD,
      );
      const line2 = buildLetterLine(
        ctx!,
        HEADLINE_2,
        size2,
        startY + size1 + lineGap + size2 / 2,
        W,
        ACCENT_WORD,
      );
      letters = [...line1, ...line2];
    }

    function drawGrid() {
      const step = 40;
      ctx!.strokeStyle = "rgba(0,0,0,0.022)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < W; x += step) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, H);
        ctx!.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }
    }

    function drawCrosshairs() {
      ctx!.strokeStyle = "rgba(0,0,0,0.10)";
      ctx!.lineWidth = 1;
      const marks: [number, number][] = [
        [10, 10],
        [W - 10, 10],
        [10, H - 10],
        [W - 10, H - 10],
      ];
      for (const [x, y] of marks) {
        ctx!.beginPath();
        ctx!.moveTo(x - 6, y);
        ctx!.lineTo(x + 6, y);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(x, y - 6);
        ctx!.lineTo(x, y + 6);
        ctx!.stroke();
      }
    }

    function drawConnections() {
      const MAX_DIST = 75;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i]!.x - dots[j]!.x;
          const dy = dots[i]!.y - dots[j]!.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.07;
            ctx!.beginPath();
            ctx!.moveTo(dots[i]!.x, dots[i]!.y);
            ctx!.lineTo(dots[j]!.x, dots[j]!.y);
            ctx!.strokeStyle = `rgba(0,0,0,${a})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    function loop() {
      const now = performance.now();
      if (!document.hidden) {
        animTime += (now - lastFrame) / 1000;
      }
      lastFrame = now;

      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const t = animTime;
      ctx!.fillStyle = CANVAS_BG;
      ctx!.fillRect(0, 0, W, H);
      drawGrid();

      dots = dots.filter((d) => !d.isDead);
      while (dots.length < MAX_DOTS) dots.push(new SpaceDot(W, H));
      for (const dot of dots) dot.update();
      drawConnections();
      for (const dot of dots) dot.draw(ctx!);

      for (const letter of letters) {
        letter.update(t, mouse.x, mouse.y);
        letter.draw(ctx!);
      }

      drawCrosshairs();
      raf = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onTouchMove(e: TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }

    resize();
    loop();

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-bg-surface"
      style={{ height: "min(420px, 42vw)", minHeight: "220px" }}
      role="presentation"
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* SEO/a11y overlay: same text, color:transparent so crawlers/screen readers see it */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ color: "transparent", userSelect: "none", zIndex: 10 }}
      >
        <h1
          style={{
            fontFamily:
              "Pretendard Variable, Pretendard, system-ui, sans-serif",
            fontSize: "clamp(28px, 4.8vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}
        >
          {HEADLINE_1}
          <br />
          {HEADLINE_2}
        </h1>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(11px, 1.3vw, 14px)",
            marginTop: "12px",
          }}
        >
          {SUBLINE}
        </p>
      </div>

      {/* Visible subline (canvas animates the headlines, not the subline) */}
      <div
        className="pointer-events-none absolute bottom-6 left-0 right-0 px-6 text-center"
        style={{ zIndex: 11 }}
      >
        <p
          className="font-mono text-ink-400"
          style={{ fontSize: "clamp(11px, 1.3vw, 14px)", lineHeight: 1.7 }}
          aria-hidden="true"
        >
          {SUBLINE}
        </p>
      </div>
    </div>
  );
}
