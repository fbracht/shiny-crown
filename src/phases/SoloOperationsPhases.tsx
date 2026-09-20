import type { ReactNode } from "react";
import { getRole } from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import type { ActorId, PresidencyId, RoleRef } from "../app/session/types";
import { PRESIDENCIES } from "../app/session/types";
import { PhaseFrame } from "../components/PhaseFrame";
import { PlayerButtonPrompt } from "../components/PlayerButtonPrompt";
import { Favor, RuleSection } from "../components/ProcedurePrimitives";
import { RoleEditor } from "../components/RoleEditor";
import { phaseCopy } from "../content/en/phases";
import { climateLabels } from "../content/en/session3";
import {
  chinaMinimumDice,
  directorTransferPriorities,
  governorGeneralRules,
  humanDirectorRewards,
  militaryTransferPriorities,
  officerTrainingPriorities,
  shippingCompanyShipRules,
  shippingPlacementPriorities,
  specialEnvoySpend,
  specialEnvoySpendFavor,
} from "../content/en/soloOperations";

function OccupiedProcedure({ role, children }: { role: RoleRef; children: ReactNode }) {
  const { session } = useSession();
  const assignment = getRole(session.roles, role);

  return (
    <>
      <RoleEditor holderOnly role={role} />
      {assignment.status === "occupied" ? (
        children
      ) : assignment.status === "not-in-play" ? (
        <p className="empty-note">This office is not in play. Skip its operations.</p>
      ) : (
        <p className="empty-note">This office is vacant. Skip its operations.</p>
      )}
    </>
  );
}

