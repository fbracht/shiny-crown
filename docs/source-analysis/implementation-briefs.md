# Phase implementation briefs

These briefs define what later sessions should build. Numeric tables and exact favors are normalized in `image-transcriptions.md`; the source/page links here prevent that file from becoming a second phase inventory.

## Setup

### `setup.configure` — New game

- Collect mode, scenario, and difficulty before creating a save.
- Support 1710, 1758, 1813, and Long 1710. The selected physical scenario card supplies scenario-specific setup details not present in the PDFs.
- Solo supports all five aid difficulties. Easy, Normal, Hard, Expert are also published for 2P; Legendary+2P needs a ruling.
- Initialize 1813 as deregulated. Other scenarios begin regulated.
- Make the selections reviewable because they affect setup copy, later Firms screens, first/final turns, and scoring.

### `setup.table` — Table and scenario

- Present Rules pp4–5 steps 1–10 in order, with the diagram available to zoom.
- Explicitly tell the player to follow the selected scenario card for track positions, region setup, and initial offices.
- Exclude the ordinary setup-card draft variant and the solo random-deal variant; scope excludes optional rules.
- Do not ask the app to reproduce or infer scenario-card values that were not supplied.

### `setup.crown` — Crown materials

- Guide Crown board/climate marker setup and its 36 family pieces.
- Compute the initial 12-cube distribution from mode and difficulty without turning this into a persistent cube ledger.
- Solo: 6/6 at Easy/Normal; Hard gives Crown four more (human 2/Crown 10); Expert adds three extra setup cards; Legendary Crown has all 12 and six extra setup cards.
- 2P: 4/4/4 at Easy/Normal; Hard/Expert take two from each human so Crown has eight; Expert adds three setup cards.
- Easy exposes five promise cards per human that may be traded for Crown cubes. Normal+ disables that exchange, not ordinary human-to-human promise use.

### `setup.cards` — Setup distribution

- Use a small round counter and a visible final total.
- Solo: draw 3, human keeps 1, Crown gets 2, four rounds → 4/8.
- 2P: each human draws 3, keeps 2, gives 1 to Crown, repeated until all three families have four. Use wording that emphasizes the final 4/4/4 distribution; the supplied sentence “repeat this 2 times” is ambiguous in isolation.
- Ask players to resolve physical card effects and office placements at the table.

### `setup.finish` — Finish and record roles

- Finish common setup steps: unused office cards, London Season display, law deck.
- Provide a compact role-initialization form. Default optional roles and uncreated regional Governors to not in play. Let users mark offices vacant or occupied by a valid actor.
- Record Commanders and Prime Minister separately from Company offices.
- Preserve the former Chairman if scenario setup has one.

### `setup.ai` — Initial climate and 2P Button

- Reveal the first AI card and set climate through the same global action used during play.
- Show all five named/icon choices: Bull, Stag, Lion, Bear, Peacock.
- 2P: explain Crown seating and initialize Button holder from the AI card's direction. Do not reset the Button on later AI draws.
- End with a concise readiness check, then go to the turn-start Deregulation gate/first-turn skip.

## Recurring flow

### `round.deregulation-vote`

- Gate by scenario and user confirmation that Standing/Debt occupies a lined/star space. Rules p36 restricts the special vote to 1758 and Long 1710; 1813 is already deregulated.
- The human Prime Minister may initiate when eligible and must on a star. Crown PM never voluntarily initiates and does so only when required.
- Crown votes last and against; show only the current climate's maximum once-only spend and the requirement that it must move the marker into failure.
- On pass, expose the physical consequences and set `deregulated=true`. On failure, leave PM and Deregulation state unchanged.
- 2P restores normal multi-human voting order around the special Crown-last rule.

### `round.london-season`

- Auto-skip on first turn, with a brief explanation in navigation history.
- Sections: Attrition → Retirements → conditional Special Retirement → Prestige Cards.
- Attrition and retirement can empty offices. Place contextual role controls beside the outcome instead of trying to roll dice or identify officeholders automatically.
- Crown retirement behavior and favor timing must remain sequential; distinguish ordinary retirement from final retirement and difficulty modifier.
- Prestige-card selection uses the AI card and clockwise fallback. Retain Crown card behavior bullets and face-down Blackmail caution.
- 2P follows normal family ordering/tie rules and actor-specific rewards; do not address both humans as one “you.”

### `round.family`

- Place Free Crown Writers before ordinary Family Actions.
- Present the six family actions with familiar art/labels. For Crown, render only the active climate's ordered action queue.
- Keep normal Crown action count separate from free writer enlistment and law-granted extra action: two normal actions solo, one normal action 2P.
- End with New Company Shares. This is the boundary at which Hiring becomes eligible and basic favor timing opens.
- Include the out-of-family-members instruction and physical viability/affordability reminder.

### `round.firms`

