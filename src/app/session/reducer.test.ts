import { describe, expect, it } from "vitest";
import { createInitialSession, createPhaseState, occupied } from "./factories";
import { boundaryHasChanges, sessionReducer } from "./reducer";
import { getRole } from "./roles";
import { validateSession } from "./validation";

describe("session reducer and invariants", () => {
  it("supports both modes but rejects the unsourced Legendary plus 2P combination", () => {
    const twoPlayer = createInitialSession("two-player");
    expect(twoPlayer.twoPlayer?.buttonHolder).toBe("human-1");
    expect(() =>
      sessionReducer(twoPlayer, { type: "set-difficulty", difficulty: "legendary" }),
    ).toThrow(/not sourced/u);

    const soloLegendary = sessionReducer(createInitialSession("solo"), {
      type: "set-difficulty",
      difficulty: "legendary",
    });
    expect(soloLegendary.difficulty).toBe("legendary");
  });

  it("keeps actor identity and passes the 2P Button only when directed", () => {
    let session = createInitialSession("two-player");
    session = sessionReducer(session, {
      type: "set-role",
      role: "chairman",
      assignment: occupied("human-2"),
    });
    expect(getRole(session.roles, "chairman")).toMatchObject({
      status: "occupied",
      occupant: "human-2",
    });
    session = sessionReducer(session, { type: "resolve-button-choice", pass: false });
    expect(session.twoPlayer?.buttonHolder).toBe("human-1");
    session = sessionReducer(session, { type: "resolve-button-choice", pass: true });
    expect(session.twoPlayer?.buttonHolder).toBe("human-2");
  });

  it("enforces not-in-play, vacancy, and occupant distinctions", () => {
    let session = createInitialSession("solo");
    expect(session.roles.superintendentChina.status).toBe("not-in-play");
    session = sessionReducer(session, { type: "activate-china" });
    expect(session.roles.superintendentChina.status).toBe("vacant");
    session = sessionReducer(session, {
      type: "set-role",
      role: "superintendentChina",
      assignment: occupied("crown"),
    });
    expect(session.roles.superintendentChina).toMatchObject({
      status: "occupied",
      occupant: "crown",
    });
    expect(() =>
      sessionReducer(session, {
        type: "set-role",
        role: "chairman",
        assignment: occupied("human-2"),
      }),
    ).toThrow(/solo/u);
  });

  it("replaces Director of Trade with Governor General and removes Governors", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "directorOfTrade",
      assignment: occupied("human-1"),
    });
    session = sessionReducer(session, {
      type: "create-governor",
      region: "bombay",
      presidency: "bombay",
    });
    session = sessionReducer(session, { type: "replace-trade-director" });
    expect(session.roles.directorOfTrade.status).toBe("not-in-play");
    expect(session.roles.governorGeneral).toMatchObject({
      status: "occupied",
      occupant: "human-1",
    });
    expect(session.roles.governors.bombay.status).toBe("not-in-play");
    expect(validateSession(session).ok).toBe(true);
  });

  it("promotes an actor while vacating their former office", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "managerOfShipping",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, {
      type: "promote",
      from: "managerOfShipping",
      to: "chairman",
      actor: "crown",
    });
    expect(session.roles.managerOfShipping).toMatchObject({
      status: "vacant",
      previousOccupant: "crown",
    });
    expect(session.roles.chairman).toMatchObject({ status: "occupied", occupant: "crown" });
  });

  it("preserves a Governor's Presidency association when a promotion vacates it", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "governor:bombay",
      assignment: {
        status: "occupied",
        occupant: "human-1",
        associatedPresidency: "bombay",
      },
    });
    session = sessionReducer(session, {
      type: "promote",
      from: "governor:bombay",
      to: "president:bombay",
      actor: "human-1",
    });

    expect(session.roles.governors.bombay).toMatchObject({
      status: "vacant",
      previousOccupant: "human-1",
      associatedPresidency: "bombay",
    });
    expect(session.roles.presidents.bombay).toMatchObject({
      status: "occupied",
      occupant: "human-1",
    });
  });

  it("persists discriminated Presidency order and completion", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "president:bombay",
      assignment: occupied("human-1"),
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "commander:bombay",
      assignment: occupied("crown"),
    });
    session.progress = {
      phaseId: "round.presidency.bombay",
      phaseState: {
        phaseId: "round.presidency.bombay",
        order: ["trade", "commander"],
        completed: [],
      },
      endReason: null,
    };
    session = sessionReducer(session, {
      type: "set-presidency-order",
      order: ["commander", "trade"],
    });
    session = sessionReducer(session, {
      type: "complete-presidency-action",
      actionId: "commander",
      complete: true,
    });
    expect(session.progress.phaseState).toEqual({
      phaseId: "round.presidency.bombay",
      order: ["commander", "trade"],
      completed: ["commander"],
    });
  });

  it("offers safe Back semantics across changed boundaries", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, { type: "advance" });
    session = sessionReducer(session, { type: "set-climate", climate: "bear" });
    expect(boundaryHasChanges(session)).toBe(true);

    const keep = sessionReducer(session, { type: "back", mode: "keep-current" });
    expect(keep.progress.phaseId).toBe("setup.configure");
    expect(keep.climate).toBe("bear");

    const restore = sessionReducer(session, { type: "back", mode: "restore-boundary" });
    expect(restore.progress.phaseId).toBe("setup.configure");
    expect(restore.climate).toBe("bull");
  });

  it("keeps Deregulation monotonic and 1813 valid", () => {
    const session = createInitialSession("solo", "1813");
    expect(session.deregulated).toBe(true);
    const changed = sessionReducer(session, { type: "set-scenario", scenario: "1758" });
    expect(changed.deregulated).toBe(false);
    const active = sessionReducer(changed, { type: "activate-deregulation" });
    expect(active.deregulated).toBe(true);
  });

  it("routes an immediate Company failure to scoring from any phase", () => {
    const session = {
      ...createInitialSession("solo"),
      progress: {
        phaseId: "round.family" as const,
        phaseState: createPhaseState("round.family"),
        endReason: null,
      },
    };
    const ended = sessionReducer(session, { type: "end-game", reason: "company-failure" });
    expect(ended.progress).toMatchObject({
      phaseId: "game.scoring",
      endReason: "company-failure",
    });
  });
});
