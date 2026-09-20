import { defaultPresidencyOrder } from "../app/session/factories";
import { getRole } from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import {
  isPresidencyPhaseState,
  type PresidencyActionId,
  type PresidencyId,
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

function titleCase(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

function actionLabel(action: PresidencyActionId, presidency: PresidencyId) {
  if (action === "trade") return "Trade";
  if (action === "commander") return `Commander of ${titleCase(presidency)}`;
  const region = action.slice("governor:".length);
  return "Governor of " + titleCase(region);
}

function actionRole(action: PresidencyActionId, presidency: PresidencyId): RoleRef {
  if (action === "trade") return `president:${presidency}`;
  if (action === "commander") return `commander:${presidency}`;
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
        On success, the Governor gains £1 (£2 if the previous roll failed), then chooses: build a
        Company ship, commission a Regiment, or Tax. Building moves a ship from the region to its
        Presidency sea zone, or places one under construction in the region. Commissioning adds a
        Regiment to the Presidency Army. Tax adds £2 to Company Balance or the Presidency treasury;
        each Tax after the first adds 1 unrest.
      </p>
      <p>
        Receive 1 promise for adding Tax money to a Crown Presidency, moving a Company ship to a
        Crown Presidency sea zone, or commissioning a Regiment into an Army associated with a Crown
        President.
      </p>
    </div>
  );
}

function CommanderProcedure({ presidency }: { presidency: PresidencyId }) {
  const { session } = useSession();
  const commander = session.roles.commanders[presidency];
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

function TradeProcedure({ presidency }: { presidency: PresidencyId }) {
  const { session } = useSession();
  const president = session.roles.presidents[presidency];
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
  index,
  orderLength,
  onMove,
  presidency,
}: {
  action: PresidencyActionId;
  index: number;
  orderLength: number;
  onMove: (direction: -1 | 1) => void;
  presidency: PresidencyId;
}) {
  return (
    <section className="presidency-action">
      <header>
        <div>
          <span className="status-label">{index + 1}</span>
          <h3>{actionLabel(action, presidency)}</h3>
        </div>
        <div className="action-order__controls">
          <button
            aria-label={`Move ${actionLabel(action, presidency)} earlier`}
            disabled={index === 0}
            onClick={() => onMove(-1)}
            type="button"
          >
            ↑
          </button>
          <button
            aria-label={`Move ${actionLabel(action, presidency)} later`}
            disabled={index === orderLength - 1}
            onClick={() => onMove(1)}
            type="button"
          >
            ↓
          </button>
        </div>
      </header>
      <RoleEditor holderOnly role={actionRole(action, presidency)} />
      {action.startsWith("governor:") ? (
        <GovernorProcedure role={actionRole(action, presidency)} />
      ) : action === "commander" ? (
        <CommanderProcedure presidency={presidency} />
      ) : (
        <TradeProcedure presidency={presidency} />
      )}
    </section>
  );
}

export function PresidencyPhase({ presidency }: { presidency: PresidencyId }) {
  const { session, dispatch } = useSession();
  const local = session.progress.phaseState;
  if (!isPresidencyPhaseState(local)) return null;
  const president = session.roles.presidents[presidency];
  const sourceDefault = defaultPresidencyOrder(presidency, session.roles);
  const order = [
    ...local.order.filter((action) => sourceDefault.includes(action)),
    ...sourceDefault.filter((action) => !local.order.includes(action)),
  ];
  const crownPresident = president.status === "occupied" && president.occupant === "crown";

  const move = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= order.length) return;
    const next = [...order];
    [next[index], next[destination]] = [next[destination], next[index]];
    dispatch({ type: "set-presidency-order", order: next });
  };

  return (
    <PhaseFrame
      copy={phaseCopy[`round.presidency.${presidency}`]}
      status={<span className="status-label">{titleCase(presidency)}</span>}
    >
      <RoleEditor holderOnly role={`president:${presidency}`} />

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
          Before resolving Presidential actions, check Initiative for each firm trading in{" "}
          {titleCase(presidency)}. Complete each action before proceeding to the next.
        </p>
      </RuleSection>

      {order.length === 0 ? (
        <p className="empty-note">
          No occupied Governor, Commander, or President action is currently eligible in{" "}
          {titleCase(presidency)}.
        </p>
      ) : (
        <section
          className="presidency-actions"
          aria-label={`${titleCase(presidency)} local actions`}
        >
          {order.map((action, index) => (
            <ActionCard
              action={action}
              index={index}
              key={action}
              onMove={(direction) => move(index, direction)}
              orderLength={order.length}
              presidency={presidency}
            />
          ))}
        </section>
      )}
    </PhaseFrame>
  );
}
