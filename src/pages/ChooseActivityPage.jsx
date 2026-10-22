import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HABESHA, HabeshaMark, Screen, TibebBand } from "../brand/HabeshaBrand";
import { useAuth } from "../context/AuthContext";
import { flushSurveyQueue, pendingSurveyCount } from "../services/surveyService";

/* ------------------------------------------------------------------
   What a BA is doing at this outlet. Two jobs share the app now, and
   they want different screens from the first tap — so the fork comes
   before anything else rather than hiding inside the home screen.
   ------------------------------------------------------------------ */
export default function ChooseActivityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pending = pendingSurveyCount();

  /* Every BA passes through here, which makes it the natural place to
     push anything that was filled in while they were out of signal. */
  useEffect(() => {
    flushSurveyQueue();
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
                <span
                  className="flex-none grid place-items-center rounded-2xl"
                  style={{ background: c.tone, width: 56, height: 56, fontSize: 26 }}
                >
                  {c.icon}
                </span>
                <span className="flex-1">
                  <span className="habesha-display block text-2xl">{c.title}</span>
                  <span
                    className="block text-sm mt-0.5"
                    style={{ color: `${HABESHA.ink}99` }}
                  >
                    {c.sub}
                  </span>
                </span>
                <span style={{ color: `${HABESHA.ink}55`, fontSize: 20 }}>→</span>
              </div>
            </button>
          ))}

          {pending > 0 && (
            <p className="text-center text-xs mt-1" style={{ color: HABESHA.amber }}>
              {pending} survey{pending > 1 ? "s" : ""} waiting to upload
            </p>
          )}
        </div>

        <div className="mt-6 opacity-70">
          <TibebBand height={22} />
        </div>
      </div>
    </Screen>
  );
}
