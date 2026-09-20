import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createInitialSession, createPhaseState, occupied } from "../app/session/factories";
import { SESSION_STORAGE_KEY } from "../app/session/persistence";
import { sessionReducer } from "../app/session/reducer";
import { SessionProvider } from "../app/session/SessionContext";
import type { GameSessionV1, PhaseId } from "../app/session/types";
import { MemoryStorage } from "../test/MemoryStorage";
import {
  ChinaPhase,
  MilitaryAffairsPhase,
  ShippingPhase,
  TradeDirectoratePhase,
} from "./SoloOperationsPhases";

function atPhase(session: GameSessionV1, phaseId: PhaseId): GameSessionV1 {
  return {
    ...session,
    progress: { phaseId, phaseState: createPhaseState(phaseId), endReason: null },
  };
}

describe("solo operation phases", () => {
  it("renders the Crown Director's active-climate procedure and records a successful China opening", async () => {
    const storage = new MemoryStorage();
    const user = userEvent.setup();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "directorOfTrade",
      assignment: occupied("crown"),
    });
    session = { ...session, climate: "lion" };
    session = atPhase(session, "round.trade-directorate");

    render(
      <SessionProvider initialSession={session} storage={storage}>
        <TradeDirectoratePhase />
      </SessionProvider>,
    );

    const envoy = screen.getByRole("heading", { name: "Special Envoy" }).closest("section");
    expect(envoy).not.toBeNull();
    expect(envoy).toHaveTextContent(/spend exactly £3 per attempt/u);
    expect(
      screen.getByText(/fewest Crown Writers toward the one with the most Crown Writers/u),
    ).toBeInTheDocument();
    expect(screen.getByText(/7\. Director of Trade and 8\. Governor General/u)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Record successful China opening" }));
    expect(screen.getByText(/China office is in play/u)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Superintendent of Trade in China holder" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      const saved = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) ?? "{}") as GameSessionV1;
      expect(saved.roles.superintendentChina.status).toBe("vacant");
    });
  });

  it("renders Governor General instead of Director of Trade when the replacement office is in play", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "governorGeneral",
      assignment: occupied("crown"),
    });
    session = { ...session, climate: "peacock" };
    session = atPhase(session, "round.trade-directorate");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <TradeDirectoratePhase />
      </SessionProvider>,
    );

    expect(screen.getByRole("heading", { name: "Regional Income" })).toBeInTheDocument();
    const govern = screen.getByRole("heading", { name: "Govern" }).closest("section");
    expect(govern).toHaveTextContent(/at least 2 dice/u);
    expect(
      screen.getByText(/Commission a Regiment for each Company-controlled region/u),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Special Envoy" })).not.toBeInTheDocument();
  });

  it("preserves the Crown Shipping order, climate rule, and mandatory human-ship favor", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "managerOfShipping",
      assignment: occupied("crown"),
    });
    session = { ...session, climate: "bear" };
    session = atPhase(session, "round.shipping");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <ShippingPhase />
      </SessionProvider>,
    );

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(headings).toEqual([
      "Fit ships",
      "Buy Company ships",
      "Lease Extra ships",
      "Place every ship",
    ]);
    expect(screen.getByText("Buy one Company ship if able.")).toBeInTheDocument();
    expect(screen.getByText(/must perform this favor if able/u)).toBeInTheDocument();
    expect(screen.getByText(/Presidency with the most Crown Writers/u)).toBeInTheDocument();
  });

  it("shows Crown Military Affairs priorities and persists a Commander assignment", async () => {
    const storage = new MemoryStorage();
    const user = userEvent.setup();
    let session = createInitialSession("solo");
    session = sessionReducer(session, {
      type: "set-role",
      role: "militaryAffairs",
      assignment: occupied("crown"),
    });
    session = { ...session, climate: "peacock" };
    session = atPhase(session, "round.military-affairs");

    render(
      <SessionProvider initialSession={session} storage={storage}>
        <MilitaryAffairsPhase />
      </SessionProvider>,
    );

    expect(
      screen.getByText(/human Commander to an Army with a Crown Commander/u),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    const training = screen
      .getByRole("heading", { name: "Assign Officers-in-Training" })
      .closest("section");
    expect(training).not.toBeNull();
    expect(within(training as HTMLElement).getAllByRole("listitem")[0]).toHaveTextContent(
      "Creates a new Crown majority",
    );

    const bombay = screen.getByRole("group", { name: "Bombay Commander" });
    await user.click(within(bombay).getByRole("button", { name: "Crown" }));
    expect(within(bombay).getByRole("button", { name: "Crown" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => {
      const saved = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) ?? "{}") as GameSessionV1;
      expect(saved.roles.commanders.bombay).toMatchObject({
        status: "occupied",
        occupant: "crown",
      });
    });
  });

  it("shows the ship-only China treasury, East treatment, and the Crown minimum", () => {
    let session = createInitialSession("solo");
    session = sessionReducer(session, { type: "activate-china" });
    session = sessionReducer(session, {
      type: "set-role",
      role: "superintendentChina",
      assignment: occupied("crown"),
    });
    session = { ...session, climate: "stag" };
    session = atPhase(session, "round.china");

    render(
      <SessionProvider initialSession={session} storage={new MemoryStorage()}>
        <ChinaPhase />
      </SessionProvider>,
    );

    expect(screen.getByText(/treasury contains only ships/u)).toBeInTheDocument();
    expect(screen.getByText(/count as being in the Eastern sea zone/u)).toBeInTheDocument();
    expect(screen.getByText(/at most once this turn/u)).toBeInTheDocument();
    const trade = screen
      .getByRole("heading", { level: 2, name: "Trade in China" })
      .closest("section");
    expect(trade).toHaveTextContent(/at least 2 dice/u);
    expect(screen.getByText("Raise or lower the minimum by one die.")).toBeInTheDocument();
  });
});
