# Authoritative phase and content inventory

The physical game has a fixed top-level phase order. Shiny Crown may divide setup into several short screens, but recurring gameplay follows the order below. The initial specification's proposed “regional procedures in any order” is incorrect: the Company Operation ribbon fixes the Presidency sequence as **Bombay → Madras → Bengal**. Within each Presidency, the acting President controls the order of Trade, its Commander, and its current Governor or Governors. A Crown President defaults to Governor(s) → Commander → Trade; a favor can make one change. A vacant President leaves order choice to the Chairman, prevents Trade, and cannot approve local alliances.

## Setup sequence

These are app screens rather than named phases of the physical game.

| ID | Screen | Required content and state | Sources |
|---|---|---|---|
| `setup.configure` | New game | Choose solo/2P, scenario, and difficulty. Available scenarios: 1710, 1758, 1813, Long 1710. All five aid difficulties are supported in solo. | Aid p1; Rules pp4,43–44 |
| `setup.table` | Table and scenario | Base setup steps 1–10, with the selected physical scenario card remaining authoritative for scenario-specific positions. No draft setup variant. | Rules pp4–5 |
| `setup.crown` | Crown setup | Crown board and climate marker; Crown uses 36 family members and exhausts one colour before the other; distribute the closed pool of 12 Crown promise cubes according to mode/difficulty. | Aid p1; Rules pp43–44 |
| `setup.cards` | Setup cards | Solo: four rounds of draw 3, keep 1, Crown 2, yielding 4/8. 2P: each human draws 3, keeps 2, gives 1 to Crown, repeated until all three families hold four. Do not include random-deal or ordinary draft variants. | Aid p1; Rules pp43–44 |
| `setup.finish` | Finish and record offices | Finish base setup steps 11–13; record current occupants of all in-play offices, Commanders, and Prime Minister. Roles absent from the chosen setup are `not-in-play`, not vacant. | Rules p5 and scenario card; role inventory below |
| `setup.ai` | AI, climate, and readiness | Reveal first AI card, set one of the five climates, record Crown seating. In 2P initialize the Player Button from the AI-card direction. Then enter the first turn at the pre-London boundary. | Aid p1; Rules pp43–45 |

The source does not contain the scenario cards themselves. The app can guide common setup and record the selected scenario, but it must tell the player to follow the matching physical scenario card for scenario-specific board positions.

## Recurring and terminal flow

| Order | ID | Screen | Entry/skip rule | Exit |
|---:|---|---|---|---|
| 0 | `round.deregulation-vote` | Vote to Deregulate | Only at turn start when allowed by scenario and Standing/Debt is on a lined space; mandatory on a star. 1813 starts deregulated; short 1710 does not offer this special vote. | Pass sets Deregulation active; fail returns to turn flow. |
| 1 | `round.london-season` | London Season | Skip all content on the first turn. | Family |
| 2 | `round.family` | Family | Always. Includes free Crown writers, family actions, and New Company Shares. | Firms boundary |
| 3 | `round.firms` | Firms | Render phase content only while Deregulation is active. The Basic Favors timing window opens at this boundary even when there is no Firms content screen. | Hiring |
| 4 | `round.hiring` | Hiring | Always; process actual vacant office cards in ascending number. | Company Operations |
| 5 | `round.chairman` | Chairman | Skip if vacant. | Trade directorate |
| 6 | `round.trade-directorate` | Director of Trade **or** Governor General | Exactly one office variant can be in play. Skip if the active variant is vacant. | Shipping |
| 7 | `round.shipping` | Manager of Shipping | Skip if vacant. | Military Affairs |
| 8 | `round.military-affairs` | Military Affairs | Skip if vacant. | Bombay |
| 9 | `round.presidency.bombay` | Bombay Presidency | Always visit the Presidency shell; skip individual vacant/not-in-play actors. | Madras |
| 10 | `round.presidency.madras` | Madras Presidency | Same. | Bengal |
| 11 | `round.presidency.bengal` | Bengal Presidency | Same. | China or Bonuses |
| 12 | `round.china` | Superintendent of Trade in China | Only if office is in play; skip if vacant. It acts after Bengal. | Bonuses |
| 13 | `round.bonuses` | Bonuses | Always. | Firm Revenue or Company Revenue |
| 14 | `round.firm-revenue` | Firm Revenue | Only under Deregulation and if at least one firm exists. Repeat for actual firms in initiative/order resolved at the table. | Company Revenue |
| 15 | `round.company-revenue` | Company Revenue | Always. Basic Favors close at the end of this screen. | Events |
| 16 | `round.events-india` | Events in India | Always; open Crisis reference when a Crisis, rebellion, or invasion requires it. | Parliament unless Company failure ends game. |
| 17 | `round.parliament` | Parliament Meets | Always unless game already ended. Includes climate shift, voting, policy, and embedded Crown voting plan. | Upkeep unless legislated Company failure ends game. |
| 18 | `round.upkeep-refresh` | Upkeep and Refresh | Always. On a final scenario turn, perform Upkeep but skip Refresh and enter scoring. Otherwise advance turn and return to order 0/1. | Next turn or scoring. |
| 19 | `game.scoring` | Game End and Scoring | Terminal branch after final turn or Company failure. | End session. |

