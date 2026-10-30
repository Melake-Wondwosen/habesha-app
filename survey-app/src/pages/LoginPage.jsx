import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import {
  HABESHA,
  HabeshaMark,
  HabeshaButton,
  Screen,
  TibebBand,
} from "../brand/HabeshaBrand";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Enter your username and password to continue.");
      return;
    }

    try {
      setLoading(true);
      const result = await loginUser(username, password);

      if (result.success) {
        login(result.user);
        navigate("/", { replace: true });
      } else {
        setError(result.message);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <div className="habesha-scroll flex-1 overflow-y-auto flex flex-col">
        <div className="m-auto w-full px-6 py-10">
          <div className="text-center mb-7">
            <HabeshaMark className="w-24 mx-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />

            <h1
              className="habesha-display text-4xl mt-5"
              style={{
                color: HABESHA.cream,
                textShadow: `3px 3px 0 ${HABESHA.ink}`,
              }}
            >
              Market share
              <br />
              study
            </h1>

            <p
              className="am text-lg mt-2"
              style={{ color: HABESHA.amber, fontWeight: 600 }}
            >
              የሚያረካ
            </p>
          </div>

          <div
            className="habesha-lockup p-6 pt-5"
            style={{ background: HABESHA.cream, color: HABESHA.ink }}
          >
            <div className="-mx-6 -mt-5 mb-5 overflow-hidden rounded-t-[18px]">
              <TibebBand height={30} ground={HABESHA.field} line={HABESHA.cream} />
            </div>

            <label className="block mb-4">
              <span
                className="habesha-eyebrow block mb-1.5"
                style={{ color: HABESHA.bronze }}
              >
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                className="habesha-field"
              />
            </label>

            <label className="block mb-5">
              <span
                className="habesha-eyebrow block mb-1.5"
                style={{ color: HABESHA.bronze }}
              >
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
                className="habesha-field"
              />
            </label>

            {error && (
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: HABESHA.bronze }}
              >
                {error}
              </p>
            )}

            <HabeshaButton onClick={handleLogin} disabled={loading} variant="gold">
              {loading ? "Signing in…" : "Sign in"}
            </HabeshaButton>
          </div>

          <p
            className="habesha-eyebrow text-center mt-6"
            style={{ color: `${HABESHA.cream}66` }}
          >
            Habesha Market Research
          </p>
        </div>
      </div>
    </Screen>
  );
}
