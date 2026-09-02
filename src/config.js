/* The deployed Apps Script web app.

   Deploy → New deployment → Web app → Execute as "Me", access
   "Anyone" → paste the URL ending in /exec here.

   Everything in src/services/ imports from this one place. */
export const API_URL = "PASTE_YOUR_HABESHA_APPS_SCRIPT_EXEC_URL_HERE";

/* A placeholder resolves as a *relative* URL, so the request quietly
   comes back as the app's own index.html and every caller dies on
   `Unexpected token '<'`. Checking up front turns that into a message
   that says what is actually wrong. */
export const API_CONFIGURED = /^https:\/\/script\.google\.com\/.+\/exec$/.test(
  API_URL
);

export const API_NOT_CONFIGURED_MESSAGE =
  "The app isn't connected to its backend yet — API_URL in src/config.js is still the placeholder.";
