import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { persistSession, type StorageLike } from "./persistence";
import { sessionReducer, type SessionAction } from "./reducer";
import type { GameSessionV1 } from "./types";

type SessionContextValue = {
  session: GameSessionV1;
  dispatch: Dispatch<SessionAction>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

type SessionProviderProps = PropsWithChildren<{
  initialSession: GameSessionV1;
  storage?: StorageLike;
}>;

export function SessionProvider({
  initialSession,
  storage = window.localStorage,
  children,
}: SessionProviderProps) {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);

  useEffect(() => {
    persistSession(storage, session);
  }, [session, storage]);

  const value = useMemo(() => ({ session, dispatch }), [session]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// The hook intentionally shares this module with its provider so the context remains private.
// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider.");
  return value;
}
