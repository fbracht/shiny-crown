# Shiny Crown

Shiny Crown is a mobile-first, client-side companion application for playing *John Company: Second Edition* with the Crown, primarily in solo and two-player games.

The application will guide players through setup and the recurring round sequence while showing only the Crown procedures relevant to the current game state. Its purpose is to reduce rules lookup and procedural overhead without simulating the board game itself.

## Status

Sessions 1–3.1 are complete. The repository contains the implementation-ready source map, typed and persistent application foundation, and four source-faithful architecture slices: Bonuses, Chairman, Hiring, and Bombay Presidency. Session 3.1 reset those slices around compact source text, named two-player identities, segmented office holders, and a collapsible global climate control. Later sessions will extend that corrected bespoke-phase pattern across the remaining English content.

## Stack

- React
- TypeScript
- Vite
- Static deployment to GitHub Pages
- Browser-local persistence with `localStorage`

## Development

```sh
npm install
npm run dev
```

Quality gates:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Documentation

- [Development specification](docs/spec-shiny-crown-development.md)
- [Session 1 source-analysis map](docs/source-analysis/README.md)
- [Authoritative phase inventory](docs/source-analysis/phase-inventory.md)
- [State-model audit](docs/source-analysis/state-model-audit.md)
- [Two-player pass](docs/source-analysis/two-player-pass.md)
- [Session 3 architecture decision](docs/architecture/session-3-vertical-slices.md)

## Scope

The initial release will provide:

- Solo and two-player game modes
- Guided setup and round phases
- Crown climate and company-role tracking
- State-aware Crown instructions
- Automatic local saving and portable backup codes
- In-play reference material
- A phone-first, accessible interface

Brazilian Portuguese localization and an interactive reference flowchart are currently planned as post-launch work.
