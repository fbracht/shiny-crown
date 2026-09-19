import {
  CLIMATES,
  DIFFICULTIES,
  PHASE_IDS,
  PRESIDENCIES,
  REGIONS,
  SCENARIOS,
  SCHEMA_VERSION,
  type ActorId,
  type GameSessionV1,
  type GovernorAssignment,
  type PhaseState,
  type RoleAssignment,
} from "./types";
import { getRole, roleRefs } from "./roles";

export type ValidationResult = { ok: true; value: GameSessionV1 } | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isActor(value: unknown): value is ActorId {
  return value === "human-1" || value === "human-2" || value === "crown";
}

function validateRole(value: unknown, path: string, errors: string[]) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }
  if (!["not-in-play", "vacant", "occupied"].includes(String(value.status))) {
    errors.push(`${path}.status is invalid.`);
    return;
  }
  if (value.status === "occupied" && !isActor(value.occupant)) {
    errors.push(`${path}.occupant is required when occupied.`);
  }
  if (value.status !== "occupied" && "occupant" in value) {
    errors.push(`${path}.occupant is only valid when occupied.`);
  }
  if (value.previousOccupant !== undefined && !isActor(value.previousOccupant)) {
    errors.push(`${path}.previousOccupant is invalid.`);
  }
}

function validatePhaseState(
  value: unknown,
  phaseId: string,
  errors: string[],
): value is PhaseState {
  if (!isRecord(value) || value.phaseId !== phaseId) {
    errors.push("progress.phaseState must match progress.phaseId.");
    return false;
  }
  if (
    phaseId === "setup.cards" &&
    (!Number.isInteger(value.dealRound) || Number(value.dealRound) < 0)
  ) {
    errors.push("setup.cards dealRound must be a non-negative integer.");
  }
  if (phaseId.startsWith("round.presidency.")) {
    if (!Array.isArray(value.order) || !Array.isArray(value.completed)) {
      errors.push("Presidency progress requires order and completed arrays.");
    } else if (value.completed.some((entry) => !(value.order as unknown[]).includes(entry))) {
      errors.push("Completed Presidency actions must be in the selected order.");
    }
  }
  if (phaseId === "round.firm-revenue") {
    if (!Array.isArray(value.firmLabels) || !Array.isArray(value.completedFirmLabels)) {
      errors.push("Firm Revenue progress requires firm label arrays.");
    }
  }
  return true;
}

function containsHumanTwo(value: unknown): boolean {
  if (value === "human-2") return true;
  if (Array.isArray(value)) return value.some(containsHumanTwo);
  if (!isRecord(value)) return false;
  return Object.values(value).some(containsHumanTwo);
}

export function validateSession(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["Save data must be an object."] };

  if (value.schemaVersion !== SCHEMA_VERSION) errors.push("Unsupported schema version.");
  if (value.mode !== "solo" && value.mode !== "two-player") errors.push("mode is invalid.");
  if (!DIFFICULTIES.includes(value.difficulty as never)) errors.push("difficulty is invalid.");
  if (!SCENARIOS.includes(value.scenario as never)) errors.push("scenario is invalid.");
  if (!CLIMATES.includes(value.climate as never)) errors.push("climate is invalid.");
  if (!Number.isInteger(value.turn) || Number(value.turn) < 1)
    errors.push("turn must be at least 1.");
  if (typeof value.firstTurn !== "boolean") errors.push("firstTurn must be boolean.");
  if (typeof value.deregulated !== "boolean") errors.push("deregulated must be boolean.");
  if (!isRecord(value.roles)) errors.push("roles must be an object.");
  if (!isRecord(value.progress)) errors.push("progress must be an object.");
  if (!Array.isArray(value.history)) errors.push("history must be an array.");

  if (isRecord(value.roles)) {
    for (const role of roleRefs())
      validateRole(getRole(value.roles as never, role), `roles.${role}`, errors);
    if (!isActor(value.roles.oppositionLeader) && value.roles.oppositionLeader !== null) {
      errors.push("roles.oppositionLeader is invalid.");
    }

    const director = value.roles.directorOfTrade as RoleAssignment;
    const governorGeneral = value.roles.governorGeneral as RoleAssignment;
    if (director?.status !== "not-in-play" && governorGeneral?.status !== "not-in-play") {
      errors.push("Director of Trade and Governor General cannot both be in play.");
    }

    if (governorGeneral?.status !== "not-in-play") {
      const governors = value.roles.governors as Record<string, GovernorAssignment>;
      if (REGIONS.some((region) => governors?.[region]?.status !== "not-in-play")) {
        errors.push("Governor General requires every regional Governor to be not in play.");
      }
    }

    const governors = value.roles.governors as Record<string, GovernorAssignment>;
    for (const region of REGIONS) {
      const governor = governors?.[region];
      if (
        governor?.status !== "not-in-play" &&
        !PRESIDENCIES.includes(governor.associatedPresidency as never)
      ) {
        errors.push(`Governor ${region} needs an associated Presidency.`);
      }
    }
  }

  if (value.mode === "solo") {
    if (value.twoPlayer !== null) errors.push("Solo sessions cannot contain two-player state.");
    if (containsHumanTwo(value.roles)) errors.push("Solo sessions cannot assign human-2.");
  }
  if (value.mode === "two-player") {
    if (
      !isRecord(value.twoPlayer) ||
      !["human-1", "human-2"].includes(String(value.twoPlayer.buttonHolder))
    ) {
      errors.push("Two-player sessions require a valid Button holder.");
    }
    if (value.difficulty === "legendary") errors.push("Legendary two-player setup is not sourced.");
  }

  if (value.scenario === "1813" && value.deregulated !== true) {
    errors.push("The 1813 scenario must begin and remain deregulated.");
  }

  if (isRecord(value.progress)) {
    if (!PHASE_IDS.includes(value.progress.phaseId as never))
      errors.push("progress.phaseId is invalid.");
    if (
      value.progress.endReason !== null &&
      value.progress.endReason !== "scenario-end" &&
      value.progress.endReason !== "company-failure"
    ) {
      errors.push("progress.endReason is invalid.");
    }
    if (typeof value.progress.phaseId === "string") {
      validatePhaseState(value.progress.phaseState, value.progress.phaseId, errors);
    }
    if (value.progress.phaseId === "round.china" && isRecord(value.roles)) {
      const china = value.roles.superintendentChina as RoleAssignment;
      if (china?.status !== "occupied")
        errors.push("China cannot be visited unless its office is occupied.");
    }
  }

  return errors.length === 0
    ? { ok: true, value: value as unknown as GameSessionV1 }
    : { ok: false, errors };
}

export function assertValidSession(value: GameSessionV1) {
  const result = validateSession(value);
  if (!result.ok) throw new Error(result.errors.join(" "));
  return result.value;
}
