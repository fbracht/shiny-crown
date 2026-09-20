import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  createInitialSession,
  createPhaseState,
  createPresidencyState,
  occupied,
} from "../app/session/factories";
import { sessionReducer } from "../app/session/reducer";
import { SessionProvider } from "../app/session/SessionContext";
import { SESSION_STORAGE_KEY } from "../app/session/persistence";
import type { GameSessionV1, PhaseId } from "../app/session/types";
import { GameShell } from "../app/GameShell";
import { MemoryStorage } from "../test/MemoryStorage";
import { PresidencyPhase } from "./BombayPresidencyPhase";
import { BonusesPhase, ChairmanPhase, HiringPhase } from "./PhaseViews";

function atPhase(session: GameSessionV1, phaseId: PhaseId): GameSessionV1 {
  return {
    ...session,
    progress: { phaseId, phaseState: createPhaseState(phaseId), endReason: null },
  };
}

describe("Session 3 representative slices", () => {
  it("switches the Chairman branch and active climate guidance immediately from the keyboard", async () => {
    const storage = new MemoryStorage();
    const user = userEvent.setup();
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
    session = sessionReducer(session, {
      type: "set-role",
      role: "chairman",
      assignment: occupied("crown"),
    });
    session = atPhase(session, "round.chairman");

    render(
      <SessionProvider initialSession={session} storage={storage}>
        <ChairmanPhase />
      </SessionProvider>,
    );

    expect(
      screen.getByText("Advance once for each Presidency with an open home port."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Opening favor")).not.toBeInTheDocument();

    const peacock = screen.getByRole("button", { name: "Peacock" });
    peacock.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Do not advance the Debt marker by default.")).toBeInTheDocument();

    await user.click(
      within(screen.getByRole("group", { name: "Chairman holder" })).getByRole("button", {
        name: "Alice",
      }),
    );
    expect(screen.getByText("Opening favor")).toBeInTheDocument();
    expect(screen.getByText("Set climate after finishing")).toBeInTheDocument();
    expect(
      screen.queryByText("Do not advance the Debt marker by default."),
    ).not.toBeInTheDocument();
    await waitFor(() => expect(storage.getItem(SESSION_STORAGE_KEY)).not.toBeNull());
  });

  it("uses printed office numbers, excludes not-in-play roles, and preserves promotion side effects", async () => {
    const user = userEvent.setup();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "chairman",
      assignment: occupied("human-1"),
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "managerOfShipping",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, { type: "activate-china" });
    session = sessionReducer(session, {
      type: "create-governor",
      region: "bombay",
      presidency: "bombay",
    });
    session = atPhase(session, "round.hiring");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <HiringPhase />
      </SessionProvider>,
    );

    const queue = screen.getByRole("list", { name: "Vacant offices in hiring order" });
    const numbers = within(queue)
      .getAllByRole("listitem")
      .map((item) => item.querySelector(".office-number")?.textContent);
    expect(numbers).toEqual(["2", "4", "5", "6", "7", "8", "9"]);
    expect(screen.queryByText("Governor General")).not.toBeInTheDocument();
    expect(screen.getAllByText("Military Affairs / Commander in Chief")).toHaveLength(2);

    const directorCard = screen
      .getByRole("heading", { level: 3, name: "Director of Trade" })
      .closest("article");
    expect(directorCard).not.toBeNull();
    await user.selectOptions(
      within(directorCard as HTMLElement).getByLabelText("Tracked promotion source"),
      "managerOfShipping",
    );
    await user.click(
      within(directorCard as HTMLElement).getByRole("button", { name: "Confirm promotion" }),
    );

    expect(
      screen.queryByRole("heading", { level: 3, name: "Director of Trade" }),
    ).not.toBeInTheDocument();
    const updatedQueue = screen.getByRole("list", { name: "Vacant offices in hiring order" });
    expect(within(updatedQueue).getAllByRole("listitem")[0]).toHaveTextContent(
      "Manager of Shipping",
    );
  });

  it("keeps a Governor's Presidency association when Hiring fills the office", async () => {
    const storage = new MemoryStorage();
    const user = userEvent.setup();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "president:bombay",
      assignment: occupied("human-1"),
    });
    session = sessionReducer(session, {
      type: "create-governor",
      region: "bombay",
      presidency: "bombay",
    });
    session = atPhase(session, "round.hiring");

    render(
      <SessionProvider initialSession={session} storage={storage}>
        <HiringPhase />
      </SessionProvider>,
    );

    const governorCard = screen
      .getByRole("heading", { level: 3, name: "Governor of Bombay" })
      .closest("article");
    expect(governorCard).not.toBeNull();
    await user.click(
      within(governorCard as HTMLElement).getByRole("button", { name: "Confirm hire" }),
    );

    await waitFor(() => {
      const saved = storage.getItem(SESSION_STORAGE_KEY);
      expect(saved).not.toBeNull();
      expect((JSON.parse(saved as string) as GameSessionV1).roles.governors.bombay).toMatchObject({
        status: "occupied",
        occupant: "human-1",
        associatedPresidency: "bombay",
      });
    });
  });

  it("persists Bombay local order and updates every Crown action from global climate", async () => {
    const storage = new MemoryStorage();
    const user = userEvent.setup();
    let session = createInitialSession("two-player");
    session = sessionReducer(session, {
      type: "set-role",
      role: "president:bombay",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "commander:bombay",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, {
      type: "create-governor",
      region: "bombay",
      presidency: "bombay",
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "governor:bombay",
      assignment: { status: "occupied", occupant: "crown", associatedPresidency: "bombay" },
    });
    session = {
      ...session,
      progress: {
        phaseId: "round.presidency.bombay",
        phaseState: createPresidencyState("bombay", session.roles),
        endReason: null,
      },
    };

    render(
      <SessionProvider initialSession={session} storage={storage}>
        <GameShell onHome={() => undefined} />
      </SessionProvider>,
    );

    const governorCard = screen
      .getByRole("heading", { level: 3, name: "Governor of Bombay" })
      .closest("section");
    expect(governorCard).not.toBeNull();
    await user.click(
      within(governorCard as HTMLElement).getByRole("button", {
        name: "Move Governor of Bombay later",
      }),
    );

    const commanderCard = screen
      .getByRole("heading", { level: 3, name: "Commander of Bombay" })
      .closest("section");
    expect(within(commanderCard as HTMLElement).queryByRole("checkbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Crown climate: Bull/u }));
    await user.click(screen.getByRole("button", { name: "Peacock" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Governor of Bombay" }).closest("section"),
    ).toHaveTextContent(/at least 1 die/u);
    expect(
      screen.getByRole("heading", { level: 3, name: "Commander of Bombay" }).closest("section"),
    ).toHaveTextContent(/exactly 2 dice against a non-Company region/u);
    expect(
      screen.getByRole("heading", { level: 3, name: "Trade" }).closest("section"),
    ).toHaveTextContent(/at least 6 dice/u);
    await waitFor(() => {
      const persisted = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) ?? "{}");
      expect(persisted.climate).toBe("peacock");
      expect(persisted.progress.phaseState.completed).toEqual([]);
    });
  });

  it("removes Trade when Bombay has a vacant President", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "commander:bombay",
      assignment: occupied("human-1"),
    });
    session = {
      ...session,
      progress: {
        phaseId: "round.presidency.bombay",
        phaseState: createPresidencyState("bombay", session.roles),
        endReason: null,
      },
    };

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <PresidencyPhase presidency="bombay" />
      </SessionProvider>,
    );
    expect(screen.getByText(/The Presidency is vacant/u)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Trade" })).not.toBeInTheDocument();
  });

  it("keeps Bonuses to the source procedure without mode-specific connective copy", () => {
    const session = atPhase(createInitialSession("two-player"), "round.bonuses");
    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <BonusesPhase />
      </SessionProvider>,
    );
    expect(
      screen.getByText(/Players gain £1 for each Shipyard with a fitted ship/u),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Human 1|Human 2/u)).not.toBeInTheDocument();
  });
});
