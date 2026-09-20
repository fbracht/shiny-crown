import type { ComponentType } from "react";
import type { PhaseId } from "../app/session/types";
import {
  BonusesPhase,
  ChairmanPhase,
  ConfigurePhase,
  DeregulationPhase,
  FirmRevenuePhase,
  HiringPhase,
  SetupAiPhase,
  SetupCardsPhase,
  SetupCrownPhase,
  SetupFinishPhase,
  SetupTablePhase,
} from "../phases/PhaseViews";
import { PresidencyPhase } from "../phases/BombayPresidencyPhase";
import { FamilyPhase, FirmsPhase, LondonSeasonPhase } from "../phases/ModeAwareEarlyPhases";
import {
  CompanyRevenuePhase,
  EventsIndiaPhase,
  ParliamentPhase,
  ScoringPhase,
  UpkeepRefreshPhase,
} from "../phases/SoloLatePhases";
import {
  ChinaPhase,
  MilitaryAffairsPhase,
  ShippingPhase,
  TradeDirectoratePhase,
} from "../phases/SoloOperationsPhases";

type PhaseComponent = ComponentType;

const presidency =
  (presidencyId: "bombay" | "madras" | "bengal"): PhaseComponent =>
  () => <PresidencyPhase presidency={presidencyId} />;

export const phaseRegistry: Record<PhaseId, PhaseComponent> = {
  "setup.configure": ConfigurePhase,
  "setup.table": SetupTablePhase,
  "setup.crown": SetupCrownPhase,
  "setup.cards": SetupCardsPhase,
  "setup.finish": SetupFinishPhase,
  "setup.ai": SetupAiPhase,
  "round.deregulation-vote": DeregulationPhase,
  "round.london-season": LondonSeasonPhase,
  "round.family": FamilyPhase,
  "round.firms": FirmsPhase,
  "round.hiring": HiringPhase,
  "round.chairman": ChairmanPhase,
  "round.trade-directorate": TradeDirectoratePhase,
  "round.shipping": ShippingPhase,
  "round.military-affairs": MilitaryAffairsPhase,
  "round.presidency.bombay": presidency("bombay"),
  "round.presidency.madras": presidency("madras"),
  "round.presidency.bengal": presidency("bengal"),
  "round.china": ChinaPhase,
  "round.bonuses": BonusesPhase,
  "round.firm-revenue": FirmRevenuePhase,
  "round.company-revenue": CompanyRevenuePhase,
  "round.events-india": EventsIndiaPhase,
  "round.parliament": ParliamentPhase,
  "round.upkeep-refresh": UpkeepRefreshPhase,
  "game.scoring": ScoringPhase,
};
