# Shiny Crown — Development Specification

Status: Revised after Session 1 source analysis
Working title: Shiny Crown  
Target: Web application, mobile-first  
Primary game: *John Company: Second Edition*  
Primary use case: Solo and two-player games using the Crown rules

---

## 1. Product summary

Shiny Crown is a client-side companion application for playing *John Company: Second Edition* with the Crown, primarily in solo and two-player games.

The Crown rules add substantial procedural overhead to an already complex game. During a round, players move through a long sequence of phases. Many phases have their own Crown-specific procedures, and Crown behavior frequently depends on its current **climate**. This forces players to continually consult tables, cross-reference rules, remember the current climate, and mentally discard instructions that do not apply.

Shiny Crown should remove as much of that cognitive overhead as possible.

The core experience is a guided sequence of phase screens. At any point, the application knows enough about the current game state to show the player only the rules and Crown procedures that are relevant right now.

The application is not intended to simulate *John Company*, make decisions for the human player, or maintain a detailed model of the board state. It is a procedural rules companion.

The main product objective is:

> Let the player concentrate on playing *John Company* rather than operating the Crown rulebook.

---

## 2. Source material and project context

The supplied source set has been extracted, rendered, and mapped in [`source-analysis/`](source-analysis/README.md). The authority order is part of the implementation contract.

### 2.1 Primary solo source

`references/Solo_Player_Aid_Combi_V3.2.pdf` is the primary English content source for solo play. It combines the base-game and Crown procedures and incorporates the changes named on its first page. Its substantive sections on pages 1–20 have an exactly-once destination in the [phase inventory](source-analysis/phase-inventory.md); page 21 is a table of contents used for verification.

Extracted text is evidence rather than ship-ready copy. Tables, grids, icons, and diagrams must use the visually reconciled transcriptions in [`image-transcriptions.md`](source-analysis/image-transcriptions.md). OCR must never be imported without checking it against the rendered page.

### 2.2 Auxiliary rules

`references/Rules.pdf` and `references/Crown Handbook.pdf` supply base-game structure, multiplayer procedure, and 2P Crown differences. They clarify the primary aid but do not replace it for solo wording. Both are required for 2P: the relevant differences extend beyond Rules pp43–46 and include setup, Family actions, Firms, Hiring, Parliament, Refresh, and scoring.

The scenario cards are not in the supplied set. The app records 1710, 1758, 1813, or Long 1710, guides shared setup, and directs players to the matching physical scenario card for scenario-specific values.

### 2.3 Reference application

The community application at `https://the-crown-81cb9.web.app/handbook` and its public repository are behavior references only.

It contributes two useful interaction ideas:

- a persistent quick climate selector;
- direct phase navigation for recovery and lookup.

The purpose of Shiny Crown is not merely to reproduce that application.

Its content is incomplete for Shiny Crown because it omits most base procedure. Its flat phase list, unconditional 18-phase cycle, lack of setup/endgame/persistence, and styling-only role flags are not authoritative. Its phase order and content must not be copied.

The new application should particularly improve the quality of:

- typography;
- information hierarchy;
- mobile usability;
- state awareness;
- visual presentation;
- reduction of irrelevant information;
- navigation through the Crown procedure.

### 2.4 Conversion rule

The task is explicitly **not** to dump extracted PDF text into generic HTML.

Each phase should be treated individually. Some may consist primarily of paragraphs; others may require status controls, lists, tables, callouts, conditional sections, sub-procedures, or other bespoke presentation.

The PDF's content should be preserved faithfully while the medium changes from a document into an interactive application.

---

## 3. Product principles

Several principles should guide implementation decisions.

### 3.1 Reduce cognitive load

The application should hide information that is not currently relevant whenever it can determine that relevance from state.

For example, if the Crown is acting under one climate, the user should generally not need to look through Crown instructions for the other four climates.

### 3.2 Optimize for use during a board game

This is not an information website.

A user will have a physical board game in front of them and will repeatedly glance at and interact with Shiny Crown while performing game actions.

Interactions should therefore be:

- fast;
- obvious;
- low-friction;
- forgiving;
- easy to perform one-handed on a phone where practical.

### 3.3 Content is the interface

The most important visual element is the actual game procedure.

The application should devote most of the viewport to clear, exceptionally readable content rather than application chrome.

### 3.4 Prefer explicit state over memory burden

If keeping a small amount of state allows the application to eliminate repeated mental work for the user, keeping that state is desirable.

The app should therefore track, at minimum:

- game mode;
- scenario and difficulty;
- current turn and first-turn status;
- current phase;
- Crown climate;
- Deregulation;
- role availability and occupancy;
- Prime Minister and Opposition Leader;
- the 2P Player Button holder;
- narrow phase-local progress.

### 3.5 Do not over-model the game

Shiny Crown should not evolve into a full digital implementation of *John Company*.

Only state that materially improves procedural guidance should be represented.

### 3.6 Do not abstract prematurely

Individual phases may have very different UI requirements.

Do not force every phase into an elaborate universal content schema simply to maximize component reuse.

A clear one-off React component is preferable to an awkward abstraction.

Reuse should emerge from demonstrated common patterns.

---

## 4. Technical constraints

The application should remain completely client-side.

There should be:

- no backend;
- no application server;
- no database;
- no accounts;
- no authentication;
- no remote save system.

It must be possible to deploy the complete application as static files to GitHub Pages.

