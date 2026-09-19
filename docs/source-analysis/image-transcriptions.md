# Combined aid: visual content transcription and branch register

Source: `references/Solo_Player_Aid_Combi_V3.2.pdf`, PDF/printed pages 1–20. Primary agent visually inspected every page, including the page-21 contents. This is a normalized implementation transcription, not polished UI copy. Pair with `normalized-reading-order.md` for the prose. `assets/combined-aid/` retains the original embedded raster graphics; `image-inventory.json` records every placement and its PDF-point bounds. A reused raster can have added PDF text or images over it: the **rendered page**, not the isolated raster or OCR, is authoritative.

All vectors and table columns below use **Bull, Stag, Lion, Bear, Peacock**, in that left-to-right order. These are descriptive IDs for the five visually distinct animal icons. A dash means unavailable, not a zero-cost favor. Signed numbers are promise cubes from the human's perspective: positive = receive from Crown; negative = pay Crown. Physical affordability, eligibility, and action timing still apply. Mandatory favors are marked explicitly. Do not hide the base procedure when Crown-specific instructions are shown.

## Page 1 — Basic favors and Deregulation

Basic favors are available from the start of Firms through the end of Revenue; see timing clarification in `decisions-and-questions.md` for games without Firms. Image28:

| Action | Give to Crown | Take from Crown |
|---|---:|---:|
| Unfitted shipyard | +2 | -4 |
| Fitted shipyard | +3 | -5 |
| Uninvested workshop | +4 | -6 |
| Invested workshop | +1 | -3 |
| Luxury | +5 | -7 |
| Enterprise from a prestige card | +4 | — |
| Give £3 | +2 | — |
| Easy only: remove a promise card from game | +X; X = turn/2, rounded up | — |

Image29: Crown's maximum once-only spending against Deregulation, only if it makes the vote fail: **£6, £5, £4, £3, £2**. This is not a promise cost.

## Page 2 — London Season and Family

Image38: before retirements, **-2** to take £1 from Crown family treasury. Image39: after Crown retirements, **-1** to take £1. Image40: **-5** to take an enterprise prestige card; **-4** to take a blackmail card (do not peek at Crown blackmail).

Images41–46 are the six Family action symbols (writer, officer, luxury, shipyard, workshop, share). Image47 gives the following ordered Crown action queues; repeated entries are deliberate:

| Climate | Queue, left to right |
|---|---|
| Bull | Seek Share → Buy Shipyard → Enlist Writer → Enlist Writer → Enlist Officer |
| Stag | Seek Share → Enlist Writer → Buy Shipyard → Enlist Writer → Enlist Officer |
| Lion | Buy Shipyard → Enlist Officer → Enlist Writer → Enlist Officer |
| Bear | Enlist Officer → Buy Luxury → Buy Workshop → Enlist Officer → Enlist Writer |
| Peacock | Buy Workshop → Buy Luxury → Enlist Officer → Enlist Officer → Enlist Writer |

Apply the text-layer rules: skip unaffordable/nonviable actions; take two in solo; an extra-action law is additional, not one of the two. Free-writer rules precede this queue. The 2P pass replaces the count with one (Handbook p2).

## Page 3 — Shares and Firms

The combined graphics and overlaid labels on this page must be read together (Images55–65; Image56 is reused).

After new Company shares: **+1** for giving £1 from your family treasury to Crown if Crown has a majority of Company shares.

| Favor | Bull | Stag | Lion | Bear | Peacock |
|---|---:|---:|---:|---:|---:|
| Take a Company share from Crown | -6 | -4 | -4 | -3 | -3 |
| Give a Company share to Crown | +2 | -3 | -3 | -4 | -4 |
| Take a firm share from Crown | -3 | -4 | -4 | -6 | -6 |
| Give a firm share to Crown, never giving majority | -4 | -3 | -3 | +2 | +2 |

Creating a firm: **mandatory -3**, paying as many cubes as you have if fewer than three. Crown never creates its own firm.

