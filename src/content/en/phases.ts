import type { GameMode, PhaseId } from "../../app/session/types";

export type SourceRef = {
  document: "aid-v3.2" | "rules" | "crown-handbook" | "office-cards";
  pages: number[];
  section: string;
  mode: "shared" | "solo" | "two-player";
  use: "primary" | "clarification" | "replacement";
  note?: string;
};

export type PhaseCopy = {
  title: string;
  summary: string;
  shared: string[];
  solo?: string[];
  twoPlayer?: string[];
  sources: SourceRef[];
};

const aid = (pages: number[], section: string): SourceRef => ({
  document: "aid-v3.2",
  pages,
  section,
  mode: "solo",
  use: "primary",
});

const rules = (pages: number[], section: string): SourceRef => ({
  document: "rules",
  pages,
  section,
  mode: "shared",
  use: "clarification",
});

const twoPlayer = (pages: number[], section: string): SourceRef => ({
  document: "crown-handbook",
  pages,
  section,
  mode: "two-player",
  use: "replacement",
});

const officeCards = (section: string): SourceRef => ({
  document: "office-cards",
  pages: [1],
  section,
  mode: "shared",
  use: "primary",
  note: "User-supplied composite photograph of all office-card backs, 2026-09-19.",
});

export const phaseCopy: Record<PhaseId, PhaseCopy> = {
  "setup.configure": {
    title: "New game",
    summary: "Confirm the game facts that shape every later instruction.",
    shared: [
      "Choose the scenario and difficulty. The physical scenario card remains authoritative.",
    ],
    sources: [aid([1], "Setup and Difficulty"), rules([4, 43, 44], "Setup")],
  },
  "setup.table": {
    title: "Table and scenario",
    summary: "Set out the common game materials, then follow the selected scenario card.",
    shared: [
      "Complete base setup steps 1–10.",
      "Use the selected physical scenario card for track positions, regions, and initial offices.",
    ],
    sources: [rules([4, 5], "Setup steps 1–10")],
  },
  "setup.crown": {
    title: "Crown materials",
    summary: "Prepare the Crown board, family pieces, climate marker, and promise cubes.",
    shared: ["The Crown uses 36 family members and exhausts one colour before the other."],
    solo: ["Easy/Normal begins 6–6; higher difficulty changes the closed pool."],
    twoPlayer: ["Begin 4–4–4; Hard and Expert move two cubes from each human to the Crown."],
    sources: [aid([1], "Setup and Difficulty"), rules([43, 44], "Crown setup")],
  },
  "setup.cards": {
    title: "Setup cards",
    summary: "Track the sourced distribution rounds without adding a draft variant.",
    shared: ["Resolve every physical card effect and office placement at the table."],
    solo: ["Four rounds: draw three, keep one, give two to Crown. Final total: 4 / 8."],
    twoPlayer: ["Each human draws three, keeps two, gives one to Crown. Final total: 4 / 4 / 4."],
    sources: [aid([1], "Setup cards"), rules([43, 44], "Two-player setup cards")],
  },
  "setup.finish": {
    title: "Record the offices",
    summary: "Finish setup and record only the state that changes later guidance.",
    shared: [
      "Complete common setup steps 11–13.",
      "Mark absent offices not in play; reserve vacant for an office that exists and can be hired.",
    ],
    sources: [rules([5], "Setup steps 11–13")],
  },
  "setup.ai": {
    title: "Climate and readiness",
    summary: "Reveal the first AI card, set climate, and enter the first turn.",
    shared: ["The first turn skips London Season."],
    twoPlayer: [
      "Initialize the Player Button from the AI-card direction. Later AI cards do not reset it.",
    ],
    sources: [aid([1], "Setup"), rules([43, 44, 45], "Crown seating and Player Button")],
  },
  "round.deregulation-vote": {
    title: "Vote to Deregulate",
    summary: "Use this gate only when the scenario and physical Standing or Debt space allow it.",
    shared: ["A passed vote permanently enables Firms and Firm Revenue."],
    sources: [aid([1], "0. Vote to Deregulate"), rules([36], "Deregulation")],
  },
  "round.london-season": {
    title: "London Season",
    summary: "Resolve attrition, retirements, conditional special retirement, then Prestige cards.",
    shared: ["Use the contextual role controls when attrition or retirement empties an office."],
    sources: [aid([2], "1. London Season"), rules([11, 12], "London Season")],
  },
  "round.family": {
    title: "Family",
    summary: "Resolve free Crown Writers, normal Family actions, then New Company Shares.",
    shared: [
      "Free writers and law-granted extra actions are separate from the normal action count.",
    ],
    solo: ["The Crown takes two normal Family actions."],
    twoPlayer: ["The Crown takes one normal Family action."],
    sources: [aid([2, 3], "2. Family"), twoPlayer([2], "Family actions")],
  },
  "round.firms": {
    title: "Firms",
    summary: "This phase exists only after Deregulation.",
    shared: [
      "Keep shares, ships, manager consent, value, and secret strategy on the physical table.",
    ],
    solo: ["Hostile takeovers and mergers do not occur."],
    twoPlayer: [
      "Use the sourced consent, takeover, merger, and Button-controlled investment procedures.",
    ],
    sources: [aid([3], "3. Firms"), rules([37, 38, 39, 40], "Firms"), twoPlayer([3], "Firms")],
  },
  "round.hiring": {
    title: "Hiring",
    summary: "Resolve the Chairman election, then actual vacant office cards in printed order.",
    shared: ["Never put a not-in-play position in the vacancy queue."],
    sources: [
      aid([4], "4. Hiring"),
      rules([14, 15, 16], "Hiring"),
      officeCards("Printed office numbers, hirers, and candidate pools"),
    ],
  },
  "round.chairman": {
    title: "Chairman",
    summary: "Seek Debt, allocate Company Balance, and set climate in the correct branch order.",
    shared: ["All money and share predicates remain on the physical board."],
    sources: [aid([5, 6], "6. Chairman"), rules([18], "Chairman")],
  },
  "round.trade-directorate": {
    title: "Trade directorate",
    summary: "Show either Director of Trade or Governor General from structural role state.",
    shared: [
      "A successful Special Envoy may create the China office; Governor General is a structural replacement.",
    ],
    sources: [
      aid([6, 7, 8], "7. Director of Trade and 8. Governor General"),
      rules([18, 26], "Trade directorate"),
    ],
  },
  "round.shipping": {
    title: "Manager of Shipping",
    summary: "Fit, buy, lease, then place ships in that order.",
    shared: ["The office must spend until at most £2 remains."],
    sources: [aid([9], "9. Manager of Shipping"), rules([19], "Shipping")],
  },
  "round.military-affairs": {
    title: "Military Affairs",
    summary: "Resolve transfers, Officers-in-Training, then Commander assignments.",
    shared: [
      "Replacing a Commander demotes the old Commander; it does not create an office vacancy.",
    ],
    sources: [aid([10], "10. Military Affairs"), rules([19], "Military Affairs")],
  },
  "round.presidency.bombay": {
    title: "Bombay Presidency",
    summary: "Complete eligible local actions in the selected order.",
    shared: ["Bombay is always the first Presidency screen."],
    sources: [
      aid([11, 12, 13, 14], "11–14. Presidency operations"),
      rules([20, 21, 22, 23, 24], "Company operations"),
    ],
  },
  "round.presidency.madras": {
    title: "Madras Presidency",
    summary: "Complete eligible local actions in the selected order.",
    shared: ["Madras always follows Bombay and precedes Bengal."],
    sources: [
      aid([11, 12, 13, 14], "11–14. Presidency operations"),
      rules([20, 21, 22, 23, 24], "Company operations"),
    ],
  },
  "round.presidency.bengal": {
    title: "Bengal Presidency",
    summary: "Complete eligible local actions in the selected order.",
    shared: ["Bengal always follows Madras; China, when active, follows Bengal."],
    sources: [
      aid([11, 12, 13, 14], "11–14. Presidency operations"),
      rules([20, 21, 22, 23, 24], "Company operations"),
    ],
  },
  "round.china": {
    title: "Trade in China",
    summary: "Visit only while the Superintendent office exists and is occupied.",
    shared: ["The once-per-turn check depends on physical ships and opium icons."],
    sources: [aid([15], "15. Superintendent of Trade in China"), rules([25], "China")],
  },
  "round.bonuses": {
    title: "Bonuses",
    summary: "Collect the shared enterprise bonuses shown on the physical cards.",
    shared: [
      "Gain £1 for each fitted Shipyard and each non-invested Workshop; apply cards and laws.",
    ],
    sources: [aid([15], "16. Bonuses")],
  },
  "round.firm-revenue": {
    title: "Firm Revenue",
    summary: "Resolve each physical firm in initiative order and mark local progress here.",
    shared: [
      "The app tracks labels and completion only; the table remains authoritative for every firm fact.",
    ],
    sources: [
      aid([15], "17. Firm Revenue"),
      rules([41, 42], "Firm Revenue"),
      twoPlayer([14], "Firm Revenue"),
    ],
  },
  "round.company-revenue": {
    title: "Company Revenue",
    summary: "Resolve expenses, expectations, dividends, then Standing.",
    shared: ["The Basic Favors timing window closes after this screen."],
    sources: [aid([16], "18. Company Revenue")],
  },
  "round.events-india": {
    title: "Events in India",
    summary: "Resolve Storms, then Event cards one at a time.",
    shared: ["Use the Crisis reference for Crisis, rebellion, or invasion resolution."],
    sources: [
      aid([16, 17], "19. Events in India and Crisis reference"),
      rules([28, 29, 30, 31, 32, 33], "Events"),
    ],
  },
  "round.parliament": {
    title: "Parliament Meets",
    summary: "Shift climate, select and vote on a law, then apply policy.",
    solo: ["Use the sourced two-family Crown shortcut and its PM succession branch."],
    twoPlayer: [
      "Use normal clockwise voting rounds, coalitions, Opposition Leader, and actual failed-law succession.",
    ],
    shared: [
      "Apply only the verified structural switches in the app; other law effects stay physical.",
    ],
    sources: [
      aid([18, 19, 20], "20. Parliament and 23. Crown Voting Plan"),
      rules([34, 35, 36], "Parliament"),
      twoPlayer([14, 15, 16], "Parliament"),
    ],
  },
  "round.upkeep-refresh": {
    title: "Upkeep and Refresh",
    summary: "Pay Upkeep first. On the final turn, skip Refresh and score.",
    shared: [
      "Otherwise refresh the physical game, advance the turn, and return to the turn-start gate.",
    ],
    solo: ["Apply the solo-only Crown-Presidency writer compensation when its predicate is met."],
    twoPlayer: ["Do not apply the solo-only writer compensation."],
    sources: [aid([19], "21. Upkeep and Refresh"), twoPlayer([15], "Refresh")],
  },
  "game.scoring": {
    title: "Game End and Scoring",
    summary: "Score in source order using the physical board and the recorded terminal reason.",
    shared: ["Break the final VP tie by Windows, then clockwise from Prime Minister."],
    solo: ["Award only first place for Power and apply the sourced Company-failure adjustment."],
    twoPlayer: [
      "Award first and second Power prizes and do not apply the solo failure adjustment.",
    ],
    sources: [
      aid([19], "22. Game End and Scoring"),
      rules([8, 9, 37], "Scoring"),
      twoPlayer([15], "Scoring"),
    ],
  },
};

export function applicableCopy(phaseId: PhaseId, mode: GameMode) {
  const copy = phaseCopy[phaseId];
  return [...copy.shared, ...(mode === "solo" ? (copy.solo ?? []) : (copy.twoPlayer ?? []))];
}