- Conditional on Deregulation. Sections: create firm → investments → acquire ships → 2P takeover/merger → strategy → dissolution.
- The Crown never creates a firm. Show the mandatory creation favor and investment behavior for the active climate.
- Keep human choices at the physical table. The app does not model shares, manager, firm value, ships, or secret strategy.
- In 2P, provide precise manager consent, Button-controlled Crown investment, hostile takeover, merger, and secret-choice guidance. The solo sentence “never occurs” must be replaced, not supplemented.
- Basic Favors should be one tap away from this screen through Company Revenue.

### `round.hiring`

- First handle Chairman election because it differs from ordinary numbered office hiring.
- Then build the vacancy queue from roles marked `vacant`, sorted by the physical office-card number. Never include `not-in-play` roles.
- Show hirer and candidate pool per office: Chairman hires Director/GG, Shipping, Military Affairs, China; Director/GG hires Presidents; Presidents hire Governors; Military Affairs assigns Commanders outside Hiring.
- When a promotion is confirmed, occupy the new role, vacate the prior office, and preserve previous occupant/fatigue instructions.
- Crown hirer: own family if able; Director/GG selection along ribbon from Chairman in AI-card direction; candidate type priority Writer → Officer → Governor; AI ties.
- 2P must restore pure-majority election, multiple supporters, every candidate-family's Nepotism consent, and exact Crown favor branches. Do not reduce the election to “who has most shares.”

### `round.chairman`

- Put Company Operations/Success Check shared context at the top or behind a nearby reference link.
- Human branch order: mandatory opening favor if able → Debt → allocate all Balance → flip AI/set new climate **after finishing**.
- Crown branch order: flip AI/set new climate **before acting** → seek Debt by active climate → allocate by active climate.
- Changing climate midway must immediately rerender Crown rules and must use the single global climate value.
- Debt and allocation use physical predicates. In 2P, Crown consent favors appear only when Crown support is actually needed; two humans can jointly supply a majority.
- This is the representative role/climate vertical slice for Session 3.

### `round.trade-directorate`

- Render exactly one variant from state.
- Director of Trade: Special Envoy, then up to two transfers. Successful China opening activates and immediately hires the optional China office. Use the active-climate spend/target and transfer priorities.
- Governor General: creation is a structural transition from Parliament, not something that happens on this screen. Display Regional Income then Govern attempts; stop after a success. On success choose one action for each Company-controlled region.
- A Governor General transition must retire/remove all Governors, remove Director, transfer occupant/fatigue/treasury instructions, and change who hires Presidents.
- Provide favor controls as explanatory transactions only; no cube ledger.

### `round.shipping`

- Preserve the mandatory “spend until at most £2” rule and exact order: fit → buy Company ships only when no Shipyard ships → lease → place everything.
- Crown fits own ships first, then human ships. In 2P use Button only when choosing between eligible humans and apply required pass.
- Active-climate table determines normal buying and placement. Distinguish “no option” from zero-cost option.
- Favor to fit a human ship is mandatory when triggered and affordable, before placement choice.

### `round.military-affairs`

- Sections: up to two transfers → assign every Officer-in-Training → assign/reassign Commanders.
- Offer two local transfer completion slots but do not model pieces.
- Crown placement priorities are climate-indexed and restart for each assignment.
- Confirming a Commander assignment updates role state; the replaced Commander becomes an ordinary Officer physically rather than a vacant office.
- In 2P, evaluate each family separately. Use Button only when the Crown must choose between otherwise tied human candidates/assets.

### `round.presidency.{bombay|madras|bengal}`

- Fixed screen order. At entry, determine eligible action cards from current roles and regional Governor associations.
- Human President chooses any valid local order. Crown President defaults all Governors → Commander → Trade, with one-change favor. Vacant President: Chairman orders available Governors/Commander, no Trade, no local-alliance consent.
- Each action card opens the relevant bespoke procedure and can be checked complete; persist order/progress.
- Governor: Administer with diminishing dice, active-climate minimum/result for Crown, and contextual favors.
- Commander: Local Alliances then Deploy. Preserve target priority, exact-dice rule, exhaustion order, repeat decision, death check, loot, and new-region Governor creation.
- Trade: shared route/check procedure, active-climate Crown dice and writer behavior, firm initiative. Human President can still trigger Crown favors.
- Support multiple Governors. Governor General removes all Governor cards but does not remove Presidency, Commander, or Trade.
- In 2P, identity matters throughout assets, loot, writers, consent, and Button arbitration.
- Bombay Presidency is the representative local-order vertical slice for Session 3.

### `round.china`

- Only exists when activated; acts after Bengal.
- Explain its ship-only treasury, East-storm treatment, once-per-turn check, and export-icon prerequisite.
- Human branch uses ordinary check; Crown branch rolls as many dice as possible if it meets the active-climate minimum. Favor adjusts the minimum.
- Do not ask the app to count ships or export icons.

### `round.bonuses`

