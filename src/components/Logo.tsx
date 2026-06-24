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
