import type { ReactNode } from "react";
import { getRole, roleRefs } from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import { PhaseFrame } from "../components/PhaseFrame";
import { Favor, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import {
  crownFamilyActionQueue,
  crownFirmInvestment,
  familyActionLabel,
  familyActions,
  newCompanyShareFavors,
  promiseExchangeLabel,
  soloEarlySources,
  writerPlacementPriority,
} from "../content/en/soloEarly";
import { phaseCopy } from "../content/en/phases";
import { climateLabels } from "../content/en/session3";

const attritionRoleRefs = roleRefs().filter((role) => role !== "primeMinister");

function OccupiedOfficeControls() {
  const { session } = useSession();
  const occupiedRoles = attritionRoleRefs.filter(
    (role) => getRole(session.roles, role).status === "occupied",
  );

  if (occupiedRoles.length === 0) {
    return <p className="empty-note">No occupied office is currently recorded.</p>;
  }

  return (
    <div className="role-list" aria-label="Occupied offices after attrition">
      {occupiedRoles.map((role) => (
        <RoleEditor holderOnly key={role} role={role} />
      ))}
    </div>
  );
}

function SoloOnly({ children }: { children: ReactNode }) {
  const { session } = useSession();
  return session.mode === "solo" ? children : null;
}

export function SoloLondonSeasonPhase() {
  const { session } = useSession();

  return (
    <SoloOnly>
      <PhaseFrame
        copy={{
          ...phaseCopy["round.london-season"],
          sources: soloEarlySources.londonSeason,
        }}
        status={<span className="status-label">{session.firstTurn ? "Skipped" : "Solo"}</span>}
      >
        {session.firstTurn ? (
          <p className="empty-note">Skip the entire London Season on the first turn.</p>
        ) : (
          <div className="phase-procedure">
            <RuleSection number="01" title="Attrition">
              <p>
                Roll one die for every officeholder, adding +1 for each fatigue on that office. Add
                another +1 to the Chairman's roll.
              </p>
              <ul>
                <li>1–2: no effect.</li>
                <li>3–4: add one fatigue to the office card.</li>
                <li>
                  5 or more: move the officeholder to the Pensioners box, return the card's fatigue
                  to the supply, and move the office card to Vacant Offices.
                </li>
              </ul>
              <p className="field-note">
                The app does not roll or identify outcomes. For each 5+, mark that office vacant
                below after resolving the physical pieces.
              </p>
              <OccupiedOfficeControls />
            </RuleSection>

            <RuleSection number="02" title="Retirements">
              <Favor cost="Give 2">
                Before any retirement, take £1 from the Crown family treasury.
              </Favor>
              <p>
                Starting with the current or former Chairman, retire pensioners one at a time. Move
                each pensioner to a Prize, pay its cost after any retirement discount, and gain its
                VP reward. Keep the money spent beside each family until Prestige-card order is
                resolved.
              </p>
              <p>
                For each Crown pensioner, choose the most expensive Prize the Crown can afford with
                half its current family treasury, rounded up. Use the £2 Prize only if the Crown has
                made no other retirement this turn.
              </p>
              <Favor cost="Give 1">
                After the Crown finishes all ordinary retirements, take £1 from the Crown family
                treasury.
              </Favor>
            </RuleSection>

            {session.deregulated ? (
              <RuleSection number="2.5" title="Special Retirement">
                <p>
                  Each family with at least one firm share may retire one family member from its
                  supply. The maximum money spent equals the highest last dividend paid by a firm in
                  which that family owns a share; retirement discounts may raise the Prize value
                  beyond that amount.
                </p>
                <p>
                  If Crown has a firm share, it takes the single highest-VP special retirement it
                  can afford.
                </p>
              </RuleSection>
            ) : null}

            <RuleSection number="03" title="Prestige Cards">
              <p>
                Each family that retired at least one pensioner must take or discard one card. Start
                with the family that spent the most on retirements this turn; break ties by total
                Windows, then Prime Minister order.
              </p>
              <p>
                Crown takes the card in the AI-card position. If it is unavailable, move clockwise
                to the next available card.
              </p>
              <ul>
                <li>Crown ignores Spouse text but receives its discount and VP.</li>
                <li>Keep Crown Blackmail face down.</li>
                <li>Enterprises work for Crown.</li>
                <li>Crown does not perform optional card actions.</li>
                <li>Crown never gives consent required by a card.</li>
              </ul>
              <Favor cost="Give 5">Take an enterprise Prestige card from Crown.</Favor>
              <Favor cost="Give 4">
                Take a Blackmail card from Crown without looking at it first.
              </Favor>
              <p>
                Discard the remaining display, refill it to three cards with Blackmail face down,
                and return every non-retired pensioner to its supply.
              </p>
            </RuleSection>
          </div>
        )}
      </PhaseFrame>
    </SoloOnly>
  );
}

export function SoloFamilyPhase() {
  const { session } = useSession();
  const queue = crownFamilyActionQueue[session.climate];

  return (
    <SoloOnly>
      <PhaseFrame
        copy={{ ...phaseCopy["round.family"], sources: soloEarlySources.family }}
        status={<span className="status-label">{climateLabels[session.climate]}</span>}
      >
        <div className="phase-procedure">
          <RuleSection number="00" title="Free Crown Writers">
            <p>
              If there are four or more vacant offices, Crown first enlists one Writer for free.
              Then, if a vacant Presidency has no Crown Writer, Crown enlists a second Writer for
              free.
            </p>
          </RuleSection>

          <RuleSection number="01" title="Family Actions">
            <p>
              Starting with the current or former Chairman, choose one Family Action. If your
              opportunity marker already occupies that action, perform it twice. A most-recent law
              may grant a separate extra action; it does not receive the opportunity-marker bonus.
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
              If a piece is required and none remain in supply, remove one from a Prize and lose
              that Prize's VP reward. Skip any action that is not affordable or physically viable.
            </p>
          </RuleSection>

          <RuleSection number="01C" title={"Crown actions · " + climateLabels[session.climate]}>
            <p>
              Crown takes two normal actions: scan this queue from left to right and perform the
              first two affordable, viable actions. Repeated entries are separate opportunities.
            </p>
            <ol className="priority-list">
              {queue.map((action, index) => (
                <li key={action + "-" + index}>{familyActionLabel(action)}</li>
              ))}
            </ol>
            <p>
              A law-granted action is additional to those two. Crown performs it when its action is
              encountered in the queue or after completing the two normal actions.
            </p>
            <p>
              When seeking a share, Crown takes the cheapest open space, using the rightmost £3
              space when it is both open and cheapest.
            </p>
            <p>When enlisting a Writer, use this priority:</p>
            <ol className="priority-list">
              {writerPlacementPriority.map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ol>
          </RuleSection>

          <RuleSection number="02" title="New Company Shares">
            <p>
              While Company Debt remains, move the rightmost family member on the Stock Exchange to
              the Court and lower Debt by one. Then slide any remaining members as far right as
              possible while preserving their order.
            </p>
            <p>
              After resolving new Company shares, the following favors use the current{" "}
              {climateLabels[session.climate]} climate:
            </p>
            <div className="favor-stack">
              <Favor cost="Receive 1">
                Give £1 from your family treasury to Crown when Crown has a majority of Company
                shares.
              </Favor>
              {newCompanyShareFavors.map((favor) => (
                <Favor cost={promiseExchangeLabel(favor.costs[session.climate])} key={favor.label}>
                  {favor.label}.
                </Favor>
              ))}
            </div>
          </RuleSection>
        </div>
      </PhaseFrame>
    </SoloOnly>
  );
}

export function SoloFirmsPhase() {
  const { session } = useSession();
  const investment = crownFirmInvestment[session.climate];

  return (
    <SoloOnly>
      <PhaseFrame
        copy={{ ...phaseCopy["round.firms"], sources: soloEarlySources.firms }}
        status={
          <span className="status-label">
            {session.deregulated ? "Deregulated" : "Unavailable"}
          </span>
        }
      >
        {!session.deregulated ? (
          <p className="empty-note">Skip Firms while the Company remains regulated.</p>
        ) : (
          <div className="phase-procedure">
            <RuleSection number="01" title="Create a Firm">
              <p>
                If you do not manage a firm, form one by returning an eligible Company share to its
                supply or flipping a Workshop to its invested side. A Company share is ineligible
                while Standing or Debt is on a lined space and during the turn it was created.
              </p>
              <Favor cost="Give 3 · mandatory">
                Pay Crown to create the firm. If you have fewer than three promise cubes, give every
                cube you have.
              </Favor>
              <p>
                Crown never creates a firm. Flip your family board, place a family member in Shares,
                place a cube on the leftmost Value space, and add £5 from the bank to the firm's
                London treasury. You are its manager.
              </p>
            </RuleSection>

            <RuleSection number="02" title="Firm Investments">
              <p>
                Invest by returning an eligible Company share or flipping a Workshop to invested.
                Add £5 from the bank to the firm's London treasury and add one family member to its
                Shares box. Beyond ten shares, an investment still adds £5 but creates no share.
              </p>
              <p>
                After your investments, Crown may invest only if it holds a majority of Company
                shares and would not gain a majority of the firm's shares. It returns an eligible
                Company share if able, otherwise flips a Workshop to invested.
              </p>
              <p>
                In {climateLabels[session.climate]}, Crown's default is to{" "}
                {investment.default === "one" ? "make one investment" : "make no investment"}.
              </p>
              {investment.override === "request" ? (
                <Favor cost={"Give " + investment.amount}>Require Crown to invest once.</Favor>
              ) : (
                <Favor cost="Give X · X is firm Value">Prevent Crown's investment.</Favor>
              )}
            </RuleSection>

            <RuleSection number="03" title="Acquire Ships">
              <p>
                A manager may spend from the firm's London treasury to fit a player's Shipyard ship
                for £3, or buy a player-owned Company ship for £3 if unfatigued or £2 if fatigued.
                The ship owner must consent. Pay a buyback to the Shipping Office and place every
                acquired ship on the firm board.
              </p>
              <Favor cost="Give 2">Obtain Crown consent to fit a Crown Shipyard ship.</Favor>
              <Favor cost="Give 2">
                Obtain Crown consent to buy a Crown-owned ship back from the Company.
              </Favor>
            </RuleSection>

            <RuleSection number="04" title="Hostile Takeovers and Mergers">
              <p>Neither hostile takeovers nor mergers occur in a solo game.</p>
            </RuleSection>

            <RuleSection number="05" title="Firm Strategy">
              <p>
                Secretly choose a Firm Strategy for a Presidency where the firm has at least one
                ship, and move any chosen trade spend from London treasury to Trade Bid. Choose
                Hobnob and move no money if the firm will not trade or has no ships. Keep the
                strategy face down and conceal the bid until all firm managers have chosen.
              </p>
            </RuleSection>

            <RuleSection number="06" title="Firm Dissolution">
              <p>
                You may dissolve the firm using the Firm Revenue dissolution steps. Crown always
                grants consent to dissolution.
              </p>
            </RuleSection>
          </div>
        )}
      </PhaseFrame>
    </SoloOnly>
  );
}
