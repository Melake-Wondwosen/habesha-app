import { API_URL, API_CONFIGURED } from "../config";

/* ------------------------------------------------------------------
   The main-prize gate.

   One main prize per crate of beer moved across the whole campaign.
   The count is campaign-wide, so it can't live on the device — two BAs
   in different cities share the same allowance, and the server is the
   only place that can arbitrate that.

   Because the count starts at zero, nothing main is reachable until the
   campaign has moved its first 24 bottles. That's what keeps the big
   prizes out of the opening spins.
   ------------------------------------------------------------------ */

export async function readMainGate() {
  if (!API_CONFIGURED) return { unlocked: false };
  try {
    const res = await fetch(`${API_URL}?action=mainGate&t=${Date.now()}`);
    const data = await res.json();
    return data?.success ? data : { unlocked: false };
  } catch {
    /* Offline or unreachable: fail closed. Handing out a main prize we
       can't account for is worse than making the BA spin again. */
    return { unlocked: false };
  }
}

/* Claims the slot. Returns false if another BA took it in the moment
   between reading the gate and landing on the prize — the wheel then
   re-draws from the regular prizes instead. */
export async function claimMainSlot() {
  if (!API_CONFIGURED) return false;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "claimMainSlot" }),
    });
    const data = await res.json();
    return Boolean(data?.granted);
  } catch {
    return false;
  }
}
