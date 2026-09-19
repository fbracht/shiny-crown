import { firstPhaseOfTurn, nextPhase } from "../../flow/flowDefinition";
import { createPhaseState, createPresidencyState, notInPlay, occupied, vacant } from "./factories";
import { actorIsAllowed, getRole, setRole } from "./roles";
import { isPresidencyPhaseState } from "./types";
import type {
  ActorId,
  AdvanceIntent,
  BackMode,
  ClimateId,
  Difficulty,
  GameMode,
  GameSessionV1,
  GovernorAssignment,
  HumanId,
  NavigationSnapshot,
  PhaseId,
  PresidencyActionId,
  PresidencyId,
  RegionId,
  RoleAssignment,
  RoleRef,
  Scenario,
  SessionFacts,
} from "./types";

export type SessionAction =
  | { type: "set-mode"; mode: GameMode }
  | { type: "set-difficulty"; difficulty: Difficulty }
  | { type: "set-scenario"; scenario: Scenario }
  | { type: "set-climate"; climate: ClimateId }
  | {
      type: "set-role";
      role: RoleRef;
      assignment: RoleAssignment | GovernorAssignment;
    }
  | { type: "promote"; from: RoleRef; to: RoleRef; actor: ActorId }
  | { type: "activate-deregulation" }
  | { type: "replace-trade-director" }
  | { type: "activate-china" }
  | { type: "create-governor"; region: RegionId; presidency: PresidencyId }
  | { type: "lose-region"; region: RegionId; presidency: PresidencyId }
  | { type: "assign-commander"; presidency: PresidencyId; actor: ActorId }
  | { type: "set-prime-minister"; actor: ActorId | null }
  | { type: "set-opposition-leader"; actor: ActorId | null }
  | { type: "transfer-button"; holder: HumanId }
  | { type: "resolve-button-choice"; pass: boolean }
  | { type: "set-setup-card-round"; dealRound: number }
  | { type: "set-presidency-order"; order: PresidencyActionId[] }
  | { type: "complete-presidency-action"; actionId: PresidencyActionId; complete: boolean }
  | { type: "set-firm-labels"; labels: string[] }
  | { type: "complete-firm"; label: string; complete: boolean }
  | { type: "advance"; intent?: AdvanceIntent }
  | { type: "back"; mode: BackMode }
  | { type: "end-game"; reason: "scenario-end" | "company-failure" }
  | { type: "cancel-end-game" }
  | { type: "restore-session"; session: GameSessionV1 };

export function sessionFacts(session: GameSessionV1): SessionFacts {
  const facts: Partial<GameSessionV1> = structuredClone(session);
  delete facts.history;
  return facts as SessionFacts;
}

function snapshot(session: GameSessionV1, skippedPhaseIds: PhaseId[] = []): NavigationSnapshot {
  return { facts: sessionFacts(session), skippedPhaseIds };
}

function nextStateForPhase(session: GameSessionV1, phaseId: PhaseId) {
  const phaseState = phaseId.startsWith("round.presidency.")
    ? createPresidencyState(
        phaseId.slice("round.presidency.".length) as PresidencyId,
        session.roles,
      )
    : createPhaseState(phaseId);
  return {
    ...session,
    progress: { ...session.progress, phaseId, phaseState },
  };
}

function replaceHumanTwo(assignment: RoleAssignment | GovernorAssignment) {
  if (assignment.status === "occupied" && assignment.occupant === "human-2") {
    return vacant("human-2");
  }
  return assignment;
}

function changeMode(session: GameSessionV1, mode: GameMode): GameSessionV1 {
  if (session.progress.phaseId !== "setup.configure") return session;
  if (mode === "two-player" && session.difficulty === "legendary") {
    throw new Error("Legendary two-player setup is not sourced.");
  }
  if (mode === "two-player") {
    return { ...session, mode, twoPlayer: { buttonHolder: "human-1" } };
  }
  const roles = {
    ...session.roles,
    chairman: replaceHumanTwo(session.roles.chairman),
    directorOfTrade: replaceHumanTwo(session.roles.directorOfTrade),
    governorGeneral: replaceHumanTwo(session.roles.governorGeneral),
    managerOfShipping: replaceHumanTwo(session.roles.managerOfShipping),
    militaryAffairs: replaceHumanTwo(session.roles.militaryAffairs),
    superintendentChina: replaceHumanTwo(session.roles.superintendentChina),
    primeMinister: replaceHumanTwo(session.roles.primeMinister),
    oppositionLeader:
      session.roles.oppositionLeader === "human-2" ? null : session.roles.oppositionLeader,
    presidents: Object.fromEntries(
      Object.entries(session.roles.presidents).map(([id, role]) => [id, replaceHumanTwo(role)]),
    ) as GameSessionV1["roles"]["presidents"],
    commanders: Object.fromEntries(
      Object.entries(session.roles.commanders).map(([id, role]) => [id, replaceHumanTwo(role)]),
    ) as GameSessionV1["roles"]["commanders"],
    governors: Object.fromEntries(
      Object.entries(session.roles.governors).map(([id, role]) => [id, replaceHumanTwo(role)]),
    ) as GameSessionV1["roles"]["governors"],
  };
  return { ...session, mode, roles, twoPlayer: null };
}

