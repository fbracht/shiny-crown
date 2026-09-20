import { useState } from "react";
import crisisImageUrl from "../../docs/source-analysis/assets/combined-aid/p17-Image168.png";
import { ROUND_FLOW } from "../flow/flowDefinition";
import { useSession } from "../app/session/SessionContext";
import { SourceNote } from "./SourceNote";
import { basicFavors, crisisBranches, glossaryEntries } from "../content/en/references";
import { votingPlan } from "../content/en/soloLate";

export type ReferenceId =
  | "glossary"
  | "favors"
  | "success"
  | "crisis"
  | "voting"
  | "button";

const referenceLabels: Record<ReferenceId, string> = {
  glossary: "Glossary",
  favors: "Basic Favors",
  success: "Success Checks",
  crisis: "Crisis",
  voting: "Voting Plan",
  button: "Player Button",
};

function favorsAreActive(phaseId: string) {
  const start = ROUND_FLOW.indexOf("round.firms");
  const end = ROUND_FLOW.indexOf("round.company-revenue");
  const current = ROUND_FLOW.indexOf(phaseId as (typeof ROUND_FLOW)[number]);
  return current >= start && current <= end;
}

export function ReferenceLibrary({ initial = "glossary" }: { initial?: ReferenceId }) {
  const { session, dispatch } = useSession();
  const [selected, setSelected] = useState<ReferenceId>(initial);
  const available = (Object.keys(referenceLabels) as ReferenceId[]).filter(
    (id) => id !== "button" || session.mode === "two-player",
  );
  const favorsActive = favorsAreActive(session.progress.phaseId);

  return (
    <div className="reference-library">
      <nav aria-label="Reference sections" className="reference-tabs">
        {available.map((id) => (
          <button
            aria-pressed={selected === id}
            key={id}
            onClick={() => setSelected(id)}
            type="button"
          >
            {referenceLabels[id]}
          </button>
        ))}
      </nav>

      {selected === "glossary" ? (
        <section aria-labelledby="reference-glossary">
          <h3 id="reference-glossary">Glossary</h3>
          <dl className="reference-definitions">
            {glossaryEntries.map(([term, definition]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{definition}</dd>
              </div>
            ))}
          </dl>
          <SourceNote
            sources={[
              {
                document: "aid-v3.2",
                pages: [1],
                section: "Definitions",
                mode: "solo",
                use: "primary",
              },
            ]}
          />
        </section>
      ) : null}

      {selected === "favors" ? (
        <section aria-labelledby="reference-favors">
          <h3 id="reference-favors">Basic Favors</h3>
          <p className={favorsActive ? "reference-availability is-active" : "reference-availability"}>
            {favorsActive
              ? "Available now: from the Firms boundary through the end of Company Revenue."
              : "Readable now; unavailable outside the Firms-through-Company-Revenue window."}
          </p>
          <div className="reference-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asset or payment</th>
                  <th>Give to Crown</th>
                  <th>Take from Crown</th>
                </tr>
              </thead>
              <tbody>
                {basicFavors.map(([asset, give, take]) => (
                  <tr key={asset}>
                    <th>{asset}</th>
                    <td>{give}</td>
                    <td>{take}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote
            sources={[
              {
                document: "aid-v3.2",
                pages: [1],
                section: "Basic Favours",
                assetIds: ["aid.p01.Image28"],
                mode: "solo",
                use: "primary",
              },
            ]}
          />
        </section>
      ) : null}

      {selected === "success" ? (
        <section aria-labelledby="reference-success">
          <h3 id="reference-success">Success Checks</h3>
          <p>Gather dice from the acting office's resources, apply every penalty, then use the lowest die.</p>
          <ol>
            <li><strong>1–2:</strong> success.</li>
            <li><strong>3–4:</strong> failure; try again if sufficient resources remain.</li>
            <li><strong>5–6:</strong> catastrophic failure; stop acting, return the officeholder to supply, clear fatigue, and place the office card in Vacant Offices.</li>
          </ol>
          <SourceNote
            sources={[
              {
                document: "aid-v3.2",
                pages: [4],
                section: "Success Checks",
                mode: "solo",
                use: "primary",
              },
              {
                document: "rules",
                pages: [17],
                section: "Success Checks",
                mode: "shared",
                use: "clarification",
              },
            ]}
          />
        </section>
      ) : null}

      {selected === "crisis" ? (
        <section aria-labelledby="reference-crisis">
          <h3 id="reference-crisis">Crisis / Rebellion / Invasion</h3>
          <div className="crisis-pan" tabIndex={0} aria-label="Scrollable Crisis flowchart">
            <img alt="Crisis, rebellion, and invasion resolution flowchart" src={crisisImageUrl} />
          </div>
          <div className="crisis-text">
            {crisisBranches.map((branch) => (
              <section key={branch.title}>
                <h4>{branch.title}</h4>
                <p>{branch.text}</p>
              </section>
            ))}
            <h4>Region Loss</h4>
            <ol>
              <li>Remove the Commander and half their trophies, rounded up.</li>
              <li>Make death checks for Officers.</li>
              <li>Eliminate the Governor position unless Governor General is in play.</li>
              <li>Remove unrest and half-built Company ships; place a level-one tower and invasion flag where applicable.</li>
              <li>Return the control marker facedown.</li>
              <li>Close orders, Cascading if already closed.</li>
              <li>Lower Company Standing by regions lost this turn.</li>
            </ol>
          </div>
          <SourceNote
            sources={[
              {
                document: "aid-v3.2",
                pages: [17],
                section: "Crisis/Rebellion/Invasion Resolution",
                assetIds: ["aid.p17.Image168"],
                mode: "solo",
                use: "primary",
              },
              {
                document: "rules",
                pages: [29, 32, 33],
                section: "Crisis and Region Loss",
                mode: "shared",
                use: "clarification",
              },
            ]}
          />
        </section>
      ) : null}

      {selected === "voting" ? (
        <section aria-labelledby="reference-voting">
          <h3 id="reference-voting">Crown Voting Plan</h3>
          <p>Unless a row says otherwise, Crown votes against when its listed For condition is false.</p>
          <div className="reference-table-wrap">
            <table>
              <thead><tr><th>Law</th><th>For / special instruction</th></tr></thead>
              <tbody>
                {votingPlan.map(([law, rule]) => (
                  <tr key={law}><th>{law}</th><td>{rule}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote
            sources={[
              {
                document: "aid-v3.2",
                pages: [20],
                section: "Crown Voting Plan",
                assetIds: ["aid.p20.Image194"],
                mode: "solo",
                use: "primary",
              },
            ]}
          />
        </section>
      ) : null}

      {selected === "button" && session.twoPlayer ? (
        <section aria-labelledby="reference-button">
          <h3 id="reference-button">Player Button</h3>
          <p>
            When Crown must choose between the two humans, or both humans dispute who acts, the
            holder decides and immediately passes the Button. Negotiated transfer is always allowed.
          </p>
          <p>Current holder: <strong>{session.playerNames[session.twoPlayer.buttonHolder]}</strong></p>
          <button
            onClick={() => dispatch({ type: "resolve-button-choice", pass: true })}
            type="button"
          >
            Resolve choice and pass
          </button>
          <SourceNote
            sources={[
              {
                document: "rules",
                pages: [44, 46],
                section: "The Player Button",
                mode: "two-player",
                use: "replacement",
              },
            ]}
          />
        </section>
      ) : null}
    </div>
  );
}
