import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/theme";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;       // shape target (only used in morph/hold)
  size: number; twinkle: number;
  alpha: number;
  alive: boolean;
  burstDelay: number;
  burstVx: number; burstVy: number;
  burstActivated: boolean;
};

type Phase = "gather" | "hold" | "burst" | "settle" | "network" | "morph" | "hold_shape";

const SURVIVE     = 0.55;
const NET_ALPHA   = 0.40;
const NET_LINE_A  = 0.15;
const NET_DIST    = 120;

// ── Timing ──────────────────────────────────────────────────────────
const T_GATHER     = 1400;   // D assembly
const T_HOLD       = 1600;   // D holds while the interface springs in around it
const T_BURST      = 2200;   // D explosion (page reveals at end)
const T_SETTLE     = 2000;   // dead particles fade, survivors slow
const T_NETWORK    = 4000;   // free cosmic drift before next shape
const T_MORPH      = 4500;   // slow organic shape formation
const T_SHAPE_HOLD = 3000;   // shape held before release

// ── Ambient physics ─────────────────────────────────────────────────
// Low friction lets particles travel far; noise drives gentle continuous drift.
// total_travel = initial_speed / (1 - FRIC)
// e.g. 1.5 px/frame → 1.5 / 0.007 ≈ 214 px before stopping
const FRIC       = 0.993;  // 0.7% decay per frame — nearly frictionless
const NET_NOISE  = 0.038;  // per component → ~0.27 px/frame steady-state drift
const MORPH_NOISE_0 = 0.034; // initial noise during morph (fights the pull, looks organic)
const MORPH_NOISE_1 = 0.014; // final noise (shape firms up)

const SHAPES: Array<"clock" | "check" | "star"> = ["clock", "check", "star"];

