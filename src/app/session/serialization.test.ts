import { describe, expect, it } from "vitest";
import { createInitialSession } from "./factories";
import { sessionReducer } from "./reducer";
import { exportBackup, importBackup } from "./serialization";

describe("portable backup", () => {
  it("compresses and restores the full resumable state", () => {
    let session = createInitialSession("two-player", "1758");
    session = sessionReducer(session, {
      type: "set-player-name",
      player: "human-1",
      name: "Alice",
    });
    session = sessionReducer(session, {
      type: "set-player-name",
      player: "human-2",
      name: "Bruno",
    });
    session = sessionReducer(session, { type: "set-climate", climate: "peacock" });
    session = sessionReducer(session, { type: "advance" });
    const code = exportBackup(session);
    expect(code.startsWith("SC1.")).toBe(true);
    expect(code.length).toBeLessThan(JSON.stringify(session).length);
    const restored = importBackup(code);
    expect(restored).toEqual({ ok: true, session });
    if (restored.ok)
      expect(restored.session.playerNames).toEqual({
        "human-1": "Alice",
        "human-2": "Bruno",
      });
  });

  it("rejects damaged and non-Shiny-Crown strings", () => {
    expect(importBackup("hello")).toEqual({
      ok: false,
      message: "This is not a Shiny Crown backup code.",
    });
    expect(importBackup("SC1.damaged").ok).toBe(false);
  });

  it("validates all invariants before returning a replacement session", () => {
    const valid = createInitialSession("solo");
    const invalid = {
      ...valid,
      twoPlayer: { buttonHolder: "human-2" as const },
    };
    const code = exportBackup(invalid as typeof valid);
    const restored = importBackup(code);
    expect(restored.ok).toBe(false);
    if (!restored.ok) expect(restored.message).toMatch(/Solo sessions/u);
  });
});
