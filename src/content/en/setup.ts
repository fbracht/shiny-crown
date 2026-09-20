import type { Difficulty, GameMode, Scenario } from "../../app/session/types";

export const setupTableSteps = [
  "Place the game board and component trays in the center of the table.",
  "Shuffle the India event tiles and place them next to the board.",
  "Place each Local Alliance tile in the Army box named on the tile.",
  "Place the Company Balance marker on 5.",
  "Place the four power tokens on their indicated spaces on the Power track.",
  "Take the family board and family pieces for each human family and the Crown. Place every victory point marker on 0.",
  "Place the tower levels, domes, and flags near the right side of the board.",
  "Place the law, office, prestige, blackmail, and setup cards nearby.",
  "Place each loot token in its matching region with the pound side faceup.",
  "Take the physical setup card for the selected scenario and follow its track, region, turn, and Prime Minister instructions.",
] as const;

export const scenarioSetupNotes: Record<Scenario, string> = {
  "1710": "The 1710 scenario is the recommended first game with the Crown.",
  "1758": "The Company begins with its monopoly; Deregulation may later enable private firms.",
  "1813": "The Company begins without its monopoly, so the session starts deregulated.",
  "long-1710":
    "Long 1710 begins like 1710, includes Deregulation, and may last up to eight turns.",
};

type CrownSetup = {
  crownCubes: number;
  humanCubes: number[];
  promiseCardsPerHuman: number;
  extraSetupCards: number;
};

export function crownSetupFor(mode: GameMode, difficulty: Difficulty): CrownSetup {
  if (mode === "two-player") {
    const hardOrExpert = difficulty === "hard" || difficulty === "expert";
    return {
      crownCubes: hardOrExpert ? 8 : 4,
      humanCubes: hardOrExpert ? [2, 2] : [4, 4],
      promiseCardsPerHuman: difficulty === "easy" ? 5 : 0,
      extraSetupCards: difficulty === "expert" ? 3 : 0,
    };
  }

  const hardOrExpert = difficulty === "hard" || difficulty === "expert";
  return {
    crownCubes: difficulty === "legendary" ? 12 : hardOrExpert ? 10 : 6,
    humanCubes: [difficulty === "legendary" ? 0 : hardOrExpert ? 2 : 6],
    promiseCardsPerHuman: difficulty === "easy" ? 5 : 0,
    extraSetupCards: difficulty === "legendary" ? 6 : difficulty === "expert" ? 3 : 0,
  };
}

export const soloSetupCards = {
  rounds: 4,
  instruction: "Draw 3 setup cards. Keep 1 and give the other 2 to the Crown.",
  finalTotal: "You: 4 · Crown: 8",
} as const;

export const twoPlayerSetupCards = {
  rounds: 2,
  instruction:
    "Each human draws 3 setup cards, keeps 2, and gives the remaining card to the Crown.",
  finalTotal: "Each human: 4 · Crown: 4",
} as const;

export const finishSetupSteps = [
  "Set all remaining office cards near the board.",
  "Build the London Season display: shuffle the prestige and blackmail cards together and deal 3. Place prestige cards faceup and blackmail cards facedown.",
  "Shuffle the remaining law cards and place them near the board.",
] as const;
