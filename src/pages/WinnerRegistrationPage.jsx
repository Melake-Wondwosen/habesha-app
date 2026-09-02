import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { getWinMessage, fillTemplate } from "../services/settingsService";
import { useAuth } from "../context/AuthContext";
import {
  HABESHA,
  HabeshaMark,
  HabeshaButton,
  TibebWash,
  TibebBand,
} from "../brand/HabeshaBrand";

export default function WinnerRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { outlet, prize, outletId, spinId } = location.state || {};
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [winMessage, setWinMessage] = useState(
    "Congratulations! You've won {prize} 🎉"
  );

  useEffect(() => {
    getWinMessage().then(setWinMessage);
  }, []);

  useEffect(() => {
    const already = localStorage.getItem(`spin_done_${spinId}`);
    if (already) {
      alert("This spin is already registered.");
      navigate(`/spin/${outletId}`);
    }
  }, []);

  const submit = async () => {
    if (!fullName.trim()) {
      alert("Enter the winner's name.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        action: "addWinner",
        outletId,
        outletName: outlet?.name,
        prize,
        tier: "main",
        baId: user?.id,
        fullName,
        phone: "",
        age: "",
        gender,
        date: new Date().toISOString(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to save winner");
      }

      const campaign = JSON.parse(localStorage.getItem(`campaign_${outletId}`));

      const updated = campaign
        .map((item) =>
          item.name === prize ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0);

      localStorage.setItem(`campaign_${outletId}`, JSON.stringify(updated));

      if (updated.length === 0) {
        alert("Every prize has been handed out. Campaign complete.");
        navigate("/home");
        return;
      }

      alert("Winner registered 🎉");
      navigate(`/spin/${outletId}`, { state: { outlet } });
    } catch (err) {
      console.error(err);
      alert("Could not save the winner. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, node) => (
    <div>
      <label className="habesha-eyebrow block mb-2" style={{ color: HABESHA.amber }}>
        {label}
      </label>
      {node}
    </div>
  );

  return (
    <div
      className="relative h-[100dvh] max-w-md mx-auto overflow-hidden flex flex-col"
      style={{
        background: HABESHA.inkDeep,
        color: HABESHA.cream,
      }}
    >
      {/* Same campaign backdrop as the shared Screen shell. */}
      <div className="habesha-backdrop" aria-hidden="true" />

      <TibebWash
        opacity={0.3}
        className="absolute pointer-events-none"
        style={{
          top: "-60%",
          left: "50%",
          width: "190%",
          height: "190%",
          transform: "translateX(-50%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 z-20 pointer-events-none opacity-85">
        <TibebBand height={28} />
      </div>

      {/* Header — the prize is the headline */}
      <div className="relative z-10 pt-7 px-6 flex-none flex flex-col items-center text-center">
        <button
          onClick={() => navigate(`/spin/${outletId}`, { state: { outlet } })}
          aria-label="Back to the wheel"
          className="habesha-press absolute left-6 top-7 w-10 h-10 rounded-xl flex items-center justify-center"
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

        <HabeshaMark className="w-16 mb-3 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]" />

        <p className="habesha-eyebrow" style={{ color: HABESHA.amber }}>
          🎉 Winner
        </p>
        <h1
          className="habesha-display text-3xl mt-2"
          style={{
            color: HABESHA.cream,
            textShadow: `3px 3px 0 ${HABESHA.ink}, 6px 6px 0 ${HABESHA.gold}`,
          }}
        >
          {fillTemplate(winMessage, prize || "a prize")}
        </h1>
        <div className="w-32 mt-4">
          <TibebBand height={24} tiles={8} ground={HABESHA.amber} line={HABESHA.bronze} />
        </div>
      </div>

      {/* Form */}
      <div className="habesha-scroll relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {field(
          "Full name",
          <input
            placeholder="As it appears on their ID"
            className="habesha-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        )}

        {field(
          "Gender",
          <select
            className="habesha-field"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        )}

        <p className="text-xs font-semibold pt-1" style={{ color: `${HABESHA.cream}AA` }}>
          Prizes go to people aged 21 and over. Check their ID before you confirm.
        </p>
      </div>

      {/* Sticky action */}
      <div
        className="relative z-10 p-6 pt-4 flex-none"
        style={{
          background: `linear-gradient(to top, ${HABESHA.inkDeep} 55%, transparent 100%)`,
        }}
      >
        <HabeshaButton onClick={submit} disabled={loading} className="!text-base">
          {loading ? "Saving…" : "Confirm the win →"}
        </HabeshaButton>
      </div>
    </div>
  );
}
