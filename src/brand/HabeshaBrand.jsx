import { useId } from "react";
import habeshaMark from "../assets/habesha-mark.png";
import adeyFlower from "../assets/habesha-flower.png";
import tibebTile from "../assets/habesha-tibeb.png";

export const HABESHA = {
  /* Sampled off the supplied artwork — the sticker field, the tibeb
     band's gold gradient, and the highlight in the Adey Abeba. */
  ink: "#14100F",
  inkDeep: "#0B0808",
  field: "#231F20",
  bronze: "#754927",
  gold: "#B38A4A",
  goldLit: "#D0AC63",
  amber: "#E5CA78",
  adey: "#F0E77F",
  cream: "#F7F1E3",
  silver: "#8D8378",
};

/* ------------------------------------------------------------------
   Tibeb wash — the ambient behind every screen. A single oversized,
   very faint band of the weave, rotated off-axis so it reads as
   texture rather than as a border that has slipped.

   This replaces the sunburst that came from the old artwork; the
   motif here is the same chevron the stickers are built from.
   ------------------------------------------------------------------ */
export function TibebWash({ opacity = 0.07, className = "", style }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ opacity, ...style }}
    >
      <TibebBand height={220} ground="transparent" line={HABESHA.gold} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Tibeb band — the supplied Habesha pattern: concentric diamonds set
   in a field of smaller ones. One repeat of the artwork lives in
   habesha-tibeb.png as an alpha mask, so a single asset can be tinted
   any colour the screen needs rather than shipping one file per tone.

   ground — fill behind the motif (transparent by default)
   line   — the motif itself
   tiles  — force exactly this many whole repeats across the width, so
            nothing is clipped mid-motif at the edges
   ------------------------------------------------------------------ */
const TIBEB_RATIO = 195 / 126; /* one repeat of the supplied artwork */

export function TibebBand({
  height = 22,
  ground = "transparent",
  line = HABESHA.gold,
  opacity = 1,
  flip = false,
  tiles = 0,
  className = "",
  style,
}) {
  /* Without `tiles` the motif keeps its own aspect and simply repeats,
     which is what the wide full-bleed trims want. */
  const size = tiles > 0
    ? `${100 / tiles}% 100%`
    : `${height * TIBEB_RATIO}px ${height}px`;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height,
        width: "100%",
        opacity,
        background: ground,
        display: "block",
        transform: flip ? "scaleY(-1)" : undefined,
        ...style,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: line,
          maskImage: `url(${tibebTile})`,
          WebkitMaskImage: `url(${tibebTile})`,
          maskRepeat: "repeat-x",
          WebkitMaskRepeat: "repeat-x",
          maskSize: size,
          WebkitMaskSize: size,
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </div>
  );
}

/* The dashed row that separates the woven bands in the pattern sheet. */
export function TibebDashes({
  height = 10,
  color = HABESHA.cream,
  opacity = 1,
  className = "",
}) {
  const id = useId().replace(/:/g, "");
  const s = height / 12;

  return (
    <svg
      width="100%"
      height={height}
      aria-hidden="true"
      className={className}
      style={{ opacity, display: "block" }}
    >
      <defs>
        <pattern
          id={`td-${id}`}
          width={7 * s}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <rect
            transform={`scale(${s})`}
            x="0"
            y="1"
            width="3.4"
            height="10"
            fill={color}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#td-${id})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Tibeb field — a large, tiled texture for panels that want more
   than the wash. Drawn from the same chevron rather than a bitmap,
   so it stays crisp and carries no leftover artwork.
   ------------------------------------------------------------------ */
export function TibebField({ opacity = 0.12, className = "", style }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ opacity, overflow: "hidden", ...style }}
    >
      <TibebBand height={140} ground="transparent" line={HABESHA.gold} />
      <TibebBand height={140} ground="transparent" line={HABESHA.gold} flip />
    </div>
  );
}

