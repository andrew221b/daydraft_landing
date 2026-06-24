import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { W, H } from "./phoneScenes";

const isTouch =
  typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const BEZEL = 11;          // frame thickness around the screen
const FRAME_R = 52;        // outer corner radius
const SCREEN_R = FRAME_R - BEZEL - 1;

/**
 * A photoreal iPhone-style device frame around a fixed W×H screen.
 *
 * Desktop: tilts in 3D toward the cursor (springy), with a glare sweep.
 * Touch: there's no pointer, so it sways on a slow infinite loop instead — the
 * screens still read as a real, tiltable device.
 *
 * `island` projects an expanded Live Activity into the Dynamic Island; without
 * it the island is the usual collapsed hardware pill.
 */
export default function PhoneFrame({
  children,
  island,
  intensity = 9,
  scale = 1,
  className = "",
}: {
  children: ReactNode;
  island?: ReactNode;
  intensity?: number;
  scale?: number;
  className?: string;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 170, damping: 18 });
  const my = useSpring(py, { stiffness: 170, damping: 18 });
  const rotateX = useTransform(my, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);
  // Glare follows the cursor across the glass.
  const glareX = useTransform(mx, [-0.5, 0.5], ["18%", "82%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["12%", "78%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]: string[]) => `radial-gradient(60% 50% at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 60%)`,
  );

  const outerW = W + BEZEL * 2;
  const outerH = H + BEZEL * 2;

  const frame = (
    <div
      className="relative"
      style={{
        width: outerW,
        height: outerH,
        borderRadius: FRAME_R,
        // Titanium rail: light top edge → dark body → faint bottom catch-light.
        background: "linear-gradient(150deg, #43474f 0%, #1b1d22 26%, #0c0d10 60%, #25282e 100%)",
        padding: BEZEL,
        boxShadow: [
          "inset 0 1px 1px rgba(255,255,255,0.35)",
          "inset 0 0 0 1.5px rgba(0,0,0,0.85)",
          "inset 0 0 0 3px rgba(80,84,92,0.4)",
          "0 1px 0 rgba(255,255,255,0.06)",
          "0 30px 60px -18px rgba(0,0,0,0.78)",
          "0 12px 28px -12px rgba(0,0,0,0.6)",
        ].join(", "),
        transformStyle: "preserve-3d",
      }}
    >
      {/* ── Side buttons (sit just outside the rail) ── */}
      <span style={btn(-2.5, 112, 3, 26)} />{/* mute switch */}
      <span style={btn(-2.5, 150, 3, 42)} />{/* volume up */}
      <span style={btn(-2.5, 200, 3, 42)} />{/* volume down */}
      <span style={{ ...btn(-2.5, 168, 3, 64), left: "auto", right: -2.5 }} />{/* power */}

      {/* ── Screen ── */}
      <div
        className="relative overflow-hidden"
        style={{
          width: W,
          height: H,
          borderRadius: SCREEN_R,
          background: "hsl(var(--dd-bg))",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.9), inset 0 0 22px rgba(0,0,0,0.55)",
        }}
      >
        {children}

        {/* ── Dynamic Island (hardware, always on top) ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center justify-center"
          style={{
            top: 11,
            height: island ? 34 : 27,
            minWidth: island ? 150 : 86,
            padding: island ? "0 12px" : 0,
            background: "#000",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.8)",
            transition: "min-width 0.4s cubic-bezier(0.34,1.3,0.64,1), height 0.4s cubic-bezier(0.34,1.3,0.64,1)",
          }}
        >
          {island}
        </div>

        {/* ── Screen glare (desktop only — follows cursor) ── */}
        {!isTouch && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-40 mix-blend-overlay"
            style={{ borderRadius: SCREEN_R, background: glare }}
          />
        )}
      </div>
    </div>
  );

  // Touch: no cursor → idle sway so the device still feels alive and 3D.
  if (isTouch) {
    return (
      <div className={className} style={{ perspective: 1300 }}>
        <motion.div
          style={{ transformStyle: "preserve-3d", width: outerW, height: outerH, scale, transformOrigin: "top center" }}
          animate={{ rotateY: [-4.5, 4.5, -4.5], rotateX: [1.8, -1.8, 1.8] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          {frame}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={className} style={{ perspective: 1300 }}>
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => { px.set(0); py.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", width: outerW, height: outerH, scale, transformOrigin: "top center" }}
      >
        {frame}
      </motion.div>
    </div>
  );
}

function btn(left: number, top: number, w: number, h: number): React.CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: w,
    height: h,
    borderRadius: 3,
    background: "linear-gradient(90deg, #0a0b0d, #34373d 50%, #0a0b0d)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
  };
}
