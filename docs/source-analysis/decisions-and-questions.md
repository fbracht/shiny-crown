# Decisions, gaps, and open questions

## Locked Session 1 decisions

- The combined player aid is the primary solo content source. Its integrated version-3 changes are intentional for this product.
- The app supports solo first and completes a full 2P pass before launch. 3+ players are post-launch and will be a different, simpler product mode without Crown.
- All five aid difficulty levels are in solo v1. Easy/Normal/Hard/Expert have sourced 2P setup; Legendary+2P is not inferred.
- No optional rules, setup-card draft/random-deal variants, or house rules are included.
- All four published scenarios can be selected, but scenario-specific physical setup stays on the scenario card because those cards were not supplied.
- The flow is fixed at the phase/Presidency level. Bombay → Madras → Bengal; only the action order inside each Presidency is locally configurable.
- Firms and Firm Revenue render only after Deregulation. The Basic Favors window begins after New Company Shares at the point the Firms phase begins, even if the Firms content screen is skipped, and ends after Company Revenue.
- Director of Trade and Governor General are mutually exclusive state variants. Governor General removes all regional Governor roles from play.
- `not-in-play`, `vacant`, and `occupied` are distinct.
- The page-17 Crisis flowchart is the sole separate pre-launch graphic reference. The extracted 1353×1670 raster is adequate for a zoomable v1 surface; it also requires a semantic text equivalent. No external asset search is necessary for v1.
- The page-20 voting plan is an embedded Parliament reference, not a round phase.
- The app does not simulate the board. It persists mode, scenario, difficulty, turn/first-turn, climate, role/office availability, deregulation, 2P Button/actor identity, procedural position, and narrow phase progress.
- The reference app contributes the quick climate control and phase-navigation idea only. Its phase order, content, lack of persistence, and styling-only role flags are not inherited.

## Source-exact issues needing a later ruling

These do not block Session 2's foundation or the solo implementation.

### 1. Legendary difficulty in 2P

Aid p1 defines Legendary only for solo. Rules p44 publishes Easy through Expert for 2P. The state model can include Legendary while validation disallows the Legendary+2P pairing until the user chooses between hiding it or defining an adaptation.

### 2. Player Button passing on non-arbitration uses

Rules p44 explicitly passes the Button when Crown chooses between humans or humans dispute who acts. It also allows negotiated transfer. Rules p46 lets the holder make an otherwise indistinguishable Crown choice, and Handbook p14 makes the holder choose exhausted pieces in a Crisis, without independently instructing a pass. Automate the explicit cases and retain manual transfer for these cases until clarified.

### 3. 2P Crown Nepotism with one human candidate

Handbook p3 awards +1 to each human only when both are candidates and both consent. The +2 mandatory consent is explicitly solo-only. Rules p14 explains who must consent but supplies no promise reward for a sole human candidate. Do not invent one.

### 4. Refusing Crown firm investment in 2P

Rules p38 says investments need manager consent. Handbook p3 gives solo a paid `-X` denial favor and labels it solo-only. It is unclear whether a 2P manager can withhold consent normally or whether Crown behavior overrides the base consent rule. Render the exact Crown procedure without adding a free or paid denial until ruled.

### 5. Button behavior during Writer placement

Handbook p13 says human-player priority for each Writer follows the Button. Rules p44 says an actual Crown choice between humans passes the Button. The conservative implementation passes only when at least two human owners are eligible, not after every Writer placement. This should be validated during 2P playtesting.

## Missing inputs with bounded impact

### Scenario cards

The Rules show common setup and name 1710, 1758, 1813, and Long 1710, but the scenario cards that define exact track/region/office setup and final turn were not supplied. The app can ship a safe setup instruction—follow the selected physical scenario card—and let the user mark final turn. A later scan can make setup more detailed without changing the phase architecture.

### Physical office-card backs — resolved in Session 3

A user-supplied composite photograph provided the complete printed sequence, hirers, candidate pools, and the shared replacement numbers for Director of Trade/Governor General and Military Affairs/Commander in Chief. The verified transcription is in [office-card-register.md](office-card-register.md). Hiring may now sort vacancies deterministically rather than asking the player to order cards manually.

### Card-specific ongoing exceptions

Law, prestige, Blackmail, scenario, and setup cards can change rules. The supplied books explain the general procedure but this session did not inventory every individual card face. The app should present “apply card text” and implement only structural changes verified here (Deregulation, Governor General, China office, law extra actions, Royal Protection) until cards are supplied.

## Clarifications resolved during Session 1

- The five climates are Bull, Stag, Lion, Bear, and Peacock.
- China acts after Bengal and is an optional office, not a Presidency.
- Commanders are tracked positions but not Company officeholders.
- Governor General acts in Director of Trade's ribbon position and hires Presidents.
- Page 17 is the Crisis/Rebellion/Invasion reference named in the provisional spec.
- 2P rules occur throughout the Crown Handbook, not only Rules pp43–46.
- The “unordered regional procedure” is instead a fixed Presidency order with locally ordered actions.

## Next-session readiness

Session 2 is unblocked. Its foundation should include the full discriminated role model, scenario/difficulty/deregulation state, structural optional offices, named human actors and Button holder, fixed flow with conditional skips, and typed Presidency-local progress. The four unresolved 2P rulings can remain conservative/manual until the 2P content pass; none requires a foundation redesign.
