/* ------------------------------------------------------------------
   Campaign taglines — the የሚያረካ sticker set.

   Each sticker is the lettering, the tibeb pattern and the mark on a
   transparent ground, keyed off the dark field they were supplied on.
   They sit straight on whatever the screen's background happens to be.

   Vite hands back URLs only, so listing all 59 here costs nothing at
   load — the browser fetches just the one that ends up on screen.
   ------------------------------------------------------------------ */

const files = import.meta.glob("../assets/taglines/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

export const TAGLINES = Object.keys(files)
  .sort()
  .map((path, i) => ({
    id: path.slice(path.lastIndexOf("/") + 1, -4),
    src: files[path],
    /* The Amharic wording, for screen readers and for anywhere the
       artwork can't be shown. Still to be filled in — the lettering is
       vector outlines, so it can't be read back off the file. */
    text: "",
    index: i,
  }));

const BAG_KEY = "tagline_bag";

/* ------------------------------------------------------------------
   Draws from a shuffled bag rather than picking at random, so a BA
   sees all 59 before any one comes round again. Random picking would
   repeat within a handful of logins, which is exactly what makes the
   thing feel broken.
   ------------------------------------------------------------------ */
export function nextTagline() {
  if (TAGLINES.length === 0) return null;

  let bag = [];
  try {
    const stored = JSON.parse(localStorage.getItem(BAG_KEY));
    if (Array.isArray(stored)) bag = stored;
  } catch {
    /* Corrupt or absent — refill below. */
  }

  /* Drop anything that no longer matches the current sticker set, so
     adding or removing artwork doesn't leave stale indices behind. */
  bag = bag.filter((i) => Number.isInteger(i) && i >= 0 && i < TAGLINES.length);

  if (bag.length === 0) {
    bag = TAGLINES.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }

  const pick = bag.pop();

  try {
    localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  } catch {
    /* Private mode or a full quota — the tagline still shows, it just
       won't remember what came before. */
  }

  return TAGLINES[pick];
}
