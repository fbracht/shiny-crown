# Phase-by-state matrix

Legend:

- **Actor** names the tracked occupant that selects human/Crown/vacant content. `shared` means no role branch.
- **C** means Crown-actor content branches by current climate.
- **Mode** identifies material solo/2P differences; `shared+2P` means the shared procedure remains but 2P adds or replaces content.
- **Board input** is evaluated by the players from the physical game. It is not a demand for app state.

| ID | Primary source | Actor | C | Mode | Persistent visibility/state gates | Board input and state mutations | Bespoke presentation |
|---|---|---|:---:|---|---|---|---|
| `setup.configure` | Aid 1; R4,43–44 | shared |  | shared+2P | new session only | set mode, scenario, difficulty | three compact selectors; prevent unsourced Legendary+2P or label unresolved |
| `setup.table` | R4–5 | shared |  | shared | setup only | selected scenario; physical scenario card | ordered checklist, table-setup visual optional |
| `setup.crown` | Aid 1; R43–44 | shared |  | shared+2P | setup only | set Crown/human cube distribution; no need to count later | mode/difficulty calculation card |
| `setup.cards` | Aid 1; R43–44 | shared |  | replacement | setup only | round of dealing/keeping; Crown card total | mode-specific guided counter; exclude random/draft variants |
| `setup.finish` | R5, scenario card | shared |  | shared | setup only | initialize role availability/occupants, PM, optional offices | role checklist using `not-in-play` distinctly |
| `setup.ai` | Aid 1; R43–45 | shared |  | shared+2P | setup only | set climate; 2P set Button holder | five climate choices with names/icons; Button direction prompt |
| `round.deregulation-vote` | Aid 1; R36; H2 | PM/Crown voting | C | shared+2P | scenario permits; inactive Deregulation; lined/star input | physical Debt/Standing/votes; pass sets `deregulated=true`; PM may remain/change only per special-vote rule | vote procedure, Crown spend table, pass/fail actions |
| `round.london-season` | Aid 2; R11–12; H2 | per officeholder/family | C | shared+2P | hidden/auto-skipped on first turn; special retirement only if deregulated | attrition can vacate offices; retirement/card choices; difficulty affects final retirement | ordered subsections; contextual “mark vacant”; favor callouts |
| `round.family` | Aid 2–3; R13–14; H2 | family order | C | replacement | always; Crown normal action count solo=2, 2P=1 | vacancies trigger free writers; physical action viability; New Shares affects later hiring/firms | climate queue showing only active row; free/extra actions separated from normal count |
| `round.firms` | Aid 3; R37–40; H3 | human managers/Crown | C | replacement | content visible only if deregulated | physical firm/share/ship data; 2P Button per Crown investment; takeover/merger only 2P | creation/investment/actions; physical-secret strategy guidance; favor cards |
| `round.hiring` | Aid 4; R14–16; H3 | hiring role/Crown | C only for favor prices where shown | replacement | always; show actual `vacant` roles only, ascending office-card number | promotion vacates prior office; new occupant; empty Court; immediate optional-office hiring | Chairman election separate; vacancy queue; exact candidates/hirer; 2P consent prompts |
| `round.chairman` | Aid 5–6; R18; H4–5 | Chairman | C | shared+2P | skip if vacant | set climate occurs **after** human branch and **before** Crown branch; board predicates determine debt/allocation; Crown consent may be unnecessary if humans provide majority in 2P | debt and allocation tables; inline set-climate control at correct position |
| `round.trade-directorate` | Aid 6–8; R18,26; H5–7 | Director of Trade or Governor General | C | shared+2P | exactly one variant `in-play`; skip active office if vacant | Special Envoy may activate China; GG law replacement removes Director/Governors; physical routes/pieces | mutually exclusive bespoke branches; tables; contextual office-transition actions |
| `round.shipping` | Aid 9; R19; H8 | Manager of Shipping | C | shared+2P | skip if vacant | physical treasury/ships; 2P Button selects tied human ship and passes per arbitration | ordered fit→buy→lease→place procedure; climate decision cards |
| `round.military-affairs` | Aid 10; R19; H9 | Military Affairs | C | shared+2P | skip if vacant | physical Armies; assignments update Commander occupants; displaced Commander becomes Officer, not vacancy | two transfer slots; assignment priority; contextual Commander selectors |
| `round.presidency.bombay` | Aid 11–14; R20–24; H10–13 | President, Commander, Governors | C by each Crown actor | shared+2P | fixed first Presidency screen | physical routes, Army, regions, firm initiative; local order/progress persisted | locally ordered action cards; multiple Governors supported |
| `round.presidency.madras` | same | same | C | shared+2P | fixed second Presidency screen | same | same |
| `round.presidency.bengal` | same | same | C | shared+2P | fixed third Presidency screen | same | same |
| `round.china` | Aid 15; R25; H13 | Superintendent | C if Crown | shared+2P | show only `in-play`; skip if vacant | physical opium/export icons and ships; once-per-turn attempt | compact trade check and active-climate minimum |
| `round.bonuses` | Aid 15; base rules | shared |  | shared | always | physical enterprise income | concise checklist; predominantly textual prototype candidate |
| `round.firm-revenue` | Aid 15; R41–42; H14 | firm manager/shareholders/Crown | limited | replacement | deregulated and firm exists; repeat per firm | physical initiative, expenses, shares, dividends; dissolution; emergency investment/merger; no need to model firms globally for v1 | repeatable firm panel; 2P ordering and consent guidance |
| `round.company-revenue` | Aid 16; base rules; H14 | Chairman for dividends | C if Crown Chairman | shared+2P | always | physical expense/Balance/Standing; failure action available | expense checklist and Crown dividend threshold table |
| `round.events-india` | Aid 16–17; R28–33; H14 | event/Commander | limited | shared+2P | always | physical storm/events/Elephant; region loss updates Governor availability and Commander vacancy; possible game failure | event lookup table; modal flowchart with zoom + accessible text |
| `round.parliament` | Aid 18–20; R34–36; H14–16 | PM/voters | C | replacement | always unless ended | climate shift mutates climate; law may activate GG/China/deregulation; track PM/Opposition Leader; possible failure | PM branches, climate calculator/table, vote sequence, policy panel, law-indexed Crown plan |
| `round.upkeep-refresh` | Aid 19; R36; H15 | shared |  | replacement | always | physical upkeep; final-turn choice; else increment turn and clear phase-local progress | ordered checklist; 2P hides solo writer compensation |
| `game.scoring` | Aid 19; R8–9,37; H15 | shared | difficulty for Crown retirement | replacement | final turn or failure | terminal reason, physical scores; no mutation back into round | mode-specific scoring; solo failure table; 2P ordinary first/second Power award |