function setRoleSafely(
  session: GameSessionV1,
  role: RoleRef,
  assignment: RoleAssignment | GovernorAssignment,
) {
  if (assignment.status === "occupied" && !actorIsAllowed(session, assignment.occupant)) {
    throw new Error("human-2 cannot be assigned in a solo session.");
  }
  if (role.startsWith("governor:") && assignment.status !== "not-in-play") {
    const governor = assignment as GovernorAssignment;
    if (!governor.associatedPresidency) {
      throw new Error("An in-play Governor requires a Presidency association.");
    }
    if (session.roles.governorGeneral.status !== "not-in-play") {
      throw new Error("Regional Governors cannot exist while Governor General is in play.");
    }
  }

  let roles = setRole(session.roles, role, assignment);
  if (role === "directorOfTrade" && assignment.status !== "not-in-play") {
    roles = setRole(roles, "governorGeneral", notInPlay());
  }
  if (role === "governorGeneral" && assignment.status !== "not-in-play") {
    roles = setRole(roles, "directorOfTrade", notInPlay());
    roles = {
      ...roles,
      governors: Object.fromEntries(
        Object.entries(roles.governors).map(([id, governor]) => [
          id,
          notInPlay(governor.status === "occupied" ? governor.occupant : governor.previousOccupant),
        ]),
      ) as typeof roles.governors,
    };
  }
  return { ...session, roles };
}

function globalFingerprint(facts: SessionFacts) {
  const { progress, ...global } = facts;
  return JSON.stringify({ ...global, endReason: progress.endReason });
}

export function boundaryHasChanges(session: GameSessionV1) {
  const previous = session.history.at(-1);
  if (!previous) return false;
  return globalFingerprint(sessionFacts(session)) !== globalFingerprint(previous.facts);
}

function advance(session: GameSessionV1, intent: AdvanceIntent = { type: "ordinary" }) {
  if (session.progress.phaseId === "round.upkeep-refresh") {
    if (intent.type !== "finish-upkeep") return session;
    if (intent.finalTurn) {
      return sessionReducer(session, { type: "end-game", reason: "scenario-end" });
    }
    const nextTurn: GameSessionV1 = {
      ...session,
      turn: session.turn + 1,
      firstTurn: false,
    };
    const transition = firstPhaseOfTurn(nextTurn);
    const moved = nextStateForPhase(nextTurn, transition.nextPhaseId);
    return {
      ...moved,
      history: [...session.history, snapshot(session, transition.skippedPhaseIds)],
    };
  }

  const transition = nextPhase(session, {
    firmRevenuePresent: intent.type === "firms-present" && intent.present,
  });
  if (transition.nextPhaseId === session.progress.phaseId) return session;
  const moved = nextStateForPhase(session, transition.nextPhaseId);
  return {
    ...moved,
    history: [...session.history, snapshot(session, transition.skippedPhaseIds)],
  };
}

function goBack(session: GameSessionV1, mode: BackMode) {
  const previous = session.history.at(-1);
  if (!previous) return session;
  const history = session.history.slice(0, -1);
  if (mode === "restore-boundary") {
    return { ...structuredClone(previous.facts), history };
  }
  return {
    ...session,
    progress: structuredClone(previous.facts.progress),
    history,
  };
}

