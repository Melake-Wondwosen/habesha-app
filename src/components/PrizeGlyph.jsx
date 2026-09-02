import {
  FaBeer,
  FaTshirt,
  FaHatCowboy,
  FaBoxOpen,
  FaKey,
  FaGift,
} from "react-icons/fa";
import { HABESHA } from "../brand/HabeshaBrand";
import { isBottlePrize } from "../services/bottleStock";

/* ------------------------------------------------------------------
   Prize glyphs.

   The app used to show photographs of the old brand's merchandise here.
   That artwork is gone, and there is no Habesha equivalent yet, so
   prizes are drawn as gold glyphs on the ink field instead — which
   reads as a deliberate part of the theme rather than as a gap.

   When real Habesha product renders arrive, this is the one place to
   change: swap the glyph for an <img> and everything downstream keeps
   working, since callers only ever ask for "the thing for this name".
   ------------------------------------------------------------------ */
function glyphFor(name = "") {
  if (/6\s*-?\s*pack|crate|case/i.test(name)) return FaBoxOpen;
  if (isBottlePrize(name)) return FaBeer;
  if (/t[\s-]?shirt|tee\b/i.test(name)) return FaTshirt;
  if (/\bcap\b|hat/i.test(name)) return FaHatCowboy;
  if (/opener|key\s*-?\s*chain|keyring/i.test(name)) return FaKey;
  return FaGift;
}

export default function PrizeGlyph({
  name,
  size = 34,
  tone = HABESHA.amber,
  className = "",
  style,
}) {
  const Glyph = glyphFor(name);

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ color: tone, ...style }}
      aria-hidden="true"
    >
      <Glyph size={size} />
    </span>
  );
}

export { glyphFor };
