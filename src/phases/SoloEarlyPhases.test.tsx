import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createInitialSession, createPhaseState, occupied } from "../app/session/factories";
import { sessionReducer } from "../app/session/reducer";
import { SessionProvider } from "../app/session/SessionContext";
import type { GameSessionV1, PhaseId } from "../app/session/types";
import { MemoryStorage } from "../test/MemoryStorage";
import { SoloFamilyPhase, SoloFirmsPhase, SoloLondonSeasonPhase } from "./SoloEarlyPhases";

function atPhase(session: GameSessionV1, phaseId: PhaseId): GameSessionV1 {
  return {
    ...session,
    progress: { phaseId, phaseState: createPhaseState(phaseId), endReason: null },
  };
}

describe("solo early-round phases", () => {
  it("shows only the sourced first-turn London Season skip", () => {
    const session = atPhase(createInitialSession("solo"), "round.london-season");
    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <SoloLondonSeasonPhase />
      </SessionProvider>,
    );

    expect(
      screen.getByText("Skip the entire London Season on the first turn."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Attrition" })).not.toBeInTheDocument();
  });

  it("orders London Season, exposes attrition vacancy controls, and gates special retirement", async () => {
    const user = userEvent.setup();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "chairman",
      assignment: occupied("human-1"),
    });
    session = { ...session, firstTurn: false, deregulated: true };
    session = atPhase(session, "round.london-season");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <SoloLondonSeasonPhase />
      </SessionProvider>,
    );

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings).toEqual(["Attrition", "Retirements", "Special Retirement", "Prestige Cards"]);
    expect(screen.getByText(/half its current family treasury, rounded up/u)).toBeInTheDocument();
    expect(screen.getByText(/AI-card position/u)).toBeInTheDocument();

    const holder = screen.getByRole("group", { name: "Chairman holder" });
    await user.click(within(holder).getByRole("button", { name: "Chairman: Vacant" }));
    expect(screen.queryByRole("group", { name: "Chairman holder" })).not.toBeInTheDocument();
  });

  it("shows the active Crown Family queue, two normal actions, and separate extra action", () => {
    let session = createInitialSession("solo");
    session = { ...session, climate: "bear", firstTurn: false };
    session = atPhase(session, "round.family");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <SoloFamilyPhase />
      </SessionProvider>,
    );

    const crownSection = screen
      .getByRole("heading", { name: "Crown actions · Bear" })
      .closest("section");
    expect(crownSection).not.toBeNull();
    expect(
      within(crownSection as HTMLElement).getByText(/takes two normal actions/u),
    ).toBeInTheDocument();
    expect(
      within(crownSection as HTMLElement).getByText(/additional to those two/u),
    ).toBeInTheDocument();
    expect(
      within(crownSection as HTMLElement)
        .getAllByRole("listitem")
        .slice(0, 5)
        .map((item) => item.textContent),
    ).toEqual(["Enlist Officer", "Buy Luxury", "Buy Workshop", "Enlist Officer", "Enlist Writer"]);
    expect(
      screen.getByText("Give a firm share to Crown, without giving Crown a majority."),
    ).toBeInTheDocument();
  });

  it("renders the solo Firms procedure only after Deregulation and filters investment by climate", () => {
    let session = createInitialSession("solo");
    session = { ...session, climate: "lion", deregulated: true };
    session = atPhase(session, "round.firms");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <SoloFirmsPhase />
      </SessionProvider>,
    );

    expect(screen.getByText(/Crown's default is to make one investment/u)).toBeInTheDocument();
    expect(screen.getByText("Prevent Crown's investment.")).toBeInTheDocument();
    expect(
      screen.getByText("Neither hostile takeovers nor mergers occur in a solo game."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Keep the strategy face down/u)).toBeInTheDocument();
  });

  it("does not invent two-player early-round procedures", () => {
    const session = atPhase(createInitialSession("two-player"), "round.family");
    const { container } = render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <SoloFamilyPhase />
      </SessionProvider>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
