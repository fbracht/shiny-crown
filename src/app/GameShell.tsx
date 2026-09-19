import { useEffect, useRef, useState } from "react";
import { roleRefs } from "./session/roles";
import { useSession } from "./session/SessionContext";
import { boundaryHasChanges } from "./session/reducer";
import { exportBackup, importBackup } from "./session/serialization";
import { phaseCopy } from "../content/en/phases";
import { phaseRegistry } from "../flow/phaseRegistry";
import { ClimateSelector } from "../components/ClimateSelector";
import { RoleEditor } from "../components/RoleEditor";

type GameShellProps = {
  onHome: () => void;
};

function showDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function UtilityDialog({
  dialogRef,
  title,
  children,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <dialog className="utility-dialog" ref={dialogRef}>
      <header>
        <h2>{title}</h2>
        <button
          aria-label={`Close ${title}`}
          onClick={() => closeDialog(dialogRef.current)}
          type="button"
        >
          Close
        </button>
      </header>
      {children}
    </dialog>
  );
}

function RoleSheet({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const { session, dispatch } = useSession();
  return (
    <UtilityDialog dialogRef={dialogRef} title="Role ledger">
      <p className="dialog-intro">
        Correct availability and occupants here. Structural actions still belong beside the rule
        that causes them.
      </p>
      <div className="role-ledger__grid">
        {roleRefs().map((role) => (
          <RoleEditor key={role} role={role} />
        ))}
      </div>
      {session.twoPlayer ? (
        <fieldset className="segmented-field">
          <legend>Player Button</legend>
          <div>
            {(["human-1", "human-2"] as const).map((holder) => (
              <button
                aria-pressed={session.twoPlayer?.buttonHolder === holder}
                key={holder}
                onClick={() => dispatch({ type: "transfer-button", holder })}
                type="button"
              >
                {holder === "human-1" ? "Human 1" : "Human 2"}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
    </UtilityDialog>
  );
}

function BackupSheet({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const { session, dispatch } = useSession();
  const [importCode, setImportCode] = useState("");
  const [message, setMessage] = useState("");
  const backup = exportBackup(session);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(backup);
      setMessage("Backup copied.");
    } catch {
      setMessage("Copy was blocked. Select the code and copy it manually.");
    }
  };

  const restore = () => {
    const result = importBackup(importCode);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    dispatch({ type: "restore-session", session: result.session });
    setImportCode("");
    setMessage("Backup restored.");
  };

  return (
    <UtilityDialog dialogRef={dialogRef} title="Backup and restore">
      <section className="backup-section">
        <label htmlFor="export-code">Current backup code</label>
        <textarea id="export-code" readOnly rows={5} value={backup} />
        <button className="button button--primary" onClick={() => void copy()} type="button">
          Copy backup
        </button>
      </section>
      <section className="backup-section">
        <label htmlFor="import-code">Restore code</label>
        <textarea
          aria-describedby="backup-message"
          id="import-code"
          onChange={(event) => {
            setImportCode(event.target.value);
            setMessage("");
          }}
          placeholder="SC1.…"
          rows={5}
          value={importCode}
        />
        <button disabled={!importCode.trim()} onClick={restore} type="button">
          Validate and restore
        </button>
      </section>
      <p aria-live="polite" className="dialog-message" id="backup-message">
        {message}
      </p>
    </UtilityDialog>
  );
}

function NavigationControls() {
  const { session, dispatch } = useSession();
  const backDialog = useRef<HTMLDialogElement>(null);
  const phaseId = session.progress.phaseId;

  const back = () => {
    if (boundaryHasChanges(session)) showDialog(backDialog.current);
    else dispatch({ type: "back", mode: "keep-current" });
  };

  const nextControls = () => {
    if (phaseId === "game.scoring") return null;
    if (phaseId === "round.upkeep-refresh") {
      return (
        <div className="navigation__choices">
          <button
            className="button button--primary"
            onClick={() =>
              dispatch({ type: "advance", intent: { type: "finish-upkeep", finalTurn: false } })
            }
            type="button"
          >
            Next turn
          </button>
          <button
            onClick={() =>
              dispatch({ type: "advance", intent: { type: "finish-upkeep", finalTurn: true } })
            }
            type="button"
          >
            Final turn
          </button>
        </div>
      );
    }
    if (phaseId === "round.bonuses" && session.deregulated) {
      return (
        <div className="navigation__choices">
          <button
            className="button button--primary"
            onClick={() =>
              dispatch({ type: "advance", intent: { type: "firms-present", present: true } })
            }
            type="button"
          >
            Firm revenue
          </button>
          <button
            onClick={() =>
              dispatch({ type: "advance", intent: { type: "firms-present", present: false } })
            }
            type="button"
          >
            No firms
          </button>
        </div>
      );
    }
    return (
      <button
        className="button button--primary"
        onClick={() => dispatch({ type: "advance", intent: { type: "ordinary" } })}
        type="button"
      >
        Next
      </button>
    );
  };

  return (
    <>
      <nav aria-label="Phase navigation" className="navigation">
        <button disabled={session.history.length === 0} onClick={back} type="button">
          Back
        </button>
        {nextControls()}
      </nav>
      <UtilityDialog dialogRef={backDialog} title="Return to the previous phase">
        <p className="dialog-intro">
          Game state changed after this boundary. Choose whether those changes remain in the
          physical game record.
        </p>
        <div className="dialog-actions dialog-actions--stacked">
          <button
            className="button button--primary"
            onClick={() => {
              dispatch({ type: "back", mode: "keep-current" });
              closeDialog(backDialog.current);
            }}
            type="button"
          >
            Keep current state
          </button>
          <button
            onClick={() => {
              dispatch({ type: "back", mode: "restore-boundary" });
              closeDialog(backDialog.current);
            }}
            type="button"
          >
            Restore boundary
          </button>
        </div>
      </UtilityDialog>
    </>
  );
}

export function GameShell({ onHome }: GameShellProps) {
  const { session, dispatch } = useSession();
  const roleDialog = useRef<HTMLDialogElement>(null);
  const backupDialog = useRef<HTMLDialogElement>(null);
  const endDialog = useRef<HTMLDialogElement>(null);
  const Phase = phaseRegistry[session.progress.phaseId];
  const title = phaseCopy[session.progress.phaseId].title;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [session.progress.phaseId]);

  return (
    <div className="app-shell">
      <aside className="app-rail" aria-label="Session position">
        <button className="app-rail__brand" onClick={onHome} type="button">
          Shiny Crown
        </button>
        <span className="app-rail__position">Turn {session.turn}</span>
      </aside>

      <header className="app-header">
        <div className="app-header__mast">
          <button className="wordmark" onClick={onHome} type="button">
            Shiny Crown
          </button>
          <p>
            {session.mode === "solo" ? "Solo" : "Two players"} · {session.scenario} · Turn{" "}
            {session.turn}
          </p>
        </div>
        <ClimateSelector
          compact
          value={session.climate}
          onChange={(climate) => dispatch({ type: "set-climate", climate })}
        />
        <nav aria-label="Session tools" className="app-header__tools">
          <button onClick={() => showDialog(roleDialog.current)} type="button">
            Roles
          </button>
          <button onClick={() => showDialog(backupDialog.current)} type="button">
            Backup
          </button>
          <button onClick={() => showDialog(endDialog.current)} type="button">
            End game
          </button>
        </nav>
      </header>

      <main className="app-main" id="main-content" tabIndex={-1}>
        <p className="phase-position" aria-label={`Current phase: ${title}`}>
          Turn {session.turn} · {title}
        </p>
        <Phase />
      </main>

      <NavigationControls />
      <RoleSheet dialogRef={roleDialog} />
      <BackupSheet dialogRef={backupDialog} />
      <UtilityDialog dialogRef={endDialog} title="End the game">
        <p className="dialog-intro">
          Choose the physical reason that sends this session to scoring.
        </p>
        <div className="dialog-actions dialog-actions--stacked">
          <button
            onClick={() => {
              dispatch({ type: "end-game", reason: "scenario-end" });
              closeDialog(endDialog.current);
            }}
            type="button"
          >
            Scenario ended
          </button>
          <button
            className="button button--danger"
            onClick={() => {
              dispatch({ type: "end-game", reason: "company-failure" });
              closeDialog(endDialog.current);
            }}
            type="button"
          >
            Company failed
          </button>
        </div>
      </UtilityDialog>
    </div>
  );
}
