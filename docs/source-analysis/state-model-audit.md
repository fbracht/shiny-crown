# State-model audit

The app should persist only facts that materially change which instructions appear or protect procedural progress. The physical board remains authoritative for money, shares, units, routes, dice, cards, and most eligibility checks.

## Recommended session shape

```ts
type GameMode = "solo" | "two-player";
type HumanId = "human-1" | "human-2";
type ActorId = HumanId | "crown";
type Difficulty = "easy" | "normal" | "hard" | "expert" | "legendary";
type Scenario = "1710" | "1758" | "1813" | "long-1710";
type ClimateId = "bull" | "stag" | "lion" | "bear" | "peacock";
type PresidencyId = "bombay" | "madras" | "bengal";
type RegionId =
  | "bombay" | "madras" | "bengal" | "punjab"
  | "delhi" | "maratha" | "mysore" | "hyderabad";

type RoleAssignment =
  | { status: "not-in-play"; previousOccupant?: ActorId }
  | { status: "vacant"; previousOccupant?: ActorId }
  | { status: "occupied"; occupant: ActorId; previousOccupant?: ActorId };

type GovernorAssignment = RoleAssignment & {
  associatedPresidency?: PresidencyId;
};

type EndReason = "scenario-end" | "company-failure";

interface GameSessionV1 {
  schemaVersion: 1;
  mode: GameMode;
  difficulty: Difficulty;
  scenario: Scenario;
  turn: number;
  firstTurn: boolean;
  climate: ClimateId;
  deregulated: boolean;

  roles: {
    chairman: RoleAssignment;
    directorOfTrade: RoleAssignment;
    governorGeneral: RoleAssignment;
    managerOfShipping: RoleAssignment;
    militaryAffairs: RoleAssignment;
    presidents: Record<PresidencyId, RoleAssignment>;
    commanders: Record<PresidencyId, RoleAssignment>;
    governors: Record<RegionId, GovernorAssignment>;
    superintendentChina: RoleAssignment;
    primeMinister: RoleAssignment;
    oppositionLeader: ActorId | null;
  };

  twoPlayer: null | {
    buttonHolder: HumanId;
  };

  progress: {
    phaseId: PhaseId;
    phaseState: PhaseState;
    endReason: EndReason | null;
  };

  history: NavigationSnapshot[];
}
```

`firstTurn` may be derived from scenario/turn only after scenario-card start and end data are fully sourced. Keeping it explicit in schema v1 is safer because London Season uses it directly and the physical scenario card remains authoritative.

## Role-model findings

### Three-state availability is required

`vacant` means an office exists and can be hired. `not-in-play` means the office does not currently exist and must not appear in Hiring or Company Operations.

- Superintendent of Trade in China begins not in play and is created by Special Envoy or law, then hired immediately.
- Regional Governor offices are created when regions become Company-controlled and are removed when those regions are lost.
- Governor General replaces Director of Trade and removes every regional Governor office. Director of Trade and Governor General cannot both be active.
- A catastrophic check or attrition can make an existing office vacant; it does not make it not in play.
- Commanders have no office cards but may be vacant and are tracked because their occupant changes procedures.

### Actor identity is required in 2P

Collapsing both humans into `player` would break the Player Button, hiring consent, election support, Parliament opposition, firm dividends, Crown choices among human ships/writers/officers, and final ties. Content can still say “you” where the acting human is clear, but state and actions need `human-1` and `human-2`.

### Political state belongs beside role state

Prime Minister changes who acts in Parliament, resolves ties, and matters in final scoring. Opposition Leader can be either human or Crown and determines succession after a failed law. The Crown can hold both Prime Minister and Opposition Leader. These positions are not Company offices, but they must survive phase changes and reloads.

## Required invariants

1. `mode === "solo"` forbids `human-2` in every role and requires `twoPlayer === null`.
2. `mode === "two-player"` requires a valid human Button holder.
3. Director of Trade and Governor General cannot both be `vacant`/`occupied`. One active variant implies the other is `not-in-play`.
4. If Governor General is in play, every regional Governor is `not-in-play`.
5. An `occupied` role always has an occupant; other statuses do not.
6. A regional Governor that is vacant/occupied has an associated Presidency.
7. Superintendent of Trade in China cannot be visited while `not-in-play`.
8. `deregulated` starts true for 1813 and false for the other scenarios. It can change only from false to true.
9. Legendary is fully sourced for solo. The supplied books do not define Legendary setup for 2P; validation must not extrapolate it silently.
10. `progress.endReason !== null` routes to scoring and prevents ordinary round advancement until the user deliberately returns/cancels.
11. Phase-local Presidency progress is reset when leaving that Presidency forward into the next round, but persisted across reload and reversible Back navigation.
12. Import validation establishes every invariant before replacing the current save.

## Domain mutations and source-driven side effects

