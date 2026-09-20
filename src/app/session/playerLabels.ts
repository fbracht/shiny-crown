import type { ActorId, GameMode, HumanId } from "./types";

export function playerLabel(mode: GameMode, playerNames: Record<HumanId, string>, actor: ActorId) {
  if (actor === "crown") return "Crown";
  if (mode === "solo") return "You";
  return playerNames[actor].trim() || (actor === "human-1" ? "Player 1" : "Player 2");
}
