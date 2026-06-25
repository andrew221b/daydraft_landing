import { useTheme } from "../contexts/theme";

/**
 * The DayDraft "D" mark.
 *
 * Dark theme: the sacred cream glyph, exactly as in the app.
 * Light theme: the cream glyph would vanish on white (and a flat black D looked
 * cheap), so we paint the brand gradient THROUGH the glyph via a CSS mask — a
 * blue→indigo→violet D that carries the same identity as the dark logo.
 */
export default function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const { theme } = useTheme();

  if (theme === "light") {
    return (
      <span
        className={className}
        aria-hidden
        style={{
          display: "block",
          width: size,
          height: size,
          background: "linear-gradient(135deg, var(--blue) 0%, var(--indigo) 52%, var(--violet) 100%)",
          WebkitMaskImage: "url(/isolated-logo.webp)",
          maskImage: "url(/isolated-logo.webp)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          filter: "drop-shadow(0 3px 8px rgba(94,92,230,0.38))",
        }}
      />
    );
  }

  return (
    <img
      src="/isolated-logo.webp"
      alt=""
      aria-hidden
      className={className}
      style={{ display: "block", width: size, height: size, objectFit: "contain" }}
    />
  );
}

/**
 * The full DayDraft logo (mark + typographic text).
 * Meticulously spaced and weighted to look like a cohesive brand mark.
 */
export function Logo({ size = 32, className = "", textClassName = "" }: { size?: number; className?: string; textClassName?: string }) {
  return (
    <div className={`flex items-center gap-[5px] ${className}`}>
      {/* Lifted further to optically align the bottom of the D (ignoring its shadow) with the text baseline */}
      <LogoMark size={size} className="shrink-0 -translate-y-[3.5px]" />
      <span 
        className={`font-display tracking-[-0.04em] leading-none logo-text-metallic flex items-center ${textClassName}`}
        style={{ fontSize: size * 0.8 }}
      >
        <span className="font-semibold">Day</span>
        <span className="font-semibold">Draft</span>
      </span>
    </div>
  );
}
