# Session 4 implementation ledger

Status: complete. This ledger maps the Session 1 exactly-once inventory to the Session 4 implementation. It does not replace `docs/source-analysis/phase-inventory.md`; that file remains normative for source coverage and phase order.

## Working rules

- Preserve the uncommitted Session 3.1 reset as the implementation baseline.
- Finish and audit solo behavior before applying the complete two-player replacement pass.
- Treat `Solo_Player_Aid_Combi_V3.2.pdf` as primary solo copy; use Rules and Crown Handbook for shared clarification and two-player replacements.
- Keep procedural copy in localized content modules with adjacent `SourceRef` records. Interface labels and state feedback may remain component-local.
- A phase is complete only when its source units, state gates, mutations, actor/climate branches, responsive behavior, and focused tests are complete.
- Global references are overlays: opening or closing one must not mutate gameplay state or procedural position.
- Do not resolve bounded source gaps by invention.

## Chunk boundaries

| Chunk | Scope | Exit gate |
|---:|---|---|
| 1 | Read and reconcile the governing documents, inspect the Session 3.1 baseline, run the existing quality gates, and assign every source destination to a later chunk. | Baseline passes; no source destination is unassigned. |
| 2 | Solo setup and early round: `setup.*`, Deregulation, London Season, Family, Firms, plus audit/fixes for Hiring. | A solo session can reach Company Operations with all early procedures source-traceable and state-aware. |
| 3 | Solo Company Operations: audit/fix Chairman; implement Trade Directorate, Shipping, Military Affairs, all three Presidencies, and China. | The complete solo operations sequence is usable in fixed Bombay → Madras → Bengal order with correct local actors and climate branches. |
| 4 | Solo late round, scoring, and global references: audit Bonuses; implement Firm Revenue, Company Revenue, Events, Parliament, Upkeep/Refresh, Scoring, Glossary, Basic Favors, Success Checks, Crisis, and Crown Voting Plan. | The complete solo setup and recurring loop is playable, including terminal paths and state-neutral references. |
| 5 | Complete two-player replacement pass, coverage/provenance audit, full-flow integration, responsive/accessibility checks, and final quality gates. | Solo and 2P both satisfy the Session 4 completion gate; every inventory unit is covered exactly once and no placeholder phase remains. |

## Phase coverage ledger

`Baseline` means the phase has a Session 3.1 representative implementation to preserve and audit. `Placeholder` means it currently relies substantially on `GenericPhase`, short summary copy, or an incomplete bespoke surface.

| Inventory destination | Primary source | Current state | Implementation chunk |
|---|---|---|---:|
| `setup.configure` | Aid p1; Rules pp4, 43–44 | implemented and focused-tested | 2 |
| `setup.table` | Rules pp4–5 | implemented and focused-tested | 2 |
| `setup.crown` | Aid p1; Rules pp43–44 | implemented and focused-tested | 2 |
| `setup.cards` | Aid p1; Rules pp43–44 | implemented and focused-tested | 2 |
| `setup.finish` | Rules p5; scenario card | implemented and focused-tested | 2 |
| `setup.ai` | Aid p1; Rules pp43–45 | implemented and focused-tested | 2 |
| `round.deregulation-vote` | Aid p1; Rules p36 | implemented and mode-audited | 2 |
| `round.london-season` | Aid p2; Rules pp11–12 | implemented with solo and 2P procedures | 2 |
| `round.family` | Aid pp2–3; Handbook p2 | implemented with one/two Crown-action replacement | 2 |
| `round.firms` | Aid p3; Rules pp37–40; Handbook p3 | implemented with complete 2P replacement | 2 |
| `round.hiring` | Aid p4; Rules pp14–16; office cards | implemented with 2P election and consent | 2 |
| `round.chairman` | Aid pp5–6; Rules p18 | implemented and mode-audited | 3 |
| `round.trade-directorate` | Aid pp6–8; Rules pp18, 26 | implemented with both structural branches | 3 |
| `round.shipping` | Aid p9; Rules p19 | implemented with 2P Button arbitration | 3 |
| `round.military-affairs` | Aid p10; Rules p19 | implemented with both human identities | 3 |
| `round.presidency.bombay` | Aid pp11–14; Rules pp20–24 | implemented and focused-tested | 3 |
| `round.presidency.madras` | Aid pp11–14; Rules pp20–24 | implemented and flow-tested | 3 |
| `round.presidency.bengal` | Aid pp11–14; Rules pp20–24 | implemented and flow-tested | 3 |
| `round.china` | Aid p15; Rules p25 | implemented with structural availability | 3 |
| `round.bonuses` | Aid p15 | implemented | 4 |
| `round.firm-revenue` | Aid p15; Rules pp41–42; Handbook p14 | implemented with 2P comparison replacement | 4 |
| `round.company-revenue` | Aid p16 | implemented | 4 |
| `round.events-india` | Aid pp16–17; Rules pp28–33 | implemented with region loss and 2P Crisis chooser | 4 |
| `round.parliament` | Aid pp18–20; Rules pp34–36; Handbook pp14–16 | implemented with distinct solo and 2P voting/succession | 4 |
| `round.upkeep-refresh` | Aid p19; Rules p36; Handbook p15 | implemented with solo-only compensation | 4 |
| `game.scoring` | Aid p19; Rules pp8–9, 37; Handbook p15 | implemented with distinct Power/failure rules | 4 |

## Reference coverage ledger

| Reference | Source | Current state | Implementation chunk |
|---|---|---|---:|
| Glossary | Aid p1 | implemented | 4 |
| Basic Favors | Aid p1 | implemented with timing state | 4 |
| Success Checks | Aid p4; Rules p17 | implemented | 4 |
| Crisis / Rebellion / Invasion | Aid p17; Rules pp29, 32–33 | static image and accessible text implemented | 4 |
| Crown Voting Plan | Aid p20; Handbook p16 | implemented and embedded from Parliament | 4 |
| Two-player Player Button help | Rules pp44, 46 | implemented globally and contextually | 5 |

## Final verification record

- Every `PhaseId` maps to a bespoke registered component; the former generic placeholder implementation was removed.
- Full first-round reducer walks pass in solo and two-player modes, including the Firms/Firm Revenue gates, fixed Presidency order, new-turn loop, and final-turn scoring transition.
- Focused tests cover setup, both early modes, Hiring/Chairman/Presidency behavior, solo operations, late round, global references, 2P Button arbitration, Parliament succession, and 2P scoring.
- Desktop and 390×844 mobile visual checks confirmed the landing page, in-game header/navigation, configuration controls, fixed bottom navigation, and reference dialog remain usable.
- Open source edges remain procedural rather than automated: generic free-choice and Crisis Button passing, sole-human Crown-nepotism reward, Crown firm-investment refusal in 2P, and Legendary 2P difficulty.

## Chunk 1 verification record

- Read the revised development specification, source-analysis entry point, authoritative phase inventory, source/provenance register, phase/state matrix, implementation briefs, two-player pass, Session 3.1 Tana record, corrected architecture decision, and representative implementation files.
- Confirmed the worktree contains the uncommitted Session 3.1 reset and no unrelated file changes were discarded or overwritten.
- Baseline quality gates passed on 2026-09-19: TypeScript, ESLint, 34 Vitest tests across 7 files, and the Vite production build.