// ── Shape drawing ────────────────────────────────────────────────────
function buildShapePoints(
  shape: "clock" | "check" | "star",
  cx: number, cy: number,
  sizePx: number, step: number,
): { x: number; y: number }[] {
  const sz = sizePx + 32;
  const ox = sz / 2, oy = sz / 2;
  const r  = sizePx * 0.40;
  const lw = Math.max(7, step * 2.8);

  const off = document.createElement("canvas");
  off.width = sz; off.height = sz;
  const c = off.getContext("2d")!;
  c.strokeStyle = "#fff"; c.fillStyle = "#fff";
  c.lineCap = "round"; c.lineJoin = "round";

  if (shape === "clock") {
    c.lineWidth = lw;
    c.beginPath(); c.arc(ox, oy, r, 0, Math.PI * 2); c.stroke();
    const ha = -Math.PI / 2 - Math.PI / 3;
    c.beginPath(); c.moveTo(ox, oy);
    c.lineTo(ox + Math.cos(ha) * r * 0.52, oy + Math.sin(ha) * r * 0.52); c.stroke();
    c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox, oy - r * 0.76); c.stroke();
    c.beginPath(); c.arc(ox, oy, lw * 0.9, 0, Math.PI * 2); c.fill();
    c.lineWidth = lw * 0.65;
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 - Math.PI / 2;
      c.beginPath();
      c.moveTo(ox + Math.cos(a) * r * 0.82, oy + Math.sin(a) * r * 0.82);
      c.lineTo(ox + Math.cos(a) * r * 0.98, oy + Math.sin(a) * r * 0.98);
      c.stroke();
    }
  } else if (shape === "check") {
    c.lineWidth = lw * 1.35;
    c.beginPath();
    c.moveTo(ox - r * 0.54, oy + r * 0.07);
    c.lineTo(ox - r * 0.08, oy + r * 0.53);
    c.lineTo(ox + r * 0.66, oy - r * 0.46);
    c.stroke();
  } else {
    // Apple-style AI sparkle: large + small companion (lower-right)
    const sparkle = (spx: number, spy: number, sr: number) => {
      c.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI / 4) - Math.PI / 2;
        const rad = i % 2 === 0 ? sr : sr * 0.07;
        const sx  = spx + Math.cos(ang) * rad;
        const sy  = spy + Math.sin(ang) * rad;
        if (i === 0) c.moveTo(sx, sy); else c.lineTo(sx, sy);
      }
      c.closePath(); c.fill();
    };
    sparkle(ox - r * 0.12, oy - r * 0.12, r * 0.76);
    sparkle(ox + r * 0.60, oy + r * 0.52, r * 0.30);
  }

  const data = c.getImageData(0, 0, sz, sz).data;
  const pts: { x: number; y: number }[] = [];
  for (let py = 0; py < sz; py += step)
    for (let px = 0; px < sz; px += step)
      if (data[(py * sz + px) * 4 + 3] > 90)
        pts.push({ x: cx - sz / 2 + px, y: cy - sz / 2 + py });
  return pts;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ParticlesCanvas({ onAssembled }: { onAssembled: () => void }) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const rafRef         = useRef<number>(0);
  const destroyedRef   = useRef(false);
  const assembledFired = useRef(false);
  const { theme }      = useTheme();

  // Spark colour lives in refs so a theme switch only re-tints the particles —
  // it must NEVER restart the D-assembly intro (which it did when `theme` was a
  // dependency of the animation effect). The draw loop lerps cur → target each
  // frame, so the stars beautifully cross-fade to the new colour in place.
  const themeRgb = (t: string): [number, number, number] => (t === "light" ? [88, 86, 214] : [255, 252, 224]);
  const curRgbRef    = useRef<[number, number, number]>(themeRgb(theme));
  const targetRgbRef = useRef<[number, number, number]>(themeRgb(theme));

  useEffect(() => {
    targetRgbRef.current = themeRgb(theme);
  }, [theme]);

  useEffect(() => {
    destroyedRef.current = false;
    let cancelled = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fallback: if the logo fails to load, reveal the page after 5 s so the
    // site never stays hidden because of a missing asset on Netlify.
    const fallbackTimer = setTimeout(() => {
      if (!assembledFired.current) { assembledFired.current = true; onAssembled(); }
    }, 5000);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth, H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width  = W * dpr; canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isMobile  = W < 768 || window.matchMedia("(pointer: coarse)").matches;
    const MAX_P     = isMobile ? 280 : 420;
    const NET_D     = isMobile ? 80 : NET_DIST;
    const FRAME_MS  = isMobile ? 33 : 0;
    let   lastDraw  = 0;

    // Glow sprite — rebuilt only when the (lerped) spark colour actually changes.
    const SP = 36;
    const buildSprite = (rgb: [number, number, number]): HTMLCanvasElement => {
      const s = document.createElement("canvas");
      s.width = SP; s.height = SP;
      const c2 = s.getContext("2d")!;
      const rc = `${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0}`;
      const g = c2.createRadialGradient(SP/2, SP/2, 0, SP/2, SP/2, SP/2);
      g.addColorStop(0,    `rgba(${rc},1)`);
      g.addColorStop(0.38, `rgba(${rc},0.38)`);
      g.addColorStop(1,    `rgba(${rc},0)`);
      c2.fillStyle = g; c2.fillRect(0, 0, SP, SP);
      return s;
    };
    let sprite = buildSprite(curRgbRef.current);
    let SPARK = `rgb(${curRgbRef.current[0] | 0},${curRgbRef.current[1] | 0},${curRgbRef.current[2] | 0})`;
    let lastBuiltKey = "";

    const particles: Particle[] = [];
    let phase: Phase   = "gather";
    let phaseStart     = 0;
    let netAlpha       = 0;
    let morphIdx       = 0;
    let firstNetwork   = true;

    const logoPx = Math.round(Math.min(W, H) * (W < 640 ? 0.54 : 0.28));
    const cx = Math.round(W / 2);
    const cy = Math.round(H / 2);
    const step = Math.max(3, Math.round(logoPx / 96));

    // ── init from D logo ──
    const initParticles = (pts: { x: number; y: number }[]) => {
      if (cancelled || destroyedRef.current) return;
      const sp = shuffled(pts).slice(0, MAX_P);
      for (const p of sp) {
        const ang = Math.random() * Math.PI * 2;
        const d   = Math.max(W, H) * 0.85 + Math.random() * 350;
        particles.push({
          x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d,
          vx: 0, vy: 0, tx: p.x, ty: p.y,
          size: Math.random() * 1.8 + 1.1, twinkle: Math.random() * Math.PI * 2,
          alpha: 1, alive: Math.random() < SURVIVE,
          burstDelay: 0, burstVx: 0, burstVy: 0, burstActivated: false,
        });
      }
      phaseStart = performance.now();
      rafRef.current = requestAnimationFrame((n) => draw(n));
    };

    // ── assign shape targets silently; particles keep their velocity ──
    const assignMorphTargets = () => {
      const morphPx   = Math.round(Math.min(W, H) * (isMobile ? 0.80 : 0.88));
      const morphStep = Math.max(4, Math.round(morphPx / 52));
      const shape = SHAPES[morphIdx % SHAPES.length];
      morphIdx++;
      const pts = shuffled(buildShapePoints(shape, cx, cy, morphPx, morphStep));
      for (let i = 0; i < particles.length; i++) {
        particles[i].tx = i < pts.length ? pts[i].x : particles[i].x;
        particles[i].ty = i < pts.length ? pts[i].y : particles[i].y;
      }
    };

    // ── D logo ──
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/isolated-logo.webp";
    img.onload = () => {
      if (cancelled || destroyedRef.current) return;
      const off = document.createElement("canvas");
      off.width = logoPx; off.height = logoPx;
      const oc = off.getContext("2d")!;
      oc.drawImage(img, 0, 0, logoPx, logoPx);
      const data = oc.getImageData(0, 0, logoPx, logoPx).data;
      const raw: { x: number; y: number }[] = [];
      for (let py = 0; py < logoPx; py += step)
        for (let px = 0; px < logoPx; px += step)
          if (data[(py * logoPx + px) * 4 + 3] > 90)
            raw.push({ x: cx - logoPx / 2 + px, y: cy - logoPx / 2 + py });
      if (raw.length === 0) return;
      // Center by centroid so image padding never offsets the D
      const mx = raw.reduce((s, p) => s + p.x, 0) / raw.length;
      const my = raw.reduce((s, p) => s + p.y, 0) / raw.length;
      const dx = cx - mx, dy = cy - my;
      initParticles(raw.map(p => ({ x: p.x + dx, y: p.y + dy })));
    };

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    // ── Draw lines with distance-based fade (3 alpha buckets, 3 draw calls) ──
    const drawLines = (maxD: number, la: number) => {
      if (la < 0.004) return;
      const md2 = maxD * maxD;
      type Seg = [number, number, number, number];
      const near: Seg[] = [], mid: Seg[] = [], far: Seg[] = [];

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]; if (a.alpha < 0.06) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]; if (b.alpha < 0.06) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < md2) {
            const t = Math.sqrt(d2) / maxD; // 0=close, 1=far
            const seg: Seg = [a.x, a.y, b.x, b.y];
            if (t < 0.36) near.push(seg);
            else if (t < 0.68) mid.push(seg);
            else far.push(seg);
          }
        }
      }

      ctx.strokeStyle = SPARK; ctx.lineWidth = 0.45;
      ctx.globalCompositeOperation = "source-over";
      for (const [segs, alpha] of [[near, la], [mid, la * 0.48], [far, la * 0.15]] as const) {
        if (!segs.length || alpha < 0.004) continue;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (const [ax, ay, bx, by] of segs) { ctx.moveTo(ax, ay); ctx.lineTo(bx, by); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawDots = (now: number, base: number, glow: number, core: number, slow = false) => {
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const a = base * p.alpha; if (a < 0.01) continue;
        const tw = slow
          ? 0.60 + Math.sin(now * 0.0006 + p.twinkle) * 0.12
          : 0.52 + Math.sin(now * 0.005  + p.twinkle) * 0.46;
        const ha = a * tw * glow; if (ha < 0.01) continue;
        const r = p.size * 3.8;
        ctx.globalAlpha = ha;
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = SPARK;
      for (const p of particles) {
        const a = base * p.alpha; if (a < 0.01) continue;
        const tw = slow
          ? 0.62 + Math.sin(now * 0.0006 + p.twinkle) * 0.10
          : 0.62 + Math.sin(now * 0.005  + p.twinkle) * 0.36;
        ctx.globalAlpha = a * tw * core;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (slow ? 0.34 : 0.52), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    // ── Ambient step: friction + noise + optional pull toward target ──
    // pull = 0 → pure free drift; pull > 0 → gentle bias toward tx/ty
    const ambientStep = (p: Particle, noise: number, pull: number) => {
      p.vx *= FRIC; p.vy *= FRIC;
      p.vx += (Math.random() - 0.5) * noise;
      p.vy += (Math.random() - 0.5) * noise;
      // Soft boundary so particles stay loosely inside viewport
      const M = 140;
      if (p.x < -M) p.vx += 0.06; if (p.x > W + M) p.vx -= 0.06;
      if (p.y < -M) p.vy += 0.06; if (p.y > H + M) p.vy -= 0.06;
      // Pull is added directly to position (not velocity) so it never oscillates
      p.x += p.vx + (p.tx - p.x) * pull;
      p.y += p.vy + (p.ty - p.y) * pull;
    };

    // ── Main loop ──
    const draw = (now: number) => {
      // Throttle background phases to ~30 fps on mobile
      if (FRAME_MS > 0) {
        const bg = phase === "network" || phase === "morph" || phase === "hold_shape";
        if (bg && now - lastDraw < FRAME_MS) {
          rafRef.current = requestAnimationFrame((n) => draw(n));
          return;
        }
        if (bg) lastDraw = now;
      }

      // Tween the spark colour toward the active theme (smooth recolour on
      // theme switch — no intro restart). Rebuild the glow sprite only when the
      // rounded colour actually changes, so it's a few rebuilds over ~0.5s.
      {
        const cur = curRgbRef.current, tgt = targetRgbRef.current;
        cur[0] += (tgt[0] - cur[0]) * 0.08;
        cur[1] += (tgt[1] - cur[1]) * 0.08;
        cur[2] += (tgt[2] - cur[2]) * 0.08;
        const key = `${cur[0] | 0},${cur[1] | 0},${cur[2] | 0}`;
        if (key !== lastBuiltKey) {
          lastBuiltKey = key;
          SPARK = `rgb(${key})`;
          sprite = buildSprite(cur);
        }
      }

      ctx.clearRect(0, 0, W, H);
      if (destroyedRef.current) return;

      if (particles.length === 0) {
        rafRef.current = requestAnimationFrame((n) => draw(n));
        return;
      }

      const el = now - phaseStart;

      // 1 ── Gather: D flies in ──────────────────────────────────────
      if (phase === "gather") {
        const t = easeOut(Math.min(1, el / T_GATHER));
        for (const p of particles) {
          p.x += (p.tx - p.x) * (0.035 + t * 0.055);
          p.y += (p.ty - p.y) * (0.035 + t * 0.055);
        }
        drawLines(22, Math.max(0, (el / T_GATHER - 0.7) / 0.3) * 0.22);
        drawDots(now, 1, 0.65, 1);
        if (el >= T_GATHER) {
          phase = "hold"; phaseStart = now;
        }

      // 2 ── Hold: D trembles ────────────────────────────────────────
      } else if (phase === "hold") {
        for (const p of particles) {
          p.x += (p.tx - p.x) * 0.10 + (Math.random() - 0.5) * 0.25;
          p.y += (p.ty - p.y) * 0.10 + (Math.random() - 0.5) * 0.25;
        }
        drawLines(22, 0.22); drawDots(now, 1, 0.65, 1);
        if (el >= T_HOLD) {
          for (const p of particles) {
            const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
            const f = 3 + Math.random() * 7;
            p.burstVx = (dx / d) * f + (Math.random() - 0.5) * 3;
            p.burstVy = (dy / d) * f + (Math.random() - 0.5) * 3 - 0.7;
            p.burstDelay = Math.random() * 700;
            p.burstActivated = false; p.vx = 0; p.vy = 0;
          }
          phase = "burst"; phaseStart = now;
        }

      // 3 ── Burst: D explodes; reveal page when done ────────────────
      } else if (phase === "burst") {
        for (const p of particles) {
          if (el >= p.burstDelay) {
            if (!p.burstActivated) {
              p.vx = p.burstVx; p.vy = p.burstVy; p.burstActivated = true;
            }
            p.x += p.vx; p.y += p.vy; p.vx *= 0.975; p.vy *= 0.975;
          }
        }
        drawDots(now, 1, 0.60, 1);
        
        // Reveal the page partway into the burst so elements float in as the D shatters
        if (el >= 350 && !assembledFired.current) {
          assembledFired.current = true; onAssembled();
        }

        if (el >= T_BURST) {
          phase = "settle"; phaseStart = now;
        }

      // 4 ── Settle: dead fade, survivors slow, network forms ─────────
      } else if (phase === "settle") {
        const t = Math.min(1, el / T_SETTLE);
        netAlpha = easeOut(t) * NET_LINE_A;
        for (const p of particles) {
          if (!p.alive) {
            p.vx += (Math.random() - 0.5) * 0.08; p.vy += (Math.random() - 0.5) * 0.08;
            p.x  += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy *= 0.98;
            p.alpha = Math.max(0, 1 - t * 1.9);
          } else {
            p.vx *= 0.96; p.vy *= 0.96;
            p.vx += (Math.random() - 0.5) * 0.028; p.vy += (Math.random() - 0.5) * 0.028;
            p.x  += p.vx; p.y += p.vy;
            p.alpha = 1 - t * (1 - NET_ALPHA);
          }
        }
        drawLines(NET_D, netAlpha); drawDots(now, 1, 0.55, 0.9);
        if (t >= 1) {
          const survivors = particles.filter(q => q.alive);
          particles.length = 0; particles.push(...survivors);
          for (const p of particles) {
            p.alpha = NET_ALPHA;
            // Give each survivor a velocity from the burst remnant so they
            // immediately feel "in motion" entering the network phase.
            p.vx *= 0.5; p.vy *= 0.5;
            p.tx = p.x; p.ty = p.y;
          }
          phase = "network"; phaseStart = now;
        }

      // 5 ── Network: free cosmic drift ──────────────────────────────
      } else if (phase === "network") {
        for (const p of particles) ambientStep(p, NET_NOISE, 0);

        const fi = firstNetwork ? Math.min(1, el / 2000) : 1;
        if (firstNetwork && el >= 2000) firstNetwork = false;
        drawLines(NET_D, NET_LINE_A);
        drawDots(now, 1, 0.55 - fi * 0.17, 0.90 - fi * 0.20, fi > 0.5);

        if (el >= T_NETWORK) {
          assignMorphTargets();      // targets set silently — no visual change yet
          phase = "morph"; phaseStart = now;
        }

      // 6 ── Morph: particles drift toward shape by accident ─────────
      // Pull is tiny and grows slowly — shape emerges like a coincidence.
      } else if (phase === "morph") {
        const t     = Math.min(1, el / T_MORPH);
        const pull  = t * 0.009;                                 // 0 → 0.009
        const noise = MORPH_NOISE_0 + t * (MORPH_NOISE_1 - MORPH_NOISE_0); // 0.034 → 0.014
        for (const p of particles) ambientStep(p, noise, pull);
        drawLines(NET_D, NET_LINE_A); drawDots(now, 1, 0.38, 0.70, true);
        if (t >= 1) { phase = "hold_shape"; phaseStart = now; }

      // 7 ── Hold shape: shape breathes; then particles scatter away ─
      } else if (phase === "hold_shape") {
        for (const p of particles) ambientStep(p, 0.011, 0.012);
        drawLines(NET_D, NET_LINE_A); drawDots(now, 1, 0.40, 0.72, true);

        if (el >= T_SHAPE_HOLD) {
          // Release: each particle gets a meaningful velocity so it visibly
          // travels 200-350 px before FRIC decays it.
          // total_distance ≈ speed / (1 - FRIC) = speed / 0.007
          // speed 1.5 → ~214 px, speed 2.5 → ~357 px
          for (const p of particles) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 1.4 + Math.random() * 1.2;
            p.vx = Math.cos(ang) * spd;
            p.vy = Math.sin(ang) * spd;
            // Reset targets so morph pull can't linger during free drift
            p.tx = p.x; p.ty = p.y;
          }
          phase = "network"; phaseStart = now;
        }
      }

      rafRef.current = requestAnimationFrame((n) => draw(n));
    };

    window.addEventListener("resize", resize);
    return () => {
      cancelled = true;
      destroyedRef.current = true;
      clearTimeout(fallbackTimer);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
    // Runs ONCE — theme changes only retint via targetRgbRef, never restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAssembled]);

  return <canvas ref={canvasRef} id="particles-canvas" aria-hidden />;
}