A recommended initial stack is:

- React;
- TypeScript;
- Vite;
- CSS using either CSS Modules or a similarly lightweight styling approach;
- `localStorage` for persistent game state.

A large application framework such as Next.js is unnecessary unless a later requirement provides a compelling reason for it.

The application should be architected as essentially a **single-screen application** rather than a collection of URL routes.

The persistent outer shell remains mounted while the central content changes from phase to phase.

This also avoids unnecessary GitHub Pages SPA-routing complications.

---

## 5. Primary device targets

The application is mobile-first.

Priority order:

1. Phone
2. Tablet
3. Desktop

The phone experience should drive design decisions.

Desktop support should remain functional, but desktop optimization is not a major project objective.

Responsive layouts should not simply stretch phone content across a large desktop viewport. Content should retain a comfortable reading width.

---

## 6. High-level application structure

The main gameplay interface consists conceptually of:

```text
┌──────────────────────────────┐
│ Persistent application chrome │
│                              │
│ Climate / utility controls    │
├──────────────────────────────┤
│                              │
│                              │
│     Current phase content     │
│                              │
│          scrollable           │
│                              │
├──────────────────────────────┤
│        Back       Next        │
└──────────────────────────────┘
```

The central content region is the primary interface.

Reference material may temporarily appear above this interface as a modal, sheet, overlay, or equivalent layer without changing the user's position in the normal phase sequence.

---

## 7. Landing screen

The initial screen should be highly functional and deliberately unlike a SaaS marketing landing page.

Do not include:

- feature marketing;
- promotional copy;
- sales-oriented hero sections;
- long explanations of why the application is useful.

The screen should quickly expose the actions relevant to someone who has opened a board-game utility.

Depending on available saved state, appropriate actions include:

- Resume game
- New one-player game
- New two-player game
- Restore/import game

If no saved game exists, the new-game actions naturally become dominant.

If a saved session exists, Resume should be prominent.

Starting a new game when another save exists should require confirmation before overwriting it.

---

## 8. Game mode

A game session has a global mode:

```ts
type GameMode = "solo" | "two-player";
```

The player selects this when starting a new game.

This mode generally remains fixed for the entire session.

The app is built and content-audited for solo first, then receives a complete 2P pass before launch. All five difficulties—Easy, Normal, Hard, Expert, and Legendary—are sourced for solo. The books publish 2P setup only through Expert, so the app must reject or clearly hold the unsourced Legendary+2P combination until a deliberate ruling exists.

2P is a mode-aware replacement layer, not merely extra paragraphs. Some shared procedure remains, but 2P replaces material in setup, Family, Firms, Hiring, Parliament, Refresh, and scoring. It also requires distinct `human-1` and `human-2` identities and the persistent Player Button.

Phase content must therefore support shared material, additions, and replacements.

Example conceptual behavior:

```tsx
<ModeProcedure shared={sharedProcedure}>
  {gameMode === "solo" ? <SoloProcedure /> : <TwoPlayerProcedure />}
</ModeProcedure>
```

The actual implementation should use the application's content/localization architecture rather than necessarily embedding literal strings here.

---

## 9. Round and phase structure

The application presents the game's procedure as a sequence of screens.

In the ordinary case:

> one game phase = one application screen.

A long phase remains one screen and scrolls vertically rather than being automatically divided into multiple screens.

There are two major sections in the game flow.

### 9.1 Initial setup sequence

Six screens occur only once: `setup.configure`, `setup.table`, `setup.crown`, `setup.cards`, `setup.finish`, and `setup.ai`.

After setup is completed, these screens are not part of the recurring round loop.

### 9.2 Recurring round sequence

After setup, the app enters the verified sequence below. Conditional positions remain in the flow definition and are skipped from rendered navigation when their gate is false.

```text
Vote to Deregulate (eligible turns only)
  → London Season (skip on first turn)
  → Family
  → Firms (Deregulation only)
  → Hiring
  → Chairman
  → Director of Trade or Governor General
  → Manager of Shipping
  → Military Affairs
  → Bombay Presidency
  → Madras Presidency
  → Bengal Presidency
  → Superintendent of Trade in China (only when in play)
  → Bonuses
  → Firm Revenue (Deregulation and firms only)
  → Company Revenue
  → Events in India
  → Parliament Meets
  → Upkeep and Refresh
  → next turn or Game End and Scoring
```

The full entry/skip rules and exits are normative in [`phase-inventory.md`](source-analysis/phase-inventory.md). Company failure can occur outside its most common phases, so an always-available deliberate “Company failed / End game” action must route to scoring.

Once the final phase of a round is completed, pressing Next should return to the first phase of the **round**, not to the first setup screen.

Conceptually:

```text
Setup A
   ↓
Setup B
   ↓
Setup C
   ↓
Round Phase 1
   ↓
Round Phase 2
   ↓
...
   ↓
Round Phase N
   └──────────────→ Round Phase 1
```

On a non-final turn, Upkeep and Refresh returns to the turn-start Deregulation gate; it never returns to setup. On a final turn, perform Upkeep, skip Refresh, and enter scoring.

---

## 10. Non-linear sub-procedures

The three Presidency screens are linearly ordered **Bombay → Madras → Bengal**. Users must not reorder them.

Each Presidency has a locally ordered set of eligible actions: Trade, its Commander, and every associated in-play Governor. A human President chooses that local order. A Crown President defaults to Governors → Commander → Trade and can accept the sourced one-change favor. If the President is vacant, the Chairman orders the remaining Governor and Commander actions; Trade and local-alliance consent are unavailable.

