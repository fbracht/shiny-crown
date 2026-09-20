import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GameShell } from "../app/GameShell";
import { createInitialSession, createPhaseState, occupied } from "../app/session/factories";
import { SESSION_STORAGE_KEY } from "../app/session/persistence";
import { sessionReducer } from "../app/session/reducer";
import { SessionProvider } from "../app/session/SessionContext";
import type { GameSessionV1, PhaseId } from "../app/session/types";
import { MemoryStorage } from "../test/MemoryStorage";
import {
  CompanyRevenuePhase,
  EventsIndiaPhase,
  ParliamentPhase,
  ScoringPhase,
  UpkeepRefreshPhase,
} from "./SoloLatePhases";

function atPhase(session: GameSessionV1, phaseId: PhaseId): GameSessionV1 {
  return {
    ...session,
    progress: { phaseId, phaseState: createPhaseState(phaseId), endReason: null },
  };
}

function renderPhase(session: GameSessionV1, phase: React.ReactNode, storage = new MemoryStorage()) {
  return render(
    <SessionProvider initialSession={session} storage={storage}>
      {phase}
    </SessionProvider>,
  );
}

describe("solo late-round phases", () => {
  it("shows only the active Crown-Chairman dividend row", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "chairman",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, { type: "set-climate", climate: "bear" });
    renderPhase(session, <CompanyRevenuePhase />);

    expect(screen.getByText(/retaining at least/u)).toHaveTextContent("£6");
    expect(screen.getByText("Pay one fewer dividend.").previousElementSibling).toHaveTextContent(
      "Give 1",
    );
  });

  it("records Region Loss through the verified Governor and Commander mutations", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "create-governor",
      region: "bombay",
      presidency: "bombay",
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "governor:bombay",
      assignment: { status: "occupied", occupant: "human-1", associatedPresidency: "bombay" },
    });
    session = sessionReducer(session, {
      type: "assign-commander",
      presidency: "bombay",
      actor: "crown",
    });
    renderPhase(session, <EventsIndiaPhase />, storage);

    await user.click(screen.getByRole("button", { name: "Record region loss" }));
    await waitFor(() => {
      const saved = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) as string) as GameSessionV1;
      expect(saved.roles.governors.bombay.status).toBe("not-in-play");
      expect(saved.roles.commanders.bombay.status).toBe("vacant");
    });
  });

  it("records the Governor General structural law without leaving regional Governors active", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "primeMinister",
      assignment: occupied("human-1"),
    });
    session = sessionReducer(session, {
      type: "set-role",
      role: "directorOfTrade",
      assignment: occupied("crown"),
    });
    session = sessionReducer(session, {
      type: "create-governor",
      region: "bengal",
      presidency: "bengal",
    });
    renderPhase(session, <ParliamentPhase />, storage);

    await user.click(screen.getByRole("button", { name: "Governor General enacted" }));
    await waitFor(() => {
      const saved = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) as string) as GameSessionV1;
      expect(saved.roles.directorOfTrade.status).toBe("not-in-play");
      expect(saved.roles.governorGeneral).toMatchObject({ status: "occupied", occupant: "crown" });
      expect(saved.roles.governors.bengal.status).toBe("not-in-play");
    });
  });

  it("keeps solo compensation in Refresh and applies sourced failure scoring", () => {
    const upkeep = renderPhase(createInitialSession("solo"), <UpkeepRefreshPhase />);
    expect(screen.getByText(/If you have a Writer in a Crown Presidency/u)).toBeInTheDocument();
    upkeep.unmount();

    let scoring = createInitialSession("solo", "1710");
    scoring = {
      ...scoring,
      turn: 3,
      progress: {
        phaseId: "game.scoring",
        phaseState: createPhaseState("game.scoring"),
        endReason: "company-failure",
      },
    };
    renderPhase(scoring, <ScoringPhase />);
    expect(screen.getByText(/Adjust the human score/u)).toHaveTextContent("-3 VP");
  });
});

describe("global reference library", () => {
  it("opens the mobile Crisis image and accessible text without changing phase state", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    const session = atPhase(createInitialSession("solo"), "round.events-india");
    renderPhase(session, <GameShell onHome={() => undefined} />, storage);

    await user.click(screen.getByRole("button", { name: "References" }));
    const dialog = screen.getByRole("dialog", { name: "References" });
    await user.click(within(dialog).getByRole("button", { name: "Crisis" }));
    expect(
      within(dialog).getByRole("img", { name: /Crisis, rebellion, and invasion/u }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Region Loss")).toBeInTheDocument();

    const saved = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) as string) as GameSessionV1;
    expect(saved.progress.phaseId).toBe("round.events-india");
  });
});

