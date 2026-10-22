import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HABESHA, HabeshaMark, Screen, TibebBand } from "../brand/HabeshaBrand";
import { useAuth } from "../context/AuthContext";
import {
  flushSurveyQueue,
  pendingSurveyCount,
  lastSurveyError,
} from "../services/surveyService";

/* ------------------------------------------------------------------
   What a BA is doing at this outlet. Two jobs share the app now, and
   they want different screens from the first tap — so the fork comes
   before anything else rather than hiding inside the home screen.
   ------------------------------------------------------------------ */
export default function ChooseActivityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pending, setPending] = useState(pendingSurveyCount());
  const [why, setWhy] = useState(lastSurveyError());

  /* Every BA passes through here, which makes it the natural place to
     push anything that was filled in while they were out of signal. */
  useEffect(() => {
    flushSurveyQueue().then(() => {
      setPending(pendingSurveyCount());
      setWhy(lastSurveyError());
    });
  }, []);

  const CARDS = [
    {
      to: "/home",
      icon: "🎯",
      title: "Gamification",
      sub: "Spin the wheel and register winners",
      tone: HABESHA.adey,
    },
    {
      to: "/survey",
      icon: "📋",
      title: "Survey",
      sub: "Market share study",
      tone: HABESHA.amber,
    },
  ];

  return (
    <Screen>
      <div className="relative z-10 flex-1 flex flex-col px-5 pt-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <HabeshaMark className="w-12" />
          <div className="text-right">
            <p className="habesha-eyebrow" style={{ color: `${HABESHA.cream}99` }}>
              Signed in as
            </p>
            <p className="habesha-display text-xl" style={{ color: HABESHA.amber }}>
              {user?.name || user?.username}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-5">
          <p
            className="habesha-eyebrow text-center mb-1"
            style={{ color: `${HABESHA.cream}88` }}
          >
            What are you doing today?
          </p>

          {CARDS.map((c, i) => (
            <button
              key={c.to}
              onClick={() => navigate(c.to)}
              className="habesha-lockup habesha-press choice-card w-full p-6 text-left"
              style={{
                background: HABESHA.cream,
                color: HABESHA.ink,
                animationDelay: `${120 + i * 110}ms`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex-none grid place-items-center rounded-2xl"
                  style={{ background: c.tone, width: 56, height: 56, fontSize: 26 }}
                >
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="habesha-display text-2xl"
                    style={{ lineHeight: 1.1 }}
                  >
                    {c.title}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: `${HABESHA.ink}99`, lineHeight: 1.3 }}
                  >
                    {c.sub}
                  </div>
                </div>
                <div
                  className="flex-none"
                  style={{ color: `${HABESHA.ink}55`, fontSize: 20 }}
                >
                  →
                </div>
              </div>
            </button>
          ))}

          {pending > 0 && (
            <div className="mt-1 text-center">
              <p className="text-xs" style={{ color: HABESHA.amber }}>
                {pending} survey{pending > 1 ? "s" : ""} waiting to upload
              </p>
              {why && (
                <p
                  className="text-xs mt-1 px-2"
                  style={{ color: `${HABESHA.cream}99`, lineHeight: 1.4 }}
                >
                  {why}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 opacity-70">
          <TibebBand height={22} />
        </div>
      </div>
    </Screen>
  );
}