Immediate Company failure can occur outside Events or Parliament as physical state changes resolve. The app must expose an always-available “Company failed / End game” action rather than assuming that navigation alone observes it.

## Presidency screen structure

Each of the three fixed Presidency screens contains a locally ordered set of eligible actions:

- `trade`: the President's action; unavailable when the Presidency is vacant;
- `commander`: the Presidency's Commander, if occupied;
- one `governor:<region>` item for every in-play Governor associated with that Presidency;
- firm initiative/trading guidance at the Presidency boundary when relevant.

The President chooses the sequence and every selected actor finishes before the next. A Crown President starts with all Governors, then Commander, then Trade. If several Governors exist, their relative order remains a table choice; the supplied Crown sources do not define an automatic ordering among them. Persist the chosen order and completion checks for the current Presidency so a reload does not lose local progress. Do not let players drag Bombay, Madras, and Bengal themselves into a different order.

## Role inventory

### Company offices

- Chairman.
- Director of Trade, mutually exclusive with Governor General.
- Governor General, created by its law and replacing Director of Trade.
- Manager of Shipping.
- Military Affairs.
- President of Bombay, President of Madras, President of Bengal.
- Superintendent of Trade in China, created by Special Envoy or law.
- Regional Governors for Bombay, Madras, Bengal, Punjab, Delhi, Maratha, Mysore, and Hyderabad. A Governor exists only while its region is Company-controlled and Governor General is absent. Store its current Presidency association.

### Army and political positions

- Commander of Bombay, Commander of Madras, Commander of Bengal. Commanders are not officeholders and have no office card, but their occupant affects instructions.
- Prime Minister.
- Opposition Leader, relevant especially to 2P Parliament and failed-law succession.

Every role uses three distinct availability states: `not-in-play`, `vacant`, `occupied`. An occupied role has `human-1`, `human-2` in 2P, or `crown` as occupant. Solo never permits `human-2`. Chairman also retains `previousOccupant` because the former Chairman acts during election/retirement ordering after vacancy.

## Exactly-once combined-aid coverage ledger

Every substantive section of aid pp1–20 is assigned once below. Page 21 is a table of contents and is verification evidence, not duplicate content.

| Aid section | Pages | Destination |
|---|---:|---|
| Setup; Difficulty | 1 | `setup.configure`, `setup.crown`, `setup.cards`, `setup.ai` |
| Definitions | 1 | global Rules Glossary reference; contextual definitions link to it |
| Basic Favours | 1 | global Basic Favors sheet, enabled from Firms boundary through Company Revenue |
| 0. Vote to Deregulate | 1 | `round.deregulation-vote` |
| 1. London Season: Attrition, Retirements, Special Retirements, Prestige Cards | 2 | `round.london-season` |
| 2. Family: Free Crown Writers, Family Action, New Company Shares | 2–3 | `round.family` |
| 3. Firms: creation, investments, acquiring ships, takeovers/mergers, strategy, dissolution | 3 | `round.firms` |
| 4. Hiring: Chairman election, remaining vacancies, both hirer branches | 4 | `round.hiring` |
| 5. Company Operations; Success Checks | 4 | shared intro at `round.chairman`, then contextual Success Check sheet linked from relevant actions |
| 6. Chairman: Debt, allocation, climate | 5–6 | `round.chairman` |
| 7. Director of Trade: Special Envoy, transfers | 6–7 | Director branch of `round.trade-directorate` |
| 8. Governor General: creation, regional income, Govern | 8 | Governor General branch of `round.trade-directorate`; creation also linked from Parliament |
| 9. Manager of Shipping: fitting, buying, leasing, placing | 9 | `round.shipping` |
| 10. Military Affairs: transfers, assign Officers-in-Training, assign Commanders | 10 | `round.military-affairs` |
| 11. Presidencies; Firm Initiative | 11 | shared shell of three `round.presidency.*` screens |
| 12. Governors; Administer | 11 | eligible Governor item within associated Presidency screen |
| 13. Commanders: alliances, Deploy | 12–13 | Commander item within associated Presidency screen |
| 14. Trade; firm trading | 14 | Trade item within associated Presidency screen |
| 15. Superintendent of Trade in China | 15 | `round.china` |
| 16. Bonuses | 15 | `round.bonuses` |
| 17. Firm Revenue: expenses/dissolution, dividends | 15 | `round.firm-revenue` |
| 18. Company Revenue: expenses, expectations, dividends, standing | 16 | `round.company-revenue` |
| 19. Events in India: Storms, Events | 16 | `round.events-india` |
| Crisis/Rebellion/Invasion Resolution | 17 | zoomable `reference.crisis` opened over Events; accessible text equivalent |
| 20. Parliament Meets: both PM branches, votes, climate shift, policy, Royal Privilege | 18–19 | `round.parliament` |
| 21. Upkeep and Refresh | 19 | `round.upkeep-refresh` |
| 22. Game End and Scoring | 19 | `game.scoring` |
| 23. Crown Voting Plan | 20 | `reference.crown-voting-plan`, embedded from Parliament and globally available |

This ledger is the content-coverage baseline for Sessions 3–5. A later component may split a long screen into accordions or local steps, but it must keep the same semantic destination and provenance rather than creating duplicate rule copies.

