import type { ClimateId } from "../../app/session/types";

type CompanyShipRule = {
  default: string;
  changeDefault: { cost: number; instruction: string } | null;
  anotherShipCost: number | null;
};

export const specialEnvoySpend: Record<ClimateId, number> = {
  bull: 3,
  stag: 3,
  lion: 3,
  bear: 4,
  peacock: 5,
};

export const specialEnvoySpendFavor: Record<ClimateId, number> = {
  bull: 2,
  stag: 2,
  lion: 1,
  bear: 1,
  peacock: 1,
};

export const humanDirectorRewards: Record<ClimateId, number | null> = {
  bull: 1,
  stag: 1,
  lion: 1,
  bear: null,
  peacock: null,
};

export const directorTransferPriorities: Record<ClimateId, string[]> = {
  bull: [
    "Move a Crown Writer from the shortest-route Presidency toward the longest route.",
    "Move a ship from the shortest route toward the longest route.",
    "Move a human Writer from the longest-route Presidency toward the shortest route.",
  ],
  stag: [
    "Move a ship from the shortest route toward the longest route.",
    "Move a Crown Writer from the Presidency with the fewest ships toward the one with the most ships.",
    "Move a human Writer from the longest-route Presidency toward the shortest route.",
  ],
  lion: [
    "Move a ship from the Presidency with the fewest Crown Writers toward the one with the most Crown Writers.",
    "Move a Crown Writer from the Presidency with the fewest ships toward the one with the most ships.",
    "Move a ship from the Presidency with the fewest Crown Writers to China.",
    "Move a ship from the Presidency with the most human Writers toward the one with the fewest human Writers.",
  ],
  bear: [
    "Move a ship from a human Presidency to a Crown Presidency.",
    "Move a Crown Writer from the Presidency with the fewest ships toward the one with the most ships.",
    "Move a Crown Writer from a human Presidency to a Crown Presidency.",
  ],
  peacock: [
    "Move a Crown Writer from a human Presidency to a Crown Presidency.",
    "Move a ship from the Presidency with the fewest Crown Writers toward the one with the most Crown Writers.",
    "Repeat the preceding ship-transfer priority if it is still possible.",
    "Move a human Writer from a human Presidency to a Crown Presidency.",
  ],
};

export const governorGeneralRules: Record<ClimateId, { minimumDice: number; result: string }> = {
  bull: {
    minimumDice: 5,
    result:
      "Tax in every Company-controlled region. Distribute the money as evenly as possible among Crown Presidencies, then add any remainder to Company Balance.",
  },
  stag: {
    minimumDice: 3,
    result:
      "Tax in every Company-controlled region. Distribute the money as evenly as possible among Crown Presidencies, then add any remainder to Company Balance.",
  },
  lion: {
    minimumDice: 3,
    result: "Build a Company ship for each Company-controlled region.",
  },
  bear: {
    minimumDice: 3,
    result: "Commission a Regiment for each Company-controlled region.",
  },
  peacock: {
    minimumDice: 2,
    result: "Commission a Regiment for each Company-controlled region.",
  },
};

export const shippingCompanyShipRules: Record<ClimateId, CompanyShipRule> = {
  bull: {
    default: "Do not buy a Company ship by default.",
    changeDefault: { cost: 1, instruction: "Buy one Company ship." },
    anotherShipCost: 1,
  },
  stag: {
    default: "Buy one Company ship if able.",
    changeDefault: { cost: 2, instruction: "Do not buy the default Company ship." },
    anotherShipCost: 1,
  },
  lion: {
    default: "Buy as many Company ships as possible.",
    changeDefault: { cost: 3, instruction: "Buy as many Company ships as you wish instead." },
    anotherShipCost: null,
  },
  bear: {
    default: "Buy one Company ship if able.",
    changeDefault: { cost: 1, instruction: "Do not buy the default Company ship." },
    anotherShipCost: 2,
  },
  peacock: {
    default: "Do not buy a Company ship by default.",
    changeDefault: { cost: 2, instruction: "Buy one Company ship." },
    anotherShipCost: 2,
  },
};

export const shippingPlacementPriorities: Record<ClimateId, string> = {
  bull: "Place it on the longest open route, preferring a Crown Presidency.",
  stag: "Place it on the longest open route, preferring the route with more Crown Writers.",
  lion: "Place it in a Crown Presidency; otherwise choose the Presidency with the most Writers.",
  bear: "Place it in the Presidency with the most Crown Writers.",
  peacock:
    "Place it in China if possible; otherwise choose the Presidency with the most Crown Writers.",
};

export const militaryTransferPriorities: Record<ClimateId, string> = {
  bull: "Move from an Army associated with a human Presidency to one associated with a Crown Presidency.",
  stag: "Move from an Army associated with a human Presidency to one associated with a Crown Presidency.",
  lion: "Move from the Army whose Presidency has the fewest ships to the Army whose Presidency has the most ships.",
  bear: "Move from an Army with a human Commander to an Army with a Crown Commander.",
  peacock: "Move from an Army with a human Commander to an Army with a Crown Commander.",
};

const expansionTrainingPriorities = [
  "Crown Presidency",
  "Most ships",
  "Crown Governor",
  "Creates a new Crown majority",
  "Creates equality with a human majority",
  "Preserves a Crown majority",
  "Crown Commander",
];

const controlTrainingPriorities = [
  "Creates a new Crown majority",
  "Creates equality with a human majority",
  "Preserves a Crown majority",
  "Crown Governor",
  "Crown Commander",
  "Crown Presidency",
  "Most ships",
];

export const officerTrainingPriorities: Record<ClimateId, string[]> = {
  bull: expansionTrainingPriorities,
  stag: expansionTrainingPriorities,
  lion: expansionTrainingPriorities,
  bear: controlTrainingPriorities,
  peacock: controlTrainingPriorities,
};

export const chinaMinimumDice: Record<ClimateId, number> = {
  bull: 1,
  stag: 2,
  lion: 2,
  bear: 3,
  peacock: 3,
};
