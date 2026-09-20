import { useState } from "react";
import { playerLabel } from "../app/session/playerLabels";
import { useSession } from "../app/session/SessionContext";
import type { RegionId } from "../app/session/types";
import { REGIONS } from "../app/session/types";
import { ClimateSelector } from "../components/ClimateSelector";
import { PhaseFrame } from "../components/PhaseFrame";
import { PlayerButtonPrompt } from "../components/PlayerButtonPrompt";
import { Favor, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import { useReferences } from "../components/ReferenceContext";
import { phaseCopy } from "../content/en/phases";
import {
  companyDividendRules,
  eventRules,
  soloFailureAdjustment,
  votingPlan,
} from "../content/en/soloLate";
import { climateLabels } from "../content/en/session3";

function titleCase(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

export function CompanyRevenuePhase() {
  const { session } = useSession();
  const chairman = session.roles.chairman;
  const crownChairman = chairman.status === "occupied" && chairman.occupant === "crown";
  const rule = companyDividendRules[session.climate];

  return (
    <PhaseFrame copy={phaseCopy["round.company-revenue"]}>
      <div className="phase-procedure">
        <RuleSection number="01" title="Pay Company expenses">
          <p>
            Reduce Company Balance by £1 for each Debt, Regiment, Officer other than a Commander,
            and ship in a sea zone.
          </p>
          <p>
            If Balance cannot cover expenses, take Emergency Loans: advance Debt and add £5,
            repeating as needed. After paying, set Balance to 0 and lower Standing by 1 for one or
            two loans, or by 2 for three or more.
          </p>
          {crownChairman ? (
            <p>
              If Emergency Loans were taken and Royal Protection is available, the Crown Chairman
              discards it.
            </p>
          ) : null}
        </RuleSection>
        <RuleSection number="02" title="Check Expectations">
          <p>
            Lower Company Standing by 1 if Company Balance is below the Expectations value printed
            beneath the current Standing space.
          </p>
        </RuleSection>
        <RuleSection number="03" title="Pay dividends">
          <p>
            Each dividend costs Company Balance equal to the number of Company shares and pays each
            family £1 per share owned. The Chairman may pay multiple dividends.
          </p>
          {crownChairman ? (
            <div className="climate-decision">
              <p>
                In {climateLabels[session.climate]}, the Crown pays one dividend if able, then pays
                more while retaining at least <strong>£{rule.retainedBalance}</strong>.
              </p>
              <Favor cost={`Give ${rule.fewerCost}`}>Pay one fewer dividend.</Favor>
              <Favor cost={`Give ${rule.moreCost}`}>Pay one more dividend.</Favor>
            </div>
          ) : null}
        </RuleSection>
        <RuleSection number="04" title="Adjust Standing">
          <p>If total dividends paid exceeded Expectations, advance Company Standing by 1.</p>
          <p className="field-note">
            If any reduction reaches Company Failure, use the persistent End game control after
            finishing the current required procedure.
          </p>
        </RuleSection>
      </div>
    </PhaseFrame>
  );
}

export function EventsIndiaPhase() {
  const { session, dispatch } = useSession();
  const openReference = useReferences();
  const [region, setRegion] = useState<RegionId>("bombay");
  const governor = session.roles.governors[region];
  const presidency = governor.associatedPresidency ?? "bombay";

  return (
    <PhaseFrame copy={phaseCopy["round.events-india"]}>
      <div className="phase-procedure">
        <RuleSection number="01" title="Roll for Storms">
          <p>
            Roll the Storm die. In every rolled sea zone, roll once for each human, Crown, or firm
            ship; ships in the China treasury count as East.
          </p>
          <ul>
            <li>1–2: no effect.</li>
            <li>3–4: fatigue the ship; if already fatigued, return it faceup to its Shipyard.</li>
            <li>5–6: return the ship faceup to its Shipyard.</li>
          </ul>
        </RuleSection>
        <RuleSection number="02" title="Resolve Events">
          <p>
            Draw and resolve Event cards one at a time until you have resolved the number shown on
            the Storm die. Continue resolving the required Events even if Company Failure occurs.
          </p>
          <dl className="event-lookup">
            {eventRules.map((event) => (
              <div key={event.name}>
                <dt>{event.name}</dt>
                <dd>{event.text}</dd>
              </div>
            ))}
          </dl>
          <button onClick={() => openReference("crisis")} type="button">
            Open Crisis reference
          </button>
          {session.mode === "two-player" ? (
            <PlayerButtonPrompt>
              When a Crown Commander defends during a Crisis, the current holder chooses which
              eligible pieces are exhausted. The source does not establish an automatic pass here.
            </PlayerButtonPrompt>
          ) : null}
        </RuleSection>
        <RuleSection number="03" title="Record a lost Company region">
          <p>
            After completing the physical Region Loss steps, remove its regional Governor from play
            and leave the associated Commander vacant. Governor General replaces the Governor step.
          </p>
          <div className="context-controls">
            <label>
              <span>Lost region</span>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value as RegionId)}
              >
                {REGIONS.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    {titleCase(candidate)}
                  </option>
                ))}
              </select>
            </label>
            <button
              disabled={!governor.associatedPresidency}
              onClick={() => dispatch({ type: "lose-region", region, presidency })}
              type="button"
            >
              Record region loss
            </button>
          </div>
          {!governor.associatedPresidency ? (
            <p className="field-note">No tracked Presidency association exists for this region.</p>
          ) : null}
        </RuleSection>
      </div>
    </PhaseFrame>
  );
}