Investment default: Bull/Stag will not invest; Lion/Bear/Peacock seek one investment. Global prerequisites from prose still apply: after player investments, Crown majority of Company shares, use an eligible Company share before a workshop, never acquire majority of firm shares. Bull/Stag: **-2** to make Crown invest once. Lion/Bear/Peacock: **solo only -X** to deny investment, X = firm value.

Acquiring ships: **-2** for consent to fit a Crown ship; **-2** for consent to buy a Crown-owned ship back from the Company. No hostile takeovers/mergers occur in solo; replace that statement for 2P.

## Page 4 — Hiring and structure diagram

Images68–73:

- Crown majority/former-chairman choice: **-3** to have Crown elect you Chairman; **-12** under Deregulation.
- Human majority/former-chairman choice elects Crown: **+3**; **+6** under Deregulation.
- Human hires: **-2** for Crown consent to nepotism; **+1** for hiring Crown over any non-Crown candidate.
- Crown hires: **solo mandatory +2** to consent to Crown nepotism when needed and Crown has at least two cubes; consent is optional otherwise.
- **-3** to make a hiring decision for Crown.

Image74, Company structure: Chairman is drawn from Company shares; Chairman hires Director of Trade, Manager of Shipping, Military Affairs, and Superintendent of Trade in China. Director of Trade hires Presidents; Presidents hire their associated Governors; Military Affairs assigns Commanders. Dotted candidate lines are **not** sufficient to infer exact fallback eligibility: see `state-model-audit.md`, supplemented by Rules pp15–16,26.

## Pages 5–6 — Chairman

Page5 Images77–80:

- Human Chairman: **mandatory -1 once per turn**, before any action, if able.
- First additional Debt advance beyond three: Crown-share consent costs **-1,-2,-3,-4,-6**. Each further additional advance: **-1** from a Crown share.
- Allocate **£3,£4,£4,£4,£5** respectively to a Crown office: **+1**.
- Human Chairman sets new climate **after** finishing; Crown Chairman sets climate **before** acting. Changing climate must not move the set-climate instruction to the wrong end of the branch.

Crown seeks one Debt advance for each qualifying:

| Bull/Stag | Lion | Bear | Peacock |
|---|---|---|---|
| Presidency with an open home port | Sea zone with fewer than two ships | Presidency where Crown is Commander or has majority of all Army-box pieces | No advances |

Request another Debt advance: **-1,-1,-2,-2,-3**. Request one fewer: **-2,-2,-1,-1,—**.

Page6 Images84–85: before each allocation step, **-1** to allocate £3 or less to a specific office. Apply each climate's priority list in order; give as much as possible at each step, and send any remainder to Shipping:

| Climate | Allocation priorities |
|---|---|
| Bull | £4 to each Presidency with an open home port; £5 to Director of Trade/Governor General |
| Stag | £4 to each Crown Presidency with open home port; £1 to each Presidency with a Crown writer; £3 to Director of Trade/Governor General |
| Lion | £5 to Shipping for each Presidency whose sea zone has fewer than two ships; £4 to the Crown Presidency with most ships; £3 to Director of Trade/Governor General; £1 to each Presidency with a Crown writer |
| Bear | £4 to each Presidency where Crown has majority of Army-box pieces; £2 to each Presidency with a Crown Governor; £4 to Crown Governor General; £2 to each Presidency with a Crown writer |
| Peacock | £5 to each Presidency where Crown is Commander or has majority of officers; £2 to each Presidency with a Crown Governor; £5 to Crown Governor General |

## Pages 6–7 — Director of Trade

Human Special Envoy: open an order in home region of a Crown Presidency with at least one Crown writer: **+1,+1,+1,—,—** (p6 Image86).

Crown Special Envoy: spend exactly **£3,£3,£3,£4,£5** per attempt; target northernmost closed order in an eligible non-Company region chosen by AI priority; repeat until unable to afford required amount. **-2,-2,-1,-1,-1** to alter spending by any amount, including zero, optionally skipping further attempts; **-1** to target a specific order; **-3** to open China (p6 Image87 and composite table).

Human transfers: after office acts, if no Presidency has two or more ships or writers than any other, **+1,+1,+1,—,—** (p7 Image95).

