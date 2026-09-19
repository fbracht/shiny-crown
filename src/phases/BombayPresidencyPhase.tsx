import { defaultPresidencyOrder } from "../app/session/factories";
import { getRole } from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import {
  isPresidencyPhaseState,
  type PresidencyActionId,
  type RoleRef,
} from "../app/session/types";
import { PhaseFrame } from "../components/PhaseFrame";
import { Favor, ModeNote, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import { phaseCopy } from "../content/en/phases";
import {
  climateLabels,
  commanderClimateRules,
  governorClimateRules,
  tradeDice,
} from "../content/en/session3";

function actionLabel(action: PresidencyActionId) {
  if (action === "trade") return "Trade";
  if (action === "commander") return "Commander of Bombay";
  const region = action.slice("governor:".length);
  return "Governor of " + region[0].toUpperCase() + region.slice(1);
}

function actionRole(action: PresidencyActionId): RoleRef {
  if (action === "trade") return "president:bombay";
  if (action === "commander") return "commander:bombay";
  return action;
}

function GovernorProcedure({ role }: { role: RoleRef }) {
  const { session } = useSession();
  const governor = getRole(session.roles, role);
  if (governor.status !== "occupied") return null;
  const rule = governorClimateRules[session.climate];

  return governor.occupant === "crown" ? (
    <div className="action-procedure" data-branch="crown">
      <p>
        Start with the dice printed on the Governor card. Repeat Administer while at least{" "}
        <strong>
          {rule.minimumDice} {rule.minimumDice === 1 ? "die" : "dice"}
        </strong>{" "}
        remains, reducing the pool by one after every attempt. Stop after catastrophic failure or
        when the requirement cannot be met.
      </p>
      <p>
        On success in <strong>{climateLabels[session.climate]}</strong>: {rule.result}
      </p>
      <p>On failure, add 1 unrest to the Governor's region.</p>
      <div className="favor-stack">
        <Favor cost="Give 1">Raise or lower the minimum by one die.</Favor>
        <Favor cost="Give 2">Choose another result after a successful Administer.</Favor>
        <Favor cost="Give 3">Take no Administer actions.</Favor>
      </div>
    </div>
  ) : (
    <div className="action-procedure" data-branch="human">
      <p>
        Start with the dice printed on the office card. Reduce the pool by one after every
        Administer attempt. Continue until the pool is empty, you stop, or a catastrophic failure
        occurs.
      </p>
      <p>
        On success, gain £1—£2 if the preceding roll failed—then build a Company ship, commission a
        Regiment, or Tax. On failure, add 1 unrest. Each Tax after the first this turn also adds 1
        unrest.
      </p>
      <p>
        Receive 1 promise when the relevant Crown-Presidency predicate is met for Tax, completing a
        Company ship, or commissioning a Regiment.
      </p>
    </div>
  );
}

function CommanderProcedure() {
  const { session } = useSession();
  const commander = session.roles.commanders.bombay;
  if (commander.status !== "occupied") return null;
  const rule = commanderClimateRules[session.climate];

  return (
    <div
      className="action-procedure"
      data-branch={commander.occupant === "crown" ? "crown" : "human"}
    >
      <h4>Local Alliances</h4>
      {commander.occupant === "crown" ? (
        <p>
          {rule.alliance} Crown Presidents always consent. When a human President did not pay to
          cause the purchase, that human receives 1 promise for consent.
        </p>
      ) : (
        <p>
          Request Presidential funds to purchase Local Alliances and move purchased pieces to
          available forces. Crown-President consent costs 2 promises in Bull/Stag, 1 in Lion, and 0
          in Bear/Peacock.
        </p>
      )}

      <h4>Deploy</h4>
      <ol>
        <li>Choose an eligible target where the action can have an effect and can succeed.</li>
        <li>
          Exhaust forces, then subtract target and empire strength. Alliances contribute their
          printed strength.
        </li>
        <li>After the check, roll one death-check die per committed Officer; each 6 is a loss.</li>
        <li>
          On success, divide Loot in source order, gain trophies, open orders/remove unrest, and
          create a vacant associated Governor when a new region becomes Company-controlled.
        </li>
        <li>
          On catastrophic failure, lose half the Commander's trophies rounded up and vacate the
          Commander position.
        </li>
      </ol>
      {commander.occupant === "crown" ? (
        <div className="climate-decision">
          <p>
            <strong>{climateLabels[session.climate]} target order:</strong> {rule.target}
          </p>
          <p>
            Deploy only if the Crown can roll exactly <strong>{rule.nonCompanyDice}</strong> dice
            against a non-Company region or <strong>{rule.companyDice}</strong> against a
            Company-controlled region. Exhaust Alliances → Crown Officers → human Officers →
            Regiments.
          </p>
          <p>
            The Crown {rule.deployAgain ? "attempts" : "does not attempt"} another Deploy by
            default.
          </p>
          <div className="favor-stack">
            <Favor cost="Give 2">Choose another valid target.</Favor>
            <Favor cost="Give 1">Raise or lower the exact-dice requirement by one.</Favor>
            {rule.repeatFavor ? (
              <Favor cost={"Give " + rule.repeatFavor}>Require another Deploy.</Favor>
            ) : null}
            {rule.stopFavor ? (
              <Favor cost={"Give " + rule.stopFavor}>Prevent another Deploy.</Favor>
            ) : null}
          </div>
        </div>
      ) : null}
      {session.mode === "two-player" ? (
        <ModeNote>
          Track each family's Officers separately. Divide Loot from Commander/own Officers, then
          other families clockwise, then Regiments and Alliances; the Player Button does not replace
          this order.
        </ModeNote>
      ) : null}
    </div>
  );
}

function TradeProcedure() {
  const { session } = useSession();
  const president = session.roles.presidents.bombay;
  if (president.status !== "occupied") return null;

  return (
    <div
      className="action-procedure"
      data-branch={president.occupant === "crown" ? "crown" : "human"}
    >
      <ol>
        <li>
          Declare connected regions from the home port. Regions crossed cannot exceed ships in the
          sea zone; another Presidency's home region is never eligible.
        </li>
        <li>
          Spend from the President's treasury for one die per £1, minus one die for each declared
          region beyond home.
        </li>
        <li>
          On the single successful Trade this turn, fill as many connected orders as possible,
          increase Company Balance, pay the President £1 per order, and pay each family £1 per
          Writer placed.
        </li>
      </ol>
      {president.occupant === "crown" ? (
        <div className="climate-decision">
          <p>
            In <strong>{climateLabels[session.climate]}</strong>, spend enough to roll at least{" "}
            <strong>{tradeDice[session.climate]} dice</strong>. Prefer the highest-value viable
            route, shortening it if needed; then spend up to £3 more if funds remain.
          </p>
          <p>
            Fill the highest-value route, breaking ties by home orders, then closest to home, then
            the most southerly equidistant order. Place Crown Writers first.
          </p>
          <Favor cost="Give 1">Raise or lower the required dice by one.</Favor>
          <Favor cost="Give 1">Place a chosen human Writer instead of another Writer.</Favor>
          {session.mode === "two-player" ? (
            <ModeNote>
              After Crown Writers, the Player Button determines priority only when both humans have
              eligible Writers. Pass it only for that actual between-humans choice.
            </ModeNote>
          ) : null}
        </div>
      ) : (
        <p>Receive X promises when X Crown Writers are placed, even if there was no alternative.</p>
      )}
    </div>
  );
}

function ActionCard({
  action,
  done,
  index,
  orderLength,
  onComplete,
  onMove,
}: {
  action: PresidencyActionId;
  done: boolean;
  index: number;
  orderLength: number;
  onComplete: (complete: boolean) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <article className="presidency-card" data-complete={done || undefined}>
      <header>
        <div>
          <span className="status-label">Local action {index + 1}</span>
          <h3>{actionLabel(action)}</h3>
        </div>
        <label className="completion-control">
          <input
            checked={done}
            onChange={(event) => onComplete(event.target.checked)}
            type="checkbox"
          />
          <span>{done ? "Complete" : "Mark complete"}</span>
        </label>
      </header>
      <RoleEditor role={actionRole(action)} />
      {action.startsWith("governor:") ? (
        <GovernorProcedure role={actionRole(action)} />
      ) : action === "commander" ? (
        <CommanderProcedure />
      ) : (
        <TradeProcedure />
      )}
      <div className="action-order__controls action-order__controls--wide">
        <button disabled={index === 0} onClick={() => onMove(-1)} type="button">
          Move earlier
        </button>
        <button disabled={index === orderLength - 1} onClick={() => onMove(1)} type="button">
          Move later
        </button>
      </div>
    </article>
  );
}

export function BombayPresidencyPhase() {
  const { session, dispatch } = useSession();
  const local = session.progress.phaseState;
  if (!isPresidencyPhaseState(local)) return null;
  const president = session.roles.presidents.bombay;
  const sourceDefault = defaultPresidencyOrder("bombay", session.roles);
  const order = [
    ...local.order.filter((action) => sourceDefault.includes(action)),
    ...sourceDefault.filter((action) => !local.order.includes(action)),
  ];
  const crownPresident = president.status === "occupied" && president.occupant === "crown";
  const completeCount = order.filter((action) => local.completed.includes(action)).length;

  const move = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= order.length) return;
    const next = [...order];
    [next[index], next[destination]] = [next[destination], next[index]];
    dispatch({ type: "set-presidency-order", order: next });
  };

  return (
    <PhaseFrame
      copy={phaseCopy["round.presidency.bombay"]}
      status={
        <span className="status-label">
          {completeCount} / {order.length} complete
        </span>
      }
    >
      <section className="workbench-panel">
        <h2>Acting President</h2>
        <RoleEditor role="president:bombay" />
        <p className="state-reading" aria-live="polite">
          {president.status === "occupied" && president.occupant === "crown"
            ? "Showing Crown order and climate guidance."
            : president.status === "occupied"
              ? "Showing the human President procedure."
              : "The Chairman orders occupied Governors and the Commander; Trade is unavailable."}
        </p>
      </section>

      <RuleSection title="Set the local order">
        {crownPresident ? (
          <p>
            First arrange multiple Governors to match their physical formation order, which the app
            does not infer. The Crown default is then every Governor → Commander → Trade. Give 1
            promise to make one change to that default; the app records the resulting order but
            leaves the physical payment to the players.
          </p>
        ) : president.status === "occupied" ? (
          <p>The human President chooses any valid order for all eligible local actions.</p>
        ) : (
          <p>
            The Presidency is vacant. The Chairman orders occupied Governors and the Commander;
            Trade and Presidential consent for Local Alliances are unavailable.
          </p>
        )}
        <p className="field-note">
          Before these actions, resolve physical firm Initiative for every firm trading in Bombay.
          Each action must finish before the next begins.
        </p>
      </RuleSection>

      {order.length === 0 ? (
        <p className="empty-note">
          No occupied Governor, Commander, or President action is currently eligible in Bombay.
        </p>
      ) : (
        <section className="presidency-actions" aria-label="Bombay local actions">
          {order.map((action, index) => (
            <ActionCard
              action={action}
              done={local.completed.includes(action)}
              index={index}
              key={action}
              onComplete={(complete) =>
                dispatch({ type: "complete-presidency-action", actionId: action, complete })
              }
              onMove={(direction) => move(index, direction)}
              orderLength={order.length}
            />
          ))}
        </section>
      )}
    </PhaseFrame>
  );
}
