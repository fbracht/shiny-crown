import { useState } from "react";
import { currentHiringVacancies, occupied } from "../app/session/factories";
import {
  getRole,
  HIRING_ROLE_REFS,
  OFFICE_CARD_NUMBERS,
  roleRefs,
  ROLE_LABELS,
} from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import {
  DIFFICULTIES,
  SCENARIOS,
  isPresidencyPhaseState,
  type ActorId,
  type GovernorAssignment,
  type PhaseId,
  type PresidencyActionId,
  type PresidencyId,
  type RoleRef,
} from "../app/session/types";
import { ClimateSelector } from "../components/ClimateSelector";
import { PhaseFrame } from "../components/PhaseFrame";
import { Favor, ModeNote, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import { applicableCopy, phaseCopy } from "../content/en/phases";
import {
  chairmanClimateRules,
  climateLabels,
  firstAdditionalDebtConsent,
  hiringGuidance,
} from "../content/en/session3";

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

const actorLabels: Record<ActorId, string> = {
  "human-1": "Human 1",
  "human-2": "Human 2",
  crown: "Crown",
};

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

export function ChairmanPhase() {
  const { session, dispatch } = useSession();
  const chairman = session.roles.chairman;
  const climateRule = chairmanClimateRules[session.climate];
  const climateName = climateLabels[session.climate];

  return (
    <PhaseFrame
      copy={phaseCopy["round.chairman"]}
      status={
        <span className="status-label">
          {chairman.status === "occupied" ? actorLabels[chairman.occupant] : chairman.status}
        </span>
      }
    >
      <ActingRole role="chairman" />
      {chairman.status !== "occupied" ? (
        <p className="empty-note">
          The Chairman office is {chairman.status.replaceAll("-", " ")}. Company Operations skips it
          until an occupant is recorded.
        </p>
      ) : chairman.occupant === "crown" ? (
        <div className="phase-procedure" data-branch="crown">
          <RuleSection number="01" title="Set climate before acting">
            <p>
              Flip a new AI card now. Set the single global Crown climate before resolving Debt or
              allocations; this screen updates immediately.
            </p>
            <ClimateSelector
              value={session.climate}
              onChange={(climate) => dispatch({ type: "set-climate", climate })}
            />
          </RuleSection>

          <RuleSection number="02" title={`Seek Debt · ${climateName}`}>
            <p>{climateRule.debt}</p>
            <p>
              Each advance moves Debt once and adds £5 to Company Balance. Evaluate the physical
              Presidencies, sea zones, and Armies at the table.
            </p>
            <div className="favor-stack">
              <Favor cost={`Give ${climateRule.requestMore}`}>
                Request one additional Debt advance.
              </Favor>
              {climateRule.requestLess === null ? null : (
                <Favor cost={`Give ${climateRule.requestLess}`}>
                  Request one fewer Debt advance.
                </Favor>
              )}
            </div>
          </RuleSection>

          <RuleSection number="03" title={`Allocate Company Balance · ${climateName}`}>
            <p>
              Work down this priority list. Give as much as possible to a step that cannot be
              completed in full, then send any remainder to the Manager of Shipping.
            </p>
            <ol className="priority-list">
              {climateRule.allocation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <Favor cost="Give 1">
              Before any step, allocate £3 or less to one specific office instead.
            </Favor>
          </RuleSection>
        </div>
      ) : (
        <div className="phase-procedure" data-branch="human">
          <RuleSection number="01" title="Opening favor">
            <Favor cost="Give 1 · mandatory if able">
              Perform this favor once per turn, before the Chairman takes any action.
            </Favor>
          </RuleSection>

          <RuleSection number="02" title="Seek Debt">
            <p>
              Advance Debt up to three times, adding £5 to Company Balance each time. Every
              additional advance requires consent from families controlling a majority of Company
              shares; the Chairman still counts as a share.
            </p>
            {session.mode === "two-player" ? (
              <ModeNote>
                The two human families may jointly provide the majority. Use Crown-consent favors
                only when Crown shares are actually needed.
              </ModeNote>
            ) : null}
            <div className="favor-stack">
              <Favor cost={`Give ${firstAdditionalDebtConsent[session.climate]}`}>
                Obtain Crown-share consent for the first advance beyond three in the {climateName}
                climate.
              </Favor>
              <Favor cost="Give 1 per Crown share">
                Obtain Crown-share consent for each later additional advance.
              </Favor>
            </div>
          </RuleSection>

          <RuleSection number="03" title="Allocate all Company Balance">
            <p>
              Move every pound from Company Balance to office treasuries. You may interleave
              permitted Debt advances while planning the allocation.
            </p>
            <Favor cost="Receive 1">
              Allocate £{climateRule.humanCrownAllocation} to a Crown office in the {climateName}
              climate.
            </Favor>
          </RuleSection>

          <RuleSection number="04" title="Set climate after finishing">
            <p>
              Only after the Chairman has finished acting, flip a new AI card and set the global
              Crown climate.
            </p>
            <ClimateSelector
              value={session.climate}
              onChange={(climate) => dispatch({ type: "set-climate", climate })}
            />
          </RuleSection>
        </div>
      )}
    </PhaseFrame>
  );
}

export function BonusesPhase() {
  const { session } = useSession();
  return (
    <PhaseFrame copy={phaseCopy["round.bonuses"]}>
      <div className="textual-procedure">
        <p className="textual-procedure__lead">
          Resolve these bonuses for{" "}
          {session.mode === "solo"
            ? "the human family and the Crown"
            : "Human 1, Human 2, and the Crown"}
          .
        </p>
        <ol className="bonus-list">
          <li>
            <strong>Fitted Shipyards</strong>
            <span>Gain £1 for each owned Shipyard with a fitted ship.</span>
          </li>
          <li>
            <strong>Non-invested Workshops</strong>
            <span>Gain £1 for each owned Workshop that is not invested in a firm.</span>
          </li>
          <li>
            <strong>Cards and laws</strong>
            <span>Apply any additional bonus printed on the physical game state.</span>
          </li>
        </ol>
        <p className="field-note">
          Do not count an unfitted Shipyard or a Workshop currently invested in a firm.
        </p>
      </div>
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

function hirerRoleFor(target: RoleRef, association?: PresidencyId): RoleRef | null {
  if (
    target === "directorOfTrade" ||
    target === "governorGeneral" ||
    target === "managerOfShipping" ||
    target === "militaryAffairs" ||
    target === "superintendentChina"
  ) {
    return "chairman";
  }
  if (target.startsWith("president:")) return "directorOfTrade";
  if (target.startsWith("governor:") && association) return `president:${association}`;
  return null;
}

function hiringOfficeLabel(role: RoleRef) {
  return role === "militaryAffairs" ? "Military Affairs / Commander in Chief" : ROLE_LABELS[role];
}

function promotionSources(target: RoleRef) {
  if (target === "directorOfTrade") {
    return HIRING_ROLE_REFS.filter(
      (role) => role !== target && role !== "governorGeneral" && !role.startsWith("governor:"),
    );
  }
  if (target === "governorGeneral") {
    return HIRING_ROLE_REFS.filter((role) => role !== target && role !== "directorOfTrade");
  }
  if (target === "militaryAffairs") {
    return ["commander:bombay", "commander:madras", "commander:bengal"] satisfies RoleRef[];
  }
  if (target.startsWith("president:")) {
    return HIRING_ROLE_REFS.filter((role) => role.startsWith("governor:"));
  }
  return [];
}

function VacancyHireCard({ index, role }: { index: number; role: RoleRef }) {
  const { session, dispatch } = useSession();
  const [actor, setActor] = useState<ActorId>("human-1");
  const [sourceRole, setSourceRole] = useState<RoleRef | "">("");
  const assignment = getRole(session.roles, role) as GovernorAssignment;
  const association = assignment.associatedPresidency;
  const guidance = hiringGuidance(role);
  const nominalHirer = hirerRoleFor(role, association);
  const actualHirer =
    nominalHirer === "directorOfTrade" && session.roles.governorGeneral.status !== "not-in-play"
      ? "governorGeneral"
      : nominalHirer;
  const hirer = actualHirer ? getRole(session.roles, actualHirer) : null;
  const sources = promotionSources(role).filter((candidate) => {
    const current = getRole(session.roles, candidate);
    if (current.status !== "occupied") return false;
    if (role.startsWith("president:") && candidate.startsWith("governor:")) {
      return (current as GovernorAssignment).associatedPresidency === role.split(":")[1];
    }
    return true;
  });
  const actors: ActorId[] =
    session.mode === "solo" ? ["human-1", "crown"] : ["human-1", "human-2", "crown"];

  const chooseSource = (value: string) => {
    if (!value) {
      setSourceRole("");
      return;
    }
    const selected = value as RoleRef;
    const source = getRole(session.roles, selected);
    if (source.status === "occupied") setActor(source.occupant);
    setSourceRole(selected);
  };

  const confirm = () => {
    if (sourceRole) {
      dispatch({ type: "promote", from: sourceRole, to: role, actor });
    } else {
      const next = occupied(actor);
      dispatch({
        type: "set-role",
        role,
        assignment:
          role.startsWith("governor:") && association
            ? { ...next, associatedPresidency: association }
            : next,
      });
    }
  };

  return (
    <article className="hiring-card">
      <header>
        <span>{String(OFFICE_CARD_NUMBERS[role] ?? index + 1).padStart(2, "0")}</span>
        <div>
          <h3>{hiringOfficeLabel(role)}</h3>
          <p>Hired by {guidance.hirer}</p>
        </div>
      </header>
      <p>{guidance.candidates}</p>
      {!hirer || hirer.status !== "occupied" ? (
        <p className="warning-note">No active hirer is recorded. The office remains vacant.</p>
      ) : (
        <>
          <p className="state-reading">
            Current hirer: {ROLE_LABELS[actualHirer ?? "chairman"]} · {actorLabels[hirer.occupant]}
          </p>
          {hirer.occupant === "crown" ? (
            <div className="branch-note">
              <strong>Crown hiring</strong>
              <p>
                Hire Crown family if able. For Director/Governor General, take the first eligible
                candidate along the Company Operations ribbon in the AI-card direction. Otherwise
                prefer Writer → Officer → Governor, using the AI card for ties.
              </p>
              <Favor cost="Give 3">Make this hiring decision for the Crown.</Favor>
            </div>
          ) : (
            <div className="branch-note">
              <strong>{actorLabels[hirer.occupant]} hiring</strong>
              <p>
                Hiring the hirer's own family requires consent from every other family in the
                candidate pool. Crown consent costs 2 promises. Receive 1 promise for choosing Crown
                over any eligible non-Crown candidate.
              </p>
              {session.mode === "two-player" ? (
                <ModeNote>
                  Keep Human 1 and Human 2 separate. If self-hiring, obtain consent from every other
                  candidate family; do not invent a reward for the unresolved sole-human
                  Crown-nepotism case.
                </ModeNote>
              ) : null}
            </div>
          )}
          <div className="hire-controls">
            <label>
              <span>Candidate family</span>
              <select value={actor} onChange={(event) => setActor(event.target.value as ActorId)}>
                {actors.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    {actorLabels[candidate]}
                  </option>
                ))}
              </select>
            </label>
            {sources.length > 0 ? (
              <label>
                <span>Tracked promotion source</span>
                <select value={sourceRole} onChange={(event) => chooseSource(event.target.value)}>
                  <option value="">Candidate comes from the physical board or supply</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {ROLE_LABELS[source]} ·{" "}
                      {getRole(session.roles, source).status === "occupied"
                        ? actorLabels[
                            (
                              getRole(session.roles, source) as {
                                status: "occupied";
                                occupant: ActorId;
                              }
                            ).occupant
                          ]
                        : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <button className="button button--primary" onClick={confirm} type="button">
              {sourceRole ? "Confirm promotion" : "Confirm hire"}
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export function HiringPhase() {
  const { session } = useSession();
  const vacancies = currentHiringVacancies(session.roles);
  const order = vacancies;

  return (
    <PhaseFrame
      copy={phaseCopy["round.hiring"]}
      status={<span className="status-label">{vacancies.length} vacant</span>}
    >
      <RuleSection number="01" title="Elect the Chairman">
        <p>
          Declare the pure-majority threshold: more than half of all Company shares. Any family with
          a Company share may campaign; the first candidate to reach that support becomes Chairman.
          If none does, the former Chairman chooses any eligible shareholder, including themselves.
        </p>
        <p>
          If the Court is empty, the former Chairman returns with a family member from supply, then
          from a prize if necessary; if neither is possible, the office stays vacant.
        </p>
        {session.mode === "two-player" ? (
          <ModeNote>
            Several families may combine support. If Crown lacks a majority, either human may give X
            promises for X supporting Crown shares. When Crown has a majority, give 3 promises to
            elect a human (12 after Deregulation). Receive 3 for electing Crown (6 after
            Deregulation).
          </ModeNote>
        ) : (
          <p className="branch-note">
            Crown elects itself when it has a majority or is tied as former Chairman. The opposing
            majority/former Chairman may use the sourced Crown-election favors.
          </p>
        )}
        <RoleEditor role="chairman" />
      </RuleSection>

      <RuleSection number="02" title="Order the vacant office cards">
        <p>
          The queue below is sorted by the printed office-card numbers. Positions not in play and
          Army Commanders are excluded. Director of Trade/Governor General share number 2; Military
          Affairs/Commander in Chief share number 4 because each later title replaces the earlier
          office.
        </p>
        {order.length === 0 ? (
          <p className="empty-note">No Company office is currently recorded as vacant.</p>
        ) : (
          <ol className="hiring-order" aria-label="Vacant offices in hiring order">
            {order.map((role) => (
              <li key={role}>
                <span className="office-number">{OFFICE_CARD_NUMBERS[role]}</span>
                <span>{hiringOfficeLabel(role)}</span>
              </li>
            ))}
          </ol>
        )}
      </RuleSection>

      {order.length > 0 ? (
        <section className="hiring-queue" aria-label="Hiring queue">
          {order.map((role, index) => (
            <VacancyHireCard index={index} key={role} role={role} />
          ))}
        </section>
      ) : null}
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