Crown transfers, up to two, skip unavailable entries and stop at end; resolve origin/destination ties using AI card. Ship preference: Company ship → unfatigued ship → Crown ship → human ship. Page7 Image96:

| Climate | Ordered transfer candidates |
|---|---|
| Bull | Crown writer, shortest-route Presidency → longest; ship, shortest route → longest; human writer, longest route → shortest |
| Stag | Ship, shortest route → longest; Crown writer, fewest ships → most ships; human writer, longest route → shortest |
| Lion | Ship, fewest Crown writers → most Crown writers; Crown writer, fewest ships → most ships; ship, fewest Crown writers → China; ship, most human writers → fewest human writers |
| Bear | Ship, human Presidency → Crown Presidency; Crown writer, fewest ships → most ships; Crown writer, human Presidency → Crown Presidency |
| Peacock | Crown writer, human Presidency → Crown Presidency; ship, fewest Crown writers → most Crown writers; repeat that ship transfer entry; human writer, human Presidency → Crown Presidency |

Image97: **-1** prevent one transfer (uses one of two); **-2** choose a writer/ship transfer (uses one of two, cannot undo a previous transfer).

## Page 8 — Governor General

Images100–102: human gains **+1** for adding money to a Crown office, placing a regiment in an Army associated with Crown Presidency, or placing a Company ship in a sea zone associated with Crown Presidency.

Image103: Crown Govern dice requirement **5,3,3,3,2**; **-1** adjusts requirement by one die. Attempt while requirement can be met; stop after success as in prose.

Image104: Bull/Stag choose Tax (distribute evenly to Crown Presidencies, remainder to Balance); Lion builds Company ship; Bear/Peacock commission regiment. **-2** to choose a different successful Govern result. Apply one result in each Company-controlled region, as in prose.

## Page 9 — Manager of Shipping

Images109–112: human gains **+1** for fitting Crown ship, and **+1** for placing a ship in a Crown Presidency or Crown Superintendent's China. Crown fits its own ships first; **-1** to fit a particular ship. When Crown fits a human ship: **mandatory -1 if able**, before sea-zone selection.

Image113:

| Climate | Default Company-ship purchases | Favor changes default | Another Company ship |
|---|---|---|---|
| Bull | None | -1 buys one | -1 |
| Stag | One if able | -2 does not buy | -1 |
| Lion | As many as able | -3 buys as many as you wish | — |
| Bear | One if able | -1 does not buy | -2 |
| Peacock | None | -2 buys one | -2 |

Image114: **-1** to leave £2 unspent instead of spending remaining funds on extra ships.

Image115, placement (highest number may be zero): Bull → longest open route, prefer Crown Presidency; Stag → longest open route, prefer more Crown writers; Lion → Crown Presidency, otherwise most writers; Bear → most Crown writers; Peacock → China if possible, otherwise most Crown writers. **-1** to choose a sea zone or China. Preserve applicable ties/eligibility rather than pretending app knows ships or writers.

## Page 10 — Military Affairs

Image119, Crown transfers: Bull/Stag human Presidency Army → Crown Presidency Army; Lion fewest-ships Presidency Army → most-ships Presidency Army; Bear/Peacock human Commander Army → Crown Commander Army. Preference Regiment → Crown Officer → human Officer; skip impossible/undoing transfers, AI arrow ties. Image120: **-1** choose an Officer/Regiment transfer (uses one slot); **-1** prevent a transfer (uses one slot).

Image121, Crown assigns human Officers-in-Training before Crown Officers; restart priority list for each placement; AI black arrow then white breaks remaining ties:

| Bull/Stag/Lion | Bear/Peacock |
|---|---|
| 1 Crown Presidency | 1 Creates new Crown majority |
| 2 Most ships | 2 Creates equality with human majority |
| 3 Crown Governor | 3 Preserves Crown majority |
| 4 Creates new Crown majority | 4 Crown Governor |
| 5 Creates equality with human majority | 5 Crown Commander |
| 6 Preserves Crown majority | 6 Crown Presidency |
| 7 Crown Commander | 7 Most ships |