function DirectorOfTradeProcedure() {
  const { session, dispatch } = useSession();
  const director = session.roles.directorOfTrade;
  if (director.status !== "occupied") return null;
  const crown = director.occupant === "crown";
  const reward = humanDirectorRewards[session.climate];

  return (
    <div className="phase-procedure" data-branch={crown ? "crown" : "human"}>
      <RuleSection number="01" title="Special Envoy">
        <p>
          For each attempt, spend any amount from the Director treasury and roll one die per £1. On
          a success, either open one closed order in a non-Company-controlled Indian region or open
          trade with China. Special Envoy may be attempted any number of times.
        </p>
        {crown ? (
          <div className="climate-decision">
            <p>
              In <strong>{climateLabels[session.climate]}</strong>, spend exactly £
              <strong>{specialEnvoySpend[session.climate]}</strong> per attempt. Target the
              northernmost closed order in an eligible region selected by AI-card priority. Repeat
              until the treasury cannot pay for another attempt, then pass.
            </p>
            <div className="favor-stack">
              <Favor cost={`Give ${specialEnvoySpendFavor[session.climate]}`}>
                Alter the spending by any amount, including zero; you may also skip later attempts.
              </Favor>
              <Favor cost="Give 1">Target a specific eligible order.</Favor>
              <Favor cost="Give 3">Open trade with China instead.</Favor>
            </div>
            {session.mode === "two-player" ? (
              <PlayerButtonPrompt passAfterChoice>
                Use the holder only if the remaining eligible transfer is a choice between human
                owners, after all type and location priorities.
              </PlayerButtonPrompt>
            ) : null}
          </div>
        ) : reward === null ? (
          <p>The active climate offers no promise reward for the human Special Envoy outcome.</p>
        ) : (
          <Favor cost="Receive 1">
            Open an order in the home region of a Crown Presidency that has at least one Crown
            Writer.
          </Favor>
        )}
        {session.roles.superintendentChina.status === "not-in-play" ? (
          <button
            className="button"
            onClick={() => dispatch({ type: "activate-china" })}
            type="button"
          >
            Record successful China opening
          </button>
        ) : (
          <div className="branch-note">
            <p>
              The China office is in play. A successful opening requires the Chairman to hire a
              Writer there immediately, following normal Nepotism rules.
            </p>
            <RoleEditor holderOnly role="superintendentChina" />
          </div>
        )}
      </RuleSection>

      <RuleSection number="02" title="Transfers">
        <p>
          Make up to two transfers. Each transfer moves one Writer or ship from one Presidency or
          sea zone to another.
        </p>
        {crown ? (
          <div className="climate-decision">
            <p>
              In <strong>{climateLabels[session.climate]}</strong>, attempt the following list in
              order. Skip an impossible entry, stop when the list ends, and use the AI card to break
              origin or destination ties.
            </p>
            <ol className="priority-list">
              {directorTransferPriorities[session.climate].map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ol>
            <p>
              When choosing a ship, prefer Company ship → non-fatigued ship → Crown ship → human
              ship.
            </p>
            <div className="favor-stack">
              <Favor cost="Give 1">Prevent one transfer; it still uses one of the two slots.</Favor>
              <Favor cost="Give 2">
                Choose a Writer or ship transfer; it uses one slot and cannot undo a prior transfer.
              </Favor>
            </div>
          </div>
        ) : reward === null ? null : (
          <Favor cost="Receive 1">
            After the office acts, no Presidency has two or more ships or Writers than every other
            Presidency.
          </Favor>
        )}
      </RuleSection>
    </div>
  );
}

function GovernorGeneralProcedure() {
  const { session } = useSession();
  const governorGeneral = session.roles.governorGeneral;
  if (governorGeneral.status !== "occupied") return null;
  const crown = governorGeneral.occupant === "crown";
  const rule = governorGeneralRules[session.climate];

  return (
    <div className="phase-procedure" data-branch={crown ? "crown" : "human"}>
      <RuleSection number="01" title="Regional Income">
        <p>Add £3 to Company Balance for each Company-controlled region.</p>
      </RuleSection>
      <RuleSection number="02" title="Govern">
        <ol>
          <li>Spend any amount from the Governor General treasury and roll one die per £1.</li>
          <li>For each 6 rolled, add 1 unrest in every Company-controlled region.</li>
          <li>
            On failure, add 1 unrest in every Company-controlled region. Another attempt may be
            made.
          </li>
          <li>
            On success, gain £1 per Company-controlled region, resolve one result in every such
            region, and stop making Govern attempts.
          </li>
        </ol>
        {crown ? (
          <div className="climate-decision">
            <p>
              In <strong>{climateLabels[session.climate]}</strong>, attempt Govern while the Crown
              can roll at least <strong>{rule.minimumDice} dice</strong>. {rule.result}
            </p>
            <div className="favor-stack">
              <Favor cost="Give 1">Raise or lower the minimum by one die.</Favor>
              <Favor cost="Give 2">Choose another result after a successful Govern.</Favor>
            </div>
          </div>
        ) : (
          <div className="action-procedure">
            <p>
              For each Company-controlled region, choose Shipbuilding, Commission Regiment, or Tax.
              Shipbuilding places a Company ship in any sea zone, including China. Commissioning
              places a new Regiment in any Army. Tax adds £2 to Company Balance or any treasury
              except the Governor General's, then adds 1 unrest to a different Company-controlled
              region for each Tax this turn.
            </p>
            <Favor cost="Receive 1">
              Add money to a Crown office, place a Regiment in an Army associated with a Crown
              Presidency, or place a Company ship in a sea zone associated with a Crown Presidency.
            </Favor>
          </div>
        )}
      </RuleSection>
    </div>
  );
}

export function TradeDirectoratePhase() {
  const { session } = useSession();
  const governorGeneralInPlay = session.roles.governorGeneral.status !== "not-in-play";
  const role = governorGeneralInPlay ? "governorGeneral" : "directorOfTrade";

  return (
    <PhaseFrame
      copy={phaseCopy["round.trade-directorate"]}
      status={
        <span className="status-label">
          {governorGeneralInPlay ? "Governor General" : "Director"}
        </span>
      }
    >
      <OccupiedProcedure role={role}>
        {governorGeneralInPlay ? <GovernorGeneralProcedure /> : <DirectorOfTradeProcedure />}
      </OccupiedProcedure>
    </PhaseFrame>
  );
}

export function ShippingPhase() {
  const { session } = useSession();
  const assignment = session.roles.managerOfShipping;
  const crown = assignment.status === "occupied" && assignment.occupant === "crown";
  const buying = shippingCompanyShipRules[session.climate];

  return (
    <PhaseFrame copy={phaseCopy["round.shipping"]}>
      <OccupiedProcedure role="managerOfShipping">
        <div className="phase-procedure" data-branch={crown ? "crown" : "human"}>
          <RuleSection number="01" title="Fit ships">
            <p>
              Pay £3 per ship to move a ship from its Shipyard to any sea zone. The owner's consent
              is not required.
            </p>
            {crown ? (
              <div className="action-procedure">
                <p>Fit as many Crown ships as possible, then human ships.</p>
                <div className="favor-stack">
                  <Favor cost="Give 1">Fit a particular ship.</Favor>
                  <Favor cost="Receive 1">
                    When the Crown fits a human ship, the human must perform this favor if able,
                    before choosing its sea zone.
                  </Favor>
                </div>
                {session.mode === "two-player" ? (
                  <PlayerButtonPrompt passAfterChoice>
                    If ships belonging to both humans remain tied after Crown ships are exhausted,
                    the holder chooses the human owner, then passes the Button.
                  </PlayerButtonPrompt>
                ) : null}
              </div>
            ) : (
              <Favor cost="Receive 1">Fit a Crown ship.</Favor>
            )}
          </RuleSection>
          <RuleSection number="02" title="Buy Company ships">
            <p>
              Only when no ships remain on Shipyards, pay £5 per Company ship and place it in any
              sea zone.
            </p>
            {crown ? (
              <div className="climate-decision">
                <p>
                  <strong>{climateLabels[session.climate]}:</strong> {buying.default}
                </p>
                <div className="favor-stack">
                  {buying.changeDefault ? (
                    <Favor cost={`Give ${buying.changeDefault.cost}`}>
                      {buying.changeDefault.instruction}
                    </Favor>
                  ) : null}
                  {buying.anotherShipCost ? (
                    <Favor cost={`Give ${buying.anotherShipCost}`}>Buy another Company ship.</Favor>
                  ) : null}
                </div>
              </div>
            ) : null}
          </RuleSection>
          <RuleSection number="03" title="Lease Extra ships">
            <p>Pay £2 per Extra ship and place it in any sea zone.</p>
            {crown ? (
              <div className="action-procedure">
                <p>Spend as much remaining money as possible on Extra ships.</p>
                <Favor cost="Give 1">Leave £2 unspent instead.</Favor>
              </div>
            ) : null}
          </RuleSection>
          <RuleSection number="04" title="Place every ship">
            <p>
              Continue fitting, buying, and leasing until the Manager's treasury contains at most
              £2. Place every ship acquired this turn.
            </p>
            {crown ? (
              <div className="climate-decision">
                <p>
                  For each ship in <strong>{climateLabels[session.climate]}</strong>:{" "}
                  {shippingPlacementPriorities[session.climate]}
                </p>
                <Favor cost="Give 1">Choose its sea zone or China.</Favor>
              </div>
            ) : (
              <Favor cost="Receive 1">
                Place a ship in a Crown Presidency or in Crown Superintendent's China treasury.
              </Favor>
            )}
          </RuleSection>
        </div>
      </OccupiedProcedure>
    </PhaseFrame>
  );
}

function CommanderRecorder({ presidency }: { presidency: PresidencyId }) {
  const { session, dispatch } = useSession();
  const assignment = session.roles.commanders[presidency];
  const label = presidency[0].toUpperCase() + presidency.slice(1);

  const assign = (actor: ActorId) => {
    dispatch({ type: "assign-commander", presidency, actor });
  };

  return (
    <fieldset className="holder-control">
      <legend>{label} Commander</legend>
      <div>
        {(
          ["human-1", ...(session.mode === "two-player" ? (["human-2"] as const) : [])] as ActorId[]
        ).map((actor) => (
          <button
            aria-pressed={assignment.status === "occupied" && assignment.occupant === actor}
            key={actor}
            onClick={() => assign(actor)}
            type="button"
          >
            {session.mode === "two-player"
              ? session.playerNames[actor as "human-1" | "human-2"]
              : "You"}
          </button>
        ))}
        <button
          aria-pressed={assignment.status === "occupied" && assignment.occupant === "crown"}
          onClick={() => assign("crown")}
          type="button"
        >
          Crown
        </button>
      </div>
    </fieldset>
  );
}

export function MilitaryAffairsPhase() {
  const { session } = useSession();
  const assignment = session.roles.militaryAffairs;
  const crown = assignment.status === "occupied" && assignment.occupant === "crown";

  return (
    <PhaseFrame copy={phaseCopy["round.military-affairs"]}>
      <OccupiedProcedure role="militaryAffairs">
        <div className="phase-procedure" data-branch={crown ? "crown" : "human"}>
          <RuleSection number="01" title="Up to two transfers">
            <p>
              Each transfer moves one Officer or Regiment from one Army to another. A moved piece
              remains in the top half of its new Army box.
            </p>
            <fieldset className="state-panel">
              <legend>Transfer slots</legend>
              <label>
                <input type="checkbox" /> Transfer 1 resolved
              </label>
              <label>
                <input type="checkbox" /> Transfer 2 resolved
              </label>
            </fieldset>
            {crown ? (
              <div className="climate-decision">
                <p>
                  Attempt two transfers in <strong>{climateLabels[session.climate]}</strong>.{" "}
                  {militaryTransferPriorities[session.climate]} Prefer Regiment → Crown Officer →
                  human Officer. Skip any transfer that is impossible or would undo an earlier
                  transfer; use the AI-card arrows to break ties.
                </p>
                <div className="favor-stack">
                  <Favor cost="Give 1">
                    Choose an Officer or Regiment transfer; it uses one slot.
                  </Favor>
                  <Favor cost="Give 1">Prevent one transfer; it uses one slot.</Favor>
                </div>
              </div>
            ) : null}
          </RuleSection>
          <RuleSection number="02" title="Assign Officers-in-Training">
            <p>Assign every Officer-in-Training to an Army, in the top half of its Army box.</p>
            {crown ? (
              <div className="climate-decision">
                <p>
                  Assign human Officers first, then Crown Officers. Restart this priority list for
                  every piece; break remaining ties with the AI card's black arrow, then white
                  arrow.
                </p>
                <ol className="priority-list">
                  {officerTrainingPriorities[session.climate].map((priority) => (
                    <li key={priority}>{priority}</li>
                  ))}
                </ol>
                <Favor cost="Give 1">Assign one Officer to a chosen Presidency.</Favor>
                {session.mode === "two-player" ? (
                  <PlayerButtonPrompt passAfterChoice>
                    When both humans still own eligible Officers after the printed priorities, the
                    holder chooses the owner for that piece and passes only for that choice.
                  </PlayerButtonPrompt>
                ) : null}
              </div>
            ) : null}
          </RuleSection>
          <RuleSection number="03" title="Assign Commanders">
            <p>
              For each Army, assign a new Commander if the slot is vacant or another family has more
              total pieces than the current Commander's family. Choose among families tied for the
              most pieces and move one of that family's Officers into the Commander slot. A replaced
              Commander returns to the top half as an Officer; this is not Hiring.
            </p>
            {crown ? (
              <p>The Crown assigns its own Officer whenever the Crown is an eligible family.</p>
            ) : (
              <Favor cost="Receive 1">
                Assign a Crown Officer as Commander; this is mandatory even when there is no other
                choice.
              </Favor>
            )}
            <div className="role-ledger__grid" aria-label="Record Commander assignments">
              {PRESIDENCIES.map((presidency) => (
                <CommanderRecorder key={presidency} presidency={presidency} />
              ))}
            </div>
          </RuleSection>
        </div>
      </OccupiedProcedure>
    </PhaseFrame>
  );
}

export function ChinaPhase() {
  const { session } = useSession();
  const superintendent = session.roles.superintendentChina;
  const crown = superintendent.status === "occupied" && superintendent.occupant === "crown";

  return (
    <PhaseFrame copy={phaseCopy["round.china"]}>
      <OccupiedProcedure role="superintendentChina">
        <div className="phase-procedure" data-branch={crown ? "crown" : "human"}>
          <RuleSection number="01" title="China treasury">
            <p>
              This treasury contains only ships. Shipping or the Director of Trade may send ships
              here as though China were a sea zone. For storms, expenses, events, and laws, these
              ships count as being in the Eastern sea zone.
            </p>
          </RuleSection>
          <RuleSection number="02" title="Trade in China">
            <p>
              Attempt this check at most once this turn, and only if a Company-controlled region has
              an export icon. Roll one die per ship in the Superintendent's treasury.
            </p>
            <p>
              On success, for every export icon in all Company-controlled regions, increase Company
              Balance by £4 and give the officeholder £1 from the bank.
            </p>
            {crown ? (
              <div className="climate-decision">
                <p>
                  In <strong>{climateLabels[session.climate]}</strong>, roll as many dice as
                  possible only if the Crown can roll at least{" "}
                  <strong>{chinaMinimumDice[session.climate]} dice</strong>.
                </p>
                <Favor cost="Give 1">Raise or lower the minimum by one die.</Favor>
              </div>
            ) : null}
          </RuleSection>
        </div>
      </OccupiedProcedure>
    </PhaseFrame>
  );
}
