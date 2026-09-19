import { useState } from "react";
import { createInitialSession } from "./session/factories";
import type { GameSessionV1 } from "./session/types";
import { importBackup } from "./session/serialization";

type LandingScreenProps = {
  savedSession: GameSessionV1 | null;
  loadError: string | null;
  onOpen: (session: GameSessionV1) => void;
};

export function LandingScreen({ savedSession, loadError, onOpen }: LandingScreenProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const start = (mode: "solo" | "two-player") => {
    if (savedSession && !window.confirm("Start a new game and replace the current browser save?"))
      return;
    onOpen(createInitialSession(mode));
  };

  const restore = () => {
    const result = importBackup(code);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage("");
    onOpen(result.session);
  };

  return (
    <main className="landing">
      <header className="landing__mast">
        <p className="landing__edition">A Crown procedure companion</p>
        <h1>Shiny Crown</h1>
        <p>John Company: Second Edition · solo and two players</p>
      </header>

      {loadError ? (
        <aside className="recovery-note" role="alert">
          <strong>The browser save could not be opened.</strong>
          <span>{loadError} Its raw data has been preserved for recovery.</span>
        </aside>
      ) : null}

      <section className="landing__actions" aria-label="Start or resume">
        {savedSession ? (
          <button className="resume-action" onClick={() => onOpen(savedSession)} type="button">
            <span>Resume</span>
            <small>
              {savedSession.mode === "solo" ? "Solo" : "Two players"} · {savedSession.scenario} ·
              Turn {savedSession.turn}
            </small>
          </button>
        ) : null}
        <button className="new-action" onClick={() => start("solo")} type="button">
          <span>New solo game</span>
          <small>All five sourced difficulties</small>
        </button>
        <button className="new-action" onClick={() => start("two-player")} type="button">
          <span>New two-player game</span>
          <small>Easy through Expert</small>
        </button>
      </section>

      <section className="landing__restore">
        <div>
          <h2>Restore a session</h2>
          <p>
            Paste a Shiny Crown backup. The current save changes only after complete validation.
          </p>
        </div>
        <label htmlFor="landing-import">Backup code</label>
        <textarea
          aria-describedby="landing-import-message"
          id="landing-import"
          onChange={(event) => {
            setCode(event.target.value);
            setMessage("");
          }}
          placeholder="SC1.…"
          rows={4}
          value={code}
        />
        <button disabled={!code.trim()} onClick={restore} type="button">
          Validate and restore
        </button>
        <p aria-live="polite" className="dialog-message" id="landing-import-message">
          {message}
        </p>
      </section>

      <footer className="landing__colophon">
        <p>
          Client-side only. Automatic browser save. Portable backups. Rule guidance remains tied to
          the supplied source map; the physical board is authoritative.
        </p>
      </footer>
    </main>
  );
}
