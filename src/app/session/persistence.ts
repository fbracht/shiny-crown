import { migrateSession } from "./migrations";
import type { GameSessionV1 } from "./types";
import { validateSession } from "./validation";

export const SESSION_STORAGE_KEY = "shiny-crown.session.v1";
export const INVALID_STORAGE_KEY = "shiny-crown.invalid-save";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LoadResult =
  | { status: "empty" }
  | { status: "loaded"; session: GameSessionV1; migrated: boolean }
  | { status: "error"; message: string; raw: string };

export function persistSession(storage: StorageLike, session: GameSessionV1) {
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearPersistedSession(storage: StorageLike) {
  storage.removeItem(SESSION_STORAGE_KEY);
}

export function loadPersistedSession(storage: StorageLike): LoadResult {
  const raw = storage.getItem(SESSION_STORAGE_KEY);
  if (raw === null) return { status: "empty" };

  try {
    const parsed: unknown = JSON.parse(raw);
    const migratedValue = migrateSession(parsed);
    const result = validateSession(migratedValue);
    if (!result.ok) {
      storage.setItem(INVALID_STORAGE_KEY, raw);
      return { status: "error", message: result.errors.join(" "), raw };
    }
    const migrated =
      typeof parsed === "object" && parsed !== null && "schemaVersion" in parsed
        ? parsed.schemaVersion !== 2
        : true;
    if (migrated) persistSession(storage, result.value);
    return { status: "loaded", session: result.value, migrated };
  } catch (error) {
    storage.setItem(INVALID_STORAGE_KEY, raw);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The saved session is malformed.",
      raw,
    };
  }
}