export function sessionReducer(session: GameSessionV1, action: SessionAction): GameSessionV1 {
  switch (action.type) {
    case "set-mode":
      return changeMode(session, action.mode);
    case "set-difficulty":
      if (session.mode === "two-player" && action.difficulty === "legendary") {
        throw new Error("Legendary two-player setup is not sourced.");
      }
      return { ...session, difficulty: action.difficulty };
    case "set-scenario":
      return {
        ...session,
        scenario: action.scenario,
        deregulated: action.scenario === "1813",
      };
    case "set-climate":
      return { ...session, climate: action.climate };
    case "set-role":
      return setRoleSafely(session, action.role, action.assignment);
    case "promote": {
      if (!actorIsAllowed(session, action.actor))
        throw new Error("Actor is invalid for this mode.");
      const from = getRole(session.roles, action.from);
      let roles = setRole(
        session.roles,
        action.from,
        vacant(from.status === "occupied" ? from.occupant : from.previousOccupant),
      );
      const destination = getRole(roles, action.to);
      roles = setRole(
        roles,
        action.to,
        occupied(
          action.actor,
          destination.status === "occupied" ? destination.occupant : destination.previousOccupant,
        ),
      );
      return { ...session, roles };
    }
    case "activate-deregulation":
      return { ...session, deregulated: true };
    case "replace-trade-director": {
      const director = session.roles.directorOfTrade;
      const governorGeneral =
        director.status === "occupied"
          ? occupied(director.occupant, director.previousOccupant)
          : vacant(director.previousOccupant);
      return setRoleSafely(session, "governorGeneral", governorGeneral);
    }
    case "activate-china":
      return setRoleSafely(session, "superintendentChina", vacant());
    case "create-governor":
      return setRoleSafely(session, `governor:${action.region}`, {
        status: "vacant",
        associatedPresidency: action.presidency,
      });
    case "lose-region": {
      let next = setRoleSafely(session, `governor:${action.region}`, notInPlay());
      next = setRoleSafely(next, `commander:${action.presidency}`, vacant());
      return next;
    }
    case "assign-commander":
      return setRoleSafely(session, `commander:${action.presidency}`, occupied(action.actor));
    case "set-prime-minister":
      return setRoleSafely(
        session,
        "primeMinister",
        action.actor === null ? vacant() : occupied(action.actor),
      );
    case "set-opposition-leader":
      if (action.actor && !actorIsAllowed(session, action.actor)) return session;
      return { ...session, roles: { ...session.roles, oppositionLeader: action.actor } };
    case "transfer-button":
      return session.twoPlayer
        ? { ...session, twoPlayer: { buttonHolder: action.holder } }
        : session;
    case "resolve-button-choice":
      if (!session.twoPlayer || !action.pass) return session;
      return {
        ...session,
        twoPlayer: {
          buttonHolder: session.twoPlayer.buttonHolder === "human-1" ? "human-2" : "human-1",
        },
      };
    case "set-setup-card-round":
      if (session.progress.phaseState.phaseId !== "setup.cards") return session;
      return {
        ...session,
        progress: {
          ...session.progress,
          phaseState: {
            ...session.progress.phaseState,
            dealRound: Math.max(0, action.dealRound),
          },
        },
      };
    case "set-presidency-order": {
      const local = session.progress.phaseState;
      if (!isPresidencyPhaseState(local)) return session;
      if (
        action.order.length !== local.order.length ||
        action.order.some((item) => !local.order.includes(item))
      ) {
        throw new Error("Presidency order must contain every eligible action exactly once.");
      }
      return {
        ...session,
        progress: {
          ...session.progress,
          phaseState: { ...local, order: action.order },
        },
      };
    }
    case "complete-presidency-action": {
      const local = session.progress.phaseState;
      if (!isPresidencyPhaseState(local) || !local.order.includes(action.actionId)) {
        return session;
      }
      const completed = action.complete
        ? [...new Set([...local.completed, action.actionId])]
        : local.completed.filter((item) => item !== action.actionId);
      return {
        ...session,
        progress: { ...session.progress, phaseState: { ...local, completed } },
      };
    }
    case "set-firm-labels":
      if (session.progress.phaseState.phaseId !== "round.firm-revenue") return session;
      return {
        ...session,
        progress: {
          ...session.progress,
          phaseState: {
            ...session.progress.phaseState,
            firmLabels: [...new Set(action.labels.map((label) => label.trim()).filter(Boolean))],
            completedFirmLabels: session.progress.phaseState.completedFirmLabels.filter((label) =>
              action.labels.includes(label),
            ),
          },
        },
      };
    case "complete-firm": {
      const local = session.progress.phaseState;
      if (local.phaseId !== "round.firm-revenue" || !local.firmLabels.includes(action.label))
        return session;
      const completedFirmLabels = action.complete
        ? [...new Set([...local.completedFirmLabels, action.label])]
        : local.completedFirmLabels.filter((label) => label !== action.label);
      return {
        ...session,
        progress: { ...session.progress, phaseState: { ...local, completedFirmLabels } },
      };
    }
    case "advance":
      return advance(session, action.intent);
    case "back":
      return goBack(session, action.mode);
    case "end-game": {
      const previous = snapshot(session);
      const ended = nextStateForPhase(
        { ...session, progress: { ...session.progress, endReason: action.reason } },
        "game.scoring",
      );
      return { ...ended, history: [...session.history, previous] };
    }
    case "cancel-end-game":
      return { ...session, progress: { ...session.progress, endReason: null } };
    case "restore-session":
      return structuredClone(action.session);
  }
}