/* ------------------------------------------------------------------
   Adey Abeba — the new year daisy. Deliberately sparse: four small
   blooms tucked into the corners at low opacity, enough to mark the
   season without turning every screen into a greeting card.

   Fixed positions rather than random ones, so the decoration doesn't
   shuffle itself around each time a screen re-renders.
   ------------------------------------------------------------------ */
const BLOOMS = [
  { top: "6%", left: "-4%", size: 74, rotate: -18, opacity: 0.62 },
  { top: "23%", right: "-5%", size: 96, rotate: 24, opacity: 0.5 },
  { bottom: "21%", left: "-6%", size: 84, rotate: 12, opacity: 0.54 },
  { bottom: "5%", right: "1%", size: 60, rotate: -30, opacity: 0.68 },
];

export function AdeyScatter({ blooms = BLOOMS, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {blooms.map((b, i) => {
        const { size, rotate, opacity, ...pos } = b;
        return (
          <img
            key={i}
            src={adeyFlower}
            alt=""
            style={{
              position: "absolute",
              width: size,
              height: size,
              opacity,
              transform: `rotate(${rotate}deg)`,
              ...pos,
            }}
          />
        );
      })}
    </div>
  );
}


/* The wordmark on its own. Everything smaller than the hero uses this. */
export function HabeshaMark({ className = "", alt = "የሚያረካ", style }) {
  return <img src={habeshaMark} alt={alt} className={className} style={style} />;
}

/* ------------------------------------------------------------------
   Screen — the shared shell. Black ground, a faint tibeb wash, woven
   trim top and bottom. Every page is a panel cut from the same cloth.

   `rays` is kept as the prop name so existing callers don't need
   touching; it now controls the wash.
   ------------------------------------------------------------------ */
export function Screen({ children, rays = true, trim = true, fullWidth = false }) {
  return (
    <div
      className={`habesha-screen relative min-h-screen ${fullWidth ? "" : "max-w-md"} mx-auto overflow-hidden flex flex-col`}
      style={{
        /* The ink floor. The photograph sits above it in .habesha-backdrop,
           and the vignette is baked into that layer's gradient. */
        background: HABESHA.inkDeep,
      }}
    >
      {/* Clipped to this column, so on a desktop the photograph stays
          inside the phone-width frame rather than filling the window. */}
      <div className="habesha-backdrop" aria-hidden="true" />

      {rays && (
        <TibebWash
          opacity={0.06}
          className="absolute pointer-events-none"
          style={{
            top: "18%",
            left: "50%",
            width: "220%",
            transform: "translateX(-50%) rotate(-12deg)",
            transformOrigin: "center",
          }}
        />
      )}

      <AdeyScatter />

      {trim && (
        <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
          <TibebBand height={28} />
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1">{children}</div>

      {trim && (
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
          <TibebBand height={28} flip />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Buttons. Primary is cream on red — a label stuck to the poster.
   ------------------------------------------------------------------ */
export function HabeshaButton({
  children,
  variant = "primary",
  className = "",
  style,
  ...rest
}) {
  const skins = {
    primary: { background: HABESHA.cream, color: HABESHA.ink },
    gold: { background: HABESHA.amber, color: HABESHA.ink },
    ink: { background: HABESHA.ink, color: HABESHA.amber },
  };

  return (
    <button
      {...rest}
      className={`habesha-lockup habesha-press habesha-display w-full text-lg py-4 px-5 disabled:opacity-45 disabled:pointer-events-none ${className}`}
      style={{ ...skins[variant], letterSpacing: "0.06em", ...style }}
    >
      {children}
    </button>
  );
}

/* Small caps eyebrow with a rule, used to head every section. */
export function SectionLabel({ children, tone = HABESHA.amber }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="habesha-eyebrow" style={{ color: tone }}>
        {children}
      </span>
      <span className="flex-1 h-px" style={{ background: `${tone}55` }} />
    </div>
  );
}
