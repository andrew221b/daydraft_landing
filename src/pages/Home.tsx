import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, useAnimationFrame } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import React from "react";
import { useReveal } from "../contexts/reveal";
import { useTheme } from "../contexts/theme";
import DeviceShowcase, { type SceneSpec } from "../components/phone/DeviceShowcase";
import LogoMark from "../components/Logo";
import {
  TimelineScene, TrackerScene, ReportsScene,
  ComposerScene, FocusScene, BillingScene, type TLTask, type SceneProps,
} from "../components/phone/phoneScenes";

/* Problem-section task set — the SAME tasks the chaos board shows, but sorted
   into a real schedule, so "the same tasks, in an order that works" is literal. */
const PROBLEM_DUMP = [
  "Update client proposal", "Fix the API bug", "Design review at 2pm?",
  "Call the dentist", "Ship v2.1 before EOD", "Report last week's hours",
];
const PROBLEM_TASKS: TLTask[] = [
  { time: "09:00", title: "Update client proposal", dur: "1h", bar: "hsl(var(--dd-primary))", done: true },
  { time: "10:30", title: "Fix the API bug", dur: "1h", bar: "hsl(var(--dd-indigo))", done: false },
  { time: "13:00", title: "Design review", dur: "30m", bar: "hsl(var(--dd-accent))", done: false },
  { time: "15:30", title: "Ship v2.1", dur: "1h", bar: "hsl(38 92% 52%)", done: false },
];
const ProblemComposer = (p: SceneProps) => <ComposerScene {...p} lines={PROBLEM_DUMP} />;
const ProblemTimeline = (p: SceneProps) => <TimelineScene {...p} tasks={PROBLEM_TASKS} totalLabel="3h 30m" />;

/* ── 3D tilt card ── */
const isTouchDevice =
  typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

function TiltCard({ children, className = "", intensity = 12 }: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 200, damping: 20 });
  const my = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(my, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  if (isTouchDevice) return <div className={className}>{children}</div>;

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}

const rise = (revealed: boolean, delay = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: revealed ? { opacity: 1, y: 0 } : {},
  viewport: { once: true, margin: "-40px" },
  transition: { type: "spring" as const, stiffness: 70, damping: 22, delay },
});

const heroReveal = (revealed: boolean, delay = 0, yDist = 30) => ({
  initial: { opacity: 0, y: yDist },
  animate: revealed ? { opacity: 1, y: 0 } : {},
  transition: { type: "spring" as const, stiffness: 70, damping: 22, delay },
});

/* ── Unified card surface ──────────────────────────────────────────────
   Every card shares ONE base colour so the page reads as a single calm
   surface. Identity comes only from a faint glow halo. ── */
const cardStyle = (accent: string) => ({
  boxShadow: `var(--glass-strong-shadow), 0 0 50px -18px ${accent}60`,
});

/* Brand palette only — blue → indigo → violet. */
const BLUE = "#0a84ff";
const INDIGO = "#5e5ce6";
const VIOLET = "#8e7bff";

