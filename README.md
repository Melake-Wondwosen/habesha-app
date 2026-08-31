# Habesha Wheel

A copy of the Feta trade-activation app, rebranded for Habesha. Same
features: outlet registration, campaign setup, weighted prize wheel with
main/regular tiers, shared beer crate pool, winner registration, regional
manager dashboard, national analytics, and four visual themes.

The two apps are separate codebases. A fix made here does not reach the
Feta app, and vice versa.

## Still to do

**1. Brand assets.** Every image in `src/assets/` is still Feta's.
Replace them with Habesha equivalents, keeping the same filenames so no
code changes are needed:

| File | What it is |
|---|---|
| `feta-logo-lockup.png` | full logo lockup |
| `feta-mark.png` | wordmark alone, used in headers |
| `feta-pattern.png` | woven pattern |
| `feta-pattern-white.png` | same pattern, red dropped |
| `feta-bottle.png` | product bottle |
| `feta-cap.png`, `feta-tshirt.png`, `feta-keychain.png`, `feta-opener.png`, `feta-sixpack.png` | prize artwork |

Also the icons in `public/`.

**2. Palette.** Colours live in two places that must agree:
- `src/index.css` — the `@theme` block and `--feta-*` variables
- `src/brand/FetaBrand.jsx` — the `FETA` object, used for canvas drawing
  and inline styles

**3. Tagline.** `ከጓደኛ ጋር` appears on the Start and Login screens.

## Backend

Sheet already created:
https://docs.google.com/spreadsheets/d/1c79mDNHJStKA6IJIF0-VO50vnMxeszSKT4R9JIQltAU/edit

1. Open it → Extensions → Apps Script
2. Paste in all of `apps-script/Code.gs`, save
3. Back in the sheet: **Habesha Wheel → Run setup (first time only)**
4. Deploy → New deployment → Web app → Execute as **Me**, access
   **Anyone** → copy the `/exec` URL
5. Put that URL in `src/config.js`
6. In the Users sheet, set `canPublish` to `TRUE` on your row

Seeded accounts: `ba1` / `B0lCMVyZfL`, `admin1` / `2fWlxb79Ig`.
Change these before going live.

## Deploy

Vercel, pointed at this repo. `vercel.json` already handles SPA routing.
