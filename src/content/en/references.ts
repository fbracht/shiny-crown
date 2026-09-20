export const glossaryEntries = [
  ["Associated", "Any region controlled by a Presidency."],
  ["Climate", "How the Crown views the Company and whether it will support it."],
  ["Climate Set", "Draw an AI card and use its animal icon to set Crown climate."],
  ["Climate Shift", "Roll 6 dice and compare successes with Company Standing to shift climate."],
  ["Favors", "Give promise cubes to force Crown choices, or receive cubes for Crown-beneficial choices."],
  ["Fewest", "Crown has as much or less than the human, including zero."],
  ["Home", "A region containing the Bombay, Madras, or Bengal Presidency home port."],
  ["Most", "Crown has as much or more than the human, with at least one."],
  ["Shortest / Longest Trade Route", "The maximum orders a President could fill with a successful Trade, regardless of ships."],
  ["Ties", "When no source priority resolves equal Crown choices, the human chooses."],
] as const;

export const basicFavors = [
  ["Unfitted Shipyard", "Receive 2", "Give 4"],
  ["Fitted Shipyard", "Receive 3", "Give 5"],
  ["Uninvested Workshop", "Receive 4", "Give 6"],
  ["Invested Workshop", "Receive 1", "Give 3"],
  ["Luxury", "Receive 5", "Give 7"],
  ["Enterprise from Prestige card", "Receive 4", "Unavailable"],
  ["Give Crown £3", "Receive 2", "Unavailable"],
  ["Easy: discard a promise card", "Receive turn ÷ 2, rounded up", "Unavailable"],
] as const;

export const crisisBranches = [
  {
    title: "Elephant inside a Company-controlled region",
    text: "Resolve a rebellion against the Company. Attack is unrest plus Crisis bonus. The Commander selects exhausted Officers, Regiments, and Alliances; defender wins ties. Success causes Region Loss. Failure removes unrest and gives the Commander a trophy.",
  },
  {
    title: "Elephant on a Company-region border",
    text: "Resolve an invasion against the Company. Attack is every tower in the attacking empire plus defending-region unrest and Crisis bonus. Defender wins ties. Success causes Region Loss and adds the attacker's flag. Failure removes unrest, gives the Commander a trophy, and removes one attacking tower.",
  },
  {
    title: "No Company region; attacking region dominated",
    text: "Resolve rebellion against its capital. Attack is tower level plus Crisis bonus; defense is the capital tower level and wins ties. Success removes the small flag and closes every order, Cascading where required. Failure removes one capital tower. Then reposition the Elephant.",
  },
  {
    title: "No Company region; attacking region sovereign",
    text: "Resolve invasion. Attack and defense use every tower in their respective empires; defender wins ties. Success expands the attacker and may defeat a capital. Failure removes one attacking tower. A successful invasion proceeds to Imperial Ambitions; otherwise reposition the Elephant.",
  },
] as const;

