import { postJson } from "./api";

/* The six brands the study tracks, plus a free-text slot. Order is the
   order they appear on screen, and the keys match the Surveys sheet
   columns so nothing has to be translated on the way in. */
export const BRANDS = [
  { key: "habesha", label: "Habesha", ours: true },
  { key: "stgeorge", label: "St. George" },
  { key: "meta", label: "Meta" },
  { key: "dashen", label: "Dashen" },
  { key: "bedele", label: "Bedele" },
  { key: "walia", label: "Walia" },
  { key: "other", label: "Other", isOther: true },
];

export const REASONS = [
  "Low customer demand",
  "Frequent stock shortages or supply issues",
  "Competitors offer better promotions or incentives",
  "Customers prefer competing brands",
  "Habesha beer is not consistently available",
  "Habesha is my best-selling brand",
  "Other",
];

const QUEUE_KEY = "offline_surveys";

export async function submitSurvey(payload) {
  const res = await postJson({ action: "addSurvey", ...payload });

  if (!res.ok || res.data?.status !== "success") {
    /* A BA standing in an outlet with no signal shouldn't lose a
       completed questionnaire. Keep it and push it on reconnect. */
    queue(payload);
    return { ok: false, queued: true, message: res.message || res.data?.message };
  }
  return { ok: true };
}

function queue(payload) {
  try {
    const q = JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
    q.push(payload);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* Storage full or unavailable — nothing more we can do here. */
  }
}

/* Called on the activity chooser, which every BA passes through. */
export async function flushSurveyQueue() {
  let q;
  try {
    q = JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
  } catch {
    return;
  }
  if (q.length === 0 || !navigator.onLine) return;

  const unsent = [];
  for (const item of q) {
    const res = await postJson({ action: "addSurvey", ...item });
    if (!res.ok || res.data?.status !== "success") unsent.push(item);
  }

  try {
    if (unsent.length === 0) localStorage.removeItem(QUEUE_KEY);
    else localStorage.setItem(QUEUE_KEY, JSON.stringify(unsent));
  } catch {
    /* As above. */
  }
}

export function pendingSurveyCount() {
  try {
    return (JSON.parse(localStorage.getItem(QUEUE_KEY)) || []).length;
  } catch {
    return 0;
  }
}
