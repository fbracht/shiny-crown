# Session 1 source-analysis map

This directory is the source-traceable handoff for Shiny Crown development. It separates verified rule content from product decisions and unresolved edge cases so later sessions do not need to rediscover the source material.

## Authority and scope

1. `Solo_Player_Aid_Combi_V3.2.pdf` is the primary English content source for the solo application. It deliberately combines the base rules and Crown rules and incorporates the rule changes named on its first page.
2. `Rules.pdf` and `Crown Handbook.pdf` clarify structure, missing base-rule context, and all two-human-player behavior. For 2P, both books are required: the relevant differences extend well beyond Rules pp43–46.
3. The public Crown app is a behavior reference only. Its content is incomplete for Shiny Crown because it omits most base-game procedure.
4. The current release scope is solo plus the complete 2P pass before launch. It includes Easy, Normal, Hard, Expert, and Legendary difficulty for solo; it excludes optional rules, setup variants, house rules, and 3+ players. The supplied sources do not define Legendary for 2P, so that combination remains unresolved rather than extrapolated.

## Deliverables

- [office-card-register.md](office-card-register.md): visually transcribed office numbers, hirers, candidate pools, and replacement-title pairs supplied during Session 3.
- [`source-register.md`](source-register.md): authority, hashes, provenance syntax, extraction qualifications, and reference-app audit.
- [`normalized-reading-order.md`](normalized-reading-order.md): corrected text-layer reading order for the combined aid. It is evidence, not ready-to-ship copy.
- [`image-transcriptions.md`](image-transcriptions.md): verified transcription of all material tables, diagrams, climate grids, favors, the crisis flowchart, and voting plan.
- [`phase-inventory.md`](phase-inventory.md): authoritative setup and round flow, exactly-once content ledger, role inventory, and conditional skip rules.
- [`phase-state-matrix.md`](phase-state-matrix.md): visibility, actor, climate, mode, state, and UI requirements by screen.
- [`state-model-audit.md`](state-model-audit.md): minimum persistent state, invariants, mutations, and explicit non-state.
- [`implementation-briefs.md`](implementation-briefs.md): phase-by-phase product briefs for later implementation.
- [`two-player-pass.md`](two-player-pass.md): complete 2P additions and replacements, acceptance cases, and source gaps.
- [`decisions-and-questions.md`](decisions-and-questions.md): locked decisions, unresolved source questions, and non-blocking limitations.
- [`source-manifest.json`](source-manifest.json): source hashes, metadata, page counts, and extraction statistics.
- [`image-inventory.json`](image-inventory.json): embedded-image placement bounds and stable source asset IDs.
- `assets/combined-aid/`: extracted embedded graphics plus OCR sidecars. OCR is discovery evidence only.
- `extracted/`: per-page `pdftotext -layout` evidence for all three supplied PDFs.
- [`../../scripts/extract_sources.py`](../../scripts/extract_sources.py): reproducible, non-mutating extraction pipeline.

## Non-negotiable implementation rules

- Never import OCR output as application copy without visual reconciliation against the rendered PDF page.
- Never treat an absent climate cell as a zero-cost favor. A dash means the option is unavailable; a printed `0` means it is free.
- Preserve shared/base procedure while filtering Crown behavior to the current climate and actor.
- Treat `not-in-play`, `vacant`, and `occupied` as distinct role states.
- Do not infer game facts the app cannot observe. When a rule depends on money, pieces, shares, routes, dice, cards, or the board, present the applicable decision procedure and let the players evaluate the physical state.
- Every shipped content unit must carry at least one provenance record. Mode-specific replacements carry both the solo-aid source and the 2P source that replaces it.
