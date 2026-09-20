import { useSession } from "../app/session/SessionContext";
import { PhaseFrame } from "../components/PhaseFrame";
import { Favor, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import { phaseCopy } from "../content/en/phases";
import { climateLabels } from "../content/en/session3";
import {
  crownFamilyActionQueue,
  crownFirmInvestment,
  familyActionLabel,
  familyActions,
  writerPlacementPriority,
} from "../content/en/soloEarly";

function ButtonStatus({ pass = false }: { pass?: boolean }) {
  const { session, dispatch } = useSession();
  if (!session.twoPlayer) return null;
  const holder = session.twoPlayer.buttonHolder;
  return (
    <aside className="branch-note">
      <strong>Player Button · {session.playerNames[holder]}</strong>
      <p>
        Use the Button only after explicit priorities leave a choice between the two humans.
        {pass ? " After resolving that choice, pass it." : " Do not infer an automatic pass."}
      </p>
      {pass ? (
        <button
          onClick={() => dispatch({ type: "resolve-button-choice", pass: true })}
          type="button"
        >
          Resolve choice and pass Button
        </button>
      ) : null}
    </aside>
  );
}

export function TwoPlayerLondonSeasonPhase() {
  const { session } = useSession();
  return (
    <PhaseFrame copy={phaseCopy["round.london-season"]}>
      {session.firstTurn ? (
        <p className="empty-note">Skip the entire London Season on the first turn.</p>
      ) : (
        <div className="phase-procedure">
          <RuleSection number="01" title="Attrition">
            <p>
              In Company office order, roll for each officeholder and resolve fatigue or retirement
              from the physical office card. Use the controls below to record every resulting
              vacancy.
            </p>
            <div className="role-list">
              <RoleEditor holderOnly role="chairman" />
              <RoleEditor holderOnly role="directorOfTrade" />
              <RoleEditor holderOnly role="managerOfShipping" />
              <RoleEditor holderOnly role="militaryAffairs" />
            </div>
          </RuleSection>
          <RuleSection number="02" title="Retirements">
            <p>
              Starting with the current or former Chairman, resolve pensioners one at a time. Move
              each to an affordable Prize, pay its cost, and gain its VP. Keep each family's spend
              visible for Prestige order.
            </p>
            <Favor cost="Give 2">Before retirements, take £1 from Crown treasury.</Favor>
            <p>
              Crown retires one pensioner at a time to the highest-VP Prize costing no more than
              half its current treasury, rounded up; it uses the £2 Prize only to gain a card.
            </p>
            <Favor cost="Give 1">After Crown's ordinary retirements, take £1 from it.</Favor>
          </RuleSection>
          {session.deregulated ? (
            <RuleSection number="2.5" title="Special Retirements">
              <p>
                Each family with a firm share may retire one supply member, limited by that family's
                highest last firm dividend. Crown takes its single highest-VP affordable option.
              </p>
            </RuleSection>
          ) : null}
          <RuleSection number="03" title="Prestige Cards">
            <p>
              Order families by retirement spend, then Windows, then clockwise from Prime Minister.
              Each required family takes or discards one card. Crown follows the AI-card position,
              moving clockwise to the next available card.
            </p>
            <p>
              Crown ignores optional and Spouse text, keeps Blackmail facedown, uses Enterprises,
              and refuses consent. Discard and refill the display, then return unretired pensioners.
            </p>
          </RuleSection>
        </div>
      )}
    </PhaseFrame>
  );
}

export function TwoPlayerFamilyPhase() {
  const { session } = useSession();
  const queue = crownFamilyActionQueue[session.climate];
  return (
    <PhaseFrame
      copy={phaseCopy["round.family"]}
      status={<span className="status-label">Three families</span>}
    >
      <div className="phase-procedure">
        <RuleSection number="00" title="Free Crown Writers">
          <p>
            Crown first enlists a free Writer if four or more offices are vacant, then another if a
            vacant Presidency has no Crown Writer. These do not use its normal action.
          </p>
        </RuleSection>
        <RuleSection number="01" title="Family Actions">
          <p>
            Starting with the Chairman and proceeding clockwise, each family takes one normal Family
            action. An opportunity marker doubles only its matching normal action; a law action is
            extra.
          </p>
          <dl>
            {familyActions.map((action) => (
              <div key={action.id}>
                <dt>
                  <strong>{action.label}</strong>
                </dt>
                <dd>{action.procedure}</dd>
              </div>
            ))}
          </dl>
          <p>
            Humans may negotiate ordinary transfers and promises; keep both families' assets
            separate.
          </p>
        </RuleSection>
        <RuleSection number="01C" title={`Crown action · ${climateLabels[session.climate]}`}>
          <p>
            Crown takes exactly one normal action: the first affordable, viable item in this queue.
          </p>
          <ol className="priority-list">
            {queue.map((action, index) => (
              <li key={`${action}-${index}`}>{familyActionLabel(action)}</li>
            ))}
          </ol>
          <p>A law-granted action remains additional. Writer placement priority is:</p>
          <ol className="priority-list">
            {writerPlacementPriority.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </RuleSection>
        <RuleSection number="02" title="New Company Shares">
          <p>
            While Debt remains, move the rightmost Stock Exchange member to Court and lower Debt;
            then slide remaining members right without changing order. This opens Hiring and Basic
            Favors.
          </p>
          <Favor cost="Receive 1">
            Give £1 to Crown when Crown holds a majority of Company shares.
          </Favor>
        </RuleSection>
      </div>
    </PhaseFrame>
  );
}

export function TwoPlayerFirmsPhase() {
  const { session } = useSession();
  const investment = crownFirmInvestment[session.climate];
  return (
    <PhaseFrame copy={phaseCopy["round.firms"]}>
      {!session.deregulated ? (
        <p className="empty-note">Firms are unavailable until Deregulation passes.</p>
      ) : (
        <div className="phase-procedure">
          <RuleSection number="01" title="Human firm actions">
            <p>
              Humans form and invest with manager consent until neither wishes to act. Keep strategy
              and trade spending secret and simultaneous on physical components, not this screen.
            </p>
            <p>
              Ship acquisition needs the other owner's consent. Resolve manager disputes through the
              Prime Minister rules; the Button is not the default dispute resolver.
            </p>
          </RuleSection>
          <RuleSection number="02" title="Crown investments">
            <p>
              After both humans finish, Crown follows the {climateLabels[session.climate]} rule:{" "}
              {investment.default === "one" ? "make one investment" : "make no investment"}.
              Initiate each possible investment with the Button holder, switching the Button after
              every investment. The solo denial favor does not apply.
            </p>
            <ButtonStatus pass />
          </RuleSection>
          <RuleSection number="03" title="Takeovers and mergers">
            <p>
              A hostile takeover requires a family with no managed firm and majority shareholder
              consent. The Button holder may buy Crown consent for promises equal to Crown firm
              shares.
            </p>
            <p>
              A merger requires every shareholder's consent. Resolve the primary firm, transferred
              shares, treasuries, ships, and the ten-share limit in printed order.
            </p>
            <Favor cost="Give X · Button holder only">
              Crown consents to a valid hostile takeover; X is Crown firm shares.
            </Favor>
          </RuleSection>
          <RuleSection number="04" title="Physical-table boundary">
            <p>
              Preserve managers, shares, values, initiatives, strategies, treasuries, and ships on
              the table. In each Presidency, resolve multiple firms and Company trade by initiative.
            </p>
          </RuleSection>
        </div>
      )}
    </PhaseFrame>
  );
}
