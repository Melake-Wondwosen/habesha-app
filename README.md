# Habesha Wheel — የሚያረካ

Trade-activation app for the Habesha የሚያረካ campaign: outlet
registration, campaign setup, a weighted prize wheel with main and
regular tiers, a shared beer crate pool, winner registration, a regional
manager dashboard, national analytics, and four visual themes.

## Brand

The theme is black and gold, sampled off the supplied artwork rather
than picked by eye:

| Token | Value | Where it came from |
|---|---|---|
| `ink` / `inkDeep` | `#14100F` / `#0B0808` | the ground the screens sit on |
| `field` | `#231F20` | the flat field the stickers are drawn on |
| `bronze` → `adey` | `#754927` → `#F0E77F` | the tibeb band's own gold gradient |
| `cream` | `#F7F1E3` | the sticker lettering |

Colours live in two places that must agree:

- `src/index.css` — the `@theme` block and the `--habesha-*` variables
- `src/brand/HabeshaBrand.jsx` — the `HABESHA` object, used for canvas
  drawing on the wheel and for inline styles

Assets in `src/assets/`:

| File | What it is |
|---|---|
| `habesha-mark.png` | the mark — used in headers and as the PWA icon |
| `habesha-flower.png` | Adey Abeba, scattered faintly across every screen |
| `taglines/tagline-NN.png` | 59 campaign stickers, transparent ground |

## Campaign taglines

Every sign-in shows a different tagline on the home screen. The stickers
are the supplied artwork with the dark field keyed out, so the lettering,
the tibeb pattern and the mark sit straight on the screen background.

`src/data/taglines.js` draws from a shuffled bag held in `localStorage`,
so a BA sees all 59 before any repeats. To add or remove artwork, drop
files in or out of `src/assets/taglines/` — the bag re-syncs itself.

The `text` field on each tagline is empty. It's there for screen readers
and needs the Amharic wording typed in by hand: the lettering is vector
outlines, so it can't be read back off the files.

## Still to do

**Prize artwork.** Prizes currently render as gold glyphs
(`src/components/PrizeGlyph.jsx`) because the old brand's product
photography has been removed and there is no Habesha equivalent yet.
When real renders arrive, that one file is the place to swap them in —
every caller just asks for "the thing for this prize name".

## Backend

Sheet:
https://docs.google.com/spreadsheets/d/1c79mDNHJStKA6IJIF0-VO50vnMxeszSKT4R9JIQltAU/edit

1. Open it → Extensions → Apps Script
2. Paste in all of `apps-script/Code.gs` and `apps-script/prizes.gs`, save
3. Reload the sheet, then: **Habesha Wheel → Run setup (first time only)**.
   This creates the seven tabs: Users, Outlets, Winners, Prizes,
   Settings, Spins, Cities.
4. Project Settings → Script Properties → add `ADMIN_KEY` with a long
   random value. The "Wheel prizes" admin screen asks for this on save,
   and it is deliberately separate from any user's password.
5. Deploy → New deployment → Web app → Execute as **Me**, access
   **Anyone** → copy the `/exec` URL
6. Put that URL in `src/config.js`
7. In the Users sheet, set `canPublish` to `TRUE` on your row

After any later edit to `Code.gs`: Deploy → Manage deployments → pencil →
New version → Deploy. Apps Script keeps serving the old code until you do.

Setup seeds two accounts. Change both passwords before going live, and
note that `role` must be exactly `admin` for admin access — that string
is what `AdminRoute.jsx` checks.

## Deploy

Vercel, pointed at this repo. `vercel.json` already handles SPA routing.
