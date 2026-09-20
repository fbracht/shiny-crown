import type { ClimateId, Scenario } from "../../app/session/types";

export const companyDividendRules: Record<
  ClimateId,
  { retainedBalance: number; fewerCost: number; moreCost: number }
> = {
  bull: { retainedBalance: 0, fewerCost: 2, moreCost: 1 },
  stag: { retainedBalance: 2, fewerCost: 2, moreCost: 1 },
  lion: { retainedBalance: 4, fewerCost: 1, moreCost: 2 },
  bear: { retainedBalance: 6, fewerCost: 1, moreCost: 2 },
  peacock: { retainedBalance: 8, fewerCost: 1, moreCost: 2 },
};

export const eventRules = [
  {
    name: "Writer Loss",
    text: "When an order with a Writer closes, return that Writer to its supply.",
  },
  {
    name: "Cascade",
    text: "If every order in the named region is closed, close every connected open order. A connected region with no open order triggers another Cascade; each region Cascades at most once per event.",
  },
  { name: "Crisis", text: "Use the Crisis / Rebellion / Invasion reference." },
  {
    name: "Foreign Invasion",
    text: "Use the Storm die to identify affected Presidency borders, then resolve each invasion with the source procedure.",
  },
  {
    name: "Leader",
    text: "For the top-deck region: add 1 Tower if sovereign; resolve a rebellion if dominated.",
  },
  {
    name: "Peace",
    text: "If the Elephant connects two regions, remove the connected closed orders and add 1 Tower to each. If it is inside a region, open its orders and remove its unrest. Then move it to the top-deck region.",
  },
  {
    name: "Shuffle",
    text: "Move the Elephant to the top-deck region, shuffle this event into the deck, then shuffle the discards and place them on top.",
  },
  {
    name: "Turmoil",
    text: "Close the northernmost order in the top-deck region; if all are closed, Cascade.",
  },
  {
    name: "Windfall",
    text: "Each player gains £1 per Writer in or adjacent to the top-deck region.",
  },
] as const;

export const votingPlan = [
  ["Army Spending", "For in Bear or Peacock."],
  [
    "Board of Control",
    "For when Crown is Prime Minister; remove a human from office at the first opportunity.",
  ],
  ["Calico Acts", "For when Crown has the most Workshops."],
  ["Company Aids Government", "For in Bear or Peacock."],
  ["Debt Restructure", "For in Bull or Stag."],
  ["Envoy to China", "For in Lion, Bear, or Peacock."],
  ["Governor General", "For when Crown is Director of Trade."],
  ["Inclosure Acts", "For when Crown has the most prizes."],
  ["Industry Subsidy", "For in Lion, Bear, or Peacock."],
  ["Masses Demand Franchise!", "For unless Crown has the most Rotten Boroughs."],
  [
    "Military Oversight",
    "For when Crown is Prime Minister; Crown Military Affairs demotes a human Commander when a Crown Officer is present.",
  ],
  ["Old Ideas Made New!", "When Crown is Prime Minister, choose the law randomly."],
  [
    "Public Demands Impeachment!",
    "For when Crown is Prime Minister; select the first human office left-to-right, random if all offices are Crown.",
  ],
  ["Relief Demanded for Indian Famine!", "For unless Crown has the most of the named policy."],
  ["Royal Protection", "For when Crown has the most Luxuries."],
  ["Sepoy Recruitment", "For in Lion, Bear, or Peacock."],
  ["Ship Subsidy", "For in Bull, Stag, or Lion."],
  ["Tenure Limits", "For unless Crown is Chairman."],
] as const;

export const soloFailureAdjustment: Record<Scenario, Partial<Record<number, number>>> = {
  "1710": { 1: -5, 2: -4, 3: -3, 4: -2, 5: -1, 6: 0, 7: 0, 8: 0 },
  "1758": { 3: -5, 4: -4, 5: -3, 6: -2, 7: -1 },
  "1813": { 5: -4, 6: -3, 7: -2, 8: -1 },
  "long-1710": {},
};
