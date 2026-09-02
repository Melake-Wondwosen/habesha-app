import PrizeGlyph from "./PrizeGlyph";
import { HABESHA, HabeshaMark } from "../brand/HabeshaBrand";
import { bottleCost } from "../services/bottleStock";

/* The celebration shown when a prize is won. Lives here rather than
   inside the spin screen so the admin preview renders the identical
   thing — a preview that drifts from production is worse than none. */
/* Prizes that are a single object rather than a count of bottles.
   Matched loosely so "T-Shirt", "Tshirt" and "T Shirt" all land the
   same way. A 6-pack costs six from the pool but shouldn't render as
   six separate bottles trying to clink. */
const SOLO = /6\s*-?\s*pack|t[\s-]?shirt|\bcap\b|opener|key\s*-?\s*chain|keyring/i;

export default function WinCelebration({ prize }) {
  const bottles = bottleCost(prize);
  const solo = SOLO.test(String(prize || ""));

  if (solo || bottles <= 0) {

    if (solo) {
      return (
        <div
          className="relative flex items-center justify-center -mt-20 mb-3"
          style={{ height: 175 }}
        >
          <span
            aria-hidden="true"
            className="habesha-bottle-glow absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: 240,
              height: 240,
              marginLeft: -120,
              marginTop: -120,
              background: `radial-gradient(circle, ${HABESHA.amber}DD 0%, ${HABESHA.gold}66 42%, transparent 70%)`,
            }}
          />
          <PrizeGlyph
            name={prize}
            size={104}
            tone={HABESHA.amber}
            className="habesha-bottle-solo relative drop-shadow-[0_10px_18px_rgba(11,8,8,0.6)]"
          />
        </div>
      );
    }

    return <HabeshaMark className="w-12 mx-auto mb-3" />;
  }

  const classes =
    bottles === 1
      ? ["habesha-bottle-solo"]
      : bottles === 2
      ? ["habesha-cheers-left", "habesha-cheers-right"]
      : ["habesha-cheers-left", "habesha-cheers-centre", "habesha-cheers-right"];

  return (
    <div
      className="relative flex items-end justify-center -mt-24 mb-3"
      style={{ height: 190 }}
    >
      <span
        aria-hidden="true"
        className="habesha-bottle-glow absolute left-1/2 top-1/2 rounded-full pointer-events-none"
        style={{
          width: 240,
          height: 240,
          marginLeft: -120,
          marginTop: -120,
          background: `radial-gradient(circle, ${HABESHA.amber}DD 0%, ${HABESHA.gold}66 42%, transparent 70%)`,
        }}
      />

      {classes.map((c, i) => (
        <PrizeGlyph
          key={i}
          name="bottle"
          size={bottles === 1 ? 108 : 96}
          tone={HABESHA.amber}
          className={`${c} relative drop-shadow-[0_10px_18px_rgba(11,8,8,0.6)]`}
          style={{
            marginLeft: i === 0 ? 0 : bottles === 3 ? -14 : -10,
            zIndex: c === "habesha-cheers-centre" ? 1 : 2,
          }}
        />
      ))}

      {bottles > 1 && (
        <span
          aria-hidden="true"
          className="habesha-clink-spark absolute left-1/2 rounded-full pointer-events-none"
          style={{
            top: 14,
            width: 90,
            height: 90,
            marginLeft: -45,
            zIndex: 3,
            background: `radial-gradient(circle, ${HABESHA.amber}DD 0%, ${HABESHA.gold}88 40%, transparent 68%)`,
          }}
        />
      )}
    </div>
  );
}
