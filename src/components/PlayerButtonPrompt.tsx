import { playerLabel } from "../app/session/playerLabels";
import { useSession } from "../app/session/SessionContext";

export function PlayerButtonPrompt({
  children,
  passAfterChoice = false,
}: {
  children: React.ReactNode;
  passAfterChoice?: boolean;
}) {
  const { session, dispatch } = useSession();
  if (!session.twoPlayer) return null;
  return (
    <aside className="branch-note player-button-prompt">
      <strong>
        Player Button ·{" "}
        {playerLabel(session.mode, session.playerNames, session.twoPlayer.buttonHolder)}
      </strong>
      <p>{children}</p>
      {passAfterChoice ? (
        <button
          onClick={() => dispatch({ type: "resolve-button-choice", pass: true })}
          type="button"
        >
          Resolve choice and pass Button
        </button>
      ) : null}
    </aside>
  );
}
