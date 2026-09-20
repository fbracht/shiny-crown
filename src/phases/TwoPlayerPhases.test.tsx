import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createInitialSession, createPhaseState, occupied } from "../app/session/factories";
import { SessionProvider } from "../app/session/SessionContext";
import { PHASE_IDS, type GameSessionV1, type PhaseId } from "../app/session/types";
import { phaseCopy } from "../content/en/phases";
import { phaseRegistry } from "../flow/phaseRegistry";
import { FirmRevenuePhase } from "./PhaseViews";
import { ParliamentPhase, ScoringPhase } from "./SoloLatePhases";
import { MilitaryAffairsPhase, ShippingPhase } from "./SoloOperationsPhases";
import { TwoPlayerFamilyPhase, TwoPlayerFirmsPhase } from "./TwoPlayerEarlyPhases";

function atPhase(session: GameSessionV1, phaseId: PhaseId): GameSessionV1 {
  return {
    ...session,
    progress: { phaseId, phaseState: createPhaseState(phaseId), endReason: null },
  };
}

function renderPhase(session: GameSessionV1, node: React.ReactNode) {
  return render(<SessionProvider initialSession={session}>{node}</SessionProvider>);
}

describe("two-player replacement procedures", () => {
  it("uses one Crown Family action and the Button investment sequence", async () => {
    const user = userEvent.setup();
    const session = { ...createInitialSession("two-player", "1813"), firstTurn: false };
    const { rerender } = renderPhase(session, <TwoPlayerFamilyPhase />);
    expect(screen.getByText(/exactly one normal action/u)).toBeInTheDocument();

    rerender(
      <SessionProvider initialSession={session}>
        <TwoPlayerFirmsPhase />
      </SessionProvider>,
    );
    expect(screen.queryByText(/Prevent Crown's investment/u)).not.toBeInTheDocument();
    expect(screen.getByText(/Player Button · Player 1/u)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Resolve choice and pass Button/u }));
    expect(screen.getByText(/Player Button · Player 2/u)).toBeInTheDocument();
  });

  it("keeps both humans available for Commander assignment and ship arbitration", () => {
    let session = atPhase(createInitialSession("two-player"), "round.military-affairs");
    session.roles.militaryAffairs = occupied("crown");
    const { rerender } = renderPhase(session, <MilitaryAffairsPhase />);
    for (const presidency of ["Bombay", "Madras", "Bengal"]) {
      expect(
        within(screen.getByRole("group", { name: `${presidency} Commander` })).getByRole("button", {
          name: "Player 2",
        }),
      ).toBeInTheDocument();
    }

    session = atPhase(session, "round.shipping");
    session.roles.managerOfShipping = occupied("crown");
    rerender(
      <SessionProvider initialSession={session}>
        <ShippingPhase />
      </SessionProvider>,
    );
    expect(screen.getByText(/ships belonging to both humans/u)).toBeInTheDocument();
  });

  it("records the actual Opposition Leader as successor", async () => {
    const user = userEvent.setup();
    const session = atPhase(createInitialSession("two-player"), "round.parliament");
    session.roles.primeMinister = occupied("human-1");
    renderPhase(session, <ParliamentPhase />);

    await user.click(screen.getByRole("button", { name: /Record Player 2 as Opposition Leader/u }));
    await user.click(
      screen.getByRole("button", { name: /Failed law: Opposition Leader becomes Prime Minister/u }),
    );
    expect(screen.getByRole("button", { name: "Player 2" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByText(/Crown becomes Prime Minister/u)).not.toBeInTheDocument();
  });

  it("restores multiplayer firm comparison and Power awards", () => {
    let session = atPhase(createInitialSession("two-player", "1813"), "round.firm-revenue");
    const { rerender } = renderPhase(session, <FirmRevenuePhase />);
    expect(screen.getByText(/each human family separately/u)).toBeInTheDocument();

    session = atPhase(session, "game.scoring");
    session.progress.endReason = "company-failure";
    rerender(
      <SessionProvider initialSession={session}>
        <ScoringPhase />
      </SessionProvider>,
    );
    expect(screen.getByText(/Award first and second Power prizes/u)).toBeInTheDocument();
    expect(screen.queryByText(/Solo failure adjustment/u)).not.toBeInTheDocument();
  });

  it("registers a bespoke component for every phase", () => {
    for (const [phaseId, Component] of Object.entries(phaseRegistry)) {
      expect(Component.name, phaseId).not.toMatch(/Generic/u);
    }
  });

  for (const mode of ["solo", "two-player"] as const) {
    it(`renders every registered phase in ${mode} mode`, () => {
      for (const phaseId of PHASE_IDS) {
        const session = atPhase(createInitialSession(mode, "1813"), phaseId);
        const Component = phaseRegistry[phaseId];
        renderPhase(session, <Component />);
        expect(
          screen.getByRole("heading", { level: 1, name: phaseCopy[phaseId].title }),
        ).toBeVisible();
        cleanup();
      }
    });
  }
});
