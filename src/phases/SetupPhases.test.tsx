import { render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createInitialSession, occupied } from "../app/session/factories";
import { sessionReducer } from "../app/session/reducer";
import { SessionProvider } from "../app/session/SessionContext";
import { SESSION_STORAGE_KEY } from "../app/session/persistence";
import { MemoryStorage } from "../test/MemoryStorage";
import type { GameSessionV1 } from "../app/session/types";
import {
  SetupAiPhase,
  SetupCardsPhase,
  SetupCrownPhase,
  SetupFinishPhase,
  SetupTablePhase,
  ConfigurePhase,
  DeregulationPhase,
} from "./PhaseViews";

function renderPhase(
  session: ReturnType<typeof createInitialSession>,
  phase: ReactNode,
  storage = new MemoryStorage(),
) {
  return render(
    <SessionProvider initialSession={session} storage={storage}>
      {phase}
    </SessionProvider>,
  );
}

describe("source-faithful setup phases", () => {
  it("keeps configuration consequences synchronized with the selected scenario", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    renderPhase(createInitialSession("solo"), <ConfigurePhase />, storage);

    await user.click(screen.getByRole("button", { name: "1813" }));
    expect(screen.getByText(/session starts deregulated/u)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Two players" }));
    expect(screen.getByRole("button", { name: "Legendary" })).toBeDisabled();

    await waitFor(() => {
      const saved = storage.getItem(SESSION_STORAGE_KEY);
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved as string)).toMatchObject({
        mode: "two-player",
        scenario: "1813",
        deregulated: true,
      });
    });
  });

  it("renders all ten common table steps in source order and the selected scenario boundary", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, { type: "set-scenario", scenario: "1813" });

    renderPhase(session, <SetupTablePhase />);

    const procedure = document.querySelector(".procedure-list--setup");
    expect(procedure).not.toBeNull();
    const steps = within(procedure as HTMLElement)
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(steps).toHaveLength(10);
    expect(steps[0]).toMatch(/game board and component trays/u);
    expect(steps[3]).toMatch(/Company Balance marker on 5/u);
    expect(steps[9]).toMatch(/physical setup card/u);
    expect(screen.getByText(/session starts deregulated/u)).toBeInTheDocument();
    expect(screen.getByText(/do not contain the scenario-card values/u)).toBeInTheDocument();
  });

  it("calculates the solo Expert Crown materials without creating a cube ledger", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, { type: "set-difficulty", difficulty: "expert" });

    renderPhase(session, <SetupCrownPhase />);

    const allocation = screen.getByLabelText("Initial promise cube distribution");
    expect(within(allocation).getByText("You").nextElementSibling).toHaveTextContent("2");
    expect(within(allocation).getByText("Crown").nextElementSibling).toHaveTextContent("10");
    expect(screen.getByText(/3 extra setup cards/u)).toBeInTheDocument();
    expect(screen.getByText(/Do not use promise cards/u)).toBeInTheDocument();
  });

  it("uses saved player names and preserves the 4/4/4 Easy distribution", () => {
    let session = createInitialSession("two-player");
    session = sessionReducer(session, {
      type: "set-player-name",
      player: "human-1",
      name: "Alice",
    });
    session = sessionReducer(session, {
      type: "set-player-name",
      player: "human-2",
      name: "Bruno",
    });
    session = sessionReducer(session, { type: "set-difficulty", difficulty: "easy" });

    renderPhase(session, <SetupCrownPhase />);

    const allocation = screen.getByLabelText("Initial promise cube distribution");
    for (const label of ["Alice", "Bruno", "Crown"]) {
      expect(within(allocation).getByText(label).nextElementSibling).toHaveTextContent("4");
    }
    expect(screen.getByText(/Give each human/u)).toHaveTextContent("5 promise cards");
  });

  it("presents the scoped solo setup-card procedure and four-round total", () => {
    renderPhase(createInitialSession("solo"), <SetupCardsPhase />);

    expect(screen.getByText(/Draw 3 setup cards/u)).toHaveTextContent(
      "Keep 1 and give the other 2 to the Crown",
    );
    expect(screen.getByText(/4 rounds total/u)).toBeInTheDocument();
    expect(screen.getByText("You: 4 · Crown: 8")).toBeInTheDocument();
    expect(screen.queryByText(/draft variant/u)).not.toBeInTheDocument();
  });

  it("finishes common setup in steps 11–13 before the role ledger", () => {
    renderPhase(createInitialSession("solo"), <SetupFinishPhase />);

    const section = screen.getByRole("heading", { name: "Finish the common setup" }).closest(
      "section",
    );
    expect(section).not.toBeNull();
    const steps = within(section as HTMLElement).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveTextContent("remaining office cards");
    expect(steps[1]).toHaveTextContent("London Season display");
    expect(steps[2]).toHaveTextContent("remaining law cards");
    expect(screen.getByRole("heading", { name: "Role ledger" })).toBeInTheDocument();
  });

  it("sets the initial two-player Button by saved player name", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    let session = createInitialSession("two-player");
    session = sessionReducer(session, {
      type: "set-player-name",
      player: "human-1",
      name: "Alice",
    });
    session = sessionReducer(session, {
      type: "set-player-name",
      player: "human-2",
      name: "Bruno",
    });

    renderPhase(session, <SetupAiPhase />, storage);
    await user.click(screen.getByRole("button", { name: "Bruno" }));

    expect(screen.getByText(/Later AI cards do not reset/u)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bruno" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => {
      const saved = storage.getItem(SESSION_STORAGE_KEY);
      expect(saved).not.toBeNull();
      expect((JSON.parse(saved as string) as GameSessionV1).twoPlayer?.buttonHolder).toBe("human-2");
    });
  });
});

describe("Vote to Deregulate", () => {
  it("prevents a voluntary Crown-PM vote but requires the vote on a star", async () => {
    const user = userEvent.setup();
    let session = createInitialSession("solo", "1758");
    session = sessionReducer(session, {
      type: "set-role",
      role: "primeMinister",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, { type: "set-climate", climate: "peacock" });
    renderPhase(session, <DeregulationPhase />);

    await user.click(screen.getByRole("button", { name: "Lined space" }));
    expect(screen.getByText(/does not voluntarily initiate/u)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Vote passed" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Star space" }));
    expect(screen.getByText(/must initiate/u)).toBeInTheDocument();
    expect(screen.getByText(/Crown may spend up to/u)).toHaveTextContent("£2");
    expect(screen.getByRole("button", { name: "Vote passed" })).toBeInTheDocument();
  });

  it("activates Deregulation only on a passed vote and shows the sourced consequences", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    let session = createInitialSession("solo", "long-1710");
    session = sessionReducer(session, {
      type: "set-role",
      role: "primeMinister",
      assignment: occupied("human-1"),
    });
    renderPhase(session, <DeregulationPhase />, storage);

    await user.click(screen.getByRole("button", { name: "Lined space" }));
    await user.click(screen.getByRole("button", { name: "Vote failed" }));
    expect(screen.getByText(/remains in power/u)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Vote passed" }));
    expect(screen.getByText(/reset Company Standing to S/u)).toBeInTheDocument();
    await waitFor(() => {
      const saved = storage.getItem(SESSION_STORAGE_KEY);
      expect(saved).not.toBeNull();
      expect((JSON.parse(saved as string) as GameSessionV1).deregulated).toBe(true);
    });
  });
});
