import { CLIMATES, type ClimateId } from "../app/session/types";

const labels: Record<ClimateId, string> = {
  bull: "Bull",
  stag: "Stag",
  lion: "Lion",
  bear: "Bear",
  peacock: "Peacock",
};

type ClimateSelectorProps = {
  value: ClimateId;
  onChange: (climate: ClimateId) => void;
  compact?: boolean;
};

export function ClimateSelector({ value, onChange, compact = false }: ClimateSelectorProps) {
  return (
    <fieldset className={compact ? "climate climate--compact" : "climate"}>
      <legend>Crown climate</legend>
      <div className="climate__choices">
        {CLIMATES.map((climate) => (
          <button
            aria-pressed={value === climate}
            className="climate__choice"
            data-active={value === climate || undefined}
            key={climate}
            onClick={() => onChange(climate)}
            type="button"
          >
            <span className="climate__mark" aria-hidden="true">
              {labels[climate].slice(0, 1)}
            </span>
            <span>{labels[climate]}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
