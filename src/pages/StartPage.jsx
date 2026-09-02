import { useNavigate } from "react-router-dom";
import {
  HABESHA,
  HabeshaMark,
  HabeshaButton,
  Screen,
  TibebBand,
  TibebField,
} from "../brand/HabeshaBrand";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <Screen>
      <TibebField
        opacity={0.16}
        className="absolute inset-x-0 pointer-events-none"
        style={{ top: "12%", height: "42%" }}
      />

      <div className="relative flex flex-col flex-1 px-6 pt-10 pb-8">
        {/* Hero: the mark, then the campaign line the whole thing is named for. */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <HabeshaMark
            className="w-40 max-w-full drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
            alt="የሚያረካ"
          />

          <p
            className="am mt-5 text-3xl"
            style={{
              color: HABESHA.amber,
              fontWeight: 700,
              textShadow: `3px 3px 0 ${HABESHA.inkDeep}`,
            }}
          >
            የሚያረካ
          </p>

          <div className="w-40 my-5">
            <TibebBand height={26} tiles={9} ground={HABESHA.amber} line={HABESHA.bronze} />
          </div>

          <h1
            className="habesha-display text-5xl text-center"
            style={{
              color: HABESHA.cream,
              textShadow: `4px 4px 0 ${HABESHA.ink}, 8px 8px 0 ${HABESHA.gold}`,
            }}
          >
            Habesha
            <br />
            Wheel
          </h1>

          <p
            className="mt-6 text-sm text-center max-w-[250px] leading-relaxed"
            style={{ color: HABESHA.amber, fontWeight: 600 }}
          >
            Set up an outlet, spin for a prize, register the winner on the spot.
          </p>
        </div>

        <HabeshaButton onClick={() => navigate("/login")}>Start →</HabeshaButton>

        <p
          className="habesha-eyebrow text-center mt-5"
          style={{ color: `${HABESHA.cream}88` }}
        >
          Trade Marketing · 21+
        </p>
      </div>
    </Screen>
  );
}
