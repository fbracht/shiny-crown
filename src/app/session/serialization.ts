import { compressSync, decompressSync, strFromU8, strToU8 } from "fflate";
import { migrateSession } from "./migrations";
import type { GameSessionV1 } from "./types";
import { validateSession } from "./validation";

const BACKUP_PREFIX = "SC1.";

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function exportBackup(session: GameSessionV1) {
  const payload = strToU8(JSON.stringify(session));
  return `${BACKUP_PREFIX}${bytesToBase64Url(compressSync(payload, { level: 9 }))}`;
}

export type ImportResult = { ok: true; session: GameSessionV1 } | { ok: false; message: string };

export function importBackup(code: string): ImportResult {
  const trimmed = code.trim();
  if (!trimmed.startsWith(BACKUP_PREFIX)) {
    return { ok: false, message: "This is not a Shiny Crown backup code." };
  }

  try {
    const compressed = base64UrlToBytes(trimmed.slice(BACKUP_PREFIX.length));
    const parsed: unknown = JSON.parse(strFromU8(decompressSync(compressed)));
    const result = validateSession(migrateSession(parsed));
    if (!result.ok) return { ok: false, message: result.errors.join(" ") };
    return { ok: true, session: result.value };
  } catch {
    return { ok: false, message: "The backup code is damaged or incomplete." };
  }
}
