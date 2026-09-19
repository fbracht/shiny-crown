import type { ComponentType } from "react";
import type { PhaseId } from "../app/session/types";
import {
  BonusesPhase,
  ChairmanPhase,
  ConfigurePhase,
  DeregulationPhase,
  FirmRevenuePhase,
  GenericPhase,
  HiringPhase,
  PresidencyPhase,
  ScoringPhase,
  SetupAiPhase,
  SetupCardsPhase,
  SetupFinishPhase,
  TradeDirectoratePhase,
} from "../phases/PhaseViews";
import { BombayPresidencyPhase } from "../phases/BombayPresidencyPhase";

type PhaseComponent = ComponentType;

const generic =
  (phaseId: PhaseId): PhaseComponent =>
  () => <GenericPhase phaseId={phaseId} />;
const presidency =
  (phaseId: PhaseId): PhaseComponent =>
  () => <PresidencyPhase phaseId={phaseId} />;

export const phaseRegistry: Record<PhaseId, PhaseComponent> = {
  "setup.configure": ConfigurePhase,
  "setup.table": generic("setup.table"),
  "setup.crown": generic("setup.crown"),
  "setup.cards": SetupCardsPhase,
  "setup.finish": SetupFinishPhase,
  "setup.ai": SetupAiPhase,
  "round.deregulation-vote": DeregulationPhase,
  "round.london-season": generic("round.london-season"),
  "round.family": generic("round.family"),
  "round.firms": generic("round.firms"),
  "round.hiring": HiringPhase,
  "round.chairman": ChairmanPhase,
  "round.trade-directorate": TradeDirectoratePhase,
  "round.shipping": generic("round.shipping"),
  "round.military-affairs": generic("round.military-affairs"),
  "round.presidency.bombay": BombayPresidencyPhase,
  "round.presidency.madras": presidency("round.presidency.madras"),
  "round.presidency.bengal": presidency("round.presidency.bengal"),
  "round.china": generic("round.china"),
  "round.bonuses": BonusesPhase,
  "round.firm-revenue": FirmRevenuePhase,
  "round.company-revenue": generic("round.company-revenue"),
  "round.events-india": generic("round.events-india"),
  "round.parliament": generic("round.parliament"),
  "round.upkeep-refresh": generic("round.upkeep-refresh"),
  "game.scoring": ScoringPhase,
};
