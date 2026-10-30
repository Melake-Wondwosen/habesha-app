import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HABESHA,
  HabeshaButton,
  HabeshaMark,
  Screen,
  SectionLabel,
  TibebBand,
} from "../brand/HabeshaBrand";
import { useAuth } from "../context/AuthContext";
import {
  doneAllTime,
  doneToday,
  flushSurveyQueue,
  lastSurveyError,
  pendingSurveyCount,
} from "../services/surveyService";

export default function SurveyHomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [pending, setPending] = useState(pendingSurveyCount());
  const [why, setWhy] = useState(lastSurveyError());
  const [syncing, setSyncing] = useState(false);

  const today = doneToday();
  const total = doneAllTime();

  /* Anything filled in without signal goes up when the app opens. */
  useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sync() {
    setSyncing(true);
    await flushSurveyQueue();
    setPending(pendingSurveyCount());
    setWhy(lastSurveyError());
    setSyncing(false);
  }

  return (
    <Screen>
      <div className="relative z-10 flex-1 flex flex-col px-5 pt-9 pb-10">
        <div className="flex items-center justify-between mb-7">
          <HabeshaMark className="w-12" />
          <div className="text-right">
            <p className="habesha-eyebrow" style={{ color: `${HABESHA.cream}99` }}>
              Signed in as
            </p>
            <p className="habesha-display text-lg" style={{ color: HABESHA.amber }}>
              {user?.name || user?.username}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1
            className="habesha-display text-3xl mb-1"
            style={{
              color: HABESHA.cream,
              textShadow: `3px 3px 0 ${HABESHA.inkDeep}`,
            }}
          >
            Market share
            <br />
            study
          </h1>
          <p className="text-sm mb-7" style={{ color: `${HABESHA.cream}88` }}>
            Three questions per outlet. Takes about a minute.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-7">
            <Stat label="Today" value={today} />
            <Stat label="All time" value={total} />
          </div>

          <HabeshaButton onClick={() => navigate("/new")} variant="gold">
            Start a survey
          </HabeshaButton>

          {pending > 0 && (
            <div
              className="habesha-lockup-sm mt-5 p-4"
              style={{ background: `${HABESHA.ink}CC` }}
            >
              <SectionLabel>Waiting to upload</SectionLabel>
              <p className="text-sm" style={{ color: HABESHA.cream }}>
                {pending} survey{pending > 1 ? "s" : ""} saved on this phone.
              </p>
              {why && (
                <p
                  className="text-xs mt-1.5"
                  style={{ color: `${HABESHA.cream}99`, lineHeight: 1.45 }}
                >
                  {why}
                </p>
              )}
              <button
                onClick={sync}
                disabled={syncing}
                className="habesha-press habesha-eyebrow mt-3 px-4 py-2 rounded-lg disabled:opacity-50"
                style={{ background: HABESHA.amber, color: HABESHA.ink }}
              >
                {syncing ? "Trying…" : "Try again"}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="habesha-press habesha-eyebrow mt-6 py-3 rounded-xl"
          style={{
            color: HABESHA.amber,
            border: `1px solid ${HABESHA.amber}44`,
            background: `${HABESHA.ink}66`,
          }}
        >
          Sign out
        </button>

        <div className="mt-5 opacity-60">
          <TibebBand height={22} />
        </div>
      </div>
    </Screen>
  );
}

function Stat({ label, value }) {
  return (
    <div
      className="habesha-lockup-sm p-4 text-center"
      style={{ background: HABESHA.cream, color: HABESHA.ink }}
    >
      <p className="habesha-display text-3xl">{value}</p>
      <p className="habesha-eyebrow mt-1" style={{ color: HABESHA.bronze }}>
        {label}
      </p>
    </div>
  );
}
