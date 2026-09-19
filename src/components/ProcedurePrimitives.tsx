import type { ReactNode } from "react";

export function RuleSection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rule-section">
      <header>
        {number ? <span aria-hidden="true">{number}</span> : null}
        <h2>{title}</h2>
      </header>
      <div className="rule-section__body">{children}</div>
    </section>
  );
}

export function Favor({ children, cost }: { children: ReactNode; cost: string }) {
  return (
    <aside className="favor-callout">
      <strong>{cost}</strong>
      <span>{children}</span>
    </aside>
  );
}

export function ModeNote({ children }: { children: ReactNode }) {
  return (
    <aside className="mode-note">
      <span>Two players</span>
      <p>{children}</p>
    </aside>
  );
}
