import { API_URL, API_CONFIGURED, API_NOT_CONFIGURED_MESSAGE } from "../config";

/* ------------------------------------------------------------------
   One place that talks to Apps Script.

   doPost catches its own exceptions and answers in JSON, so a reply
   that starts with "<" never came from our handler — Apps Script
   itself refused the request before it ran. In practice that is one
   of three things, and the raw "Unexpected token '<'" tells the BA
   none of them:

     · the script needs re-authorising, which Google requires again
       whenever the code starts using a service it wasn't authorised
       for (adding LockService does it)
     · the deployment's access isn't "Anyone", so Google answers with
       a sign-in page
     · the deployment was never updated to a new version

   Surfacing that distinction is the difference between a five-minute
   fix and an afternoon.
   ------------------------------------------------------------------ */

function interpret(body, status) {
  const head = body.slice(0, 400).toLowerCase();

  if (head.includes("<!doctype") || head.startsWith("<html")) {
    if (head.includes("authoriz") || head.includes("authoris") ||
        head.includes("permission") || head.includes("accounts.google")) {
      return "The backend needs re-authorising. Open the Apps Script editor, press Run on any function, and accept the permissions prompt.";
    }
    if (head.includes("sign in") || head.includes("signin")) {
      return "The backend is asking callers to sign in. In Deploy → Manage deployments, set access to \"Anyone\", then deploy a new version.";
    }
    return `The backend returned a web page instead of data (HTTP ${status}). Usually the deployment needs re-authorising, or its access isn't set to "Anyone".`;
  }

  return `The backend sent something unreadable (HTTP ${status}).`;
}

export async function postJson(payload) {
  if (!API_CONFIGURED) {
    return { ok: false, message: API_NOT_CONFIGURED_MESSAGE };
  }

  let res;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, message: "Couldn't reach the server. Check your connection." };
  }

  const body = await res.text();
  try {
    return { ok: true, data: JSON.parse(body) };
  } catch {
    /* Keep the first slice of the page in the console — the alert stays
       readable, but there's something concrete to look at if the three
       usual causes turn out not to be it. */
    console.error("Non-JSON reply from Apps Script:", res.status, body.slice(0, 600));
    return { ok: false, message: interpret(body, res.status) };
  }
}
