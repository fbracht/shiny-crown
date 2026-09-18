# Shiny Crown — Development Specification

Status: Initial development specification  
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

Development should expect two major pieces of reference material to be provided.

### 2.1 Reference application

An existing community-created application already attempts to solve essentially the same problem.

It should be treated as:

- a reference for understanding the required workflow;
- a source of ideas about how the Crown procedure can be represented interactively;
- a benchmark that Shiny Crown should intentionally surpass in clarity, presentation, usability, and overall polish.

The purpose of Shiny Crown is not merely to reproduce that application.

The existing app should not dictate the new application's architecture. If its source repository is available, it may be inspected to understand behavior, edge cases, or rules mappings, but its implementation should not automatically be copied.

The new application should particularly improve the quality of:

- typography;
- information hierarchy;
- mobile usability;
- state awareness;
- visual presentation;
- reduction of irrelevant information;
- navigation through the Crown procedure.

### 2.2 Crown guidance PDF

A PDF already exists that contains essentially the complete procedural guidance that Shiny Crown needs to present.

This PDF is the primary content source for the English version.

Development should:

1. extract its content;
2. understand its structure and meaning;
3. map its material onto the actual game phases;
4. identify climate-dependent sections;
5. identify role-dependent sections;
6. identify solo/two-player differences;
7. identify tables, callouts, flowcharts, and unusual structures;
8. convert that information into appropriate interactive UI.

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
- current phase;
- Crown climate;
- role occupancy.

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

The two-player Crown rules appear to be mostly additive: the ordinary solo procedure remains applicable, but certain phases contain additional rules when there are two human players.

Therefore phase content should be able to render blocks conditionally based on game mode.

Example conceptual behavior:

```tsx
<StandardProcedure />

{gameMode === "two-player" && (
  <TwoPlayerAdditionalRules />
)}
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

Several screens occur only once at the beginning of the game.

These include setup-related procedures such as initial allocation/hiring.

After setup is completed, these screens are not part of the recurring round loop.

### 9.2 Recurring round sequence

After setup, the app enters the game's normal sequence of approximately fifteen phases.

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

The exact sequence must be derived from the reference PDF, reference app, and game rules.

---

## 10. Non-linear sub-procedures

Although the overall round structure is primarily sequential, individual phases may contain their own navigation behavior.

One known example is the group of regional presidency procedures.

Several regional procedures occur during the same broader part of the round and may be completed in different orders.

The app therefore requires support for a phase containing a collection of sub-steps that are not linearly ordered.

A possible interface is a small checklist or selectable set of region cards:

```text
Regional Presidencies

✓ Bengal
○ Bombay
✓ Madras

Continue
```

This interface is not yet locked.

The implementation should allow the final interaction design to be determined after seeing the actual content and testing it on a phone.

What is required is the underlying capability:

- track which sub-procedures have been completed;
- allow them to be performed in any valid order;
- prevent accidental loss of that progress;
- continue the main sequence when appropriate.

---

## 11. Crown climate

Climate is one of the application's most important pieces of global state.

The Crown has five climates.

The exact names should be populated from the source material rather than invented during scaffolding.

Conceptually:

```ts
type ClimateId =
  | "climate-1"
  | "climate-2"
  | "climate-3"
  | "climate-4"
  | "climate-5";
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

For every relevant company role, Shiny Crown should know whether it is occupied by:

```ts
type RoleOccupant =
  | "player-1"
  | "player-2"
  | "crown"
  | "vacant";
```

In a solo game, `"player-2"` is not a valid assignment.

The complete role list should be derived from the game/reference materials.

Known examples mentioned during discovery include:

- Chairman
- Director of Shipping
- President of Bengal
- General of Bengal
- other regional presidents and company offices

This list is illustrative, not authoritative.

---

## 14. Role-aware phases

Many phases correspond directly to a particular company office.

Examples include the Chairman phase or Director of Shipping phase.

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

At the beginning of this phase, the app should be able to identify the currently vacant roles.

The screen can then show those roles together with the specific hiring procedure relevant to each office.

For example, different offices may be appointed by different other offices.

The UI therefore needs access to the global role state while presenting phase-specific hiring information.

Changes made during hiring should immediately update global role occupancy.

When all relevant vacancies have been resolved—or whenever the rules permit proceeding—the user can advance normally.

The final visual treatment should be designed after inspecting the actual source material.

---

## 17. Roles becoming vacant

Game procedures may remove people from offices through retirement, dismissal, death, or other effects.

Whenever the displayed procedure directly creates this possibility, the relevant content should provide a fast contextual control for updating that role to `"vacant"`.

For example:

```text
If the officeholder is removed:

[ Mark office vacant ]
```

