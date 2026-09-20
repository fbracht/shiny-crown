import { createInitialSession, createPhaseState } from "./factories";
import {
  CLIMATES,
  DIFFICULTIES,
  PHASE_IDS,
  SCENARIOS,
  SCHEMA_VERSION,
  type GameMode,
  type GameSessionV1,
  type PhaseId,
  type Scenario,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function migrateSession(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (value.schemaVersion === SCHEMA_VERSION) return value;
  if (value.schemaVersion === 1) {
    const playerNames = {
      "human-1": "Player 1",
      "human-2": "Player 2",
    };
    return {
      ...value,
      schemaVersion: SCHEMA_VERSION,
      playerNames,
      history: Array.isArray(value.history)
        ? value.history.map((entry) =>
            isRecord(entry) && isRecord(entry.facts)
              ? { ...entry, facts: { ...entry.facts, schemaVersion: SCHEMA_VERSION, playerNames } }
              : entry,
          )
        : value.history,
    };
  }
  if (value.schemaVersion !== 0) return value;

  const rawMode = value.mode ?? value.gameMode;
  const mode: GameMode = rawMode === "two-player" ? "two-player" : "solo";
  const rawScenario = value.scenario;
  const scenario: Scenario = SCENARIOS.includes(rawScenario as never)
    ? (rawScenario as Scenario)
    : "1710";
  const session = createInitialSession(mode, scenario);

  if (DIFFICULTIES.includes(value.difficulty as never)) {
    session.difficulty =
      mode === "two-player" && value.difficulty === "legendary"
        ? "expert"
        : (value.difficulty as GameSessionV1["difficulty"]);
  }
  if (CLIMATES.includes(value.climate as never)) {
    session.climate = value.climate as GameSessionV1["climate"];
  }
  if (Number.isInteger(value.turn) && Number(value.turn) >= 1) {
    session.turn = Number(value.turn);
    session.firstTurn = session.turn === 1;
  }
  if (typeof value.deregulated === "boolean") {
    session.deregulated = scenario === "1813" ? true : value.deregulated;
  }

  const rawPhase = value.phaseId ?? value.currentPhase;
  if (PHASE_IDS.includes(rawPhase as never)) {
    const phaseId = rawPhase as PhaseId;
    session.progress = {
      phaseId,
      phaseState: createPhaseState(phaseId),
      endReason: phaseId === "game.scoring" ? "scenario-end" : null,
    };
  }

  return session;
}