- Concise shared procedure: £1 for each fitted Shipyard and each non-invested Workshop; physical cards/laws may add bonuses.
- Keep actor wording valid for one or two humans and Crown.
- This is the predominantly textual Session 3 slice.

### `round.firm-revenue`

- Conditional and repeatable per physical firm.
- Sections: expenses → emergency investment/merger or dissolution → dividends → move remaining India cash.
- Crown normally refuses emergency investment; show the override favor and share ceiling.
- 2P restores initiative ordering, other-human rescue, emergency mergers, dividend waiver with consent, and comparison of Crown dividend against each other family.
- A local list of firm labels/completion is enough. Do not persist a full firm model.

### `round.company-revenue`

- Sections: expenses/emergency loans → expectations → dividends → Standing.
- Show Royal Protection discard reminder if emergency loans/tax/upkeep and Crown Chairman condition applies.
- Crown Chairman always pays one dividend if able, then uses active-climate retained-Balance threshold; show current-climate pay-more/pay-less favors.
- Offer “Company failed” at any rule that can reduce Standing to failure.

### `round.events-india`

- Sections: Storms → draw/resolve event tiles one at a time to Storm-die count.
- Use a structured event lookup for Writer Loss, Cascade, Crisis, Foreign Invasion, Leader, Peace, Shuffle, Turmoil, Windfall. Preserve Peace/Shuffle movement footnotes that text extraction can merge.
- Crisis opens the supplied flowchart as a zoomable static image with the normalized accessible branch text from `image-transcriptions.md`.
- Region Loss contextual controls: remove regional Governor from play and vacate the associated Commander after the physical steps. GG skips Governor Elimination because no Governor roles exist.
- Continue resolving Events after Company failure as Rules p29 directs, then enter scoring.
- 2P Crown-Commander defense uses Button holder as chooser; automatic Button passing is unresolved, so expose manual holder control unless a ruling is added.

### `round.parliament`

- Branch first on PM occupant. Both branches perform climate shift before voting; use a compact successes/Standing lookup and a global set-climate result control.
- Human PM: up to three laws, matching policy, initial votes, Crown voting plan. Crown PM: active AI-card draw count, Dilemma stop, two draw favors, and can oppose own law.
- Embed the full Crown Voting Plan indexed by law; show only the selected law row plus an option to open the full sheet.
- Policy selection compares Crown net effect to player entities as defined in Handbook p15; 2P aggregates affected human entities for policy-space comparison, while “most” law predicates compare Crown against each family.
- Implement structural law actions: Governor General replacement, China activation, and Deregulation. Other law effects remain physical instructions.
- 2P replaces the solo two-family shortcut with normal voting rounds, opposition totals/coalitions, Opposition Leader, and failed-law PM succession.

### `round.upkeep-refresh`

- Upkeep first, including Crown Royal Privilege.
- If final scenario turn, skip Refresh and enter scoring.
- Otherwise return Writers/tokens/Extra ships, refresh pieces/alliances, advance turn, clear phase-local progress, and return to the pre-London boundary.
- Hide the solo-only Crown-Presidency writer compensation in 2P.

### `game.scoring`

- Enter from final turn or Company failure. Disable negotiations, promises, and Blackmail plays except explicit card exceptions.
- Order: firm values/Debtor's Prison as applicable → Power award → Court/Workshops → final retirement or failure card → solo failure adjustment → final VP winner/ties. Keep aid ordering/wording visible while reconciling auxiliary detail.
- Solo awards only first place for Power and uses failure adjustment table. 2P restores first and second Power awards, ordinary ties, and removes the solo failure adjustment.
- Final tie: Windows, then clockwise from Prime Minister; “Prime Minister wins” is an oversimplification.
- Difficulty affects Crown final-retirement spending. Legendary failure selects Court of Directors Blameless for Crown benefit in solo.

## Global references

- **Glossary:** Aid p1 definitions, linked at first use without occupying a phase.
- **Basic Favors:** exact bidirectional asset table. Always readable; visually enabled only during its timing window.
- **Success Checks:** shared result meanings and catastrophic-vacancy control.
- **Crisis:** static page-17 image with pan/zoom plus semantic text. Interactive flowchart stays post-launch.
- **Crown Voting Plan:** complete law table with law search/selection; current row embedded in Parliament.
- **2P Player Button:** current holder, exact pass triggers, manual negotiated transfer, and correction.

Opening or closing any reference must preserve phase, scroll position, local progress, climate, and roles.

## Session 3 representative slices

Use these verified slices instead of provisional placeholders:

1. **Bonuses** — predominantly textual and shared.
2. **Chairman** — role/climate branch with climate change at different positions.
3. **Hiring** — role availability, promotion, candidate/hirer rules, solo/2P replacements.
4. **Bombay Presidency** — fixed regional position with configurable local action order and Governor/Commander/Trade composition.

Together they validate every major architecture category without treating the entire regional sequence as unordered.

