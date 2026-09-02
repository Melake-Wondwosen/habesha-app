import { API_URL, API_CONFIGURED, API_NOT_CONFIGURED_MESSAGE } from "../config";

/* Login goes over POST rather than a query string: credentials in a URL
   end up in access logs, browser history and Referer headers, and any
   password containing & + # or a space breaks the request outright.

   Content-Type is text/plain deliberately — it keeps this a "simple"
   CORS request, and Apps Script web apps don't answer preflight OPTIONS.
   The rest of the services already post this way. */
export async function loginUser(username, password) {
  if (!API_CONFIGURED) {
    return { success: false, message: API_NOT_CONFIGURED_MESSAGE };
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "login",
        username: String(username ?? "").trim(),
        password: String(password ?? ""),
      }),
    });
  } catch {
    return {
      success: false,
      message: "Couldn't reach the server. Check your connection and try again.",
    };
  }

  /* Apps Script hands back an HTML error page rather than JSON when the
     deployment is wrong or unauthorised, so don't assume a body parses. */
  const body = await response.text();
  try {
    return JSON.parse(body);
  } catch {
    return {
      success: false,
      message: response.ok
        ? "The server sent back something unreadable. Check the Apps Script deployment."
        : `Server error (${response.status}). Check the Apps Script deployment.`,
    };
  }
}
