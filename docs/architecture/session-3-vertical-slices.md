# ADR: Session 3 phase architecture

Status: amended after the Session 3.1 fidelity and interaction reset, 2026-09-19.

## Decision

Keep phase routing centralized and phase presentation bespoke. The registry selects a normal React component for each procedure; those components read and mutate the one typed session through SessionContext and the reducer.

The four prototypes establish these patterns:

1. Bonuses uses a dedicated, predominantly textual component. Simple content does not need to pass through a universal block renderer.
2. Chairman owns its human/Crown branches. The Crown branch reads one active climate row; both contextual selectors dispatch the same global set-climate action used by persistent chrome.
3. Hiring derives its queue from global three-state roles, includes only vacant Company office cards, and sorts by verified printed number. The Chairman election remains separate. Confirmed hires mutate the destination immediately; confirmed promotions also vacate the tracked source.
4. Bombay remains one fixed phase in the global flow. Its eligible Governor, Commander, and Trade procedures derive from current roles, while their order remains typed and persisted phase-local state. Completion remains representable for later procedures that materially need it, but Bombay does not expose redundant completion controls.

Small presentation primitives were extracted only after the slices repeated them: RuleSection, Favor, and ModeNote. Climate, role, frame, and source-note components remain shared. Phase-specific decision procedures remain local to their phase.

## Session 3.1 correction

The first Session 3 presentation drifted from the product model into a guided workbench: repeated summaries and state explanations surrounded the source procedure, large bordered cards reduced phone density, full selects appeared inline, and progress controls asked the user to operate the app without replacing tabletop work.

The corrected pattern is:

- source procedure is the primary page content; non-source writing is limited to labels, state feedback, and explicit unresolved-source notes;
- the phase frame renders one phase title, optional compact status, continuous procedure, and provenance, without a repeated “current procedure” label or agent-written summary;
- global structural state lives in the compact State dialog; an in-phase holder control appears only where changing that holder immediately changes the applicable branch;
- editable in-play holders use a compact segmented control for the available human identities, Crown, and an accessible `Vacant` symbol; `not-in-play` remains a separate structural state and normally removes the office from phase content;
- the persistent climate control shows only the current climate until activated, then exposes Bull, Stag, Lion, Bear, and Peacock in source order and collapses after selection;
- two-player setup records both names. Those names persist through autosave, schema migration, history snapshots, and backup export/import. Solo renders the human identity as `You`;
- `#BD1E34` is the cover-informed accent target; other red variants exist only where contrast or interaction state requires them;
- Bombay retains local reordering but uses continuous sections rather than cards and does not expose completion checkboxes.

Later English phase work must start from this corrected pattern rather than copying the original Session 3 workbench presentation.

## State boundaries

- Persist only facts the app can know: mode, climate, role availability/occupant, fixed phase position, and narrow local progress.
- Keep money, shares, pieces, dice, routes, card text, and other physical predicates at the table.
- Global mutations made inline are ordinary reducer actions, so autosave, backup, and Back-boundary comparison continue to work without phase-specific persistence code.
- Recompute eligible Presidency actions from current role state. A vacant Governor does not act; a vacant President removes Trade but leaves occupied Governor/Commander actions for the Chairman to order.
- Treat Director of Trade/Governor General as one number-2 replacement slot. Treat Military Affairs/Commander in Chief as one number-4 replacement slot for Hiring order.

## Conditional-content rule

Render only the applicable actor and active-climate branch. Two-player material replaces solo shortcuts where the sources require it; it is not appended as an undifferentiated note. Unresolved source edges remain manual and are stated without invented automation.

## Testing consequence

Every later phase should test the applicable subset of:

- human, Crown, vacant, and not-in-play role states;
- active-climate rerendering through the global action;
- solo/two-player replacement content;
- role mutation side effects;
- phase-local progress through reload/serialization;
- Back behavior across a changed global-state boundary;
- fixed global flow versus local reordering;
- semantic buttons, selects, checkboxes, focus visibility, and phone-width layout.
- named-player migration and backup round trips;
- the expanding climate control by pointer and keyboard;
- segmented holder changes, including the accessible Vacant label;
- representative layouts at 320, 375, 414, and 768 CSS pixels without horizontal overflow.

This decision rejects a universal phase-content schema. A new shared component should be introduced only after another real phase demonstrates the same visual or behavioral contract.