Image122: **-1** assign one Officer to chosen Presidency. Image123: human assigning Crown Commander receives **mandatory +1**, even if no other choice. Crown assigns its own eligible Officer. Commander replacement demotes the old Commander; it is not an office-vacancy event.

## Page 11 — Presidency operations and Governors

Image127: **-1** makes one change to Crown President's default Governor → Commander → Trade order.

Images128–130, human Governor: **+1** for Tax money to Crown Presidency (once per turn per Presidency); **+1** for moving Company ship into Crown Presidency sea zone; **+1** for commissioning Regiment into Crown Presidency Army (once per turn per Presidency).

Image131: Crown Administer minimum dice **3,2,2,2,1**. **-1** adjusts requirement one die; **-3** takes no Administer actions. Image132: Bull/Stag tax to Crown Presidency first, remaining funds to Company Balance; Lion builds Company ship; Bear/Peacock commission regiment. **-2** changes successful action result.

## Pages 12–13 — Commanders

Page12 Image136: human Commander requests consent to buy local alliance from Crown President: **-2,-2,-1,0,0** (zero means consent free, unlike dash).

Page12 Image137:

| Climate | Crown alliance default |
|---|---|
| Bull/Stag | Does not purchase |
| Lion | If Army strength ≥3, attempt cheapest affordable alliance, with Presidential consent |
| Bear/Peacock | If Army strength ≥2, attempt most expensive affordable alliance, with Presidential consent |

Crown Presidents consent to Crown Commanders. Additional alliance of human choice: **-2,-2,-2,-1,-1**; human must give consent when in their Presidency. Require more expensive alliance: **—,-1,-1,—,—**. Require less expensive: **—,—,—,-1,-1**. If Crown also holds Presidency, prevent alliance purchase: **—,-1,-1,-2,-2**. Human consent to Crown purchase, when human did not pay to cause it: **+1**.

Page13 Image141, human successful deployment favors: non-Company region using at least one Crown Officer: **—,—,+1,+1,+1**. Company-controlled region associated with Crown Presidency and at least one Crown writer: **+1,+1,+1,—,—**.

Image142, Crown target order:

- Bull/Stag: home region with closed orders → associated Company regions with closed orders → home region if not Company-controlled → non-Company regions adjacent to Company-controlled regions.
- Lion/Bear/Peacock: home region if not Company-controlled → non-Company regions adjacent to Company-controlled associated regions → associated Company-controlled regions with closed orders.
- **-2** chooses a valid region.

Image143: required exact dice for non-Company target **6,5,4,3,2**; Company-controlled target **2,3,4,5,6**. Consider lower-priority targets if needed to meet requirement. Exhaust Alliances → Crown Officers → human Officers → Regiments. **-1** changes requirement by one; **-X** after exhaustion and before roll swaps exhausted pieces of X value for unexhausted pieces; alliance of strength X counts as X pieces.

Image144: Bull/Stag/Lion do not deploy again by default; Bear/Peacock attempt again. Favor to repeat: **-2,-1,-1,—,—**. Favor to stop: **—,—,—,-1,-1**.

## Page 14 — Trade

Image149: human places X Crown writers: **mandatory +X**, even when no alternative. Image150: Crown required dice **2,3,4,5,6**; prose additionally spends up to £3 remaining after meeting the requirement, so this is not an exact final dice cap. Image151: **-1** adjusts requirement by one. Image152: **-1** places your writer instead of another. Crown normally uses own writers first. The 2P pass adds Button allocation for human writers.

## Page 15 — China and Firm Revenue

Image155: Crown China minimum **1,2,2,3,3**; roll as many dice as possible, unlike exact-dice Commander procedures. **-1** changes minimum by one.

Image156: default Crown refusal of emergency investment can be overridden for **-4**; Crown invests Company shares unless weak, then workshops, regardless of Company-share majority. Cannot cause Crown to have more firm shares than manager.

Image157: if Crown firm-share dividends ≥ any/all other player's firm-share dividends (exclude manager fee), receive **+X**, X = Crown firm shares, maximum three.

