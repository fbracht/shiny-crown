import { useSession } from "../app/session/SessionContext";
import { SoloFamilyPhase, SoloFirmsPhase, SoloLondonSeasonPhase } from "./SoloEarlyPhases";
import {
  TwoPlayerFamilyPhase,
  TwoPlayerFirmsPhase,
  TwoPlayerLondonSeasonPhase,
} from "./TwoPlayerEarlyPhases";

export function LondonSeasonPhase() {
  const { session } = useSession();
  return session.mode === "solo" ? <SoloLondonSeasonPhase /> : <TwoPlayerLondonSeasonPhase />;
}

export function FamilyPhase() {
  const { session } = useSession();
  return session.mode === "solo" ? <SoloFamilyPhase /> : <TwoPlayerFamilyPhase />;
}

export function FirmsPhase() {
  const { session } = useSession();
  return session.mode === "solo" ? <SoloFirmsPhase /> : <TwoPlayerFirmsPhase />;
}
