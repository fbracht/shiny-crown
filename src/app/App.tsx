import { useState } from "react";
import { GameShell } from "./GameShell";
import { LandingScreen } from "./LandingScreen";
import { loadPersistedSession, persistSession, type StorageLike } from "./session/persistence";
import { SessionProvider } from "./session/SessionContext";
import type { GameSessionV1 } from "./session/types";

export function App({ storage = window.localStorage }: { storage?: StorageLike }) {
  const [loadResult, setLoadResult] = useState(() => loadPersistedSession(storage));
  const [activeSession, setActiveSession] = useState<GameSessionV1 | null>(null);

  const open = (session: GameSessionV1) => {
    persistSession(storage, session);
    setLoadResult({ status: "loaded", session, migrated: false });
    setActiveSession(session);
  };

  const home = () => {
    setActiveSession(null);
    setLoadResult(loadPersistedSession(storage));
  };

  if (activeSession) {
    return (
      <SessionProvider initialSession={activeSession} storage={storage}>
        <GameShell onHome={home} />
      </SessionProvider>
    );
  }

  return (
    <LandingScreen
      loadError={loadResult.status === "error" ? loadResult.message : null}
      onOpen={open}
      savedSession={loadResult.status === "loaded" ? loadResult.session : null}
    />
  );
}
