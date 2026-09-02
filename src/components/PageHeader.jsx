import { useNavigate } from "react-router-dom";
import { HABESHA, HabeshaMark } from "../brand/HabeshaBrand";

/* Every screen below the home page gets one of these, so there's always
   a way back without relying on the device back button. */
export default function PageHeader({ title, subtitle, to = "/home" }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(to)}
        aria-label="Back to home"
        className="habesha-press flex-none w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: HABESHA.cream,
          color: HABESHA.ink,
          boxShadow: `0 0 0 2px ${HABESHA.gold}, 0 0 0 4px ${HABESHA.ink}`,
          fontSize: 18,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        ←
      </button>

      <HabeshaMark className="w-10 flex-none" />

      <div className="min-w-0 flex-1">
        <h1
          className="habesha-display text-xl truncate"
          style={{ color: HABESHA.cream, textShadow: `2px 2px 0 ${HABESHA.ink}` }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-xs font-bold mt-0.5 truncate"
            style={{ color: HABESHA.amber }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
