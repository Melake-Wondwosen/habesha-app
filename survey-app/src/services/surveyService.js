import { postJson } from "./api";

/* The six brands the study tracks, plus a free-text slot. Order is the
   order they appear on screen, and the keys match the Surveys sheet
   columns so nothing has to be translated on the way in. */
export const BRANDS = [
  { key: "habesha", label: "Habesha", ours: true },
  { key: "harar", label: "Harar" },
  { key: "dashen", label: "Dashen" },
  { key: "bedele", label: "Bedele" },
  { key: "stgeorge", label: "St. George" },
  { key: "meta", label: "Meta" },
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
const DONE_KEY = "surveys_done";
const ERROR_KEY = "offline_surveys_why";

export async function submitSurvey(payload) {
  const res = await postJson({ action: "addSurvey", ...payload });

  if (!res.ok || res.data?.status !== "success") {
    /* A BA standing in an outlet with no signal shouldn't lose a
       completed questionnaire. Keep it and push it on reconnect. */
    const why = res.message || res.data?.message || "The server rejected it.";
    queue(payload);
    try {
      localStorage.setItem(ERROR_KEY, why);
    } catch {
      /* Nothing to do — the queue still holds the survey. */
    }
    recordDone();
    return { ok: false, queued: true, message: why };
  }

  recordDone();
  return { ok: true };
}

/* A running tally of questionnaires finished on this phone, kept by
   day. Counted whether or not the upload landed, because from the BA's
   side the work is done either way and a counter that drops when the
   signal does reads like lost data. */
function recordDone() {
  try {
    const log = JSON.parse(localStorage.getItem(DONE_KEY)) || {};
    const today = new Date().toISOString().slice(0, 10);
    log[today] = (log[today] || 0) + 1;
    localStorage.setItem(DONE_KEY, JSON.stringify(log));
  } catch {
    /* The count is a convenience; never fail a submission over it. */
  }
}

export function doneToday() {
  try {
    const log = JSON.parse(localStorage.getItem(DONE_KEY)) || {};
    return log[new Date().toISOString().slice(0, 10)] || 0;
  } catch {
    return 0;
  }
}

export function doneAllTime() {
  try {
    const log = JSON.parse(localStorage.getItem(DONE_KEY)) || {};
    return Object.values(log).reduce((a, b) => a + (Number(b) || 0), 0);
  } catch {
    return 0;
  }
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
  let why = "";
  for (const item of q) {
    const res = await postJson({ action: "addSurvey", ...item });
    if (!res.ok || res.data?.status !== "success") {
      unsent.push(item);
      why = res.message || res.data?.message || "The server rejected it.";
    }
  }

  try {
    if (unsent.length === 0) {
      localStorage.removeItem(QUEUE_KEY);
      localStorage.removeItem(ERROR_KEY);
    } else {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(unsent));
      if (why) localStorage.setItem(ERROR_KEY, why);
    }
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

export function lastSurveyError() {
  try {
    return localStorage.getItem(ERROR_KEY) || "";
  } catch {
    return "";
  }
}
