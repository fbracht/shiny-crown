import { playerLabel } from "../app/session/playerLabels";
import { getRole, ROLE_LABELS } from "../app/session/roles";
import { useSession } from "../app/session/SessionContext";
import type {
  ActorId,
  GovernorAssignment,
  PresidencyId,
  RoleAssignment,
  RoleRef,
} from "../app/session/types";
import { PRESIDENCIES } from "../app/session/types";

function actorsForMode(mode: "solo" | "two-player"): ActorId[] {
  return mode === "solo" ? ["human-1", "crown"] : ["human-1", "human-2", "crown"];
}

function withPrevious(current: RoleAssignment, assignment: RoleAssignment): RoleAssignment {
  const previousOccupant =
    current.status === "occupied" ? current.occupant : current.previousOccupant;
  return previousOccupant === undefined ? assignment : { ...assignment, previousOccupant };
}

export function RoleEditor({ role, holderOnly = false }: { role: RoleRef; holderOnly?: boolean }) {
  const { session, dispatch } = useSession();
  const assignment = getRole(session.roles, role);
  const isGovernor = role.startsWith("governor:");
  const association = (assignment as GovernorAssignment).associatedPresidency;

  if (holderOnly && assignment.status === "not-in-play") return null;

  const update = (next: RoleAssignment) => {
    dispatch({
      type: "set-role",
      role,
      assignment:
        isGovernor && next.status !== "not-in-play"
          ? { ...next, associatedPresidency: association }
          : next,
    });
  };

  const setHolder = (holder: ActorId | "vacant") => {
    update(
      withPrevious(
        assignment,
        holder === "vacant" ? { status: "vacant" } : { status: "occupied", occupant: holder },
      ),
    );
  };

  const setInPlay = (inPlay: boolean) => {
    if (!inPlay) {
      update(withPrevious(assignment, { status: "not-in-play" }));
      return;
    }
    if (isGovernor && !association) return;
    update(withPrevious(assignment, { status: "vacant" }));
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
      <div className="role-editor__heading">
        <span>{ROLE_LABELS[role]}</span>
        {!holderOnly ? (
          <button
            aria-pressed={assignment.status !== "not-in-play"}
            className="role-editor__availability"
            disabled={isGovernor && !association}
            onClick={() => setInPlay(assignment.status === "not-in-play")}
            type="button"
          >
            {assignment.status === "not-in-play" ? "Add" : "In play"}
          </button>
        ) : null}
      </div>

      {isGovernor && !holderOnly ? (
        <label className="role-editor__association">
          <span>Presidency</span>
          <select
            aria-describedby={`${role}-association-note`}
            value={association ?? ""}
            onChange={(event) => changeAssociation(event.target.value as PresidencyId)}
          >
            <option disabled value="">
              Choose
            </option>
            {PRESIDENCIES.map((presidency) => (
              <option key={presidency} value={presidency}>
                {presidency[0].toUpperCase() + presidency.slice(1)}
              </option>
            ))}
          </select>
          <small className="field-note" id={`${role}-association-note`}>
            {!association ? "Choose a Presidency before adding this Governor." : "\u00a0"}
          </small>
        </label>
      ) : null}

      {assignment.status !== "not-in-play" ? (
        <fieldset className="holder-control">
          <legend>{ROLE_LABELS[role]} holder</legend>
          <div>
            <button
              aria-label={`${ROLE_LABELS[role]}: Vacant`}
              aria-pressed={assignment.status === "vacant"}
              onClick={() => setHolder("vacant")}
              title="Vacant"
              type="button"
            >
              <span aria-hidden="true">—</span>
              <span className="visually-hidden">Vacant</span>
            </button>
            {actorsForMode(session.mode).map((actor) => (
              <button
                aria-pressed={assignment.status === "occupied" && assignment.occupant === actor}
                key={actor}
                onClick={() => setHolder(actor)}
                type="button"
              >
                {playerLabel(session.mode, session.playerNames, actor)}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <span className="role-editor__not-in-play">Not in play</span>
      )}
    </div>
  );
}
