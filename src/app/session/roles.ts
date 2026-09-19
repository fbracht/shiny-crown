import type {
  ActorId,
  GameSessionV1,
  GovernorAssignment,
  RoleAssignment,
  RoleRef,
  RoleState,
} from "./types";

export function getRole(roles: RoleState, role: RoleRef): RoleAssignment | GovernorAssignment {
  if (role.startsWith("president:")) {
    return roles.presidents[role.slice("president:".length) as keyof RoleState["presidents"]];
  }
  if (role.startsWith("commander:")) {
    return roles.commanders[role.slice("commander:".length) as keyof RoleState["commanders"]];
  }
  if (role.startsWith("governor:")) {
    return roles.governors[role.slice("governor:".length) as keyof RoleState["governors"]];
  }
  const simpleRole = role as Exclude<
    RoleRef,
    `president:${string}` | `commander:${string}` | `governor:${string}`
  >;
  return roles[simpleRole];
}

export function setRole(
  roles: RoleState,
  role: RoleRef,
  assignment: RoleAssignment | GovernorAssignment,
): RoleState {
  if (role.startsWith("president:")) {
    const id = role.slice("president:".length) as keyof RoleState["presidents"];
    return { ...roles, presidents: { ...roles.presidents, [id]: assignment } };
  }
  if (role.startsWith("commander:")) {
    const id = role.slice("commander:".length) as keyof RoleState["commanders"];
    return { ...roles, commanders: { ...roles.commanders, [id]: assignment } };
  }
  if (role.startsWith("governor:")) {
    const id = role.slice("governor:".length) as keyof RoleState["governors"];
    return {
      ...roles,
      governors: { ...roles.governors, [id]: assignment as GovernorAssignment },
    };
  }
  return { ...roles, [role]: assignment };
}

export function actorIsAllowed(session: Pick<GameSessionV1, "mode">, actor: ActorId) {
  return session.mode === "two-player" || actor !== "human-2";
}

export function roleRefs(): RoleRef[] {
  return [
    "chairman",
    "directorOfTrade",
    "governorGeneral",
    "managerOfShipping",
    "militaryAffairs",
    "president:bombay",
    "president:madras",
    "president:bengal",
    "commander:bombay",
    "commander:madras",
    "commander:bengal",
    "governor:bombay",
    "governor:madras",
    "governor:bengal",
    "governor:punjab",
    "governor:delhi",
    "governor:maratha",
    "governor:mysore",
    "governor:hyderabad",
    "superintendentChina",
    "primeMinister",
  ];
}

export const ROLE_LABELS: Record<RoleRef, string> = {
  chairman: "Chairman",
  directorOfTrade: "Director of Trade",
  governorGeneral: "Governor General",
  managerOfShipping: "Manager of Shipping",
  militaryAffairs: "Military Affairs",
  "president:bombay": "President of Bombay",
  "president:madras": "President of Madras",
  "president:bengal": "President of Bengal",
  "commander:bombay": "Commander of Bombay",
  "commander:madras": "Commander of Madras",
  "commander:bengal": "Commander of Bengal",
  "governor:bombay": "Governor of Bombay",
  "governor:madras": "Governor of Madras",
  "governor:bengal": "Governor of Bengal",
  "governor:punjab": "Governor of Punjab",
  "governor:delhi": "Governor of Delhi",
  "governor:maratha": "Governor of Maratha",
  "governor:mysore": "Governor of Mysore",
  "governor:hyderabad": "Governor of Hyderabad",
  superintendentChina: "Superintendent of Trade in China",
  primeMinister: "Prime Minister",
};

export const HIRING_ROLE_REFS: RoleRef[] = [
  "directorOfTrade",
  "governorGeneral",
  "managerOfShipping",
  "militaryAffairs",
  "president:bombay",
  "president:madras",
  "president:bengal",
  "governor:bombay",
  "governor:madras",
  "governor:bengal",
  "governor:punjab",
  "governor:delhi",
  "governor:maratha",
  "governor:mysore",
  "governor:hyderabad",
  "superintendentChina",
];

export const OFFICE_CARD_NUMBERS: Partial<Record<RoleRef, number>> = {
  chairman: 1,
  directorOfTrade: 2,
  governorGeneral: 2,
  managerOfShipping: 3,
  militaryAffairs: 4,
  "president:bombay": 5,
  "president:madras": 6,
  "president:bengal": 7,
  superintendentChina: 8,
  "governor:bombay": 9,
  "governor:madras": 10,
  "governor:bengal": 11,
  "governor:punjab": 12,
  "governor:delhi": 13,
  "governor:maratha": 14,
  "governor:hyderabad": 15,
  "governor:mysore": 16,
};
