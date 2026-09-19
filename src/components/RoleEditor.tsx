import { useSession } from "../app/session/SessionContext";
import type {
  ActorId,
  GovernorAssignment,
  PresidencyId,
  RoleAssignment,
  RoleRef,
} from "../app/session/types";
import { PRESIDENCIES } from "../app/session/types";
import { getRole, ROLE_LABELS } from "../app/session/roles";

const actorLabels: Record<ActorId, string> = {
  "human-1": "Human 1",
  "human-2": "Human 2",
  crown: "Crown",
};

function actorsForMode(mode: "solo" | "two-player"): ActorId[] {
  return mode === "solo" ? ["human-1", "crown"] : ["human-1", "human-2", "crown"];
}

function assignmentValue(assignment: RoleAssignment | GovernorAssignment) {
  if (assignment.status !== "occupied") return assignment.status;
  return `occupied:${assignment.occupant}`;
}

function nextAssignment(value: string, current: RoleAssignment): RoleAssignment {
  const previousOccupant =
    current.status === "occupied" ? current.occupant : current.previousOccupant;
  if (value === "not-in-play") {
    return previousOccupant
      ? { status: "not-in-play", previousOccupant }
      : { status: "not-in-play" };
  }
  if (value === "vacant") {
    return previousOccupant ? { status: "vacant", previousOccupant } : { status: "vacant" };
  }
  const occupant = value.slice("occupied:".length) as ActorId;
  return previousOccupant
    ? { status: "occupied", occupant, previousOccupant }
    : { status: "occupied", occupant };
}

export function RoleEditor({ role }: { role: RoleRef }) {
  const { session, dispatch } = useSession();
  const assignment = getRole(session.roles, role);
  const isGovernor = role.startsWith("governor:");
  const association = (assignment as GovernorAssignment).associatedPresidency;

  const changeStatus = (value: string) => {
    const next = nextAssignment(value, assignment);
    if (isGovernor && next.status !== "not-in-play" && !association) return;
    dispatch({
      type: "set-role",
      role,
      assignment:
        isGovernor && next.status !== "not-in-play"
          ? { ...next, associatedPresidency: association }
          : next,
    });
  };

  const changeAssociation = (presidency: PresidencyId) => {
    if (!isGovernor) return;
    dispatch({
      type: "set-role",
      role,
      assignment: { ...assignment, associatedPresidency: presidency },
    });
  };

  return (
    <div className="role-editor">
      <label>
        <span>{ROLE_LABELS[role]}</span>
        <select
          value={assignmentValue(assignment)}
          onChange={(event) => changeStatus(event.target.value)}
        >
          <option value="not-in-play">Not in play</option>
          <option disabled={isGovernor && !association} value="vacant">
            Vacant
          </option>
          {actorsForMode(session.mode).map((actor) => (
            <option disabled={isGovernor && !association} key={actor} value={`occupied:${actor}`}>
              {actorLabels[actor]}
            </option>
          ))}
        </select>
      </label>
      {isGovernor ? (
        <label>
          <span>Presidency</span>
          <select
            aria-describedby={`${role}-association-note`}
            value={association ?? ""}
            onChange={(event) => changeAssociation(event.target.value as PresidencyId)}
          >
            <option disabled value="">
              Choose first
            </option>
            {PRESIDENCIES.map((presidency) => (
              <option key={presidency} value={presidency}>
                {presidency[0].toUpperCase() + presidency.slice(1)}
              </option>
            ))}
          </select>
          <small className="field-note" id={`${role}-association-note`}>
            {!association ? "Required before this Governor enters play." : "\u00a0"}
          </small>
        </label>
      ) : null}
    </div>
  );
}
