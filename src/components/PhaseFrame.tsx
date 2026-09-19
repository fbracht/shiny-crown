import type { PropsWithChildren, ReactNode } from "react";
import type { PhaseCopy } from "../content/en/phases";
import { SourceNote } from "./SourceNote";

type PhaseFrameProps = PropsWithChildren<{
  copy: PhaseCopy;
  status?: ReactNode;
}>;

export function PhaseFrame({ copy, status, children }: PhaseFrameProps) {
  return (
    <article className="phase">
      <header className="phase__header">
        <div>
          <p className="phase__context">Current procedure</p>
          <h1>{copy.title}</h1>
          <p className="phase__summary">{copy.summary}</p>
        </div>
        {status ? <div className="phase__status">{status}</div> : null}
      </header>
      <div className="phase__body">{children}</div>
      <SourceNote sources={copy.sources} />
    </article>
  );
}
