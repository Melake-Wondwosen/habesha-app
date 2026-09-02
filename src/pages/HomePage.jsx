import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FaPlus, FaStore } from "react-icons/fa";
import { getOutlets, newestFirst } from "../services/outletService";
import { isAdmin } from "../components/AdminRoute";
import { pingPresence } from "../services/statsService";
import CampaignTagline from "../components/CampaignTagline";
import {
  HABESHA,
  HabeshaMark,
  Screen,
  SectionLabel,
} from "../brand/HabeshaBrand";

export default function HomePage() {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    /* Admins don't see the outlets list, so there's nothing to fetch. */
    if (isAdmin(user)) {
      setLoading(false);
      return;
    }

    const cached = localStorage.getItem(`outlets_${user.id}`);
    if (cached) setOutlets(newestFirst(JSON.parse(cached)));

    loadOutlets();
  }, [user]);

  /* Presence heartbeat — drives the "live BAs" figure on the regional
     manager dashboard. Fire-and-forget, never blocks the UI. */
  useEffect(() => {
    if (!user?.id) return;
    pingPresence(user.id);
    const timer = setInterval(() => pingPresence(user.id), 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [user]);

  async function loadOutlets() {
    try {
      const data = await getOutlets(user.id);
      setOutlets(data);
      localStorage.setItem(`outlets_${user.id}`, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to load outlets:", error);
    } finally {
      setLoading(false);
    }
  }

  const openOutlet = (outlet) => {
    const existingCampaign = localStorage.getItem(`campaign_${outlet.id}`);
    if (existingCampaign) {
      const parsed = JSON.parse(existingCampaign);
      const hasRemainingPrizes = parsed.some((p) => p.qty > 0);
      if (hasRemainingPrizes) {
        navigate(`/spin/${outlet.id}`, { state: { outlet } });
        return;
      }
    }
    navigate(`/campaign/${outlet.id}`, { state: { outlet } });
  };

  return (
    <Screen>
      <div className="flex flex-col flex-1 px-5 pt-8 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-7">
          <HabeshaMark className="w-14 drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]" />
          <div className="text-right">
            <p className="habesha-eyebrow" style={{ color: `${HABESHA.cream}99` }}>
              Signed in as
            </p>
            <h2
              className="habesha-display text-lg mt-1"
              style={{ color: HABESHA.amber }}
            >
              {user?.username}
            </h2>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <h1
            className="habesha-display text-4xl"
            style={{ color: HABESHA.cream, textShadow: `3px 3px 0 ${HABESHA.ink}` }}
          >
            Welcome
            <br />
            back
          </h1>
          {/* A different campaign line every sign-in. */}
          <CampaignTagline className="mt-4" style={{ maxWidth: "22rem" }} />
        </div>

        {!isAdmin(user) && <SectionLabel>My outlets</SectionLabel>}

        <div className="space-y-4">
          {!isAdmin(user) && loading && (
            <p
              className="text-center py-6 text-sm font-semibold"
              style={{ color: `${HABESHA.cream}99` }}
            >
              Loading outlets…
            </p>
          )}

          {!isAdmin(user) && !loading && outlets.length === 0 && (
            <div
              className="habesha-lockup-flat text-center py-7 px-5"
              style={{ background: `${HABESHA.inkDeep}CC` }}
            >
              <p className="habesha-display text-base" style={{ color: HABESHA.cream }}>
                No outlets yet
              </p>
              <p className="text-sm mt-2" style={{ color: HABESHA.amber }}>
                Add your first outlet to start a campaign.
              </p>
            </div>
          )}

          {/* The list scrolls inside a fixed window — roughly four cards
              tall — so "Add an outlet" stays reachable no matter how many
              outlets a BA has registered. */}
          {!isAdmin(user) && outlets.length > 0 && (
          <div
            className="habesha-scroll overflow-y-auto space-y-4 -mx-2 pl-2 pr-3 py-1"
            style={{
              maxHeight: "23rem",
              overscrollBehavior: "contain",
            }}
          >
          {outlets.map((outlet) => (
            <button
              key={outlet.id}
              onClick={() => openOutlet(outlet)}
              className="habesha-lockup-sm habesha-press w-full text-left p-4 flex items-center gap-4"
              style={{ background: HABESHA.cream, color: HABESHA.ink }}
            >
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-none"
                style={{ background: HABESHA.field, color: HABESHA.cream }}
              >
                <FaStore />
              </span>
              <span className="min-w-0">
                <span
                  className="habesha-display text-base block truncate"
                  style={{ color: HABESHA.ink }}
                >
                  {outlet.name}
                </span>
                <span
                  className="text-sm font-semibold block truncate"
                  style={{ color: HABESHA.bronze }}
                >
                  {outlet.city}
                </span>
              </span>
            </button>
          ))}
          </div>
          )}

          {/* Add outlet — field work, not an admin task */}
          {!isAdmin(user) && (
          <button
            onClick={() => navigate("/add-outlet")}
            className="habesha-press w-full rounded-2xl p-5 text-center"
            style={{
              background: "transparent",
              border: `3px dashed ${HABESHA.amber}`,
              color: HABESHA.amber,
            }}
          >
            <FaPlus className="mx-auto text-xl mb-2" />
            <span className="habesha-display text-base block">Add an outlet</span>
            <span className="text-xs font-semibold block mt-1 opacity-80">
              Register a new shop or bar
            </span>
          </button>
          )}

          {isAdmin(user) && (
            <>
              <SectionLabel>Admin</SectionLabel>

              {[
                {
                  to: "/admin/prizes",
                  icon: "🎁",
                  title: "Wheel prizes",
                  blurb: "Stock levels and prize tiers",
                },
                {
                  to: "/admin/preview",
                  icon: "▶️",
                  title: "Preview animations",
                  blurb: "Test what a consumer sees when they win",
                },
                {
                  to: "/admin/cities",
                  icon: "📍",
                  title: "Cities",
                  blurb: "What BAs pick when adding an outlet",
                },
                {
                  to: "/admin/users",
                  icon: "👥",
                  title: "Users",
                  blurb: "Usernames, passwords and roles",
                },
                {
                  to: "/admin/theme",
                  icon: "🎨",
                  title: "Appearance",
                  blurb: "Switch the app's look for everyone",
                },
                {
                  to: "/admin/analytics",
                  icon: "📊",
                  title: "National analytics",
                  blurb: "Reach and prizes across every division",
                },
              ].map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className="habesha-lockup-sm habesha-press w-full p-4 flex items-center gap-4 text-left"
                  style={{ background: HABESHA.amber, color: HABESHA.ink }}
                >
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-none"
                    style={{ background: HABESHA.ink, fontSize: 19 }}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="habesha-display text-sm block">{item.title}</span>
                    <span
                      className="text-xs font-semibold block mt-0.5"
                      style={{ color: HABESHA.bronze }}
                    >
                      {item.blurb}
                    </span>
                  </span>
                  <span
                    className="habesha-display flex-none"
                    style={{ color: `${HABESHA.ink}66`, fontSize: 17 }}
                  >
                    →
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="habesha-press w-full mt-8 py-3.5 rounded-xl habesha-display text-sm"
          style={{
            background: "transparent",
            border: `2px solid ${HABESHA.cream}55`,
            color: `${HABESHA.cream}CC`,
          }}
        >
          Sign out
        </button>
      </div>
    </Screen>
  );
}
