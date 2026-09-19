import { useState } from "react";
import { getRole, roleRefs, ROLE_LABELS } from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import {
  DIFFICULTIES,
  SCENARIOS,
  isPresidencyPhaseState,
  type PhaseId,
  type PresidencyActionId,
  type RoleRef,
} from "../app/session/types";
import { ClimateSelector } from "../components/ClimateSelector";
import { PhaseFrame } from "../components/PhaseFrame";
import { RoleEditor } from "../components/RoleEditor";
import { applicableCopy, phaseCopy } from "../content/en/phases";

const scenarioLabels = {
  "1710": "1710",
  "1758": "1758",
  "1813": "1813",
  "long-1710": "Long 1710",
} as const;

const roleByPhase: Partial<Record<PhaseId, RoleRef>> = {
  "round.chairman": "chairman",
  "round.shipping": "managerOfShipping",
  "round.military-affairs": "militaryAffairs",
  "round.china": "superintendentChina",
};

function ProcedureList({ phaseId }: { phaseId: PhaseId }) {
  const { session } = useSession();
  return (
    <ol className="procedure-list">
      {applicableCopy(phaseId, session.mode).map((paragraph) => (
        <li key={paragraph}>{paragraph}</li>
      ))}
    </ol>
  );
}

function ActingRole({ role }: { role: RoleRef }) {
  const { session } = useSession();
  const assignment = getRole(session.roles, role);
  const actor = assignment.status === "occupied" ? assignment.occupant : assignment.status;
  return (
    <section className="workbench-panel">
      <h2>Acting role</h2>
      <RoleEditor role={role} />
      <p className="state-reading" aria-live="polite">
        {assignment.status === "occupied" && actor === "crown"
          ? `Showing Crown guidance for the ${session.climate} climate.`
          : assignment.status === "occupied"
            ? "Showing the human procedure. Crown climate remains available for contextual changes."
            : "This phase is normally skipped while the role is not occupied."}
      </p>
    </section>
  );
}

export function GenericPhase({ phaseId }: { phaseId: PhaseId }) {
  const role = roleByPhase[phaseId];
  return (
    <PhaseFrame copy={phaseCopy[phaseId]}>
      <ProcedureList phaseId={phaseId} />
      {role ? <ActingRole role={role} /> : null}
    </PhaseFrame>
  );
}

