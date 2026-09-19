import type { SourceRef } from "../content/en/phases";

const names: Record<SourceRef["document"], string> = {
  "aid-v3.2": "Combined aid v3.2",
  rules: "Rules",
  "crown-handbook": "Crown Handbook",
};

export function SourceNote({ sources }: { sources: SourceRef[] }) {
  return (
    <details className="source-note">
      <summary>Source notes</summary>
      <ul>
        {sources.map((source) => (
          <li key={`${source.document}-${source.pages.join("-")}-${source.section}`}>
            {names[source.document]}, {source.pages.length === 1 ? "p" : "pp"}
            {source.pages.join("–")} — {source.section} ({source.use})
          </li>
        ))}
      </ul>
    </details>
  );
}
