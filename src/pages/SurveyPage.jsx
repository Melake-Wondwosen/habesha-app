import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HABESHA,
  HabeshaMark,
  HabeshaButton,
  Screen,
  TibebBand,
} from "../brand/HabeshaBrand";
import { useAuth } from "../context/AuthContext";
import { BRANDS, REASONS, submitSurvey } from "../services/surveyService";

/* ------------------------------------------------------------------
   Habesha market share study.

   Four steps: which outlet, then the three questions. One screen per
   question — a BA is standing in a bar holding a phone, and a single
   scrolling wall of inputs is where that goes wrong.
   ------------------------------------------------------------------ */
const STEPS = ["Outlet", "Ranking", "Volume", "Performance"];

export default function SurveyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [outletName, setOutletName] = useState("");
  const [outletId, setOutletId] = useState("");

  const [ranks, setRanks] = useState({});       // brand key -> 1..n
  const [otherBrandName, setOtherBrandName] = useState("");
  const [crates, setCrates] = useState({});     // brand key -> number
  const [reason, setReason] = useState("");
  const [reasonOther, setReasonOther] = useState("");

  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  /* ---- Q1: tap to assign the next rank, tap again to release it.
     Simpler on a phone than drag-to-reorder, and it matches the paper
     form, where a brand you don't stock is simply left blank. ---- */
  const nextRank = Object.keys(ranks).length + 1;

  const toggleRank = (key) => {
    setRanks((prev) => {
      if (prev[key]) {
        /* Releasing one closes the gap, so ranks stay 1..n with no
           holes — otherwise the sheet ends up with a 1, a 3 and a 5. */
        const removed = prev[key];
        const next = {};
        Object.entries(prev).forEach(([k, v]) => {
          if (k === key) return;
          next[k] = v > removed ? v - 1 : v;
        });
        return next;
      }
      return { ...prev, [key]: nextRank };
    });
  };

  const setCrate = (key, raw) => {
    const n = raw === "" ? "" : Math.max(0, parseInt(raw, 10) || 0);
    setCrates((p) => ({ ...p, [key]: n }));
  };

  const canAdvance =
    (step === 0 && outletName.trim() && outletId.trim()) ||
    (step === 1 && Object.keys(ranks).length > 0) ||
    step === 2 ||
    (step === 3 && reason && (reason !== "Other" || reasonOther.trim()));

  const submit = async () => {
    setSaving(true);
    setNote("");

    const res = await submitSurvey({
      baId: user?.id,
      baName: user?.name || user?.username,
      outletId: outletId.trim(),
      outletName: outletName.trim(),
      ranks,
      crates,
      otherBrandName,
      reason,
      reasonOther: reason === "Other" ? reasonOther : "",
      date: new Date().toISOString(),
    });

    setSaving(false);

    if (res.ok) {
      setNote("Survey saved. Thank you.");
    } else if (res.queued) {
      setNote("No connection — saved on this phone and will upload later.");
    }
    setTimeout(() => navigate("/choose"), 1700);
  };

  return (
    <Screen>
      <div className="relative z-10 flex-1 flex flex-col px-5 pt-7 pb-8">
        {/* ---- header + progress ---- */}
        <div className="flex items-center gap-3 mb-5">
          <HabeshaMark className="w-10" />
          <div className="flex-1">
            <p className="habesha-eyebrow" style={{ color: `${HABESHA.cream}88` }}>
              Market share study
            </p>
            <p className="habesha-display text-lg" style={{ color: HABESHA.cream }}>
              {STEPS[step]}
            </p>
          </div>
          <button
            onClick={() => navigate("/choose")}
            className="rounded-full grid place-items-center"
            style={{
              width: 40,
              height: 40,
              color: HABESHA.cream,
              background: `${HABESHA.ink}99`,
              border: `1px solid ${HABESHA.amber}40`,
            }}
            aria-label="Leave the survey"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1.5 mb-6">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className="flex-1 rounded-full survey-tick"
              style={{
                height: 4,
                background: i <= step ? HABESHA.amber : `${HABESHA.cream}22`,
              }}
            />
          ))}
        </div>

        {/* ---- the step itself ---- */}
        <div key={step} className="flex-1 survey-step overflow-y-auto">
          {step === 0 && (
            <>
              <Prompt>Where are you?</Prompt>
              <Hint>
                Type the outlet exactly as it appears on the shop front and on
                your route sheet — these two fields are what ties every answer
                below to a place.
              </Hint>

              <label className="block mb-4 survey-item">
                <span
                  className="habesha-eyebrow block mb-1.5"
                  style={{ color: `${HABESHA.cream}99` }}
                >
                  Outlet name
                </span>
                <input
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  placeholder="e.g. Fiyel Bet"
                  autoComplete="off"
                  className="habesha-field w-full"
                />
              </label>

              <label className="block survey-item" style={{ animationDelay: "70ms" }}>
                <span
                  className="habesha-eyebrow block mb-1.5"
                  style={{ color: `${HABESHA.cream}99` }}
                >
                  Outlet ID
                </span>
                <input
                  value={outletId}
                  onChange={(e) => setOutletId(e.target.value.toUpperCase())}
                  placeholder="e.g. ADD-0142"
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="habesha-field w-full"
                />
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <Prompt>
                Rank the brands by sales, highest first.
              </Prompt>
              <Hint>
                Tap in order — first tap is rank 1. Leave anything you don't
                sell untapped. Tap again to undo.
              </Hint>

              <div className="space-y-3">
                {BRANDS.map((b, i) => {
                  const r = ranks[b.key];
                  return (
                    <div key={b.key} className="survey-item" style={{ animationDelay: `${i * 50}ms` }}>
                      <button
                        onClick={() => toggleRank(b.key)}
                        className="habesha-lockup-sm habesha-press w-full p-4 flex items-center gap-3 text-left"
                        style={{
                          background: r ? HABESHA.amber : HABESHA.cream,
                          color: HABESHA.ink,
                        }}
                      >
                        <span
                          className="flex-none grid place-items-center rounded-xl habesha-display"
                          style={{
                            width: 42,
                            height: 42,
                            fontSize: 18,
                            background: r ? HABESHA.ink : `${HABESHA.ink}12`,
                            color: r ? HABESHA.adey : `${HABESHA.ink}55`,
                          }}
                        >
                          {r || "–"}
                        </span>
                        <span className="habesha-display flex-1 text-lg">
                          {b.label}
                          {b.ours && (
                            <span
                              className="ml-2 text-[10px] align-middle px-1.5 py-0.5 rounded"
                              style={{ background: HABESHA.bronze, color: HABESHA.cream }}
                            >
                              OURS
                            </span>
                          )}
                        </span>
                      </button>

                      {b.isOther && r && (
                        <input
                          value={otherBrandName}
                          onChange={(e) => setOtherBrandName(e.target.value)}
                          placeholder="Which brand?"
                          className="habesha-field w-full mt-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Prompt>Crates purchased in a typical week</Prompt>
              <Hint>Leave blank for brands you don't buy.</Hint>

              <div className="space-y-3">
                {BRANDS.map((b, i) => (
                  <div
                    key={b.key}
                    className="habesha-lockup-sm p-3 flex items-center gap-3 survey-item"
                    style={{
                      background: HABESHA.cream,
                      color: HABESHA.ink,
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <span className="habesha-display flex-1 text-base pl-1">
                      {b.isOther && otherBrandName ? otherBrandName : b.label}
                    </span>

                    <Stepper
                      value={crates[b.key]}
                      onChange={(v) => setCrate(b.key, v)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Prompt>
                Main reason you sell less Habesha than other brands?
              </Prompt>

              <div className="space-y-3">
                {REASONS.map((r, i) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className="habesha-lockup-sm habesha-press w-full p-4 flex items-center gap-3 text-left survey-item"
                    style={{
                      background: reason === r ? HABESHA.amber : HABESHA.cream,
                      color: HABESHA.ink,
                      animationDelay: `${i * 45}ms`,
                    }}
                  >
                    <span
                      className="flex-none rounded-full"
                      style={{
                        width: 20,
                        height: 20,
                        border: `2px solid ${HABESHA.ink}`,
                        background: reason === r ? HABESHA.ink : "transparent",
                        boxShadow:
                          reason === r ? `inset 0 0 0 3px ${HABESHA.amber}` : "none",
                      }}
                    />
                    <span className="flex-1 text-sm font-semibold">{r}</span>
                  </button>
                ))}
              </div>

              {reason === "Other" && (
                <input
                  value={reasonOther}
                  onChange={(e) => setReasonOther(e.target.value)}
                  placeholder="Please specify"
                  className="habesha-field w-full mt-3"
                />
              )}
            </>
          )}
        </div>

        {/* ---- footer ---- */}
        {note && (
          <p
            className="text-center text-sm mb-3 survey-note"
            style={{ color: HABESHA.adey }}
          >
            {note}
          </p>
        )}

        <div className="flex gap-3 mt-5">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="habesha-press rounded-2xl px-5"
              style={{
                color: HABESHA.amber,
                border: `1px solid ${HABESHA.amber}55`,
                background: `${HABESHA.ink}88`,
              }}
            >
              Back
            </button>
          )}

          <div className="flex-1">
            {step < 3 ? (
              <HabeshaButton
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
                className="w-full"
              >
                Continue
              </HabeshaButton>
            ) : (
              <HabeshaButton
                onClick={submit}
                disabled={!canAdvance || saving}
                className="w-full"
              >
                {saving ? "Saving…" : "Submit survey"}
              </HabeshaButton>
            )}
          </div>
        </div>

        <div className="mt-5 opacity-60">
          <TibebBand height={20} />
        </div>
      </div>
    </Screen>
  );
}

/* ---------- small pieces ---------- */

function Prompt({ children }) {
  return (
    <h2
      className="habesha-display text-2xl mb-2"
      style={{ color: HABESHA.cream, textShadow: `2px 2px 0 ${HABESHA.inkDeep}` }}
    >
      {children}
    </h2>
  );
}

function Hint({ children }) {
  return (
    <p className="text-xs mb-4" style={{ color: `${HABESHA.cream}88` }}>
      {children}
    </p>
  );
}

/* Buttons rather than a bare number field: a BA counting crates in a
   dim bar shouldn't have to fight a numeric keypad, but can still type
   straight into it when the number is large. */
function Stepper({ value, onChange }) {
  const v = value === "" || value === undefined ? "" : Number(value);
  const bump = (d) => onChange(String(Math.max(0, (Number(v) || 0) + d)));

  return (
    <div className="flex items-center gap-2">
      <StepBtn onClick={() => bump(-1)} label="−" dim={!v} />
      <input
        inputMode="numeric"
        value={v}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="0"
        className="text-center habesha-display rounded-xl"
        style={{
          width: 58,
          padding: "8px 0",
          fontSize: 18,
          color: HABESHA.ink,
          background: `${HABESHA.ink}10`,
          border: `1px solid ${HABESHA.ink}22`,
        }}
      />
      <StepBtn onClick={() => bump(1)} label="+" />
    </div>
  );
}

function StepBtn({ onClick, label, dim }) {
  return (
    <button
      onClick={onClick}
      className="habesha-press rounded-xl habesha-display"
      style={{
        width: 40,
        height: 40,
        fontSize: 20,
        lineHeight: 1,
        color: HABESHA.cream,
        background: dim ? `${HABESHA.ink}55` : HABESHA.ink,
      }}
    >
      {label}
    </button>
  );
}
