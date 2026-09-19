import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SESSION_STORAGE_KEY } from "./session/persistence";
import { App } from "./App";
import { MemoryStorage } from "../test/MemoryStorage";

describe("application foundation", () => {
  it("starts a solo session, navigates setup, skips first-turn London, and autosaves", async () => {
    const storage = new MemoryStorage();
    const user = userEvent.setup();
    render(<App storage={storage} />);

    await user.click(screen.getByRole("button", { name: /New solo game/u }));
    expect(screen.getByRole("heading", { level: 1, name: "New game" })).toBeInTheDocument();

    for (const heading of [
      "Table and scenario",
      "Crown materials",
      "Setup cards",
      "Record the offices",
      "Climate and readiness",
      "Family",
    ]) {
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    }

    expect(screen.queryByRole("heading", { name: "London Season" })).not.toBeInTheDocument();
    await waitFor(() => expect(storage.getItem(SESSION_STORAGE_KEY)).not.toBeNull());
    expect(JSON.parse(storage.getItem(SESSION_STORAGE_KEY) ?? "{}").progress.phaseId).toBe(
      "round.family",
    );
  });

  it("starts a distinct two-player session and keeps Legendary unavailable", async () => {
    const user = userEvent.setup();
    render(<App storage={new MemoryStorage()} />);
    await user.click(screen.getByRole("button", { name: /New two-player game/u }));
    expect(screen.getByRole("button", { name: "Two players" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Legendary" })).toBeDisabled();
  });

  it("updates climate globally and scrolls new phases to the top", async () => {
    const user = userEvent.setup();
    render(<App storage={new MemoryStorage()} />);
    await user.click(screen.getByRole("button", { name: /New solo game/u }));
    await user.click(screen.getByRole("button", { name: "Bear" }));
    expect(screen.getByRole("button", { name: "Bear" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