## Page 16 — Company Revenue

Image165: Crown Chairman pays one dividend if able, then more while preserving minimum Balance **£0,£2,£4,£6,£8**. Pay one fewer dividend: **-2,-2,-1,-1,-1**. Pay one more: **-1,-1,-2,-2,-2**.

The event-type table on this page is extractable text but its Peace/Shuffle merged cells require reading row-by-row. Peace: if Elephant connects two regions, remove their closed orders and add one tower each; if inside a region, open orders/remove unrest there; then move Elephant to top-of-deck region. Shuffle: move Elephant, shuffle this card into deck, shuffle discards and place on top. Movement footnote applies to both. Preserve Foreign Invasion's black-circle border symbol as a labelled symbol.

## Page 17 — Crisis/Rebellion/Invasion reference

Image168 is a complete **1353×1670** raster, usable as a zoomable static reference for v1. Retain an accessible text equivalent. This graph is a reference layer, not another round phase. Header: when Crown Commander defends, the human chooses pieces to exhaust (replace actor for 2P).

Decision: is Elephant touching a Company-controlled region?

- **Yes, inside:** primary rebellion against Company. Attack = unrest + Crisis bonus. Defense = exhausted Officers/Regiments/Alliances selected by Commander; defender wins ties. Success → region-loss steps. Failure → remove unrest, Commander gains trophy.
- **Yes, on border:** invasion against Company. Attack = all towers in attacking empire + unrest in defending region + Crisis bonus. Same defense and ties. Success → region loss and flag matching attacker. Failure → remove unrest, Commander gains trophy, attacker loses one tower.
- **No; attacking (tail) region dominated:** rebellion against its capital. Attack = tower level + Crisis bonus; defense = defending tower level, defender wins ties. Success → remove attacker's small flag, close all its orders (Cascade if already full); failure → capital loses one tower. Then reposition Elephant to top-of-deck region.
- **No; attacking region sovereign:** invasion. Attack = all towers in attacker empire + bonus; defense = all towers in defender empire, defender wins ties. Success → expand attacker empire, flag defending region; remove remaining matching flags if defeated region was capital. Failure → attacker loses one tower. Successful invasion → Imperial Ambitions; otherwise top-of-deck reposition.

After Company branches, resolve rebellion in each remaining unrest region, starting Army of Bombay and proceeding downward. Attack = unrest; defense as above. Success → region loss; failure → clear unrest + Commander trophy. Then successful invasion → Imperial Ambitions; otherwise top-of-deck reposition.

Region loss: (1) remove Commander and lose half trophies rounded up; (2) death checks for Officers; (3) eliminate Governor position; (4) remove unrest and half-built Company ships, place level-one tower, flag attacker if invasion; (5) return control marker facedown; (6) close orders, Cascade if already closed; (7) lower Company Standing by number of regions lost this turn. Governor General changes step 3 (Rules p26); Company failure may end the procedure immediately (Rules p29).

Top-of-deck reposition: dominated → border facing capital; Company-controlled → inside; sovereign → border symbol matching Crisis card. Imperial Ambitions: Elephant in capital's region, facing across matching border; rotate to next clockwise border if adjacent target dominated; if all dominated, leave at matching symbol facing inward.

Vacant Commander fallback for choosing defensive exhaustion: Military Affairs → Chairman. If none of those roles occupied, do not exhaust pieces; lose/gain no trophies. Source footer is part of the graphic.

## Page 18 — Parliament and climate shift

Image176: Crown PM draw favors **-2** stop drawing/select current law; **-2** skip current law and draw another (must select third). Dilemma forces immediate selection from prose.

Image177, extra free Crown votes by family cash: £0–3 → 0; £4–6 → 1; £7–10 → 2; £11–14 → 3; £15+ → 4.

The extractable climate-shift table uses symbolic arrows. Here each cell is **right shifts / left shifts**. Execute as many rightward shifts as possible **then** leftward shifts; do not net them before applying edge limits.

