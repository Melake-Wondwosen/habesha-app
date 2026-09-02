import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { HABESHA, HabeshaButton, Screen, SectionLabel } from "../brand/HabeshaBrand";
import PageHeader from "../components/PageHeader";
import { getSettings, saveSettings } from "../services/settingsService";
import { THEMES, applyTheme, cachedTheme } from "../theme/useTheme";

export default function AdminThemePage() {
  const { user } = useAuth();

  const [selected, setSelected] = useState(cachedTheme());
  const [published, setPublished] = useState(cachedTheme());
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getSettings()
      .then((s) => {
        const t = s?.theme || "poster";
        setSelected(t);
        setPublished(t);
        applyTheme(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Preview immediately on tap — the whole app re-skins live, so the
     choice can be judged against real screens rather than a swatch. */
  const preview = (key) => {
    setSelected(key);
    applyTheme(key);
    setNotice("");
  };

  const publish = async () => {
    setError("");
    setNotice("");

    if (!password.trim()) {
      setError("Enter your password to publish.");
      return;
    }

    try {
      setSaving(true);
      await saveSettings({ theme: selected }, user?.username, password.trim());
      setPublished(selected);
      setPassword("");
      setNotice("Published. Everyone gets this look next time they open the app.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const revert = () => {
    setSelected(published);
    applyTheme(published);
    setNotice("");
  };

  const dirty = selected !== published;

  return (
    <Screen>
      <div className="flex flex-col flex-1 px-5 pt-8 pb-10">
        <PageHeader
          title="Appearance"
          subtitle={`Live: ${
            THEMES.find((t) => t.key === published)?.name || "Poster"
          }`}
          to="/home"
        />

        {notice && (
          <div
            className="habesha-lockup-flat px-4 py-3 mb-4 text-sm font-semibold"
            style={{ background: HABESHA.amber, color: HABESHA.ink }}
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="habesha-lockup-flat px-4 py-3 mb-4 text-sm font-semibold"
            style={{ background: HABESHA.ink, color: HABESHA.amber }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p
            className="text-center py-10 text-sm font-semibold"
            style={{ color: `${HABESHA.cream}AA` }}
          >
            Loading…
          </p>
        ) : (
          <>
            <SectionLabel>Choose a look</SectionLabel>
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: `${HABESHA.cream}99` }}
            >
              Tap to preview it here first. Nothing changes for anyone else
              until you publish.
            </p>

            <div className="space-y-3">
              {THEMES.map((t) => {
                const on = selected === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => preview(t.key)}
                    className="habesha-lockup-sm habesha-press w-full p-4 flex items-center gap-4 text-left"
                    style={{
                      background: on ? HABESHA.amber : HABESHA.cream,
                      color: HABESHA.ink,
                    }}
                  >
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-none habesha-display"
                      style={{
                        background: HABESHA.ink,
                        color: HABESHA.amber,
                        fontSize: 17,
                      }}
                    >
                      {on ? "✓" : t.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="habesha-display text-sm block">
                        {t.name}
                        {t.key === published && " · live"}
                      </span>
                      <span
                        className="text-xs font-semibold block mt-0.5"
                        style={{ color: HABESHA.bronze }}
                      >
                        {t.blurb}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {dirty && (
              <button
                onClick={revert}
                className="habesha-eyebrow w-full mt-3 py-2"
                style={{ color: `${HABESHA.cream}AA` }}
              >
                Undo preview
              </button>
            )}

            <div className="mt-8">
              <SectionLabel>Publish</SectionLabel>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`Confirm as ${user?.username || "you"}`}
                autoComplete="current-password"
                className="habesha-field mb-4"
              />
              <HabeshaButton
                onClick={publish}
                disabled={saving || !dirty}
                className="!text-base"
              >
                {saving
                  ? "Publishing…"
                  : dirty
                  ? "Publish this look"
                  : "Already live"}
              </HabeshaButton>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
