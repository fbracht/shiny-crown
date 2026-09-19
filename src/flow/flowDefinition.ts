import type { GameSessionV1, PhaseId, RoleAssignment } from "../app/session/types";

export const SETUP_FLOW: PhaseId[] = [
  "setup.configure",
  "setup.table",
  "setup.crown",
  "setup.cards",
  "setup.finish",
  "setup.ai",
];

export const ROUND_FLOW: PhaseId[] = [
  "round.deregulation-vote",
  "round.london-season",
  "round.family",
  "round.firms",
  "round.hiring",
  "round.chairman",
  "round.trade-directorate",
  "round.shipping",
  "round.military-affairs",
  "round.presidency.bombay",
  "round.presidency.madras",
  "round.presidency.bengal",
  "round.china",
  "round.bonuses",
  "round.firm-revenue",
  "round.company-revenue",
  "round.events-india",
  "round.parliament",
  "round.upkeep-refresh",
];

type TransitionOptions = {
  firmRevenuePresent?: boolean;
};

export type FlowTransition = {
  nextPhaseId: PhaseId;
  skippedPhaseIds: PhaseId[];
};

function active(assignment: RoleAssignment) {
  return assignment.status === "occupied";
}

export function phaseIsAvailable(
  phaseId: PhaseId,
  session: GameSessionV1,
  options: TransitionOptions = {},
) {
  switch (phaseId) {
    case "round.deregulation-vote":
      return (
        !session.deregulated && (session.scenario === "1758" || session.scenario === "long-1710")
      );
    case "round.london-season":
      return !session.firstTurn;
    case "round.firms":
      return session.deregulated;
    case "round.chairman":
      return active(session.roles.chairman);
    case "round.trade-directorate": {
      const office =
        session.roles.governorGeneral.status === "not-in-play"
          ? session.roles.directorOfTrade
          : session.roles.governorGeneral;
      return active(office);
    }
    case "round.shipping":
      return active(session.roles.managerOfShipping);
    case "round.military-affairs":
      return active(session.roles.militaryAffairs);
    case "round.china":
      return active(session.roles.superintendentChina);
    case "round.firm-revenue":
      return session.deregulated && options.firmRevenuePresent === true;
    case "game.scoring":
      return session.progress.endReason !== null;
    default:
      return true;
  }
}

function scan(
  flow: PhaseId[],
  startIndex: number,
  session: GameSessionV1,
  options: TransitionOptions,
): FlowTransition {
  const skippedPhaseIds: PhaseId[] = [];
  for (let index = startIndex; index < flow.length; index += 1) {
    const candidate = flow[index];
    if (phaseIsAvailable(candidate, session, options)) {
      return { nextPhaseId: candidate, skippedPhaseIds };
    }
    skippedPhaseIds.push(candidate);
  }
  return { nextPhaseId: "round.upkeep-refresh", skippedPhaseIds };
}

export function nextPhase(session: GameSessionV1, options: TransitionOptions = {}): FlowTransition {
  if (session.progress.endReason !== null && session.progress.phaseId !== "game.scoring") {
    return { nextPhaseId: "game.scoring", skippedPhaseIds: [] };
  }

  const current = session.progress.phaseId;
  const setupIndex = SETUP_FLOW.indexOf(current);
  if (setupIndex >= 0) {
    if (current !== "setup.ai") {
      return { nextPhaseId: SETUP_FLOW[setupIndex + 1], skippedPhaseIds: [] };
    }
    return scan(ROUND_FLOW, 0, session, options);
  }

  const roundIndex = ROUND_FLOW.indexOf(current);
  if (roundIndex >= 0 && current !== "round.upkeep-refresh") {
    return scan(ROUND_FLOW, roundIndex + 1, session, options);
  }

  return { nextPhaseId: current, skippedPhaseIds: [] };
}

export function firstPhaseOfTurn(session: GameSessionV1): FlowTransition {
  return scan(ROUND_FLOW, 0, session, {});
}