That action updates global role state.

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
- arbitrary-order sub-procedures;
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

The exact model will evolve when the complete rules are mapped, but an initial shape should resemble:

```ts
interface GameSession {
  schemaVersion: number;

  gameMode: "solo" | "two-player";

  climate: ClimateId;

  roles: Record<RoleId, RoleOccupant>;

  progress: {
    phaseId: PhaseId;
    roundNumber?: number;
    phaseState?: Record<string, unknown>;
  };

  history?: NavigationSnapshot[];
}
```

`roundNumber` should only be tracked if it proves useful. It is not currently a core requirement.

`phaseState` should remain narrow. It exists for exceptional phases such as unordered sub-steps rather than as a dumping ground for board state.

The state model should be versioned from the beginning to support migrations as the application evolves.

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

One known reference is a flowchart.

For version 1, simply reproducing the flowchart in a usable mobile form is acceptable.

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
Applicable role / role occupant
    ↓
If Crown is acting:
    current Crown climate
    ↓
Game mode additions
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
    document: "crown-guide",
    page: 12,
    section: "Chairman"
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

Do not complicate trivial content solely to attach metadata, but retain provenance during the content-conversion workflow.

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
setRoleOccupant(...)
advancePhase()
returnToPreviousPhase(...)
completeSubstep(...)
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
- role vacancy updates;
- unordered sub-step persistence;
- local-storage serialization;
- save-string round trips;
- malformed save imports;
- schema migration behavior.

Content itself also needs manual comparison against the supplied source PDF.

For critical conditional content, lightweight rendering tests can verify that mutually exclusive variants appear under the correct state.

End-to-end tests should exercise at least one complete synthetic round on a phone-sized viewport.

---

## 45. Content implementation workflow

The safest implementation process is not to attempt every phase simultaneously.

For each phase:

1. locate it in the reference PDF;
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

### Milestone 1 — Source analysis

Deliver:

- extracted PDF content;
- complete phase inventory;
- setup sequence;
- round sequence;
- role inventory;
- five climate identifiers;
- matrix of phases versus applicable roles/climates/modes;
- inventory of special phase behaviors;
- initial content provenance mapping.

No major UI implementation should occur before this map exists.

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

Use placeholder content only where necessary.

### Milestone 3 — State layer

Deliver:

- game mode;
- climate;
- role occupancy;
- phase progress;
- phase-local state;
- autosave;
- session restore;
- backup string export/import;
- transition snapshots/back behavior.

### Milestone 4 — Representative phase prototype

Before implementing every phase, build a small selection representing different challenges.

Ideally include:

- one mostly textual phase;
- one Crown/climate-dependent role phase;
- Hiring;
- the unordered regional procedure.

This milestone should validate the architecture.

Refactor only after real patterns become apparent.

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

## 49. Known unknowns

The following items should be resolved by inspecting the reference app, PDF, and rulebooks rather than guessed:

- exact names and order of all setup screens;
- exact recurring phase sequence;
- exact five climate names;
- complete company-role inventory;
- precise role-hiring relationships;
- all Crown/player branching rules;
- all places where climate may change;
- all places where roles can become vacant;
- all two-player-only additions;
- whether any game state beyond mode, climate, roles, and limited phase-local state needs tracking;
- exact behavior of the unordered regional sequence;
- exact set of global reference sheets;
- whether the v1 flowchart should be static or interactive;
- whether any other phase has bespoke navigation comparable to the regional procedure.

These are discovery tasks, not omissions to be filled through invention.

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
8. track which human/Crown/vacant occupant holds every relevant company role;
9. see the correct procedure for the current role occupant;
10. see only the Crown instructions relevant to the current climate;
11. receive two-player additions only in a two-player game;
12. complete non-linear sub-procedures where required;
13. go backward safely after an accidental advance;
14. close and reopen the application without losing progress;
15. copy a backup code and later restore the same session from it;
16. access global reference material without losing their place;
17. comfortably read and operate the interface throughout a real tabletop session.

Most importantly, using Shiny Crown should feel materially easier than repeatedly consulting the Crown PDF or the existing reference application.

The experience should be fast enough that the application disappears into play rather than becoming another system the player must manage.

---

## Final implementation directive

When working from this specification, treat the provided reference app and PDF as essential development inputs.

Do not invent rules that are absent from the supplied material.

Do not attempt to design the full phase abstraction before examining the content.

Build the smallest robust global model necessary—game mode, climate, roles, procedural position, limited phase state—and let individual phase implementations remain bespoke where the rules demand it.

The distinguishing quality of Shiny Crown should not be technical sophistication for its own sake. It should be the precision with which a complicated body of procedural rules has been transformed into a calm, elegant, state-aware mobile interface.