export function ParliamentPhase() {
  const { session, dispatch } = useSession();
  const openReference = useReferences();
  const [law, setLaw] = useState<string>(votingPlan[0][0]);
  const primeMinister = session.roles.primeMinister;
  const crownPM = primeMinister.status === "occupied" && primeMinister.occupant === "crown";
  const plan = votingPlan.find(([name]) => name === law)?.[1];

  return (
    <PhaseFrame
      copy={phaseCopy["round.parliament"]}
      status={
        <span className="status-label">
          {primeMinister.status === "occupied"
            ? playerLabel(session.mode, session.playerNames, primeMinister.occupant)
            : primeMinister.status}
        </span>
      }
    >
      <RoleEditor holderOnly role="primeMinister" />
      {primeMinister.status !== "occupied" ? (
        <p className="empty-note">Record the Prime Minister before resolving Parliament.</p>
      ) : (
        <div className="phase-procedure">
          <RuleSection number="01" title="Shift Crown climate">
            <p>
              Roll 6 dice and compare successes with current Company Standing. Apply every rightward
              shift first, then every leftward shift; do not net the shifts before reaching an edge.
            </p>
            <ClimateSelector
              value={session.climate}
              onChange={(climate) => dispatch({ type: "set-climate", climate })}
            />
          </RuleSection>
          <RuleSection number="02" title={crownPM ? "Crown selects a law" : "Select a law"}>
            {crownPM ? (
              <>
                <p>
                  Draw the number of Law cards shown on the AI card and select the last one. A
                  Dilemma is selected immediately. Rotate to the first matching policy in the
                  direction chosen by Crown Policy Selection.
                </p>
                <Favor cost="Give 2">Stop drawing and select the current law.</Favor>
                <Favor cost="Give 2">
                  Skip the current law and draw another; select the third.
                </Favor>
              </>
            ) : (
              <p>
                Reveal up to 3 Law cards and choose one; a revealed Dilemma is chosen immediately.
                Rotate the Prime Minister wheel to the first matching policy in either direction.
              </p>
            )}
          </RuleSection>
          <RuleSection
            number="03"
            title={session.mode === "solo" ? "Crown voting plan" : "Clockwise voting rounds"}
          >
            {session.mode === "two-player" ? (
              <>
                <p>
                  Prime Minister votes first, then continue clockwise. After every family has had a
                  chance, the Prime Minister either begins another round or resolves the vote; if no
                  one voted in a round, resolve it.
                </p>
                <ul>
                  <li>Each £1 and each used vote icon is one vote.</li>
                  <li>A family that joins opposition cannot later vote for the law.</li>
                  <li>
                    The Prime Minister cannot oppose their own law or consent to that use of
                    enterprises.
                  </li>
                  <li>Coalition votes count toward the consenting opposition family.</li>
                  <li>Crown votes last and votes against only for Deregulation.</li>
                </ul>
              </>
            ) : null}
            <label>
              <span>Selected law</span>
              <select value={law} onChange={(event) => setLaw(event.target.value)}>
                {votingPlan.map(([name]) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <p className="state-reading">{plan}</p>
            <button onClick={() => openReference("voting")} type="button">
              Open full Crown Voting Plan
            </button>
          </RuleSection>
          <RuleSection number="04" title="Resolve the vote and policy">
            {session.mode === "two-player" ? (
              <>
                <p>
                  Track each family's votes against separately. The highest opposition total holds
                  Opposition Leader; the incumbent retains it on a tie. At -1 or less the law fails,
                  and the actual Opposition Leader becomes Prime Minister and chooses an adjacent
                  policy. Otherwise the law passes and the Prime Minister takes a passed-law token.
                </p>
                <div className="dialog-actions dialog-actions--stacked">
                  {(["human-1", "human-2", "crown"] as const).map((actor) => (
                    <button
                      key={actor}
                      onClick={() => dispatch({ type: "set-opposition-leader", actor })}
                      type="button"
                    >
                      Record {playerLabel(session.mode, session.playerNames, actor)} as Opposition
                      Leader
                    </button>
                  ))}
                  <button
                    disabled={!session.roles.oppositionLeader}
                    onClick={() =>
                      dispatch({
                        type: "set-prime-minister",
                        actor: session.roles.oppositionLeader,
                      })
                    }
                    type="button"
                  >
                    Failed law: Opposition Leader becomes Prime Minister
                  </button>
                </div>
              </>
            ) : (
              <p>
                Set the law's initial Votes. Crown receives enterprise votes and free votes from its
                treasury, then follows the selected plan. Resolve the final pass/fail result,
                policy, and every instruction on the physical card.
              </p>
            )}
            {session.mode === "solo" && crownPM ? (
              <button
                onClick={() => dispatch({ type: "set-prime-minister", actor: "human-1" })}
                type="button"
              >
                Failed law: You become Prime Minister
              </button>
            ) : session.mode === "solo" ? (
              <button
                onClick={() => dispatch({ type: "set-prime-minister", actor: "crown" })}
                type="button"
              >
                Failed law: Crown becomes Prime Minister
              </button>
            ) : null}
          </RuleSection>
          <RuleSection number="05" title="Record structural laws">
            <div className="dialog-actions dialog-actions--stacked">
              <button onClick={() => dispatch({ type: "replace-trade-director" })} type="button">
                Governor General enacted
              </button>
              <button onClick={() => dispatch({ type: "activate-china" })} type="button">
                China office enacted
              </button>
              <button onClick={() => dispatch({ type: "activate-deregulation" })} type="button">
                Deregulation enacted
              </button>
            </div>
          </RuleSection>
        </div>
      )}
    </PhaseFrame>
  );
}

export function UpkeepRefreshPhase() {
  const { session } = useSession();
  return (
    <PhaseFrame copy={phaseCopy["round.upkeep-refresh"]}>
      <div className="phase-procedure">
        <RuleSection number="01" title="Pay Upkeep">
          <p>
            Pay every prize expense separately. If a family cannot pay, return that family member to
            supply and lower its victory points by the prize value. Resolve Royal Privilege when its
            Crown-Chairman condition applies.
          </p>
        </RuleSection>
        <RuleSection number="02" title="Final-turn gate">
          <p>
            If this is the scenario's final turn, do not Refresh. Use Final turn below to enter
            scoring after Upkeep.
          </p>
        </RuleSection>
        <RuleSection number="03" title="Refresh for another turn">
          <ul>
            <li>Return Writers to their associated Presidency.</li>
            <li>Return Filled Order tokens and Presidency dividers to supply.</li>
            <li>Return every Extra ship to supply.</li>
            <li>Ready exhausted Officers and Regiments; exhaust active Local Alliances.</li>
          </ul>
          {session.mode === "solo" ? (
            <Favor cost="Receive 1 · mandatory">
              If you have a Writer in a Crown Presidency but none returns from filling an order in
              that Presidency.
            </Favor>
          ) : null}
          <p>Then advance the turn and return to the turn-start gate.</p>
        </RuleSection>
      </div>
    </PhaseFrame>
  );
}

export function ScoringPhase() {
  const { session } = useSession();
  const adjustment = soloFailureAdjustment[session.scenario][session.turn];
  return (
    <PhaseFrame
      copy={phaseCopy["game.scoring"]}
      status={
        <span className="status-label">
          {session.progress.endReason === "company-failure" ? "Company failure" : "Scenario end"}
        </span>
      }
    >
      <div className="phase-procedure">
        <p className="warning-note">
          Negotiations, promises, and Blackmail plays end now except where a card explicitly says
          otherwise.
        </p>
        <RuleSection number="01" title="Firms and Debtor's Prison">
          <p>Resolve final firm values and every Debtor's Prison effect that applies.</p>
        </RuleSection>
        <RuleSection number="02" title="Power award">
          {session.mode === "solo" ? (
            <p>In solo, award only the first-place Power prize. Resolve ties as printed.</p>
          ) : (
            <p>
              Award first and second Power prizes. If tied for most, every tied family receives the
              lower award and no other award is made; a tie for second receives nothing.
            </p>
          )}
        </RuleSection>
        <RuleSection number="03" title="Court, Workshops, and final retirement">
          <p>
            Score the Court of Directors and Workshops, then resolve final retirement or the
            Company-failure card. On Hard, Expert, or Legendary, Crown spends as much as possible on
            pensioners during final retirement.
          </p>
          {session.difficulty === "legendary" &&
          session.progress.endReason === "company-failure" ? (
            <p>Select Court of Directors Blameless: Crown benefits and the human does not.</p>
          ) : null}
        </RuleSection>
        {session.progress.endReason === "company-failure" ? (
          session.mode === "solo" ? (
            <RuleSection number="04" title="Solo failure adjustment">
              {adjustment === undefined ? (
                <p>No adjustment is printed for this scenario and turn. Do not invent one.</p>
              ) : (
                <p>
                  Adjust the human score by <strong>{adjustment} VP</strong>.
                </p>
              )}
            </RuleSection>
          ) : null
        ) : null}
        <RuleSection number="05" title="Determine the winner">
          <p>
            Highest victory points wins. Break a final tie by most Windows, then clockwise from the
            Prime Minister.
          </p>
        </RuleSection>
      </div>
    </PhaseFrame>
  );
}