/* ── Consistent eyebrow chip ── */
function Eyebrow({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
      style={{ background: color + "1c", border: `1px solid ${color}40` }}
    >
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-[10.5px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

/* ── Store badges — official black badge look ── */
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
    <path fill="#4DD4E3" d="M2 2.4L2 21.6L12.5 12Z" />
    <path fill="#FDCC07" d="M2 2.4L12.5 12L19.5 8.2L7.2 0.5Z" />
    <path fill="#F4463A" d="M2 21.6L12.5 12L19.5 15.8L7.2 23.5Z" />
    <path fill="#43B06A" d="M19.5 8.2L12.5 12L19.5 15.8L22 14.4C23.4 13.5 23.4 10.5 22 9.6Z" />
  </svg>
);

function StoreBadge({ platform }: { platform: "apple" | "android" }) {
  return (
    <div
      className="pressable inline-flex items-center gap-3 rounded-[14px] py-[10px] pl-[14px] pr-5 cursor-default select-none"
      style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.14)" }}
      aria-disabled
      title="Coming soon"
    >
      {platform === "apple" ? <AppleIcon /> : <PlayIcon />}
      <div>
        <p className="text-[10px] text-white/55 tracking-[0.055em] leading-none mb-0.5">
          {platform === "apple" ? "Download on the" : "Get it on"}
        </p>
        <p className="text-[15px] font-semibold text-white leading-tight tracking-[-0.01em]">
          {platform === "apple" ? "App Store" : "Google Play"}
        </p>
      </div>
    </div>
  );
}

function StoreButtons({ center = false }: { center?: boolean }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${center ? "items-center justify-center" : ""}`}>
      <StoreBadge platform="apple" />
      <StoreBadge platform="android" />
    </div>
  );
}

/* ── Chaos sticky-note illustration ── */
// The mess: the same work tasks the phone will sort, tangled up with the real
// pains DayDraft kills — untracked hours and "how do I bill this?".
const CHAOS_NOTES = [
  { t: "Update client proposal", x: "3%", y: "6%", r: "-9deg", c: "#FF453A", w: 138 },
  { t: "Fix the API bug 🔴", x: "34%", y: "2%", r: "5deg", c: "#FF9F0A", w: 116 },
  { t: "Call the dentist", x: "63%", y: "11%", r: "-5deg", c: "#0A84FF", w: 116 },
  { t: "How long did that take?", x: "13%", y: "38%", r: "8deg", c: "#FF9F0A", w: 176 },
  { t: "Report for client… how?", x: "53%", y: "34%", r: "-3deg", c: "#FF453A", w: 150 },
  { t: "Ship v2.1 before EOD!!", x: "2%", y: "66%", r: "6deg", c: "#BF5AF2", w: 152 },
  { t: "Design review — 2pm?", x: "37%", y: "62%", r: "-7deg", c: "#5E5CE6", w: 156 },
  { t: "Untracked: 3h?? ⚠️", x: "67%", y: "58%", r: "3deg", c: "#FF453A", w: 140 },
  { t: "Make an appointment at 3pm!", x: "59%", y: "80%", r: "12deg", c: "#48484A", w: 56 },
];

type ChaosNoteData = { t: string; x: string; y: string; r: string; c: string; w: number };
type Burst = { x: number; y: number; sig: number }; // click point in board-normalised coords
type Size = { w: number; h: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Fade a velocity component to 0 over the last `zone` px before a wall, so the
 *  note glides to a stop at the edge instead of snapping/bouncing off it — and,
 *  since the board clips overflow, it also guarantees the note never visibly
 *  cuts off mid-text. Only damps the component pushing further toward the wall. */
const dampNearEdge = (v: number, pos: number, lo: number, hi: number, zone: number) => {
  if (v < 0) { const d = pos - lo; if (d < zone) return v * clamp(d / zone, 0, 1); }
  else if (v > 0) { const d = hi - pos; if (d < zone) return v * clamp(d / zone, 0, 1); }
  return v;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
/** Subtle "landed and settled" overshoot — much gentler than the textbook
 *  1.70158 constant, which would look like a cartoon boing here. */
const easeOutBack = (t: number, overshoot = 1.0) => {
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
};

/** One sticky note. Falls in from above on a single choreographed ease (staggered
 *  → the pile builds up one note after another), then drifts forever along a smooth,
 *  continuous Lissajous-style wander path bounded by a soft rubber-band edge — no
 *  per-frame randomness, so the float reads as fluid rather than jittery.
 *  Clicking the note makes it dodge. Clicking the board makes an explosion. */
function ChaosNote({
  n, i, inView, burst, sizeRef,
}: { n: ChaosNoteData; i: number; inView: boolean; burst: Burst; sizeRef: React.RefObject<Size> }) {
  const baseR = parseFloat(n.r);
  const front = i > 5;
  const dir = i % 2 ? 1 : -1;
  const elRef = React.useRef<HTMLDivElement>(null);

  // Motion values for direct, smooth DOM updates
  const x = useMotionValue(0);
  const y = useMotionValue(-300 - i * 50); // Start far above the board for drop-in
  const rotate = useMotionValue(baseR + dir * 30);
  const scale = useMotionValue(0.82);
  const opacity = useMotionValue(0);

  // Impulse state — only nonzero right after a hover/click/burst, decays to 0
  const vx = React.useRef(0);
  const vy = React.useRef(0);
  const vr = React.useRef(0);
  const smoothedSpeed = React.useRef(0);

  // Per-note ambient wander signature (fixed once, never re-randomised per
  // frame) — two summed sine waves per axis give a continuous, organic
  // Lissajous-style drift with no jitter.
  const seedRef = React.useRef<{
    fx1: number; fx2: number; px1: number; px2: number;
    fy1: number; fy2: number; py1: number; py2: number;
    fr: number; pr: number;
  } | null>(null);
  if (!seedRef.current) {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    seedRef.current = {
      fx1: rnd(0.32, 0.5), fx2: rnd(0.7, 1.05), px1: rnd(0, Math.PI * 2), px2: rnd(0, Math.PI * 2),
      fy1: rnd(0.28, 0.46), fy2: rnd(0.62, 0.95), py1: rnd(0, Math.PI * 2), py2: rnd(0, Math.PI * 2),
      fr: rnd(0.22, 0.4), pr: rnd(0, Math.PI * 2),
    };
  }

  const dropRef = React.useRef({ started: false, done: false, t0: 0 });

  // Rotation deviation from baseR allowed right now. A rotated rectangle's
  // screen-space bbox is bigger than its unrotated one (roughly half its
  // width times sin(angle) of extra reach toward top/bottom) — fine when a
  // note has room to spare, but if it's already hugging a wall (deliberate:
  // several notes are anchored right at the board's edges) that overhang
  // would poke past the board's clipped edge. So the cap shrinks only when
  // the note is actually close to top/bottom, instead of permanently eating
  // into every note's wander room (which froze edge-anchored notes solid).
  const ROT_MAX_DEV = 22;
  const maxRotDev = (curY: number, minY: number, maxY: number) => {
    const room = Math.max(0, Math.min(curY - minY, maxY - curY));
    const angle = Math.asin(clamp(room / (n.w / 2), 0, 1)) * (180 / Math.PI);
    return clamp(angle, 5, ROT_MAX_DEV);
  };

  const getBounds = React.useCallback(() => {
    let { w, h } = sizeRef.current;
    if (w < 100) w = 520;
    if (h < 100) h = 400;
    const cx = (parseFloat(n.x) / 100) * w;
    const cy = (parseFloat(n.y) / 100) * h;
    const computedMinX = -cx + 10;
    const computedMaxX = w - cx - n.w - 10;
    const computedMinY = -cy + 10;
    const computedMaxY = h - cy - 44 - 10;
    return {
      minX: Math.min(computedMinX, computedMaxX),
      maxX: Math.max(computedMinX, computedMaxX),
      minY: Math.min(computedMinY, computedMaxY),
      maxY: Math.max(computedMinY, computedMaxY),
    };
  }, [n.w, n.x, n.y, sizeRef]);

  // Where the note "wants" to be right now — a smooth, deterministic point on
  // its own continuous drift path. Oscillates AROUND the note's own laid-out
  // slot (offset 0), not the midpoint of its available room — the midpoint is
  // always biased toward the board's centre (tighter room on the edge side,
  // looser on the centre side), which was quietly dragging every note into a
  // single pile in the middle. Nothing here is randomised per frame.
  const wanderAt = React.useCallback((timeSec: number) => {
    const { minX, maxX, minY, maxY } = getBounds();
    const s = seedRef.current!;
    const ax = Math.max(8, Math.min(-minX, maxX)) * 0.7;
    const ay = Math.max(8, Math.min(-minY, maxY)) * 0.7;
    return {
      tx: Math.sin(timeSec * s.fx1 + s.px1) * ax * 0.72 + Math.sin(timeSec * s.fx2 + s.px2) * ax * 0.28,
      ty: Math.sin(timeSec * s.fy1 + s.py1) * ay * 0.72 + Math.sin(timeSec * s.fy2 + s.py2) * ay * 0.28,
      tr: baseR + Math.sin(timeSec * s.fr + s.pr) * 9,
    };
  }, [baseR, getBounds]);

  // Schedule the drop — staggered so the pile builds up one note at a time.
  React.useEffect(() => {
    if (!inView) return;
    const tmr = setTimeout(() => {
      dropRef.current.started = true;
      dropRef.current.t0 = performance.now();
    }, 100 + i * 140);
    return () => clearTimeout(tmr);
  }, [inView, i]);

  // Main loop (60fps continuous): a single choreographed fall, then a
  // permanent smooth wander with elastic edges and physical impulses on top.
  useAnimationFrame((now, delta) => {
    if (!inView || !dropRef.current.started) return;
    const dt = clamp(delta / 16.66, 0.1, 3.0);
    const timeSec = now / 1000;

    if (!dropRef.current.done) {
      const DROP_MS = 700 + i * 18;
      const t = clamp((now - dropRef.current.t0) / DROP_MS, 0, 1);
      const posEase = easeOutBack(t, 0.9);
      const fade = easeOutCubic(t);
      const w = wanderAt(timeSec);
      const startX = dir * 24;
      const startY = -300 - i * 50;
      const startR = baseR + dir * 34;
      x.set(startX + (w.tx - startX) * posEase);
      y.set(startY + (w.ty - startY) * posEase);
      rotate.set(startR + (w.tr - startR) * posEase);
      opacity.set(clamp(fade * 1.5, 0, 1));
      scale.set(0.82 + 0.18 * fade);
      if (t >= 1) {
        dropRef.current.done = true;
        vx.current = 0; vy.current = 0; vr.current = 0;
      }
      return;
    }

    // Impulses (hover/click/burst) decay smoothly via friction...
    const IMPULSE_FRICTION = 0.90;
    vx.current *= Math.pow(IMPULSE_FRICTION, dt);
    vy.current *= Math.pow(IMPULSE_FRICTION, dt);
    vr.current *= Math.pow(IMPULSE_FRICTION, dt);

    // ...while a gentle spring continuously follows the smooth wander target.
    const w = wanderAt(timeSec);
    const curX = x.get(), curY = y.get(), curR = rotate.get();
    const pullVX = (w.tx - curX) * 0.045;
    const pullVY = (w.ty - curY) * 0.045;
    const pullVR = (w.tr - curR) * 0.06;

    // Fade out the velocity component heading toward a wall before it arrives —
    // glides to a stop at the edge with no snap, and never crosses it (the board
    // clips overflow, so crossing would cut a note's text off mid-frame).
    const { minX, maxX, minY, maxY } = getBounds();
    const EDGE_ZONE = 34;
    const totalVX = dampNearEdge(vx.current + pullVX, curX, minX, maxX, EDGE_ZONE);
    const totalVY = dampNearEdge(vy.current + pullVY, curY, minY, maxY, EDGE_ZONE);

    const newX = clamp(curX + totalVX * dt, minX, maxX);
    const newY = clamp(curY + totalVY * dt, minY, maxY);
    const rotDev = maxRotDev(curY, minY, maxY);
    const newR = clamp(curR + (vr.current + pullVR) * dt, baseR - rotDev, baseR + rotDev);

    x.set(newX); y.set(newY); rotate.set(newR);

    // Scale only puffs up from active impulse energy (not ambient drift),
    // and through a low-pass filter so it eases instead of flickering.
    const speed = Math.hypot(vx.current, vy.current);
    smoothedSpeed.current += (speed - smoothedSpeed.current) * clamp(0.12 * dt, 0, 1);
    const targetScale = 1 + clamp(smoothedSpeed.current * 0.0035, 0, 0.09);
    scale.set(scale.get() + (targetScale - scale.get()) * clamp(0.12 * dt, 0, 1));
  });

  // Gentle dodge on mouse hover (no dodge on touch)
  const hoverDodge = React.useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const noteCX = rect.left + rect.width / 2;
    const noteCY = rect.top + rect.height / 2;
    let vecX = noteCX - e.clientX;
    let vecY = noteCY - e.clientY;
    const dist = Math.hypot(vecX, vecY) || 1;
    vecX /= dist; vecY /= dist;

    // Subtle nudge away so they can still be "caught"
    const power = 10 + Math.random() * 8;
    vx.current += vecX * power;
    vy.current += vecY * power;
    vr.current += (Math.random() - 0.5) * 15;
  }, []);

  // Strong dodge on click (adds to the explosion)
  const clickDodge = React.useCallback((e: React.PointerEvent) => {
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const noteCX = rect.left + rect.width / 2;
    const noteCY = rect.top + rect.height / 2;
    let vecX = noteCX - e.clientX;
    let vecY = noteCY - e.clientY;
    const dist = Math.hypot(vecX, vecY) || 1;
    vecX /= dist; vecY /= dist;
    
    // Snappy bounce away
    const power = 20 + Math.random() * 15;
    vx.current += vecX * power;
    vy.current += vecY * power;
    vr.current += (Math.random() - 0.5) * 30;
  }, []);

  // Shockwave (burst)
  React.useEffect(() => {
    if (!burst.sig) return;
    const { w, h } = sizeRef.current;
    const cx = (parseFloat(n.x) / 100) * w + n.w / 2;
    const cy = (parseFloat(n.y) / 100) * h + 22;
    let vecX = cx - burst.x * w;
    let vecY = cy - burst.y * h;
    const dist = Math.hypot(vecX, vecY) || 1;
    vecX /= dist; vecY /= dist;

    const reach = Math.hypot(w, h) * 0.6;
    // Majestic, cinematic explosion: strong but readable
    const power = (15 + 20 * clamp(1 - dist / reach, 0, 1)) * (0.8 + Math.random() * 0.5);

    vx.current += vecX * power;
    vy.current += vecY * power;
    vr.current += (Math.random() - 0.5) * 45;

    // Nudge the wander phase so the note settles into a fresh path afterwards,
    // instead of drifting straight back to where it just got knocked from.
    const s = seedRef.current!;
    s.px1 += (Math.random() - 0.5) * 2.2;
    s.py1 += (Math.random() - 0.5) * 2.2;
  }, [burst.sig, n, sizeRef]);

  return (
    <motion.div
      ref={elRef}
      className="absolute will-change-transform cursor-pointer"
      style={{ left: n.x, top: n.y, width: n.w, zIndex: front ? 2 : 1, x, y, rotate, scale, opacity }}
      onPointerEnter={hoverDodge}
      onPointerDown={clickDodge}
    >
      <div
        className="rounded-[10px] px-2.5 py-2 backdrop-blur-sm"
        style={{
          background: `linear-gradient(160deg, ${n.c}24, ${n.c}12)`,
          border: `1px solid ${n.c}45`,
          boxShadow: `0 6px 18px -6px ${n.c}3a, inset 0 1px 0 ${n.c}22`,
        }}
      >
        <div className="h-1 w-5 rounded-full mb-1.5 opacity-60" style={{ background: n.c }} />
        <p
          className="text-[11px] font-medium leading-tight"
          style={{ color: n.c === "#48484A" ? "var(--ink-faint)" : "var(--ink)" }}
        >
          {n.t}
        </p>
      </div>
    </motion.div>
  );
}

function ChaosBoard({ className = "h-72 sm:h-80" }: { className?: string }) {
  const boardRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(boardRef, { once: true, amount: 0.35 });
  const sizeRef = React.useRef<Size>({ w: 520, h: 400 });
  const [burst, setBurst] = React.useState<Burst>({ x: 0.5, y: 0.5, sig: 0 });

  // Measure the board so the impulse directions are accurate at any size.
  React.useEffect(() => {
    const measure = () => {
      const el = boardRef.current;
      if (el) { const r = el.getBoundingClientRect(); sizeRef.current = { w: r.width, h: r.height }; }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const poke = (e: React.PointerEvent) => {
    const el = boardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setBurst({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, sig: Date.now() });
  };

  return (
    <div
      ref={boardRef}
      className={`relative w-full overflow-hidden cursor-pointer ${className}`}
      onPointerDown={poke}
    >
      {/* Ambient depth glows — slow drift gives the board a living, hazy backdrop */}
      <motion.div
        className="pointer-events-none absolute -top-10 left-[12%] h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(94,92,230,0.5), transparent 70%)" }}
        animate={{ x: [0, 26, -10, 0], y: [0, 16, -8, 0], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[6%] right-[10%] h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,69,58,0.4), transparent 70%)" }}
        animate={{ x: [0, -22, 12, 0], y: [0, -14, 8, 0], opacity: [0.16, 0.26, 0.16] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {CHAOS_NOTES.map((n, i) => (
        <ChaosNote key={i} n={n} i={i} inView={inView} burst={burst} sizeRef={sizeRef} />
      ))}
      <div
        className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
        style={{ background: `linear-gradient(to top, var(--glass-strong-bg), transparent)` }}
      />
    </div>
  );
}

/* ── Feature row: alternating phone + copy with scroll parallax ── */
function FeatureRow({
  revealed, flip = false, title, subtitle, body, scenes, bullets, accent, delay = 0,
}: {
  revealed: boolean;
  flip?: boolean;
  title: string;
  subtitle: string;
  body: string;
  scenes: SceneSpec[];
  bullets: string[];
  accent: string;
  delay?: number;
}) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax float effect for the phone
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const phone = (
    <motion.div style={{ y: isTouchDevice ? 0 : phoneY }} className="relative z-20 flex justify-center lg:justify-center">
      <DeviceShowcase scenes={scenes} glow={accent} intensity={10} />
    </motion.div>
  );

  const copy = (
    <div className="glass-strong rounded-3xl p-7 sm:p-9 relative overflow-hidden z-10" style={cardStyle(accent)}>
      <div className="pl-3">
        <Eyebrow label={subtitle} color={accent} />
        <h3 className="font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold tracking-[-0.03em] text-[var(--ink)] mb-4">
          {title}
        </h3>
        <p className="text-[15.5px] leading-relaxed text-[var(--ink-dim)] mb-6">{body}</p>
        <ul className="space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[14.5px] text-[var(--ink-dim)]">
              <span
                className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[8px] font-bold"
                style={{ background: accent + "28", color: accent }}
              >
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <motion.div ref={ref} {...rise(revealed, delay)} className="mb-20 sm:mb-32 relative">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className={`order-1 ${flip ? 'lg:order-1' : 'lg:order-2'}`}>
          {copy}
        </div>
        <div className={`order-2 ${flip ? 'lg:order-2' : 'lg:order-1'}`}>
          {phone}
        </div>
      </div>
    </motion.div>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimatedAppMockup from "../components/AnimatedAppMockup";

export default function Home() {
  const revealed = useReveal();
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Small delay ensures layout is complete after page transition
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="relative z-10 flex w-full flex-col">

      {/* ═══════════ HERO ═══════════ */}
      <section id="download" className="px-4 pt-24 pb-8 sm:pb-12">
        <div className="mx-auto flex flex-col w-full max-w-6xl items-center gap-10 lg:grid lg:grid-cols-2 lg:gap-16">

          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              {...heroReveal(revealed, 0.10, 14)}
              className="chip mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-dim)]"
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--blue)" }} />
              Plan · Track · Report
            </motion.div>

            <motion.h1
              {...heroReveal(revealed, 0.20, 22)}
              className="mt-5 font-display text-[clamp(2.6rem,5.5vw,4.4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[var(--ink)]"
            >
              Draft a day that really works.<br />
              <span className="text-gradient">Plan less, earn more.</span>
            </motion.h1>

            <motion.p
              {...heroReveal(revealed, 0.30, 16)}
              className="mx-auto lg:mx-0 mt-5 max-w-md text-[16.5px] leading-relaxed text-[var(--ink-dim)]"
            >
              DayDraft transforms your task list into a schedule that fits your day, tracks every billable minute, shows your earnings in real time, and generates client-ready reports.
            </motion.p>

            <motion.div
              {...heroReveal(revealed, 0.40, 14)}
              className="mt-7 flex flex-col items-center gap-3.5 lg:items-start"
            >
              <StoreButtons />
              <div className="flex items-center gap-2 text-[13px] text-[var(--ink-faint)]">
                <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--emerald)" }} />
                Web app — coming soon.
              </div>
            </motion.div>
          </div>

          {/* Hero Mockup */}
          <motion.div
            animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
            initial={{ opacity: 0, y: isTouchDevice ? 28 : 40, scale: isTouchDevice ? 1 : 0.96 }}
            transition={{ type: "spring", stiffness: 82, damping: 14, delay: 0.42 }}
            className="relative flex justify-center w-full"
          >
            <AnimatedAppMockup />
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRUST STRIP ═══════════ */}
      <section className="px-4 py-6">
        <motion.div {...heroReveal(revealed, 0.45, 30)} className="mx-auto w-full max-w-6xl">
          <div className="glass-strong rounded-3xl px-6 py-8 sm:px-12" style={{ boxShadow: `var(--glass-strong-shadow), 0 0 40px -10px ${BLUE}40` }}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 text-center">
              {[
                { v: "Plan", l: "Turn a messy list into a schedule that fits your day." },
                { v: "Track", l: "Keep every minute accounted for, even when the app is closed." },
                { v: "Report", l: "Generate client-ready PDFs with a single tap." },
              ].map((s, i) => (
                <div key={s.l} className="relative">
                  {i > 0 && (
                    <span className="absolute -left-2 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-white/10 sm:block" />
                  )}
                  <p className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold tracking-tight text-cream drop-shadow-sm">{s.v}</p>
                  <p className="mt-1.5 text-[14px] font-medium text-[var(--ink-dim)] max-w-[220px] mx-auto">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ PROBLEM → SOLUTION ═══════════ */}
      <section className="px-4 pt-14 pb-10 sm:pt-20">
        <div className="mx-auto max-w-6xl">

          <motion.div {...rise(revealed)} className="mb-12 text-center">
            <Eyebrow label="Sound familiar?" color={BLUE} />
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-[var(--ink)]">
              Your day starts with a list.<br className="hidden sm:block" />
              Then the day happens.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-8">

            {/* BEFORE — the chaos board */}
            <motion.div {...rise(revealed, 0.05)} className="glass-strong flex flex-col rounded-[2.5rem] overflow-hidden" style={cardStyle("#FF453A")}>
              <div className="p-6 sm:p-8 pb-2 text-center lg:text-left z-10 relative">
                <Eyebrow label="Before DayDraft" color="#FF453A" />
                <h3 className="font-display text-[clamp(1.45rem,2.7vw,1.95rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[var(--ink)] mt-4">
                  Every day starts as a pile.
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-dim)]">
                  Tasks with no order, hours you never logged, a report you keep putting off.
                </p>
              </div>
              <div className="relative flex-1 flex flex-col w-full min-h-[300px] sm:min-h-[330px]">
                <ChaosBoard className="absolute inset-0 w-full h-full" />
                <div className="mt-auto mb-5 w-full relative z-10 pointer-events-none">
                  <p className="text-center text-[12px] font-medium text-[var(--ink-faint)]">
                    Go ahead, try to catch one. That's what working without DayDraft feels like.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* AFTER — the sorted plan */}
            <motion.div {...rise(revealed, 0.12)} className="glass-strong flex flex-col rounded-[2.5rem] overflow-hidden" style={cardStyle(BLUE)}>
              <div className="p-6 sm:p-8 pb-2 text-center lg:text-left z-10 relative">
                <Eyebrow label="DayDraft sorts it in seconds" color={BLUE} />
                <h3 className="font-display text-[clamp(1.45rem,2.7vw,1.95rem)] font-bold tracking-[-0.025em] leading-[1.12] text-[var(--ink)] mt-4">
                  Your day, planned in seconds.
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-dim)]">
                  One timeline that fits the hours you have — ready to start, track and bill.
                </p>
              </div>
              <div className="relative flex-1 flex items-center justify-center w-full px-4 pb-6 pointer-events-none">
                <DeviceShowcase
                  scale={0.72}
                  glow={BLUE}
                  intensity={9}
                  dots
                  scenes={[
                    { key: "composer", Comp: ProblemComposer, duration: 4400 },
                    { key: "timeline", Comp: ProblemTimeline, duration: 4800 },
                  ]}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURE SHOWCASE ═══════════ */}
      <section id="features" className="px-4 pt-14 pb-6 sm:pt-20">
        <div className="mx-auto max-w-6xl">

          <motion.div {...rise(revealed)} className="mb-14 text-center">
            <Eyebrow label="One app, the whole loop" color={BLUE} />
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-[var(--ink)]">
              Own your time. Earn its full value.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--ink-dim)]">
              Built for freelancers, creators, and founders who run their own schedule. Plan realistically, track effortlessly, and make sure every billable minute counts.
            </p>
          </motion.div>

          <FeatureRow
            revealed={revealed}
            title="It drafts the plan. You get things done."
            subtitle="Smart planning"
            body="Dump every task and idea that's on your mind. DayDraft weighs each task against the way you tend to work and lays out a day you can keep. No overbooked calendars. No impossible expectations. Just a plan you can actually follow."
            scenes={[
              { key: "composer", Comp: ComposerScene, duration: 4200 },
              { key: "timeline", Comp: TimelineScene, duration: 4200 },
              { key: "focus", Comp: FocusScene, duration: 4600 },
            ]}
            bullets={[
              "Turns a brain-dump into a plan in seconds",
              "Learns how long your work really takes",
              "Keeps busywork from taking over your day",
            ]}
            accent={BLUE}
          />

          <FeatureRow
            revealed={revealed}
            flip
            title="Track the work. Get paid for it fully."
            subtitle="Live time tracking"
            body="Stop guessing how long tasks actually take. One tap starts tracking, and it keeps running through interruptions, lock screens, and app restarts. Set your rate and watch your earnings update live as you work."
            scenes={[
              { key: "tracker", Comp: TrackerScene, duration: 6000, island: true },
            ]}
            bullets={[
              "Closing the app won't lose your minutes",
              "Set your rate; earnings total as you work",
              "Live on the Lock Screen and Dynamic Island",
            ]}
            accent={INDIGO}
            delay={0.05}
          />

          <FeatureRow
            revealed={revealed}
            title="Hours in. Report out."
            subtitle="Get paid faster"
            body="All your tracked hours, organized in one place. When the job is complete, generate a polished PDF with rates, totals, and payment details already included—no more rebuilding reports from screenshots at month-end."
            scenes={[
              { key: "reports", Comp: ReportsScene, duration: 4800 },
              { key: "billing", Comp: BillingScene, duration: 5200 },
            ]}
            bullets={[
              "See exactly where your hours went",
              "One tap turns them into a polished PDF",
              "Rates, totals and payment details included",
            ]}
            accent={VIOLET}
            delay={0.10}
          />

        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how" className="px-4 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl">

          <motion.div {...rise(revealed)} className="mb-12 text-center">
            <Eyebrow label="How it works" color={INDIGO} />
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-[var(--ink)]">
              Plan it. Track it. Bill it.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {[
              { n: "01", t: "Dump & Draft", d: "Empty your head into the app. DayDraft turns the pile into a timeline that fits the day in front of you.", hex: BLUE },
              { n: "02", t: "Start & Work", d: "Hit the timer and get to work. The earnings total as you go, and closing the app or locking the phone won't lose a minute.", hex: INDIGO },
              { n: "03", t: "Bill & Log off", d: "When it's complete, turn the logged hours into a finished report. Send it. Get paid. Repeat.", hex: VIOLET },
            ].map((s, i) => (
              <motion.div key={s.n} {...rise(revealed, i * 0.08)} style={{ perspective: 1000 }}>
                <TiltCard className="h-full" intensity={6}>
                  <div className="glass-strong h-full rounded-3xl p-7 relative overflow-hidden" style={cardStyle(s.hex)}>
                    <span
                      key={theme}
                      className="pointer-events-none absolute right-4 top-3 font-display font-bold select-none tabular-nums"
                      style={{
                        fontSize: "5rem",
                        background: theme === "light"
                          ? `linear-gradient(180deg, ${s.hex}3d 0%, ${s.hex}12 100%)`
                          : `linear-gradient(180deg, ${s.hex}55 0%, ${s.hex}12 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        lineHeight: 1,
                      }}
                    >
                      {s.n}
                    </span>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div className="mb-3">
                        <Eyebrow label={`Step ${s.n}`} color={s.hex} />
                      </div>
                      <h3 className="mb-2 font-display text-[18px] font-semibold text-[var(--ink)]">{s.t}</h3>
                      <p className="text-[14px] leading-relaxed text-[var(--ink-dim)]">{s.d}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-4 pt-6 pb-20 sm:pb-24">
        <motion.div {...rise(revealed)} className="mx-auto max-w-5xl" style={{ perspective: 1400 }}>
          <TiltCard intensity={3}>
            <div
              className="glass-strong glass-sheen relative rounded-[2.2rem] px-8 py-14 text-center sm:px-16 sm:py-20"
              style={cardStyle(INDIGO)}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[2.2rem]"
                style={{ background: "radial-gradient(120% 130% at 50% -10%, rgba(10,132,255,0.16), transparent 55%), radial-gradient(120% 130% at 50% 120%, rgba(142,123,255,0.12), transparent 55%)" }}
              />
              <div className="relative" style={{ transform: "translateZ(36px)", zIndex: 1 }}>
                <LogoMark size={56} className="mx-auto mb-6" />
                <Eyebrow label="Get started free" color={INDIGO} />
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-[-0.03em] text-[var(--ink)] mt-1">
                  Stop winging it. Start working with a plan.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[var(--ink-dim)]">
                  Plan the day, keep an honest record of your hours, and bill them without the busywork. Get full Pro access free for 3 days.
                </p>
                <div className="mt-8 flex justify-center">
                  <StoreButtons center />
                </div>
                <p className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ink-faint)]">
                  <Lock className="h-3.5 w-3.5" /> No tracking. No ads. Your data stays yours.
                </p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

    </div>
  );
}
