import { useState } from "react";
import { nextTagline } from "../data/taglines";

/* ------------------------------------------------------------------
   One campaign tagline, drawn fresh each time this mounts — so a BA
   gets a different line every time they sign in.

   The artwork is transparent: lettering, pattern and mark only. There
   is no card, no panel and no background behind it, so it reads as
   part of the screen rather than something pasted onto it.
   ------------------------------------------------------------------ */
export default function CampaignTagline({ className = "", style }) {
  /* Held in state, not recomputed on render — a re-render for any
     unrelated reason shouldn't swap the line out under the BA. */
  const [tagline] = useState(nextTagline);
  const [shown, setShown] = useState(false);

  if (!tagline) return null;

  return (
    <img
      src={tagline.src}
      alt={tagline.text || "የሚያረካ"}
      onLoad={() => setShown(true)}
      className={`block w-full h-auto select-none pointer-events-none ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(6px)",
        transition: "opacity 520ms ease-out, transform 520ms ease-out",
        ...style,
      }}
    />
  );
}
