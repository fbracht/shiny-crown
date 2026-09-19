export const SCHEMA_VERSION = 1 as const;

export const CLIMATES = ["bull", "stag", "lion", "bear", "peacock"] as const;
export const DIFFICULTIES = ["easy", "normal", "hard", "expert", "legendary"] as const;
export const SCENARIOS = ["1710", "1758", "1813", "long-1710"] as const;
export const PRESIDENCIES = ["bombay", "madras", "bengal"] as const;
export const REGIONS = [
  "bombay",
  "madras",
  "bengal",
  "punjab",
  "delhi",
  "maratha",
  "mysore",
  "hyderabad",
] as const;

export const PHASE_IDS = [
  "setup.configure",
  "setup.table",
  "setup.crown",
  "setup.cards",
  "setup.finish",
  "setup.ai",
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
  "game.scoring",
] as const;

export type GameMode = "solo" | "two-player";
export type HumanId = "human-1" | "human-2";
export type ActorId = HumanId | "crown";
export type Difficulty = (typeof DIFFICULTIES)[number];
export type Scenario = (typeof SCENARIOS)[number];
export type ClimateId = (typeof CLIMATES)[number];
export type PresidencyId = (typeof PRESIDENCIES)[number];
export type RegionId = (typeof REGIONS)[number];
export type PhaseId = (typeof PHASE_IDS)[number];
export type EndReason = "scenario-end" | "company-failure";

export type RoleAssignment =
  | { status: "not-in-play"; previousOccupant?: ActorId }
  | { status: "vacant"; previousOccupant?: ActorId }
  | { status: "occupied"; occupant: ActorId; previousOccupant?: ActorId };

export type GovernorAssignment = RoleAssignment & {
  associatedPresidency?: PresidencyId;
};

export type RoleRef =
  | "chairman"
  | "directorOfTrade"
  | "governorGeneral"
  | "managerOfShipping"
  | "militaryAffairs"
  | "superintendentChina"
  | "primeMinister"
  | `president:${PresidencyId}`
  | `commander:${PresidencyId}`
  | `governor:${RegionId}`;

export type PresidencyActionId = "trade" | "commander" | `governor:${RegionId}`;
export type PresidencyPhaseId = `round.presidency.${PresidencyId}`;

export type PhaseState =
  | { phaseId: "setup.cards"; dealRound: number }
  | {
      phaseId: PresidencyPhaseId;
      order: PresidencyActionId[];
      completed: PresidencyActionId[];
    }
  | { phaseId: "round.firm-revenue"; firmLabels: string[]; completedFirmLabels: string[] }
  | {
      phaseId: Exclude<PhaseId, PresidencyPhaseId | "setup.cards" | "round.firm-revenue">;
    };

export type RoleState = {
  chairman: RoleAssignment;
  directorOfTrade: RoleAssignment;
  governorGeneral: RoleAssignment;
  managerOfShipping: RoleAssignment;
  militaryAffairs: RoleAssignment;
  presidents: Record<PresidencyId, RoleAssignment>;
  commanders: Record<PresidencyId, RoleAssignment>;
  governors: Record<RegionId, GovernorAssignment>;
  superintendentChina: RoleAssignment;
  primeMinister: RoleAssignment;
  oppositionLeader: ActorId | null;
};

export type SessionProgress = {
  phaseId: PhaseId;
  phaseState: PhaseState;
  endReason: EndReason | null;
};

export type SessionFacts = {
  schemaVersion: typeof SCHEMA_VERSION;
  mode: GameMode;
  difficulty: Difficulty;
  scenario: Scenario;
  turn: number;
  firstTurn: boolean;
  climate: ClimateId;
  deregulated: boolean;
  roles: RoleState;
  twoPlayer: null | { buttonHolder: HumanId };
  progress: SessionProgress;
};

export type NavigationSnapshot = {
  facts: SessionFacts;
  skippedPhaseIds: PhaseId[];
};

export type GameSessionV1 = SessionFacts & {
  history: NavigationSnapshot[];
};

export type BackMode = "keep-current" | "restore-boundary";

export type PresidencyPhaseState = Extract<PhaseState, { phaseId: PresidencyPhaseId }>;

export function isPresidencyPhaseState(state: PhaseState): state is PresidencyPhaseState {
  return state.phaseId.startsWith("round.presidency.");
}

export type AdvanceIntent =
  | { type: "ordinary" }
  | { type: "skip-deregulation-vote" }
  | { type: "firms-present"; present: boolean }
  | { type: "finish-upkeep"; finalTurn: boolean };
