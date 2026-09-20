# Session 5 beta verification

Status: beta candidate. Automated and synthetic checks are complete; real-table testing remains required before release.

## Verification evidence

- TypeScript, ESLint, Prettier, all Vitest tests, coverage, and the production build pass.
- The reducer walks complete solo and two-player first rounds in source order, including conditional Firms and Firm Revenue, Bombay → Madras → Bengal, China availability, the next-turn loop, and final scoring.
- Focused rendering tests cover setup, early phases, Company Operations, late phases, two-player replacements, player names, office-holder changes, climate branches, references, persistence, migration, and backup validation.
- Malformed browser saves are preserved for recovery. Backup imports are decompressed, migrated, and fully validated before the current session is replaced.
- The compact climate selector restores keyboard focus after a choice or Escape.
- Manual responsive checks at 320 CSS pixels found no document overflow and no interactive target smaller than 44×44 CSS pixels. The interface also retains bounded reading widths at tablet and desktop breakpoints.
- The production bundle is static and uses the `/shiny-crown/` GitHub Pages base path.

## Known source-bounded risks

- Scenario-card-specific setup remains on the physical scenario card because those cards were not supplied.
- Legendary two-player setup remains unavailable because the sources define only Easy through Expert.
- The unresolved two-player Button, Crown Nepotism, and firm-investment consent edges remain explicit manual procedures rather than invented automation.
- Card-specific exceptions still require players to apply physical card text.

## Real-tabletop checklist

- [ ] Complete one solo round with a Crown Chairman and change climate during Company Operations. Confirm the visible procedure changes without losing position.
- [ ] Complete one two-player round with custom player names. Hand the phone between players and confirm every human/Crown actor label is unambiguous at a glance.
- [ ] During Hiring, create vacant, occupied, and not-in-play offices; promote at least one candidate; confirm the physical office cards and app state stay aligned.
- [ ] Run Bombay, Madras, and Bengal with different local office states. Confirm the fixed Presidency order and each local action order match the table.
- [ ] Trigger a Button arbitration, a Crisis, Parliament, and succession. Record any moment where the app implies a choice or Button pass not supported by the books.
- [ ] Background or close the browser mid-phase, resume, and verify phase-local progress, names, climate, roles, and Button holder.
- [ ] Export a backup, deliberately damage a copy and verify rejection, then restore the untouched code and compare the entire visible state.
- [ ] Use one 320–375 px phone at 200% text zoom. Check for clipped procedure text, hidden controls, overlap with bottom navigation, and horizontal page scrolling.
- [ ] Use only the keyboard for climate, State, References, backup restore, Back, and Next. Confirm focus always remains visible and returns sensibly after dialogs close.
- [ ] Note the number of taps needed for climate changes, office-holder corrections, phase advance, and reference lookup; flag any common action that interrupts tabletop play.

## Feedback needed before release

Report the exact phase, mode, climate, office holders, viewport/device, and expected source wording for every discrepancy. For interaction issues, include the action attempted, tap count, where focus or scroll position ended, and whether play at the physical table had to stop to recover.
