import {
  type ActorId,
  type GameMode,
  type GameSessionV1,
  type GovernorAssignment,
  type PhaseId,
  type PhaseState,
  type PresidencyActionId,
  type PresidencyId,
  PRESIDENCIES,
  REGIONS,
  type RoleAssignment,
  type RoleState,
  SCHEMA_VERSION,
  type Scenario,
} from "./types";

export function notInPlay(previousOccupant?: ActorId): RoleAssignment {
  return previousOccupant === undefined
    ? { status: "not-in-play" }
    : { status: "not-in-play", previousOccupant };
}

export function vacant(previousOccupant?: ActorId): RoleAssignment {
  return previousOccupant === undefined
    ? { status: "vacant" }
    : { status: "vacant", previousOccupant };
}

export function occupied(occupant: ActorId, previousOccupant?: ActorId): RoleAssignment {
  return previousOccupant === undefined
    ? { status: "occupied", occupant }
    : { status: "occupied", occupant, previousOccupant };
}

export function createInitialRoles(): RoleState {
  return {
    chairman: vacant(),
    directorOfTrade: vacant(),
    governorGeneral: notInPlay(),
    managerOfShipping: vacant(),
    militaryAffairs: vacant(),
    presidents: {
      bombay: vacant(),
      madras: vacant(),
      bengal: vacant(),
    },
    commanders: {
      bombay: vacant(),
      madras: vacant(),
      bengal: vacant(),
    },
    governors: Object.fromEntries(
      REGIONS.map((region) => [region, notInPlay() as GovernorAssignment]),
    ) as RoleState["governors"],
    superintendentChina: notInPlay(),
    primeMinister: vacant(),
    oppositionLeader: null,
  };
}

export function createPhaseState(phaseId: PhaseId, actions: PresidencyActionId[] = []): PhaseState {
  if (phaseId === "setup.cards") {
    return { phaseId, dealRound: 0 };
  }

  if (phaseId.startsWith("round.presidency.")) {
    return {
      phaseId: phaseId as `round.presidency.${PresidencyId}`,
      order: actions,
      completed: [],
    };
  }

  if (phaseId === "round.firm-revenue") {
    return { phaseId, firmLabels: [], completedFirmLabels: [] };
  }

  return { phaseId } as PhaseState;
}

export function createInitialSession(mode: GameMode, scenario: Scenario = "1710"): GameSessionV1 {
  return {
    schemaVersion: SCHEMA_VERSION,
    mode,
    difficulty: "normal",
    scenario,
    turn: 1,
    firstTurn: true,
    climate: "bull",
    deregulated: scenario === "1813",
    roles: createInitialRoles(),
    twoPlayer: mode === "two-player" ? { buttonHolder: "human-1" } : null,
    progress: {
      phaseId: "setup.configure",
      phaseState: createPhaseState("setup.configure"),
      endReason: null,
    },
    history: [],
  };
}

export function defaultPresidencyOrder(presidency: PresidencyId, roles: RoleState) {
  const actions: PresidencyActionId[] = [];
  const president = roles.presidents[presidency];

  for (const region of REGIONS) {
    const governor = roles.governors[region];
    if (governor.status !== "not-in-play" && governor.associatedPresidency === presidency) {
      actions.push(`governor:${region}`);
    }
  }

  if (roles.commanders[presidency].status === "occupied") {
    actions.push("commander");
  }

  if (president.status === "occupied") {
    actions.push("trade");
  }

  if (president.status === "occupied" && president.occupant === "crown") {
    return actions;
  }

  return [...actions].reverse();
}

export function createPresidencyState(presidency: PresidencyId, roles: RoleState): PhaseState {
  const phaseId = `round.presidency.${presidency}` as const;
  return {
    phaseId,
    order: defaultPresidencyOrder(presidency, roles),
    completed: [],
  };
}

export function isPresidencyId(value: string): value is PresidencyId {
  return PRESIDENCIES.includes(value as PresidencyId);
}
