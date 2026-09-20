import type { ClimateId } from "../../app/session/types";
import type { SourceRef } from "./phases";

export type SoloFamilyActionId =
  | "enlist-writer"
  | "enlist-officer"
  | "buy-luxury"
  | "buy-shipyard"
  | "buy-workshop"
  | "seek-share";

export const soloEarlySources = {
  londonSeason: [
    {
      document: "aid-v3.2",
      pages: [2],
      section: "1. London Season",
      mode: "solo",
      use: "primary",
    },
    {
      document: "rules",
      pages: [11, 12],
      section: "I. The London Season",
      mode: "shared",
      use: "clarification",
    },
  ],
  family: [
    {
      document: "aid-v3.2",
      pages: [2, 3],
      section: "2. Family",
      mode: "solo",
      use: "primary",
    },
    {
      document: "rules",
      pages: [13, 14],
      section: "II. Family",
      mode: "shared",
      use: "clarification",
    },
  ],
  firms: [
    {
      document: "aid-v3.2",
      pages: [3],
      section: "3. Firms",
      mode: "solo",
      use: "primary",
    },
    {
      document: "rules",
      pages: [37, 38, 39, 40],
      section: "Deregulation and the Firms Phase",
      mode: "shared",
      use: "clarification",
    },
  ],
} satisfies Record<string, SourceRef[]>;

export const familyActions: ReadonlyArray<{
  id: SoloFamilyActionId;
  label: string;
  procedure: string;
}> = [
  {
    id: "enlist-writer",
    label: "Enlist Writer",
    procedure:
      "Place a family member in any Writers box. With four or more vacant offices, place one additional Writer once this turn.",
  },
  {
    id: "enlist-officer",
    label: "Enlist Officer",
    procedure: "Place a family member in the Officers-in-Training box.",
  },
  {
    id: "buy-luxury",
    label: "Buy Luxury",
    procedure: "Pay £4 to the bank, take a Luxury card, and gain 2 VP.",
  },
  {
    id: "buy-shipyard",
    label: "Buy Shipyard",
    procedure: "Pay £2 to the bank, take a Shipyard card, and place its matching Ship token.",
  },
  {
    id: "buy-workshop",
    label: "Buy Workshop",
    procedure: "Pay £5 to the bank and take a Workshop on its non-invested side.",
  },
  {
    id: "seek-share",
    label: "Seek Share",
    procedure: "Place a family member on any open Stock Exchange space and pay the printed cost.",
  },
];

export const crownFamilyActionQueue: Record<ClimateId, readonly SoloFamilyActionId[]> = {
  bull: ["seek-share", "buy-shipyard", "enlist-writer", "enlist-writer", "enlist-officer"],
  stag: ["seek-share", "enlist-writer", "buy-shipyard", "enlist-writer", "enlist-officer"],
  lion: ["buy-shipyard", "enlist-officer", "enlist-writer", "enlist-officer"],
  bear: ["enlist-officer", "buy-luxury", "buy-workshop", "enlist-officer", "enlist-writer"],
  peacock: ["buy-workshop", "buy-luxury", "enlist-officer", "enlist-officer", "enlist-writer"],
};

export const writerPlacementPriority = [
  "A vacant Presidency with no Crown Writer.",
  "A Crown Presidency with the fewest Crown Writers.",
  "A Presidency with fewer Crown Writers.",
  "The Presidency shown first by the AI card.",
] as const;

type ShareFavor = {
  label: string;
  costs: Record<ClimateId, number>;
};

export const newCompanyShareFavors: readonly ShareFavor[] = [
  {
    label: "Take a Company share from Crown",
    costs: { bull: 6, stag: 4, lion: 4, bear: 3, peacock: 3 },
  },
  {
    label: "Give a Company share to Crown",
    costs: { bull: -2, stag: 3, lion: 3, bear: 4, peacock: 4 },
  },
  {
    label: "Take a firm share from Crown",
    costs: { bull: 3, stag: 4, lion: 4, bear: 6, peacock: 6 },
  },
  {
    label: "Give a firm share to Crown, without giving Crown a majority",
    costs: { bull: 4, stag: 3, lion: 3, bear: -2, peacock: -2 },
  },
];

export const crownFirmInvestment: Record<
  ClimateId,
  { default: "none" | "one"; override: "request" | "deny"; amount: number | "firm-value" }
> = {
  bull: { default: "none", override: "request", amount: 2 },
  stag: { default: "none", override: "request", amount: 2 },
  lion: { default: "one", override: "deny", amount: "firm-value" },
  bear: { default: "one", override: "deny", amount: "firm-value" },
  peacock: { default: "one", override: "deny", amount: "firm-value" },
};

export function familyActionLabel(action: SoloFamilyActionId) {
  return familyActions.find((candidate) => candidate.id === action)?.label ?? action;
}

export function promiseExchangeLabel(cost: number) {
  return cost < 0 ? "Receive " + Math.abs(cost) : "Give " + cost;
}
