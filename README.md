# Shiny Crown

Shiny Crown is a mobile-first, client-side companion application for playing *John Company: Second Edition* with the Crown, primarily in solo and two-player games.

The application will guide players through setup and the recurring round sequence while showing only the Crown procedures relevant to the current game state. Its purpose is to reduce rules lookup and procedural overhead without simulating the board game itself.

## Status

Pre-development planning and source analysis.

## Planned stack

- React
- TypeScript
- Vite
- Static deployment to GitHub Pages
- Browser-local persistence with `localStorage`

## Documentation

- [Development specification](docs/spec-shiny-crown-development.md)

The specification is provisional and will be revised after the Crown guidance PDF, reference application, and relevant rulebooks have been fully analyzed.

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
