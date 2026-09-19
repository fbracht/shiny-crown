import { describe, expect, it } from "vitest";
import { createInitialSession, createPhaseState, occupied } from "../app/session/factories";
import { sessionReducer } from "../app/session/reducer";
import { nextPhase, phaseIsAvailable } from "./flowDefinition";

describe("verified flow", () => {
  it("moves through setup once and skips London on the first 1710 turn", () => {
    let session = createInitialSession("solo", "1710");
    const visited = [session.progress.phaseId];

    for (let step = 0; step < 6; step += 1) {
      session = sessionReducer(session, { type: "advance" });
      visited.push(session.progress.phaseId);
    }

    expect(visited).toEqual([
      "setup.configure",
      "setup.table",
      "setup.crown",
      "setup.cards",
      "setup.finish",
      "setup.ai",
      "round.family",
    ]);
    expect(session.history.at(-1)?.skippedPhaseIds).toEqual([
      "round.deregulation-vote",
      "round.london-season",
    ]);
  });

  it("applies Deregulation and scenario gates", () => {
    const short1710 = createInitialSession("solo", "1710");
    const long1710 = createInitialSession("solo", "long-1710");
    const eighteenThirteen = createInitialSession("solo", "1813");

    expect(phaseIsAvailable("round.deregulation-vote", short1710)).toBe(false);
    expect(phaseIsAvailable("round.deregulation-vote", long1710)).toBe(true);
    expect(eighteenThirteen.deregulated).toBe(true);
    expect(phaseIsAvailable("round.deregulation-vote", eighteenThirteen)).toBe(false);
    expect(phaseIsAvailable("round.firms", eighteenThirteen)).toBe(true);
  });

  it("skips vacant offices and preserves Bombay, Madras, Bengal order", () => {
    let session = createInitialSession("solo");
    session = {
      ...session,
      progress: {
        phaseId: "round.hiring",
        phaseState: createPhaseState("round.hiring"),
        endReason: null,
      },
    };

    expect(nextPhase(session).nextPhaseId).toBe("round.presidency.bombay");
    session = {
      ...session,
      progress: {
        phaseId: "round.presidency.bombay",
        phaseState: createPhaseState("round.presidency.bombay"),
        endReason: null,
      },
    };
    expect(nextPhase(session).nextPhaseId).toBe("round.presidency.madras");
    session.progress = {
      phaseId: "round.presidency.madras",
      phaseState: createPhaseState("round.presidency.madras"),
      endReason: null,
    };
    expect(nextPhase(session).nextPhaseId).toBe("round.presidency.bengal");
  });

  it("visits role phases and China only when their offices are occupied", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "chairman",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "managerOfShipping",
      assignment: occupied("human-1"),
    });
    session = sessionReducer(session, { type: "activate-china" });
    session = sessionReducer(session, {
      type: "set-role",
      role: "superintendentChina",
      assignment: occupied("crown"),
    });
    session.progress = {
      phaseId: "round.hiring",
      phaseState: createPhaseState("round.hiring"),
      endReason: null,
    };
    expect(nextPhase(session).nextPhaseId).toBe("round.chairman");

    session.progress = {
      phaseId: "round.chairman",
      phaseState: createPhaseState("round.chairman"),
      endReason: null,
    };
    expect(nextPhase(session).nextPhaseId).toBe("round.shipping");

    session.progress = {
      phaseId: "round.presidency.bengal",
      phaseState: createPhaseState("round.presidency.bengal"),
      endReason: null,
    };
    expect(nextPhase(session).nextPhaseId).toBe("round.china");
  });

  it("enters Firm Revenue only when the user confirms a physical firm", () => {
    const session = {
      ...createInitialSession("solo", "1813"),
      progress: {
        phaseId: "round.bonuses" as const,
        phaseState: createPhaseState("round.bonuses"),
        endReason: null,
      },
    };
    expect(nextPhase(session, { firmRevenuePresent: false }).nextPhaseId).toBe(
      "round.company-revenue",
    );
    expect(nextPhase(session, { firmRevenuePresent: true }).nextPhaseId).toBe("round.firm-revenue");
  });

  it("starts a new turn or skips Refresh into scoring on the final turn", () => {
    const base = createInitialSession("solo");
    const upkeep = {
      ...base,
      progress: {
        phaseId: "round.upkeep-refresh" as const,
        phaseState: createPhaseState("round.upkeep-refresh"),
        endReason: null,
      },
    };
    const nextTurn = sessionReducer(upkeep, {
      type: "advance",
      intent: { type: "finish-upkeep", finalTurn: false },
    });
    expect(nextTurn.turn).toBe(2);
    expect(nextTurn.firstTurn).toBe(false);
    expect(nextTurn.progress.phaseId).toBe("round.london-season");

    const final = sessionReducer(upkeep, {
      type: "advance",
      intent: { type: "finish-upkeep", finalTurn: true },
    });
    expect(final.progress.phaseId).toBe("game.scoring");
    expect(final.progress.endReason).toBe("scenario-end");
  });
});
