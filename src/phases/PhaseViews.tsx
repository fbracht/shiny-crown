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
import { playerLabel } from "../app/session/playerLabels";
import {
  DIFFICULTIES,
  SCENARIOS,
  type ActorId,
  type GovernorAssignment,
  type PresidencyId,
  type RoleRef,
} from "../app/session/types";
import { ClimateSelector } from "../components/ClimateSelector";
import { PhaseFrame } from "../components/PhaseFrame";
import { Favor, ModeNote, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import { phaseCopy } from "../content/en/phases";
import { deregulationMaximumSpend } from "../content/en/earlyRound";
import {
  crownSetupFor,
  finishSetupSteps,
  scenarioSetupNotes,
  setupTableSteps,
  soloSetupCards,
  twoPlayerSetupCards,
} from "../content/en/setup";
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

        {session.mode === "two-player" ? (
          <fieldset className="player-name-fields">
            <legend>Players</legend>
            <div>
              {(["human-1", "human-2"] as const).map((player, index) => (
                <label key={player}>
                  <span>Player {index + 1} name</span>
                  <input
                    autoComplete="off"
                    onChange={(event) =>
                      dispatch({ type: "set-player-name", player, name: event.target.value })
                    }
                    value={session.playerNames[player]}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

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
      <aside className="setup-source-note">
        <strong>Selected setup</strong>
        <p>
          {session.mode === "solo" ? "Solo" : "Two players"} · {scenarioLabels[session.scenario]} ·{" "}
          {session.difficulty[0].toUpperCase() + session.difficulty.slice(1)}
        </p>
        <p>{scenarioSetupNotes[session.scenario]}</p>
        <p>The matching physical scenario card remains authoritative for its setup values.</p>
      </aside>
    </PhaseFrame>
  );
}

export function SetupTablePhase() {
  const { session } = useSession();
  return (
    <PhaseFrame
      copy={phaseCopy["setup.table"]}
      status={<span className="status-label">Setup 2 of 6</span>}
    >
      <ol className="procedure-list procedure-list--setup">
        {setupTableSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <aside className="setup-source-note">
        <strong>{scenarioLabels[session.scenario]}</strong>
        <p>{scenarioSetupNotes[session.scenario]}</p>
        <p>
          The supplied rules do not contain the scenario-card values. Keep the matching physical
          card beside the board and use it for every scenario-specific position.
        </p>
      </aside>
    </PhaseFrame>
  );
}

export function SetupCrownPhase() {
  const { session } = useSession();
  const setup = crownSetupFor(session.mode, session.difficulty);
  const humans = setup.humanCubes.map((cubes, index) => ({
    label:
      session.mode === "solo"
        ? "You"
        : playerLabel(session.mode, session.playerNames, index === 0 ? "human-1" : "human-2"),
    cubes,
  }));

  return (
    <PhaseFrame
      copy={phaseCopy["setup.crown"]}
      status={<span className="status-label">Setup 3 of 6</span>}
    >
      <div className="phase-procedure">
        <RuleSection number="01" title="Crown board and family">
          <ol>
            <li>Set up the Crown family board.</li>
            <li>Use an unused opportunity marker to track the Crown climate.</li>
            <li>
              Give the Crown two sets of family members: 36 pieces total. It uses every piece of one
              colour before placing pieces of the other colour.
            </li>
          </ol>
        </RuleSection>

        <RuleSection number="02" title="Closed pool of 12 promise cubes">
          <div className="setup-allocation" aria-label="Initial promise cube distribution">
            {humans.map((human) => (
              <div key={human.label}>
                <span>{human.label}</span>
                <strong>{human.cubes}</strong>
              </div>
            ))}
            <div>
              <span>Crown</span>
              <strong>{setup.crownCubes}</strong>
            </div>
          </div>
          <p>
            Keep these 12 cubes as a closed pool. Cubes move between the human families and the
            Crown when favors are resolved; do not add cubes from the general supply.
          </p>
        </RuleSection>

        <RuleSection number="03" title="Difficulty adjustments">
          {setup.promiseCardsPerHuman > 0 ? (
            <p>
              Give each human <strong>{setup.promiseCardsPerHuman} promise cards</strong>. These may
              be traded for Crown promise cubes as shown on the Crown board.
            </p>
          ) : (
            <p>Do not use promise cards for trading with the Crown.</p>
          )}
          {setup.extraSetupCards > 0 ? (
            <p>
              Give the Crown <strong>{setup.extraSetupCards} extra setup cards</strong> in addition
              to the basic setup-card distribution resolved on the next screen.
            </p>
          ) : (
            <p>Do not give the Crown extra setup cards.</p>
          )}
        </RuleSection>
      </div>
    </PhaseFrame>
  );
}

export function SetupCardsPhase() {
  const { session, dispatch } = useSession();
  const local = session.progress.phaseState;
  const dealRound = local.phaseId === "setup.cards" ? local.dealRound : 0;
  const procedure = session.mode === "solo" ? soloSetupCards : twoPlayerSetupCards;
  const rounds = procedure.rounds;
  return (
    <PhaseFrame
      copy={phaseCopy["setup.cards"]}
      status={
        <span className="status-label">
          Round {Math.min(dealRound + 1, rounds)} of {rounds}
        </span>
      }
    >
      <div className="phase-procedure">
        <RuleSection number="01" title="Prepare the deck">
          <p>Shuffle the 12 basic setup cards. Do not add ordinary extra cards or use a draft.</p>
        </RuleSection>
        <RuleSection number="02" title="Distribute the cards">
          <p>{procedure.instruction}</p>
          <p>
            Repeat for <strong>{rounds} rounds total</strong>. Resolve everything shown on the
            physical cards, including office placement, pieces, cash, and enterprises.
          </p>
        </RuleSection>
        <RuleSection number="03" title="Final distribution">
          <p className="setup-total">{procedure.finalTotal}</p>
        </RuleSection>
      </div>
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
    <PhaseFrame
      copy={phaseCopy["setup.finish"]}
      status={<span className="status-label">Setup 5 of 6</span>}
    >
      <RuleSection title="Finish the common setup">
        <ol>
          {finishSetupSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </RuleSection>
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
    <PhaseFrame
      copy={phaseCopy["setup.ai"]}
      status={<span className="status-label">Setup 6 of 6</span>}
    >
      <div className="phase-procedure">
        <RuleSection number="01" title="Seat the Crown">
          <p>
            Place the Crown last in office order relative to the family that was Chairman during
            setup. If the Crown is Chairman, place it before the next family in office order.
          </p>
        </RuleSection>
        <RuleSection number="02" title="Reveal the first AI card">
          <p>
            Shuffle the AI deck and place it facedown. Reveal the top card to the right of the deck,
            then set the climate marker to the animal shown on that card.
          </p>
          <ClimateSelector
            value={session.climate}
            onChange={(climate) => dispatch({ type: "set-climate", climate })}
          />
        </RuleSection>
        {session.twoPlayer ? (
          <RuleSection number="03" title="Set the Player Button">
            <p>
              Give the Button to the human on the Crown's right for a counter-clockwise finger, or
              on its left for a clockwise finger. Later AI cards do not reset this holder.
            </p>
            <fieldset className="segmented-field">
              <legend>Initial holder</legend>
              <div>
                {(["human-1", "human-2"] as const).map((holder) => (
                  <button
                    aria-pressed={session.twoPlayer?.buttonHolder === holder}
                    key={holder}
                    onClick={() => dispatch({ type: "transfer-button", holder })}
                    type="button"
                  >
                    {playerLabel(session.mode, session.playerNames, holder)}
                  </button>
                ))}
              </div>
            </fieldset>
          </RuleSection>
        ) : null}
        <p className="readiness-note">
          Setup is complete. The first turn begins at the Deregulation gate and skips London Season.
        </p>
      </div>
    </PhaseFrame>
  );
}

export function DeregulationPhase() {
  const { session, dispatch } = useSession();
  const [markerSpace, setMarkerSpace] = useState<"ordinary" | "lined" | "star">("ordinary");
  const [result, setResult] = useState<"passed" | "failed" | null>(null);
  const primeMinister = session.roles.primeMinister;
  const crownPrimeMinister =
    primeMinister.status === "occupied" && primeMinister.occupant === "crown";
  const canInitiate = markerSpace === "star" || (markerSpace === "lined" && !crownPrimeMinister);
  const maximumSpend = deregulationMaximumSpend[session.climate];

  return (
    <PhaseFrame
      copy={phaseCopy["round.deregulation-vote"]}
      status={<span className="status-label">{session.deregulated ? "Active" : "Regulated"}</span>}
    >
      {session.deregulated ? (
        result === "passed" ? (
          <aside className="outcome-note" aria-live="polite">
            <strong>Pass</strong>
            <p>
              Lower Company Debt by 1 for every 2 Debt, reset Company Standing to S, and give the
              Prime Minister a passed-law token. Firms are now available.
            </p>
          </aside>
        ) : (
          <p className="empty-note">
            Deregulation is already active. This special vote is no longer available.
          </p>
        )
      ) : (
        <div className="phase-procedure">
          <RuleSection number="01" title="Check the special-session gate">
            <p>
              This vote occurs only in the 1758 or Long 1710 scenario, at the start of a turn before
              London Season. Check the physical Company Standing and Debt markers.
            </p>
            <fieldset className="segmented-field segmented-field--wrap">
              <legend>Standing or Debt position</legend>
              <div>
                <button
                  aria-pressed={markerSpace === "ordinary"}
                  onClick={() => setMarkerSpace("ordinary")}
                  type="button"
                >
                  Neither lined
                </button>
                <button
                  aria-pressed={markerSpace === "lined"}
                  onClick={() => setMarkerSpace("lined")}
                  type="button"
                >
                  Lined space
                </button>
                <button
                  aria-pressed={markerSpace === "star"}
                  onClick={() => setMarkerSpace("star")}
                  type="button"
                >
                  Star space
                </button>
              </div>
            </fieldset>
            <RoleEditor holderOnly role="primeMinister" />
            <p className="state-reading" aria-live="polite">
              {markerSpace === "ordinary"
                ? "No special vote is available this turn."
                : markerSpace === "star"
                  ? "The Prime Minister must initiate the vote."
                  : crownPrimeMinister
                    ? "The Crown Prime Minister does not voluntarily initiate the vote."
                    : "The human Prime Minister may initiate the vote."}
            </p>
          </RuleSection>

          {canInitiate ? (
            <RuleSection number="02" title="Resolve the vote">
              <p>
                The Prime Minister may vote against the law. The Crown votes last and against it. In
                the {climateLabels[session.climate]} climate, the Crown may spend up to{" "}
                <strong>£{maximumSpend}</strong> once, only if that moves the Votes marker to a
                failing position.
              </p>
              <div className="dialog-actions">
                <button
                  className="button button--primary"
                  onClick={() => {
                    dispatch({ type: "activate-deregulation" });
                    setResult("passed");
                  }}
                  type="button"
                >
                  Vote passed
                </button>
                <button onClick={() => setResult("failed")} type="button">
                  Vote failed
                </button>
              </div>
            </RuleSection>
          ) : null}

          {result === "failed" ? (
            <aside className="outcome-note" aria-live="polite">
              <strong>Fail</strong>
              <p>
                Increase the VP value of Company shares by 1, to a maximum of +3. The Prime Minister
                remains in power and the vote may be initiated again on a later eligible turn.
              </p>
            </aside>
          ) : null}
        </div>
      )}
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
          {chairman.status === "occupied"
            ? playerLabel(session.mode, session.playerNames, chairman.occupant)
            : chairman.status}
        </span>
      }
    >
      {chairman.status !== "not-in-play" ? <RoleEditor holderOnly role="chairman" /> : null}
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
  return (
    <PhaseFrame copy={phaseCopy["round.bonuses"]}>
      <div className="textual-procedure">
        <p>
          Players gain £1 for each Shipyard with a fitted ship and each non-invested Workshop they
          own. Additional bonuses may apply.
        </p>
      </div>
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
      <div className="phase-procedure">
        <RuleSection number="01" title="Pay firm expenses">
          <p>
            Pay £1 per firm ship, then pay the higher of £1 per firm share or the firm's current
            value, using its London and India treasuries.
          </p>
          <p>
            If the firm cannot pay, seek Emergency Investments or dissolve it. Each eligible Company
            share or uninvested Workshop adds £5; after expenses, remove leftover emergency money
            and lower firm value once per emergency investment.
          </p>
          <p>
            Crown refuses Emergency Investment by default. Give 4 promises to require Crown to
            invest eligible Company shares, then Workshops when weak, without exceeding the
            manager's firm-share count.
          </p>
        </RuleSection>
        <RuleSection number="02" title="Dissolve an insolvent firm">
          <p>
            Move each firm share to Debtor's Prison, return every firm ship to its Shipyard, flip
            the firm board to its family side, and leave invested Workshops invested.
          </p>
        </RuleSection>
        <RuleSection number="03" title="Pay firm dividends">
          <p>
            A dividend pays each family £1 per firm share and the manager an additional £1. The
            manager may waive any number of their own shares. Record total dividends with the firm
            cube; preserve Hobnobbing only when no dividend was paid, otherwise set it to 0.
          </p>
          {session.mode === "solo" ? (
            <p>
              If Crown's share dividend is at least the human's share dividend, receive promises
              equal to Crown shares, to a maximum of 3. Ignore the manager's extra £1 for this
              comparison.
            </p>
          ) : (
            <p>
              Compare Crown's share dividend with each human family separately. If Crown is at least
              each one, resolve the reward; exclude the manager's extra £1. A shareholder may waive
              dividends only with manager consent.
            </p>
          )}
        </RuleSection>
        <RuleSection number="04" title="Move remaining cash">
          <p>Move every pound remaining in the firm's India treasury to its London treasury.</p>
        </RuleSection>
      </div>
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
            Current hirer: {ROLE_LABELS[actualHirer ?? "chairman"]} ·{" "}
            {playerLabel(session.mode, session.playerNames, hirer.occupant)}
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
              <strong>
                {playerLabel(session.mode, session.playerNames, hirer.occupant)} hiring
              </strong>
              <p>
                Hiring the hirer's own family requires consent from every other family in the
                candidate pool. Crown consent costs 2 promises. Receive 1 promise for choosing Crown
                over any eligible non-Crown candidate.
              </p>
              {session.mode === "two-player" ? (
                <ModeNote>
                  Keep both human families separate. If self-hiring, obtain consent from every other
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
                    {playerLabel(session.mode, session.playerNames, candidate)}
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
                        ? playerLabel(
                            session.mode,
                            session.playerNames,
                            (
                              getRole(session.roles, source) as {
                                status: "occupied";
                                occupant: ActorId;
                              }
                            ).occupant,
                          )
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
        <RoleEditor holderOnly role="chairman" />
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
