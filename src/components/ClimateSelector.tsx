import { useId, useRef, useState } from "react";
import { CLIMATES, type ClimateId } from "../app/session/types";

const labels: Record<ClimateId, string> = {
  bull: "Bull",
  stag: "Stag",
  lion: "Lion",
  bear: "Bear",
  peacock: "Peacock",
};

const icons: Record<ClimateId, string> = {
  bull: "🐂",
  stag: "🦌",
  lion: "🦁",
  bear: "🐻",
  peacock: "🦚",
};

type ClimateSelectorProps = {
  value: ClimateId;
  onChange: (climate: ClimateId) => void;
  compact?: boolean;
};

export function ClimateSelector({ value, onChange, compact = false }: ClimateSelectorProps) {
  const [open, setOpen] = useState(false);
  const choicesId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeCompactSelector = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  if (compact) {
    return (
      <div
        className="climate climate--compact"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            closeCompactSelector();
          }
        }}
      >
        <button
          aria-controls={choicesId}
          aria-expanded={open}
          aria-label={`Crown climate: ${labels[value]}. Change climate`}
          className="climate__current"
          onClick={() => setOpen((current) => !current)}
          ref={triggerRef}
          title={`Crown climate: ${labels[value]}`}
          type="button"
        >
          <span aria-hidden="true">{icons[value]}</span>
        </button>
        {open ? (
          <div
            aria-label="Choose Crown climate"
            className="climate__bar"
            id={choicesId}
            role="group"
          >
            {CLIMATES.map((climate) => (
              <button
                aria-label={labels[climate]}
                aria-pressed={value === climate}
                className="climate__bar-choice"
                key={climate}
                onClick={() => {
                  onChange(climate);
                  closeCompactSelector();
                }}
                title={labels[climate]}
                type="button"
              >
                <span aria-hidden="true">{icons[climate]}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <fieldset className="climate">
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
              {icons[climate]}
            </span>
            <span>{labels[climate]}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