The app therefore requires a checklist or selectable set of local action cards inside each Presidency:

```text
Bombay Presidency

✓ Governor of Bombay
○ Commander of Bombay
○ Trade

Continue
```

This interface is not yet locked.

The implementation should follow the verified local-action model while allowing the final card/checklist treatment to be settled through phone prototyping.

What is required is the underlying capability:

- derive eligible local actions from role state;
- persist the chosen valid local order and completed actions;
- prevent accidental loss of that progress;
- support multiple Governors associated with one Presidency;
- continue to the next fixed Presidency only when appropriate.

---

## 11. Crown climate

Climate is one of the application's most important pieces of global state.

The five sourced climates are:

```ts
type ClimateId = "bull" | "stag" | "lion" | "bear" | "peacock";
```

### Climate requirements

The current climate must:

- always be readily visible during gameplay;
- be changeable directly from the persistent UI;
- persist across phase transitions;
- persist across page reloads;
- be included in exported saves.

Changing climate should immediately update climate-sensitive content on the current screen.

No explicit refresh or phase re-entry should be necessary.

### Important semantic rule

Climate affects **Crown behavior**, not human-player behavior.

However, human-player actions may cause the climate to change.

Therefore a phase controlled by a human player may still contain an interactive instruction such as:

> If X happens, set the Crown climate to Y.

Such changes should be performable directly at the relevant place in the procedure.

---

## 12. Inline state controls

Although climate can always be changed through global chrome, context-specific controls should also appear inside phase content when the rules naturally produce a state change.

For example, if a rule instructs the user to draw a card and change climate based on its suit, the relevant climate controls can appear immediately below that instruction.

The user should not be forced to:

1. read the instruction;
2. remember the result;
3. navigate to a global settings interface;
4. manually locate the corresponding value.

A contextual control should change the exact same underlying global state as the global climate selector.

There must never be separate "local" and "global" climate values.

---

## 13. Company roles

Role occupancy is another major component of global state.

Availability and occupancy are separate. Every role uses this discriminated state:

```ts
type ActorId = "human-1" | "human-2" | "crown";

type RoleAssignment =
  | { status: "not-in-play"; previousOccupant?: ActorId }
  | { status: "vacant"; previousOccupant?: ActorId }
  | { status: "occupied"; occupant: ActorId; previousOccupant?: ActorId };
```

In solo, `human-2` is invalid. `vacant` means an existing position can be filled. `not-in-play` means the position does not currently exist and must not appear in Hiring or Company Operations.

The verified inventory is:

- Chairman;
- Director of Trade or Governor General, mutually exclusive;
- Manager of Shipping;
- Military Affairs;
- Presidents of Bombay, Madras, and Bengal;
- Superintendent of Trade in China, initially not in play;
- regional Governors for Bombay, Madras, Bengal, Punjab, Delhi, Maratha, Mysore, and Hyderabad, each with a current Presidency association;
- Commanders of Bombay, Madras, and Bengal;
- Prime Minister and Opposition Leader.

Commanders and political positions are tracked because they change instructions, even though they are not Company office cards. Chairman retains `previousOccupant` for election and retirement ordering.

---

## 14. Role-aware phases

Many phases correspond directly to a particular company office.

Examples include the Chairman phase and Manager of Shipping phase.

For a role-specific phase, the UI should prominently show who currently occupies the relevant position.

For example:

```text
CHAIRMAN

Currently:
[Crown ▾]
```

The occupant should be editable directly from this UI.

Changing it should be extremely quick.

This is primarily a correction/exception mechanism; under normal play, occupancy will often already have been set during the appropriate procedural phase.

---

## 15. Role-dependent content

Role ownership can materially change an entire phase.

A phase performed by a human player may contain instructions describing the ordinary player procedure.

The same phase performed by the Crown may instead need Crown-specific instructions.

Therefore role ownership is not merely decorative metadata.

Conceptually:

```text
if role is occupied by Player 1 / Player 2:
    show human procedure

if role is occupied by Crown:
    show Crown procedure
    apply current climate to Crown decisions

if role is vacant:
    show appropriate vacant-role handling
```

The actual rules must be derived from the provided sources.

Climate-dependent branching should occur only inside the Crown branch unless the rules specifically state otherwise.

---

## 16. Hiring phase

The hiring phase is an example of a phase that requires bespoke UI.

Its purpose involves filling vacant company roles.

First resolve the Chairman election. Then build a queue from Company office cards whose state is exactly `vacant`, ordered by the printed number on the physical card. Never include `not-in-play` positions.

The screen can then show those roles together with the specific hiring procedure relevant to each office.

Chairman hires the Director/Governor General, Manager of Shipping, Military Affairs, and China office. Director/Governor General hires Presidents. Presidents hire associated Governors. Military Affairs assigns Commanders outside Hiring.

The UI therefore needs access to the global role state while presenting phase-specific hiring information.

Changes made during hiring should immediately update global role occupancy.

Promotion occupies the destination and vacates the person's former office. Hiring must preserve actor identity and `previousOccupant`, support Crown candidate priorities, and present the 2P election, consent, and nepotism replacements from [`two-player-pass.md`](source-analysis/two-player-pass.md).

When all relevant vacancies have been resolved—or whenever the rules permit proceeding—the user can advance normally.