| Action | State effect |
|---|---|
| `startSession(config)` | creates setup state, scenario/difficulty defaults, role records, 2P Button placeholder |
| `setClimate(climate)` | changes the one global climate from global or contextual control |
| `setRoleStatus(role, status, occupant?)` | records manual correction, vacancy, creation, or occupation |
| `promote(from, to, actor)` | makes prior office vacant, occupies new office, moves previous-occupant metadata |
| `replaceTradeDirectorWithGovernorGeneral()` | transfers Director occupant/fatigue guidance, makes Director and all Governors not in play, activates GG |
| `activateChinaOffice()` | changes China from not in play to vacant, then prompts immediate Chairman hiring |
| `createGovernor(region, presidency)` | changes regional Governor from not in play to vacant and records association |
| `loseRegion(region, presidency)` | makes its Governor not in play and associated Commander vacant; the physical board handles all other Region Loss steps |
| `catastrophicOfficeFailure(role)` | returns current occupant to supply and leaves existing office vacant |
| `assignCommander(presidency, actor)` | occupies/replaces Commander; old Commander becomes an Officer physically |
| `setPrimeMinister(actor)` | occupies PM; ordinary failed-law flow clears prior Opposition Leader as directed |
| `setOppositionLeader(actorOrNull)` | tracks current vote leader and tie incumbent |
| `activateDeregulation()` | reveals Firms/Firm Revenue content and deregulation-only rules permanently |
| `resolveButtonChoice({pass})` | records an explicit Crown-between-humans/disputed-action resolution and passes Button when source requires it |
| `transferButton(holder)` | manual 2P negotiation/correction |
| `advancePhase()` | takes a transition snapshot, applies conditional skips, scrolls next screen to top |
| `returnPhase(mode)` | returns while either preserving present facts or restoring boundary snapshot after user choice |
| `startNextTurn()` | increments/sets turn, clears first-turn flag and phase-local progress, returns to pre-London gate |
| `endGame(reason)` | records terminal reason and enters scoring from any screen |

The UI should offer these mutations at the rule that causes them. Examples: “Mark office vacant” after attrition/catastrophic failure, “Create China office” on successful Envoy, and “Replace Director with Governor General” when that law passes.

## Phase-local state

Avoid an untyped `Record<string, unknown>` dumping ground. Use a discriminated union with small, phase-owned payloads:

```ts
type PresidencyActionId =
  | "trade"
  | "commander"
  | `governor:${RegionId}`;

type PhaseState =
  | { phaseId: "setup.cards"; dealRound: number }
  | {
      phaseId: `round.presidency.${PresidencyId}`;
      order: PresidencyActionId[];
      completed: PresidencyActionId[];
    }
  | { phaseId: "round.firm-revenue"; completedFirmLabels: string[] }
  | { phaseId: Exclude<PhaseId, PresidencyPhaseId | "setup.cards" | "round.firm-revenue"> };
```

Firm labels can be transient user-entered names for progress; v1 does not need a firm simulation.

## Transition history and Back

Snapshots should include all persistent session facts at each navigation boundary, excluding prior history itself. On Back, compare current facts with the snapshot:

- if equal, return immediately;
- if changed, offer “keep current game state” or “restore state at this boundary”;
- always restore the earlier phase and its local progress;
- never infer that returning in the instructions means undoing the physical board.

Climate, roles, deregulation, Button holder, political positions, turn, and terminal reason all belong in the comparison. One snapshot per completed boundary is sufficient; this is not event sourcing.

## Facts the app should not model in v1

- cash or promise-cube ledgers;
- Company Balance, Debt, Standing, votes, or policy entities;
- ships, Writers, Officers, Regiments, alliances, Army strength, or fatigue counts;
- shares, firm ownership/value/initiative, enterprise inventories, or dividends;
- open orders, trade routes, unrest, towers, flags, Elephant position, or event deck;
- dice results or automatic Crown decisions;
- law-card effects beyond the few structural switches the user explicitly records.

These facts would turn the companion into a partial simulator and still require reconciliation with the physical board. Present active-climate priorities and concise prompts instead.

## Audit of the provisional specification

| Provisional assumption | Verified finding |
|---|---|
| `RoleOccupant = player-1/player-2/crown/vacant` | Insufficient; `not-in-play` is required and political roles/previous Chairman matter. |
| Region procedures can occur in any order | Incorrect at top level; Bombay → Madras → Bengal is fixed. Action order inside each Presidency is configurable. |
| 2P is mostly additive | Partly incorrect; several solo sections require replacement, including Family action count, election/hiring, Parliament, firms, and scoring. |
| Approximately fifteen round screens | Verified flow has 19 recurring/conditional screen positions plus terminal scoring, with conditional skips and three fixed Presidency screens. |
| One known reference flowchart | Verified: Crisis flowchart is the only separate static graphic required pre-launch; glossary, favors, success checks, and voting plan are contextual sheets. |
| Round number may not be core | Turn/first-turn state is useful and required for London skip, final-turn transition, and solo failure scoring. |

