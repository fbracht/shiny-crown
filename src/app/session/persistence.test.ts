import { describe, expect, it } from "vitest";
import { MemoryStorage } from "../../test/MemoryStorage";
import { createInitialSession } from "./factories";
import {
  INVALID_STORAGE_KEY,
  loadPersistedSession,
  persistSession,
  SESSION_STORAGE_KEY,
} from "./persistence";

describe("local persistence and recovery", () => {
  it("round-trips a valid session", () => {
    const storage = new MemoryStorage();
    const session = createInitialSession("two-player", "1758");
    persistSession(storage, session);
    const loaded = loadPersistedSession(storage);
    expect(loaded.status).toBe("loaded");
    if (loaded.status === "loaded") expect(loaded.session).toEqual(session);
  });

  it("preserves malformed raw data instead of crashing or replacing it", () => {
    const storage = new MemoryStorage();
    const raw = "{not-json";
    storage.setItem(SESSION_STORAGE_KEY, raw);
    const loaded = loadPersistedSession(storage);
    expect(loaded.status).toBe("error");
    expect(storage.getItem(SESSION_STORAGE_KEY)).toBe(raw);
    expect(storage.getItem(INVALID_STORAGE_KEY)).toBe(raw);
  });

  it("migrates a schema-zero save and persists the validated result", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 0,
        gameMode: "solo",
        scenario: "1758",
        difficulty: "hard",
        climate: "lion",
        turn: 3,
        currentPhase: "round.family",
      }),
    );
    const loaded = loadPersistedSession(storage);
    expect(loaded.status).toBe("loaded");
    if (loaded.status === "loaded") {
      expect(loaded.migrated).toBe(true);
      expect(loaded.session).toMatchObject({
        schemaVersion: 1,
        mode: "solo",
        scenario: "1758",
        difficulty: "hard",
        climate: "lion",
        turn: 3,
      });
    }
    expect(JSON.parse(storage.getItem(SESSION_STORAGE_KEY) ?? "{}").schemaVersion).toBe(1);
  });
});
