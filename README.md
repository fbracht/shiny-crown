# Shiny Crown

Shiny Crown is a mobile-first, client-side companion application for playing *John Company: Second Edition* with the Crown, primarily in solo and two-player games.

The application will guide players through setup and the recurring round sequence while showing only the Crown procedures relevant to the current game state. Its purpose is to reduce rules lookup and procedural overhead without simulating the board game itself.

## Status

Sessions 1 and 2 are complete. The repository now contains the implementation-ready source map and a working application foundation: the complete typed session model, verified conditional flow, setup-to-round navigation, browser persistence, portable backup/restore, safe Back snapshots, localization-ready content, and a mobile-first interface. Later sessions will replace foundation copy with complete phase-specific English content and bespoke interactions.

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