The final visual treatment should use the verified vacancy and hirer model in the implementation brief and be tested on a phone-sized viewport.

---

## 17. Roles becoming vacant

Game procedures may remove people from offices through retirement, dismissal, death, or other effects.

Whenever the displayed procedure directly creates this possibility, the relevant content should provide a fast contextual control for updating that existing role to `vacant`.

For example:

```text
If the officeholder is removed:

[ Mark office vacant ]
```

That action updates global role state. Structural changes are different: activating China creates a previously absent office; conquering or losing a region creates or removes its Governor; the Governor General law removes Director of Trade and every regional Governor from play. These transitions must use explicit domain actions rather than relabeling absence as vacancy.

Again, the goal is to place state manipulation at the point where the rules require it.

---

## 18. Phase content architecture

This is one of the most important architectural decisions.

The app is primarily a sophisticated presentation layer for rules content.

Do **not** assume that every phase can be represented by the same generic schema.

Different phases may contain:

- ordinary paragraphs;
- headings;
- Crown-specific instructions;
- climate-dependent instructions;
- player-specific instructions;
- two-player additions;
- tables;
- warning/callout panels;
- role status displays;
- role controls;
- climate controls;
- lists;
- locally ordered Presidency actions;
- specialized interactive widgets;
- flow-style decisions.

The recommended architecture is therefore a hybrid system.

Each phase has a normal React component:

```ts
type PhaseComponentProps = {
  session: GameSession;
  actions: GameActions;
  locale: Locale;
};
```

A phase component is free to compose:

- ordinary content primitives;
- shared UI components where useful;
- phase-specific components;
- state-aware conditions.

For example:

```tsx
function ChairmanPhase(props: PhaseComponentProps) {
  // Bespoke rendering appropriate to this phase.
}
```

A central registry maps procedural IDs to the corresponding components:

```ts
const phaseRegistry = {
  chairman: ChairmanPhase,
  shipping: ShippingPhase,
  hiring: HiringPhase,
  // ...
};
```

This gives the project freedom to build each phase correctly without abandoning a coherent navigation system.

---

## 19. Component-reuse philosophy

Do not treat maximum reuse as a goal.

Create shared components when a real recurring visual or behavioral pattern exists.

Likely shared primitives may eventually include components such as:

- `RuleParagraph`
- `Callout`
- `RoleBadge`
- `RoleSelector`
- `ClimateBadge`
- `ClimateSelector`
- `TwoPlayerOnly`
- `CrownOnly`
- `ReferenceSheet`
- `PhaseHeader`

But this list is illustrative.

If an interface occurs on only one phase and extracting it makes the implementation harder to understand, leave it local to that phase.

State should be reusable and centrally accessible even when presentation is bespoke.

This distinction is important:

> Share the state model aggressively. Share presentation only when doing so improves the implementation.

---

## 20. Navigation

Normal phase navigation consists of:

- a prominent Next action;
- a visually subdued Back action.

The expected direction of travel is forward.

Next should therefore have substantially greater visual prominence than Back.

When moving to another phase, the new phase should begin at its top rather than retaining the previous phase's scroll position.

The exact placement may be adjusted during UI development, but on phones a persistent or easily reachable bottom navigation treatment is likely appropriate.

---

## 21. Back behavior and state changes

Back should not blindly undo global game state.

Consider:

1. the user enters Phase A;
2. during Phase A, the rules cause the Crown climate to change;
3. the user presses Next;
4. the user realizes they advanced too early and presses Back.

It is ambiguous whether going back means:

- returning only to the previous instructions while preserving the new climate; or
- returning to the earlier game state as well.

The app should not guess silently.

A practical implementation is to retain a lightweight snapshot at phase transitions.

If returning to a previous phase would cross a state-changing boundary, offer something conceptually equivalent to:

```text
Return to the previous phase

The game state changed after you entered it.

[ Go back and keep current state ]
[ Restore previous state ]
[ Cancel ]
```

At minimum, climate changes should trigger this behavior.

Because role occupancy is also meaningful global state, the implementation should be capable of handling role-state differences through the same mechanism rather than creating an unrelated second system.

This is not intended to become a general undo/event-sourcing framework.

One transition snapshot per navigation boundary is sufficient.

---

## 22. Persistence

The application must automatically preserve progress.

Primary persistence mechanism:

```text
localStorage
```

Cookies should not be used for game-state persistence.

State should be saved after meaningful mutations, including:

- advancing or returning between phases;
- changing climate;
- changing role occupancy;
- completing sub-procedures;
- changing any future persisted phase-specific state.

Closing the browser, refreshing the page, or reopening the application should allow the session to resume.

---

## 23. Game-session state model

The source audit established the minimum persistent model. Exact TypeScript organization may evolve. Schema v2 adds persisted human display names while retaining the established facts and invariants:

```ts
interface GameSessionV2 {
  schemaVersion: 2;
  mode: "solo" | "two-player";
  playerNames: Record<"human-1" | "human-2", string>;
  scenario: "1710" | "1758" | "1813" | "long-1710";
  difficulty: "easy" | "normal" | "hard" | "expert" | "legendary";
  turn: number;
  firstTurn: boolean;
  climate: ClimateId;
  deregulated: boolean;
  roles: RoleState;
  twoPlayer: null | { buttonHolder: "human-1" | "human-2" };
  progress: {
    phaseId: PhaseId;
    phaseState: PhaseState;
    endReason: "scenario-end" | "company-failure" | null;
  };
  history: NavigationSnapshot[];
}
```