export function ConfigurePhase() {
  const { session, dispatch } = useSession();
  return (
    <PhaseFrame
      copy={phaseCopy["setup.configure"]}
      status={<span className="status-label">Setup 1 of 6</span>}
    >
      <div className="configuration-grid">
        <fieldset className="segmented-field">
          <legend>Mode</legend>
          <div>
            <button
              aria-pressed={session.mode === "solo"}
              onClick={() => dispatch({ type: "set-mode", mode: "solo" })}
              type="button"
            >
              Solo
            </button>
            <button
              aria-pressed={session.mode === "two-player"}
              onClick={() => dispatch({ type: "set-mode", mode: "two-player" })}
              type="button"
            >
              Two players
            </button>
          </div>
        </fieldset>

        <fieldset className="segmented-field segmented-field--wrap">
          <legend>Scenario</legend>
          <div>
            {SCENARIOS.map((scenario) => (
              <button
                aria-pressed={session.scenario === scenario}
                key={scenario}
                onClick={() => dispatch({ type: "set-scenario", scenario })}
                type="button"
              >
                {scenarioLabels[scenario]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="segmented-field segmented-field--wrap">
          <legend>Difficulty</legend>
          <div>
            {DIFFICULTIES.map((difficulty) => {
              const unavailable = session.mode === "two-player" && difficulty === "legendary";
              return (
                <button
                  aria-describedby={unavailable ? "legendary-note" : undefined}
                  aria-pressed={session.difficulty === difficulty}
                  disabled={unavailable}
                  key={difficulty}
                  onClick={() => dispatch({ type: "set-difficulty", difficulty })}
                  type="button"
                >
                  {difficulty[0].toUpperCase() + difficulty.slice(1)}
                </button>
              );
            })}
          </div>
          <p id="legendary-note" className="field-note">
            Legendary is sourced for solo only; the supplied books stop at Expert for two players.
          </p>
        </fieldset>
      </div>
      <ProcedureList phaseId="setup.configure" />
    </PhaseFrame>
  );
}

export function SetupCardsPhase() {
  const { session, dispatch } = useSession();
  const local = session.progress.phaseState;
  const dealRound = local.phaseId === "setup.cards" ? local.dealRound : 0;
  const rounds = session.mode === "solo" ? 4 : 2;
  return (
    <PhaseFrame
      copy={phaseCopy["setup.cards"]}
      status={
        <span className="status-label">
          Round {Math.min(dealRound + 1, rounds)} of {rounds}
        </span>
      }
    >
      <ProcedureList phaseId="setup.cards" />
      <section className="counter-panel" aria-label="Setup card round">
        <p className="counter-panel__value">
          {dealRound} / {rounds} complete
        </p>
        <div className="counter-panel__actions">
          <button
            disabled={dealRound === 0}
            onClick={() => dispatch({ type: "set-setup-card-round", dealRound: dealRound - 1 })}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={dealRound >= rounds}
            onClick={() => dispatch({ type: "set-setup-card-round", dealRound: dealRound + 1 })}
            type="button"
          >
            Mark round
          </button>
        </div>
      </section>
    </PhaseFrame>
  );
}

export function SetupFinishPhase() {
  return (
    <PhaseFrame copy={phaseCopy["setup.finish"]}>
      <ProcedureList phaseId="setup.finish" />
      <section className="role-ledger">
        <header>
          <h2>Role ledger</h2>
          <p>
            Record the physical setup. You can correct these values from the global Roles sheet
            later.
          </p>
        </header>
        <div className="role-ledger__grid">
          {roleRefs().map((role) => (
            <RoleEditor key={role} role={role} />
          ))}
        </div>
      </section>
    </PhaseFrame>
  );
}

export function SetupAiPhase() {
  const { session, dispatch } = useSession();
  return (
    <PhaseFrame copy={phaseCopy["setup.ai"]}>
      <ProcedureList phaseId="setup.ai" />
      <ClimateSelector
        value={session.climate}
        onChange={(climate) => dispatch({ type: "set-climate", climate })}
      />
      {session.twoPlayer ? (
        <fieldset className="segmented-field">
          <legend>Initial Player Button</legend>
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
    </PhaseFrame>
  );
}

export function DeregulationPhase() {
  const { session, dispatch } = useSession();
  return (
    <PhaseFrame
      copy={phaseCopy["round.deregulation-vote"]}
      status={<span className="status-label">{session.deregulated ? "Active" : "Regulated"}</span>}
    >
      <ProcedureList phaseId="round.deregulation-vote" />
      <button
        className="button button--primary"
        disabled={session.deregulated}
        onClick={() => dispatch({ type: "activate-deregulation" })}
        type="button"
      >
        {session.deregulated ? "Deregulation active" : "Vote passed"}
      </button>
    </PhaseFrame>
  );
}

function actionLabel(action: PresidencyActionId) {
  if (action === "trade") return "Trade";
  if (action === "commander") return "Commander";
  const region = action.slice("governor:".length);
  return `Governor of ${region[0].toUpperCase() + region.slice(1)}`;
}

export function PresidencyPhase({ phaseId }: { phaseId: PhaseId }) {
  const { session, dispatch } = useSession();
  const local = session.progress.phaseState;
  const presidency = phaseId.slice("round.presidency.".length);
  if (!isPresidencyPhaseState(local)) return null;

  const move = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= local.order.length) return;
    const order = [...local.order];
    [order[index], order[destination]] = [order[destination], order[index]];
    dispatch({ type: "set-presidency-order", order });
  };

  return (
    <PhaseFrame
      copy={phaseCopy[phaseId]}
      status={
        <span className="status-label">{presidency[0].toUpperCase() + presidency.slice(1)}</span>
      }
    >
      <ProcedureList phaseId={phaseId} />
      {local.order.length === 0 ? (
        <p className="empty-note">
          No eligible local actors are recorded. Confirm the role ledger before continuing.
        </p>
      ) : (
        <ol className="action-order">
          {local.order.map((action, index) => {
            const done = local.completed.includes(action);
            return (
              <li key={action}>
                <label>
                  <input
                    checked={done}
                    onChange={(event) =>
                      dispatch({
                        type: "complete-presidency-action",
                        actionId: action,
                        complete: event.target.checked,
                      })
                    }
                    type="checkbox"
                  />
                  <span>{actionLabel(action)}</span>
                </label>
                <div className="action-order__controls">
                  <button
                    aria-label={`Move ${actionLabel(action)} earlier`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label={`Move ${actionLabel(action)} later`}
                    disabled={index === local.order.length - 1}
                    onClick={() => move(index, 1)}
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </PhaseFrame>
  );
}

export function FirmRevenuePhase() {
  const { session, dispatch } = useSession();
  const [label, setLabel] = useState("");
  const local = session.progress.phaseState;
  if (local.phaseId !== "round.firm-revenue") return null;

  const addFirm = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    dispatch({ type: "set-firm-labels", labels: [...local.firmLabels, trimmed] });
    setLabel("");
  };

  return (
    <PhaseFrame copy={phaseCopy["round.firm-revenue"]}>
      <ProcedureList phaseId="round.firm-revenue" />
      <div className="firm-entry">
        <label htmlFor="firm-label">Firm label</label>
        <div>
          <input
            id="firm-label"
            onChange={(event) => setLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addFirm();
            }}
            placeholder="Example: Bengal Shipping"
            value={label}
          />
          <button disabled={!label.trim()} onClick={addFirm} type="button">
            Add firm
          </button>
        </div>
        <p className="field-note">
          Labels track local completion only; no firm facts are simulated.
        </p>
      </div>
      <ul className="firm-list">
        {local.firmLabels.map((firm) => (
          <li key={firm}>
            <label>
              <input
                checked={local.completedFirmLabels.includes(firm)}
                onChange={(event) =>
                  dispatch({ type: "complete-firm", label: firm, complete: event.target.checked })
                }
                type="checkbox"
              />
              <span>{firm}</span>
            </label>
          </li>
        ))}
      </ul>
    </PhaseFrame>
  );
}

export function TradeDirectoratePhase() {
  const { session } = useSession();
  const role: RoleRef =
    session.roles.governorGeneral.status === "not-in-play" ? "directorOfTrade" : "governorGeneral";
  return (
    <PhaseFrame copy={phaseCopy["round.trade-directorate"]}>
      <ProcedureList phaseId="round.trade-directorate" />
      <ActingRole role={role} />
    </PhaseFrame>
  );
}

export function HiringPhase() {
  const { session } = useSession();
  const vacancies = roleRefs().filter((role) => getRole(session.roles, role).status === "vacant");
  return (
    <PhaseFrame copy={phaseCopy["round.hiring"]}>
      <ProcedureList phaseId="round.hiring" />
      <section className="vacancy-list">
        <h2>Recorded vacancies</h2>
        {vacancies.length === 0 ? (
          <p className="empty-note">
            No vacant roles are recorded. Not-in-play positions are correctly excluded.
          </p>
        ) : (
          <ul>
            {vacancies.map((role) => (
              <li key={role}>{ROLE_LABELS[role]}</li>
            ))}
          </ul>
        )}
        <p className="field-note">
          Order these from the printed numbers on the physical office cards.
        </p>
      </section>
    </PhaseFrame>
  );
}

export function ScoringPhase() {
  const { session } = useSession();
  return (
    <PhaseFrame
      copy={phaseCopy["game.scoring"]}
      status={
        <span className="status-label">
          {session.progress.endReason === "company-failure" ? "Company failure" : "Scenario end"}
        </span>
      }
    >
      <ProcedureList phaseId="game.scoring" />
    </PhaseFrame>
  );
}
