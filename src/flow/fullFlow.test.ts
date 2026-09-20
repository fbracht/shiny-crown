import { describe, expect, it } from "vitest";
import { createInitialSession, createPhaseState, occupied } from "../app/session/factories";
import { sessionReducer } from "../app/session/reducer";
import type { GameMode, GameSessionV1, PhaseId } from "../app/session/types";

function playable(mode: GameMode): GameSessionV1 {
  const session = createInitialSession(mode, "1813");
  session.roles.chairman = occupied("crown");
  session.roles.directorOfTrade = occupied("human-1");
  session.roles.managerOfShipping = occupied("crown");
  session.roles.militaryAffairs = occupied("human-1");
  session.roles.superintendentChina = occupied("crown");
  session.roles.primeMinister = occupied(mode === "solo" ? "human-1" : "human-2");
  session.roles.presidents.bombay = occupied("crown");
  session.roles.presidents.madras = occupied("human-1");
  session.roles.presidents.bengal = occupied("crown");
  return session;
}

function advance(session: GameSessionV1) {
  if (session.progress.phaseId === "round.bonuses") {
    return sessionReducer(session, {
      type: "advance",
      intent: { type: "firms-present", present: true },
    });
  }
  return sessionReducer(session, { type: "advance" });
}

describe("complete session flow", () => {
  for (const mode of ["solo", "two-player"] as const) {
    it(`walks setup and the complete first ${mode} round`, () => {
      let session = playable(mode);
      const visited: PhaseId[] = [session.progress.phaseId];
      while (session.progress.phaseId !== "round.upkeep-refresh") {
        session = advance(session);
        visited.push(session.progress.phaseId);
        expect(visited.length).toBeLessThan(40);
      }
      expect(visited).toEqual([
        "setup.configure",
        "setup.table",
        "setup.crown",
        "setup.cards",
        "setup.finish",
        "setup.ai",
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
      ]);

      session = sessionReducer(session, {
        type: "advance",
        intent: { type: "finish-upkeep", finalTurn: false },
      });
      expect(session.turn).toBe(2);
      expect(session.progress.phaseId).toBe("round.london-season");

      session = {
        ...session,
        progress: {
          phaseId: "round.upkeep-refresh",
          phaseState: createPhaseState("round.upkeep-refresh"),
          endReason: null,
        },
      };
      session = sessionReducer(session, {
        type: "advance",
        intent: { type: "finish-upkeep", finalTurn: true },
      });
      expect(session.progress).toMatchObject({
        phaseId: "game.scoring",
        endReason: "scenario-end",
      });
    });
  }
});