`RoleState` uses the three-state assignments in section 13 and separately includes the three Commanders, Prime Minister, Opposition Leader, regional Governor associations, and mutually exclusive Director/Governor General variants.

`PhaseState` is a discriminated union owned by the current phase. Required initial variants cover setup-card progress, Presidency-local order/completion, and optional firm-label completion. Avoid `Record<string, unknown>`.

Required invariants include:

- solo forbids `human-2`; 2P requires a valid Button holder;
- Director of Trade and Governor General cannot both be in play;
- Governor General removes every regional Governor from play;
- an in-play Governor has a Presidency association;
- 1813 begins deregulated; Deregulation only changes from false to true;
- China cannot be visited while its office is not in play;
- Legendary+2P cannot be extrapolated silently;
- imports satisfy all invariants before replacing the current save.

The normative shape, mutations, and exclusions are in [`state-model-audit.md`](source-analysis/state-model-audit.md). The app deliberately does not persist money, cubes, shares, units, routes, dice, cards, firms, or physical-board predicates.

The state model should be versioned from the beginning to support migrations as the application evolves.

Schema v1 saves migrate both player names to neutral defaults. Two-player setup lets users replace those defaults; every displayed human identity uses the saved name. Solo displays `human-1` as `You` and never exposes `human-2`.

---

## 24. Exportable save string

In addition to browser persistence, users need a portable backup.

The application should be able to serialize the complete resumable game state into an opaque string.

Requirements:

- contains everything necessary to resume;
- as short as reasonably practical;
- copyable;
- pasteable/importable later;
- not intended to be human readable;
- contains a schema/version identifier;
- invalid imports fail safely;
- importing must not destroy an existing save until validation succeeds.

A reasonable pipeline is:

```text
GameSession
   ↓
compact serialization
   ↓
compression
   ↓
URL-safe/base64-style encoding
   ↓
opaque save string
```

The exact codec can be chosen during implementation.

Do not spend disproportionate engineering effort minimizing the string by a few characters. Reliability and forward compatibility matter more than theoretical minimum length.

---

## 25. Save/export interface

Save management should be accessible from the persistent application chrome.

It does not need to dominate the interface.

A simple utility sheet can contain actions such as:

- Copy backup code
- Restore from backup code
- Restart/new game

Normal users should not need to manually press Save; browser persistence is automatic.

The exported string is a backup/transfer mechanism, not the primary save mechanism.

---

## 26. Reference material available during play

The app should expose one or more higher-level reference resources that may be needed at arbitrary points during the game.

Opening one must not change:

- current phase;
- phase progress;
- climate;
- role state.

These references should appear as a layer over the main experience.

The global/contextual reference surfaces are:

- glossary;
- Basic Favors, visually enabled from the Firms boundary through Company Revenue;
- Success Checks;
- the page-17 Crisis/Rebellion/Invasion flowchart;
- the page-20 Crown Voting Plan;
- 2P Player Button help.

For v1, use the extracted 1353×1670 page-17 raster as a pan/zoom surface and provide the reconciled semantic text equivalent. No separate pre-launch reference sheets or external graphic sourcing are required. The voting plan is a Parliament reference, not a round phase.

---

## 27. Future interactive flowchart

A desirable later enhancement is converting the reference flowchart into an interactive mini-procedure.

Rather than displaying the entire chart simultaneously, the user could see the current decision and select among its outgoing branches.

For example:

```text
What happened?

[ Result A ]
[ Result B ]
[ Result C ]
```

Selecting an option reveals the next node.

This would function as an independent mini state machine above the main game flow.

It is not required for the initial release if implementing it would delay the core application.

The content architecture should avoid making such an enhancement unnecessarily difficult later.

---

## 28. Visual direction

The desired presentation is:

- beautiful;
- restrained;
- serious;
- elegant;
- slightly regal;
- subtly Victorian.

It should evoke the historical character of *John Company* without becoming theatrical or kitschy.

Avoid:

- excessive ornamentation;
- fake parchment everywhere;
- steampunk aesthetics;
- visually noisy Victorian decoration;
- game-UI chrome that competes with the text.

Typography is especially important.

The rules should feel intentionally typeset rather than merely rendered by a web browser.

A likely visual strategy is:

- a characterful display or serif face for headings;
- an exceptionally readable text face for body copy;
- disciplined spacing;
- restrained dividers and ornamental details;
- strong hierarchy;
- a narrow, comfortable measure for paragraphs.

Font selection should occur during visual prototyping rather than being hard-coded by this spec.

---

## 29. Persistent chrome

The app should have enough persistent UI to expose global state and utilities without reducing the central reading space excessively.

The shell needs access to:

- current Crown climate;
- climate change control;
- reference materials;
- save/export controls.

Phase-specific role ownership should generally belong near the top of the phase content rather than permanently consuming global chrome, because not every phase revolves around the same role.

The chrome should feel integrated with the visual design rather than like a generic application toolbar.

The climate control is a single compact current-climate icon at rest. Activating it expands a horizontal Bull → Stag → Lion → Bear → Peacock selector; choosing a climate updates the one global value and collapses the selector. The control must be fully keyboard and screen-reader accessible.

---

## 30. Information hierarchy inside phases

A role-oriented phase will often follow a hierarchy similar to:

```text
PHASE NAME

Role: Chairman
Occupant: Crown

Relevant status / controls

Primary procedure

Crown-specific procedure for current climate

Additional rules / exceptions

Two-player-only additions where applicable
```

This is a conceptual hierarchy only.

Individual phases are explicitly allowed to deviate from it where the content demands.

---

## 31. Conditional rendering hierarchy

When determining what information belongs on a screen, state should conceptually be evaluated in roughly this order:

```text
Current phase
    ↓
Mode, scenario, Deregulation, and structural gates
    ↓
Applicable role / availability / occupant
    ↓
If Crown is acting:
    current Crown climate
    ↓
Shared, solo, or 2P replacement content
    ↓
Any phase-specific local state
```

This is not necessarily a required programmatic nesting order.

It describes the rule dependencies discovered so far.

---

## 32. Content visibility

Whenever the application can confidently determine that a rule does not apply, the default should be not to show it.

This is particularly important for climate behavior.

A user should normally see:

> Crown does X.

rather than:

> If climate A, Crown does X.  
> If climate B, Crown does Y.  
> If climate C, Crown does Z.  
> If climate D, Crown does W.  
> If climate E, Crown does Q.

The whole point of tracking climate is to eliminate that lookup burden.

Exceptions may exist when comparison itself is useful, but those should be deliberate.

---

## 33. Internationalization

The application should be internationalization-ready from initial development.

Initial release language:

```text
English
```

A later release will add:

```text
Brazilian Portuguese (pt-BR)
```

The implementation should not assume that English text is permanent or embed important strings inseparably into application logic when avoiding that is practical.

At the same time, this project should **not** force an unrealistic absolute separation between content and presentation.

Some phase content is inherently structural and interactive.

The target is therefore:

> Keep user-facing text independently replaceable/localizable while allowing phase-specific React code to determine how and when that text is presented.

---

## 34. Recommended localization content model

Each localized content unit should have a stable semantic identifier.

For example:

```ts
content.en.phases.chairman.title
content.en.phases.chairman.player.intro
content.en.phases.chairman.crown.climateA.action
```

For content that needs structured values, a locale module may export objects or arrays rather than a single flat string.

For example:

```ts
const hiringCopy = {
  title: "Hiring",
  intro: "...",
  roles: {
    shippingDirector: {
      title: "...",
      instructions: "..."
    }
  }
};
```

The React component controls layout.

The localization module controls the actual wording.

It is acceptable for highly specialized content to use a slightly different structure when that is substantially clearer.

Again, do not create an enormous generic schema merely for architectural purity.

---

## 35. Portuguese localization workflow

The Portuguese version has an important content constraint.

The bulk of the Portuguese text should **not** be freshly machine-translated from English.

At the localization stage, the developer will receive the official Portuguese rulebook for *John Company*.

The required workflow is:

1. inspect each English content unit used by Shiny Crown;
2. locate the corresponding passage in the official Portuguese rulebook where one exists;
3. use the published Portuguese wording directly;
4. preserve official terminology consistently;
5. identify content in Shiny Crown that has no official Portuguese equivalent;
6. leave that content for deliberate manual translation or targeted translation work.

Codex should not simply run every English string through translation.

The official published Portuguese game terminology takes precedence.

This requirement is one reason stable semantic content IDs and source provenance will be valuable.

---

## 36. Content provenance

Where practical, imported rule content should retain metadata connecting it to its source.

For example:

```ts
{
  text: "...",
  source: {
    documentId: "aid-v3.2",
    page: 5,
    section: "Chairman",
    mode: "solo"
  }
}
```

This metadata does not need to ship visibly in the production interface.

It is useful for:

- checking implementation accuracy;
- locating source passages;
- resolving ambiguities;
- mapping Portuguese text later;
- auditing rule updates.

Every shipped content unit must retain at least one provenance record in source data or an adjacent content module. Mode-specific replacements retain both the solo source and the source that replaces it. Stable semantic IDs should describe the rule rather than its page location so later localization can change wording without changing behavior. See [`source-register.md`](source-analysis/source-register.md) for the schema and source hashes.

---

## 37. Accessibility and usability

Even though this is a personal/community gaming utility, basic accessibility should be part of normal implementation quality.

The interface should provide:

- sufficiently large tap targets;
- strong text/background contrast;
- readable font sizes;
- semantic HTML;
- keyboard-operable interactive controls where applicable;
- visible focus states;
- labels that do not rely only on color;
- scalable text without catastrophic layout breakage.

Climate should not be communicated solely through color.

Role occupants should likewise have textual identification.

Animations, if any, should be subtle and respect reduced-motion preferences.

---

## 38. Performance

The application is primarily text and simple UI.

It should therefore be extremely fast.

The initial bundle should not become large because of an unnecessarily heavy component framework.

The app should feel instant when:

- changing climate;
- changing role ownership;
- advancing phases;
- opening references;
- resuming from local storage.

All ordinary state transitions should happen locally with no network dependency.

Static assets should be optimized appropriately.

---

## 39. Offline behavior

Full offline/PWA installation is not currently a hard requirement.

However, once the static application has loaded, core game functionality should not depend on live APIs or remote data.

Do not introduce network dependencies into the gameplay loop.

A later PWA enhancement should remain possible without architectural replacement.

---

## 40. Error handling

The application should fail conservatively around saved state.

If `localStorage` data is malformed or comes from an unsupported schema version:

