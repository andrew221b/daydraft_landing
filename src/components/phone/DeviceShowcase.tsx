import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";
import PhoneFrame from "./PhoneFrame";
import { W, H, C, prefersReduced, type SceneProps } from "./phoneScenes";

export type SceneSpec = {
  key: string;
  Comp: React.ComponentType<SceneProps>;
  duration: number;
  /** Show an expanded Live Activity in the Dynamic Island while this scene is up. */
  island?: boolean;
};

/**
 * A framed iPhone that auto-slides through a sequence of code-built app screens.
 * Pauses when off-screen; honours reduced-motion. Used for the hero (all four
 * tabs) and every feature block (its own 2–3 relevant screens).
 */
export default function DeviceShowcase({
  scenes,
  glow = "var(--blue)",
  intensity = 9,
  scale = 1,
  dots = true,
  className = "",
}: {
  scenes: SceneSpec[];
  glow?: string;
  intensity?: number;
  scale?: number;
  dots?: boolean;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduced = useRef(prefersReduced()).current;
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = visible && !reduced;
  const n = scenes.length;

  useEffect(() => {
    if (!playing || n <= 1) return;
    const id = window.setTimeout(() => setI((s) => (s + 1) % n), scenes[i].duration);
    return () => window.clearTimeout(id);
  }, [i, playing, n, scenes]);

  // Keep index in range if the scene list length changes.
  useEffect(() => { if (i >= n) setI(0); }, [n, i]);

  const cur = scenes[Math.min(i, n - 1)];

  return (
    <div ref={hostRef} className={`relative mx-auto select-none flex flex-col items-center justify-start ${className}`} style={{ width: (W + 22) * scale, height: (H + 22) * scale + (dots && n > 1 ? 34 : 0) }}>
      <div
        className="absolute left-1/2 top-1/2 -z-10 blur-3xl opacity-30 rounded-full pointer-events-none"
        style={{ width: 320, height: 420, transform: "translate(-50%,-50%)", background: `radial-gradient(ellipse, ${glow}, transparent 70%)` }}
      />
      {/* `.dd-app` is sized to the SCALED footprint and the phone is scaled into
          it from the top-left, so layout actually collapses to the scaled size
          (PhoneFrame's own `scale` is only a visual transform that would leave a
          full-size layout box → clipped cards + dots flung far below). */}
      <div className="dd-app" style={{ width: (W + 22) * scale, height: (H + 22) * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <PhoneFrame intensity={intensity} island={cur.island ? <IslandLiveActivity /> : undefined}>
            <div
              className="flex h-full"
              style={{
                width: W * n,
                transform: `translate3d(${-i * W}px,0,0)`,
                transition: "transform 0.55s cubic-bezier(0.65,0,0.35,1)",
                willChange: "transform",
              }}
            >
              {scenes.map((s, idx) => (
                <div key={s.key} style={{ width: W }} className="h-full shrink-0 overflow-hidden">
                  <s.Comp active={idx === i} playing={playing} />
                </div>
              ))}
            </div>
          </PhoneFrame>
        </div>
      </div>

      {dots && n > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {scenes.map((s, idx) => (
            <span
              key={s.key}
              className="rounded-full transition-all duration-300"
              style={{
                height: 6,
                width: idx === i ? 22 : 6,
                background: idx === i ? glow : "var(--ink-faint)",
                opacity: idx === i ? 0.95 : 0.45,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Live Activity that lives inside the Dynamic Island — a ticking timer + total. */
function IslandLiveActivity() {
  const [sec, setSec] = useState(2538);
  useEffect(() => {
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const pad = (x: number) => x.toString().padStart(2, "0");
  const tstr = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;
  const earn = ((sec / 3600) * 500).toFixed(0);
  return (
    <div className="flex items-center gap-2 w-full">
      <Timer className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} strokeWidth={2.5} />
      <span className="dd-mono text-[11.5px] font-semibold" style={{ color: "#fff" }}>{tstr}</span>
      <span className="ml-auto dd-mono text-[11.5px] font-bold" style={{ color: C.success }}>US${earn}</span>
    </div>
  );
}