| Successes | £4 | £6 | £8 | £10 | £12 | £14 | £16 |
|---:|---|---|---|---|---|---|---|
| 0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/1 | 0/2 |
| 1 | 1/0 | 0/0 | 0/0 | 0/0 | 0/1 | 0/2 | 0/2 |
| 2 | 2/0 | 1/0 | 0/0 | 0/1 | 0/2 | 0/2 | 0/2 |
| 3 | 2/0 | 2/0 | 1/1 | 0/2 | 0/2 | 0/2 | 0/2 |
| 4 | 2/0 | 2/1 | 2/2 | 1/2 | 0/2 | 0/2 | 0/2 |
| 5 | 2/1 | 2/2 | 2/2 | 2/2 | 1/2 | 0/2 | 0/2 |
| 6 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 1/2 | 0/2 |

## Page 19 — Policy, refresh, scoring

Image181: **-4** makes Crown select alternative policy. Images182–185 are Tax, Window, Bonus, Power labels/icons; preserve their meaning with text, not decorative-only images.

Image186: **solo mandatory +1** if you have at least one writer in a Crown Presidency but no writer returns from filling an order in that Presidency. Remove in 2P.

Image191, solo human VP adjustment after Company failure; empty cells are not zero:

| Scenario | Turn1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1710 | -5 | -4 | -3 | -2 | -1 | 0 | 0 | 0 |
| 1758 | — | — | -5 | -4 | -3 | -2 | -1 | — |
| 1813 | — | — | — | — | -4 | -3 | -2 | -1 |

This is a scoring lookup, not independently sufficient evidence for scenario setup/end-turn defaults. Legendary selects Court of Directors Blameless on failure, Crown benefits and human does not (p1). Hard/Expert/Legendary Crown spends as much as possible at final retirement (p19).

## Page 20 — Crown voting plan

Image194 is the full voting plan. Render as conditional law reference within Parliament, with a complete accessible list available. This is not a new phase. Unless specified otherwise, the opposite of the For condition is Against. “Most” includes ties only when Crown has at least one.

| Law | For / special instruction |
|---|---|
| Army Spending | Bear/Peacock |
| Board of Control | Crown PM; removes human from office at first opportunity |
| Calico Acts | Crown has most workshops |
| Company Aids Government | Bear/Peacock |
| Debt Restructure | Bull/Stag |
| Envoy to China | Lion/Bear/Peacock |
| Governor General | Crown is Director of Trade |
| Inclosure Acts | Crown has most prizes |
| Industry Subsidy | Lion/Bear/Peacock |
| Masses Demand Franchise! | For unless Crown has most Rotten Boroughs |
| Military Oversight | Crown PM; Crown Military Affairs always demotes human Commander if Crown Officer in Army |
| Old Ideas Made New! | If Crown PM, choose law randomly; no For/Against partition is stated |
| Public Demands Impeachment! | Crown PM; select first human office left-to-right on ribbon, random if all offices Crown |
| Relief Demanded for Indian Famine! | For unless Crown has most of given policy |
| Royal Protection | Crown has most luxuries |
| Sepoy Recruitment | Lion/Bear/Peacock |
| Ship Subsidy | Bull/Stag/Lion |
| Tenure Limits | For unless Crown is Chairman |
| Trade Regulations | Bear/Peacock |
| Treasure Reform | Bull/Stag |
| War Against France! | Crown PM; select human ships/officers → Company ships → Crown ships/officers |
| Window Tax Repeal | Peacock |
| Writer Graft Reform | Bull |
| Writer Privileges | Crown has most writers currently on orders |
| Zamindar Taxes | Crown has most Governors |

The text layer redundantly repeats Board of Control and Military Oversight notes under/over the graphic. Normalize to one semantic record per law. Preserve their ongoing effects in the implementation briefs.

## Extraction qualifications

The normalized image transcription intentionally converts diagrams, merged cells and repeated icons into labelled data. Original line breaks, typography, and graphics remain in the supplied PDF and extracted assets. It does not silently “correct” source rules to match the older Handbook. Ambiguities, scope choices, and auxiliary-rule clarifications are in `decisions-and-questions.md`. Low-quality OCR `.txt` files are never approved display content.