- do not crash into a blank screen;
- explain that the save could not be loaded;
- preserve the raw data where practical until the user deliberately replaces it;
- allow starting a new session.

Imported backup strings must be fully validated before replacing existing state.

---

## 41. State management

A dedicated global state library is optional.

The application state is relatively small.

An initial implementation can use:

- React context;
- `useReducer`;
- a typed session model.

This has advantages here because state changes can be represented as explicit domain actions such as:

```ts
setClimate(...)
setRoleStatus(...)
promote(...)
activateDeregulation()
replaceTradeDirectorWithGovernorGeneral()
activateChinaOffice()
resolveButtonChoice(...)
advancePhase()
returnToPreviousPhase(...)
completePresidencyAction(...)
endGame(...)
restoreSession(...)
```

If implementation experience demonstrates that a small external store such as Zustand materially simplifies the code, adopting one is acceptable.

Do not select a state-management library merely because the application has "state."

---

## 42. No event system

Do not build a generalized event bus or rules engine for Crown effects.

When game rules tell the user that something happened, the user performs the relevant update through the UI.

For example:

```text
Rule says climate becomes X
        ↓
User taps X
        ↓
global climate state changes
```

Shiny Crown is assisting the player, not observing the physical game.

---

## 43. Suggested repository structure

A reasonable starting layout is:

```text
src/
  app/
    App.tsx
    session/
      types.ts
      reducer.ts
      persistence.ts
      serialization.ts

  flow/
    phaseRegistry.ts
    flowDefinition.ts

  phases/
    setup/
    chairman/
    hiring/
    shipping/
    regionalPresidencies/
    retirement/
    ...

  components/
    primitives/
    climate/
    roles/
    navigation/
    references/

  content/
    en/
      ...
    pt-BR/
      ...

  references/
    ...

  styles/
    tokens.css
    typography.css
    global.css
```

This structure is illustrative.

It should be changed if the actual source material reveals a cleaner domain organization.

---

## 44. Testing strategy

The procedural/state layer deserves automated testing because small navigation mistakes could make the application actively misleading during play.

At minimum, unit tests should cover:

- setup transitions into the round;
- final round phase loops to the correct first round phase;
- Back navigation;
- solo vs. two-player mode;
- climate updates;
- role ownership updates;
- Crown content changing when climate changes;
- human/Crown phase branching;
- role `not-in-play`/`vacant`/`occupied` transitions and invariants;
- Director/Governor General mutual exclusion;
- Deregulation and optional-office skips;
- first-turn London Season skip and final-turn Refresh skip;
- fixed Bombay → Madras → Bengal flow;
- Presidency-local action-order persistence;
- 2P actor identity and explicit Button pass triggers;
- solo/2P replacement content, including Family count, Parliament, Refresh, and scoring;
- rejected Legendary+2P configuration until ruled;
- local-storage serialization;
- save-string round trips;
- malformed save imports;
- schema migration behavior.

Content itself needs manual comparison against the primary aid and, for 2P replacements, both auxiliary books. Visual tables and diagrams must be checked against rendered pages rather than OCR alone.

For critical conditional content, lightweight rendering tests can verify that mutually exclusive variants appear under the correct state.

End-to-end tests should exercise at least one complete synthetic round on a phone-sized viewport.

---

## 45. Content implementation workflow

The safest implementation process is not to attempt every phase simultaneously.

For each phase:

1. locate its primary-aid section and any mapped auxiliary replacement in the source register;
2. inspect the equivalent behavior in the reference app;
3. identify the applicable game role, if any;
4. identify human-vs-Crown branching;
5. identify climate branching;
6. identify solo/two-player differences;
7. identify state changes produced by the procedure;
8. identify unusual UI requirements;
9. implement the phase;
10. compare it against the source material;
11. test it on a phone viewport;
12. only then move on or abstract recurring patterns.

This process should cause the component vocabulary to emerge from the content rather than being invented in advance.

---

## 46. Development milestones

### Milestone 1 — Source analysis — complete

The complete handoff is indexed in [`docs/source-analysis/README.md`](source-analysis/README.md). It includes reproducible extraction, visually reconciled graphics, exact setup/round/role inventories, an exactly-once content ledger, phase-by-state matrix, state audit, implementation briefs, complete pre-launch 2P pass, provenance rules, and explicit open source edges.

### Milestone 2 — Application skeleton

Deliver:

- Vite/React/TypeScript project;
- single-screen shell;
- visual tokens;
- typography prototype;
- basic landing screen;
- phase registry;
- Next/Back navigation;
- round looping;
- phone-first responsive layout.

Build the complete discriminated state foundation at the same time as the shell: mode, difficulty, scenario, turn/first-turn, Deregulation, climate, structural role availability, occupants, political roles, 2P Button, terminal reason, and typed phase-local progress. Do not scaffold against the discarded four-field model.

Use placeholder content only where necessary.

### Milestone 3 — Persistence and recovery

Deliver:

- autosave;
- session restore;
- backup string export/import;
- transition snapshots/back behavior.

### Milestone 4 — Representative phase prototype

Before implementing every phase, build a small selection representing different challenges.

Use the verified representative slices:

- Bonuses, for mostly textual shared content;
- Chairman, for role/climate branching and branch-specific climate timing;
- Hiring, for availability, promotion, and solo/2P replacement rules;
- Bombay Presidency, for a fixed regional position with locally configurable Governor/Commander/Trade order.

