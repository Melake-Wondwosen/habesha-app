import habeshaMark from "../assets/habesha-mark.png";
import adeyFlower from "../assets/habesha-flower.png";
import tibebTile from "../assets/habesha-tibeb.png";

export const HABESHA = {
  /* Sampled off the supplied artwork: the sticker field, the tibeb
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
   Tibeb band. One repeat of the supplied pattern ships as an alpha
   mask, so a single asset is tinted per surface rather than needing
   one file per colour.
   ------------------------------------------------------------------ */
const TIBEB_RATIO = 195 / 126;

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
  const size =
    tiles > 0
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

/* ------------------------------------------------------------------
   Adey Abeba, the new year daisy. Fixed positions rather than random
   ones, so the decoration does not shuffle on every render.
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

export function HabeshaMark({ className = "", alt = "የሚያረካ", style }) {
  return <img src={habeshaMark} alt={alt} className={className} style={style} />;
}

/* ------------------------------------------------------------------
   The shared shell. Black ground, the campaign photograph behind it,
   woven trim top and bottom.
   ------------------------------------------------------------------ */
export function Screen({ children, trim = true, fullWidth = false }) {
  return (
    <div
      className={`habesha-screen relative min-h-screen ${
        fullWidth ? "" : "max-w-md"
      } mx-auto overflow-hidden flex flex-col`}
      style={{ background: HABESHA.inkDeep }}
    >
      {/* Clipped to this column, so on a desktop the photograph stays
          inside the phone-width frame rather than filling the window. */}
      <div className="habesha-backdrop" aria-hidden="true" />

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
