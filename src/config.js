/* The deployed Apps Script web app.

   Deploy → New deployment → Web app → Execute as "Me", access
   "Anyone" → paste the URL ending in /exec here.

   Everything in src/services/ imports from this one place. */
export const API_URL =
  "https://script.google.com/macros/s/AKfycbzMfZO_oJrEbg2wZVz38Kq509UDObFCecTXIU8zO9i1rh9aNobb3iiBXwW4CtLaLW5_Yw/exec";

/* A placeholder resolves as a *relative* URL, so the request quietly
   comes back as the app's own index.html and every caller dies on
   `Unexpected token '<'`. Checking up front turns that into a message
   that says what is actually wrong. */
export const API_CONFIGURED = /^https:\/\/script\.google\.com\/.+\/exec$/.test(
  API_URL
);

export const API_NOT_CONFIGURED_MESSAGE =
  "The app isn't connected to its backend yet — API_URL in src/config.js is still the placeholder.";

/* Outlet photos are captured but not uploaded.

   The BA still has to take one — it's what proves they stood in front
   of the outlet — but the image stays on the phone and only the outlet
   details go to the sheet. That keeps the request small and keeps Drive
   out of the write path entirely.

   The cost is real: nobody back at the office can see the outlet, so
   the photo verifies nothing after the fact. Flip this to true (and
   redeploy nothing — the backend already handles it) to send them
   again. */
export const UPLOAD_OUTLET_PHOTOS = false;
