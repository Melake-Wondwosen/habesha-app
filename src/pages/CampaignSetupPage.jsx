import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HABESHA,
  HabeshaMark,
  HabeshaButton,
  TibebWash,
  SectionLabel,
  TibebBand,
} from "../brand/HabeshaBrand";

import {
  getActivePrizes,
  readCachedPrizes,
  FALLBACK_PRIZES,
} from "../services/prizeService";

import PrizeGlyph from "../components/PrizeGlyph";

import {
  BOTTLES_PER_CRATE,
  isBottlePrize,
  cratesToBottles,
  writePool,
} from "../services/bottleStock";

export default function CampaignSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const outlet = location.state?.outlet;

  const [prizes, setPrizes] = useState([]);
  const [customPrize, setCustomPrize] = useState("");
  const [crates, setCrates] = useState("");

  /* The catalogue comes from the sheet, so an admin can change what
     every BA sees without shipping a new build. Cached on the phone so
     setup still works with no signal. */
  const [catalogue, setCatalogue] = useState(
    () => (readCachedPrizes() || FALLBACK_PRIZES).filter((p) => p.active !== false)
  );
  const [catalogueState, setCatalogueState] = useState("loading");

  useEffect(() => {
    let live = true;
    getActivePrizes()
      .then((list) => {
        if (!live || !list.length) return;
        setCatalogue(list);
        setCatalogueState("live");
      })
      .catch(() => live && setCatalogueState("cached"));
    return () => {
      live = false;
    };
  }, []);

  const addPrize = (prizeName, defaultQty = 1, tier = "regular", weight = 10) => {
    const existing = prizes.find((p) => p.name === prizeName);
    if (existing) return;
    setPrizes([
      ...prizes,
      {
        name: prizeName,
        qty: Number(defaultQty) || 1,
        tier: tier === "main" ? "main" : "regular",
        weight: Number(weight) || 0,
      },
    ]);
  };

  const updateQty = (index, qty) => {
    const updated = [...prizes];
    updated[index].qty = Number(qty);
    setPrizes(updated);
  };

  const toggleTier = (index) => {
    setPrizes((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, tier: p.tier === "main" ? "regular" : "main" }
          : p
      )
    );
  };

  const removePrize = (index) => {
    const updated = [...prizes];
    updated.splice(index, 1);
    setPrizes(updated);
  };

  const addCustomPrize = () => {
    if (!customPrize.trim()) return;
    addPrize(customPrize.trim());
    setCustomPrize("");
  };

  const startCampaign = () => {
    if (prizes.length === 0) {
      alert("Add at least one prize before starting.");
      return;
    }
    if (prizes.some((p) => isBottlePrize(p.name))) {
      const bottles = cratesToBottles(crates);
      if (bottles <= 0) {
        alert("Enter how many crates of beer you have for this outlet.");
        return;
      }
      writePool(outlet.id, bottles);
    }

    localStorage.setItem(`campaign_${outlet.id}`, JSON.stringify(prizes));
    navigate(`/spin/${outlet.id}`, { state: { outlet } });
  };

  const isSelected = (name) => prizes.some((p) => p.name === name);

  const hasBeer = prizes.some((p) => isBottlePrize(p.name));
  const bottleTotal = cratesToBottles(crates);

  return (
    <div
      className="relative h-[100dvh] max-w-md mx-auto overflow-hidden flex flex-col"
      style={{
        background: `radial-gradient(110% 60% at 50% 0%, ${HABESHA.field} 0%, ${HABESHA.bronze} 55%, ${HABESHA.inkDeep} 100%)`,
        color: HABESHA.cream,
      }}
    >
      <TibebWash
        opacity={0.06}
        className="absolute pointer-events-none"
        style={{
          top: "-55%",
          left: "50%",
          width: "180%",
          height: "180%",
          transform: "translateX(-50%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 z-20 pointer-events-none opacity-85">
        <TibebBand height={17} />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-7 px-6 flex-none">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/home")}
            aria-label="Back to outlets"
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
          <div className="min-w-0">
            <h1
              className="habesha-display text-2xl"
              style={{ color: HABESHA.cream, textShadow: `3px 3px 0 ${HABESHA.ink}` }}
            >
              Campaign setup
            </h1>
            <p
              className="text-xs font-bold truncate mt-1"
              style={{ color: HABESHA.amber }}
            >
              {outlet?.name || "Unknown outlet"}
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling body */}
      <div className="habesha-scroll relative z-10 flex-1 overflow-y-auto px-6 pb-4 space-y-6">
        {/* Standard prizes */}
        <div>
          <SectionLabel>Trade materials</SectionLabel>
          {catalogueState === "cached" && (
            <p
              className="text-xs font-semibold mb-2.5"
              style={{ color: `${HABESHA.cream}AA` }}
            >
              Offline — showing the last list this phone downloaded.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {catalogue.map((item) => {
              const prize = item.name;
              const on = isSelected(prize);
              return (
                <button
                  key={prize}
                  onClick={() => addPrize(prize, item.qty, item.tier, item.weight)}
                  className="habesha-press py-3 px-2 rounded-xl font-extrabold text-xs"
                  style={{
                    background: on ? HABESHA.amber : HABESHA.cream,
                    color: HABESHA.ink,
                    boxShadow: `0 0 0 2px ${on ? HABESHA.field : HABESHA.gold}, 0 0 0 4px ${HABESHA.ink}`,
                  }}
                >
                  <PrizeGlyph
                    name={prize}
                    size={22}
                    tone={on ? HABESHA.gold : HABESHA.bronze}
                    className="block mx-auto mb-1"
                  />
                  {item.tier === "main" ? "★ " : ""}
                  {on ? `✓ ${prize}` : prize}
                </button>
              );
            })}
          </div>
        </div>

        {/* Beer stock — one number covers every bottle prize */}
        {hasBeer && (
          <div>
            <SectionLabel>Beer stock</SectionLabel>
            <div
              className="habesha-lockup-flat p-4"
              style={{ background: HABESHA.cream, color: HABESHA.ink }}
            >
              <label
                className="habesha-eyebrow block mb-2"
                style={{ color: HABESHA.bronze }}
              >
                Crates for this outlet
              </label>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={crates}
                onChange={(e) => setCrates(e.target.value)}
                placeholder="e.g. 5"
                className="habesha-field !py-2.5"
              />
              <p
                className="text-sm font-bold mt-3"
                style={{ color: bottleTotal > 0 ? HABESHA.bronze : `${HABESHA.ink}77` }}
              >
                {bottleTotal > 0
                  ? `${bottleTotal} bottles available (${BOTTLES_PER_CRATE} per crate)`
                  : `Each crate is ${BOTTLES_PER_CRATE} bottles.`}
              </p>
              <p
                className="text-xs font-semibold mt-2"
                style={{ color: `${HABESHA.ink}88` }}
              >
                One, two and three bottle wins all come out of this total. A
                prize drops off the wheel once there aren't enough left.
              </p>
            </div>
          </div>
        )}

        {/* Custom prize */}
        <div>
          <SectionLabel>Something else</SectionLabel>
          <div className="flex gap-2.5">
            <input
              value={customPrize}
              onChange={(e) => setCustomPrize(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomPrize()}
              placeholder="Name the prize"
              className="habesha-field flex-1 !py-3 !text-sm"
            />
            <button
              onClick={addCustomPrize}
              className="habesha-press px-5 rounded-xl habesha-display text-xs flex-none"
              style={{
                background: HABESHA.amber,
                color: HABESHA.ink,
                boxShadow: `0 0 0 2px ${HABESHA.gold}, 0 0 0 4px ${HABESHA.ink}`,
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Selected */}
        <div>
          <SectionLabel>On the wheel</SectionLabel>

          {prizes.length > 0 && (
            <p
              className="text-xs font-semibold mb-2.5"
              style={{ color: `${HABESHA.cream}AA` }}
            >
              Tap a prize's tier to change it for this outlet only.
            </p>
          )}

          {prizes.length === 0 ? (
            <div
              className="rounded-xl py-5 px-4 text-center"
              style={{ border: `2px dashed ${HABESHA.amber}66` }}
            >
              <p className="text-sm font-semibold" style={{ color: `${HABESHA.cream}CC` }}>
                Nothing on the wheel yet. Pick a prize above to add it.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {prizes.map((prize, index) => (
                <div
                  key={index}
                  className="habesha-lockup-flat p-4"
                  style={{ background: HABESHA.cream, color: HABESHA.ink }}
                >
                  <div className="flex justify-between items-center gap-3">
                    <PrizeGlyph
                      name={prize.name}
                      size={28}
                      tone={HABESHA.bronze}
                      className="flex-none"
                    />
                    <h4 className="habesha-display text-sm truncate flex items-center gap-1.5 flex-1">
                      {prize.tier === "main" && <span>★</span>}
                      {prize.name}
                    </h4>
                    <button
                      onClick={() => removePrize(index)}
                      className="habesha-eyebrow flex-none px-2.5 py-1.5 rounded-md"
                      style={{ background: HABESHA.field, color: HABESHA.cream }}
                    >
                      Remove
                    </button>
                  </div>

                  {isBottlePrize(prize.name) ? (
                    <p
                      className="text-xs font-semibold mt-3"
                      style={{ color: `${HABESHA.ink}99` }}
                    >
                      Drawn from your beer crates below.
                    </p>
                  ) : (
                    <div className="flex items-center gap-3 mt-3">
                      <span className="habesha-eyebrow" style={{ color: HABESHA.bronze }}>
                        Quantity
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={prize.qty}
                        onChange={(e) => updateQty(index, e.target.value)}
                        aria-label={`Quantity of ${prize.name}`}
                        className="habesha-field flex-1 !py-2 text-center"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <span className="habesha-eyebrow" style={{ color: HABESHA.bronze }}>
                      Tier
                    </span>
                    <button
                      onClick={() => toggleTier(index)}
                      aria-label={`Change tier for ${prize.name}`}
                      className="habesha-eyebrow ml-auto px-3 py-2 rounded-md"
                      style={{
                        background:
                          prize.tier === "main" ? HABESHA.field : `${HABESHA.ink}1A`,
                        color: prize.tier === "main" ? HABESHA.cream : HABESHA.ink,
                      }}
                    >
                      {prize.tier === "main" ? "★ Main prize" : "Regular prize"}
                    </button>
                  </div>

                  <p
                    className="text-xs font-semibold mt-2"
                    style={{ color: `${HABESHA.ink}99` }}
                  >
                    {prize.tier === "main"
                      ? "Winner fills in name and phone."
                      : "Winner just sees the message, then spin again."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky action */}
      <div
        className="relative z-10 p-6 pt-4 flex-none"
        style={{
          background: `linear-gradient(to top, ${HABESHA.inkDeep} 55%, transparent 100%)`,
        }}
      >
        <HabeshaButton onClick={startCampaign} className="!text-base">
          Start campaign →
        </HabeshaButton>
      </div>
    </div>
  );
}