This milestone should validate the architecture.

Refactor only after real patterns become apparent.

The Session 3.1 corrective pass established the presentation contract for later phases: source text first, one compact phase title, continuous sections instead of oversized cards, global structural editing behind the State surface, inline segmented holder controls only where branch context benefits, no completion controls unless they replace meaningful tabletop memory, and phone-width verification at 320, 375, 414, and 768 CSS pixels.

### Milestone 5 — Full English content

Convert every phase from the supplied PDF into the application.

Perform rule/content QA against the source document.

### Milestone 6 — Reference tools

Implement the global reference surfaces required for play.

The flowchart may remain static for v1.

### Milestone 7 — Polish and release

Focus on:

- typography;
- spacing;
- mobile ergonomics;
- state-control speed;
- source-text fidelity and per-sentence provenance;
- error handling;
- accessibility;
- visual cohesion;
- GitHub Pages deployment.

### Post-launch milestone — Brazilian Portuguese

Add locale switching and map English content to the official Portuguese rulebook following the localization workflow described above.

Any unmatched text is flagged for deliberate translation rather than silently machine-translated.

### Optional post-launch milestone — Interactive flowchart

Replace or supplement the static flowchart with the interactive decision-tree representation.

---

## 47. GitHub Pages deployment

The production build must be static.

A GitHub Actions workflow can:

```text
checkout
   ↓
install
   ↓
test
   ↓
build
   ↓
deploy dist/ to GitHub Pages
```

Vite's base path must be configured correctly if the project is served from a repository subpath.

Because gameplay uses no URL router, deployment should not require special SPA rewrite handling.

---

## 48. Explicit non-goals

Unless later requirements change, Shiny Crown should not include:

- accounts;
- cloud saves;
- multiplayer networking;
- a backend API;
- a database;
- user authentication;
- automatic observation of the physical board state;
- automatic execution of Crown decisions beyond presenting the applicable procedure;
- complete simulation of *John Company*;
- an elaborate general-purpose game rules engine;
- generalized event sourcing;
- a CMS;
- a SaaS-style marketing site.

These features would add complexity without advancing the core purpose of the app.

---

## 49. Bounded source gaps

Session 1 resolved the provisional unknowns. The remaining gaps do not block the foundation or solo implementation:

- **Legendary in 2P:** the books publish 2P difficulty only through Expert. Do not offer Legendary+2P until the user chooses to hide it permanently or defines an adaptation.
- **Player Button after generic Crown choices:** passing is explicit for Crown choices between humans and disputed action rights. Keep manual transfer available when a free choice or Crisis choice has no explicit pass instruction.
- **2P Nepotism with only one human candidate:** no promise reward is stated. Present the sourced consent procedure without inventing one.
- **Refusing Crown firm investment in 2P:** base manager consent and the solo-only paid refusal conflict in scope. Do not invent a free or paid refusal until ruled.
- **Writer-placement Button passing:** apply a pass only when an actual choice between eligible human owners occurs, pending playtest confirmation.
- **Scenario-card detail:** direct players to the selected physical card for scenario-specific setup and final-turn values until scans are supplied.
- **Card-specific ongoing exceptions:** office-card numbering was resolved from the complete card-back composite supplied in Session 3. Continue to apply uncatalogued law, prestige, Blackmail, scenario, and setup card text physically.

The evidence and conservative implementation policy for each gap are in [`decisions-and-questions.md`](source-analysis/decisions-and-questions.md).

---

## 50. Definition of a successful v1

Shiny Crown v1 is successful when a player can:

1. open the application on a phone;
2. start a solo or two-player game immediately;
3. proceed through setup;
4. proceed through an entire round in the correct order;
5. begin another round without returning to setup;
6. always see the current Crown climate;
7. update climate quickly wherever the rules require it;
8. distinguish absent, vacant, and occupied roles and track the correct human/Crown occupant;
9. use saved player names throughout two-player play and `You` in solo;
10. see the correct procedure for the current role occupant;
11. see only the Crown instructions relevant to the current climate;
12. receive the correct shared, solo, or two-player replacement procedure;
13. complete the fixed Presidency sequence while preserving each Presidency's local action order;
14. go backward safely after an accidental advance;
15. close and reopen the application without losing progress;
16. copy a backup code and later restore the same session from it;
17. access global reference material without losing their place;
18. comfortably read and operate the interface throughout a real tabletop session.

Most importantly, using Shiny Crown should feel materially easier than repeatedly consulting the Crown PDF or the existing reference application.

The experience should be fast enough that the application disappears into play rather than becoming another system the player must manage.

---

## Final implementation directive

When working from this specification, use [`docs/source-analysis/README.md`](source-analysis/README.md) as the source-map entry point. Treat the combined aid as the primary solo content source, both rulebooks as required 2P sources, and the reference app as behavior inspiration only.

Do not invent rules that are absent from the supplied material.

Do not flatten the mapped phase-specific behavior into a universal content abstraction.

Build the verified global model—mode, difficulty, scenario, turn/first-turn, climate, Deregulation, three-state roles, political positions, 2P Button, procedural position, terminal reason, and typed local progress—and let individual phase implementations remain bespoke where the rules demand it.

The distinguishing quality of Shiny Crown should not be technical sophistication for its own sake. It should be the precision with which a complicated body of procedural rules has been transformed into a calm, elegant, state-aware mobile interface.