## Global overlays and contextual sheets

| ID | Source | Gate | State effect |
|---|---|---|---|
| `reference.glossary` | Aid 1 | always available | none |
| `reference.basic-favors` | Aid 1 | enabled after New Shares/Firms boundary through end Company Revenue; readable at any time | none; physical cube exchange |
| `reference.success-checks` | Aid 4; R17 | linked from applicable office actions | catastrophic failure can mark acting office vacant when user confirms |
| `reference.crisis` | Aid 17; R29,32–33 | opened from Events; globally readable | none until player invokes contextual region-loss/role controls |
| `reference.crown-voting-plan` | Aid 20; H16 | embedded in Parliament; globally readable | none; may identify ongoing law effect to apply physically |
| `reference.two-player-button` | R44,46 | 2P only; globally available | manual transfer, plus explicit resolve-and-pass actions |
| `reference.save` | product requirement | always | export/import atomically replaces validated app state |

## Conditional hierarchy

For a content unit, evaluate in this order:

1. screen/phase and office availability;
2. game mode and scenario/deregulation gate;
3. applicable role occupant;
4. current climate when the Crown acts or the favor table is climate-indexed;
5. difficulty or first/final-turn gate;
6. narrow local progress;
7. physical-table predicate stated to the user.

The last category is guidance, not hidden application logic. For example, the app knows the current climate but does not know whether a Presidency has the longest open trade route. It should show the active climate's priority in a form the player can apply.

