import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// The NavBar and Footer both render links with identical accessible names
// (e.g. "Our History", "Philanthropy"). The NavBar's links come first in
// document order, so we always click the first match to drive navigation
// via the primary nav.
function clickNavLink(name: string) {
  const links = screen.getAllByRole("link", { name });
  return userEvent.setup().click(links[0]);
}

describe("App", () => {
  it("renders the Home page headline by default", () => {
    render(<App />);
    expect(screen.getByText(/Leaders of Men/i)).toBeInTheDocument();
  });

  it("navigates to Our History and shows its headline", async () => {
    render(<App />);
    await clickNavLink("Our History");
    // The route wrapper (PageTransition + AnimatePresence mode="wait") keeps the
    // outgoing page mounted until its exit animation finishes, so the incoming
    // page's content isn't in the DOM synchronously after the click — wait for it.
    expect(await screen.findByText(/A Story Still Being Written/i)).toBeInTheDocument();
  });

  it("navigates to Values & Creed and shows its headline", async () => {
    render(<App />);
    await clickNavLink("Values & Creed");
    expect(await screen.findByText(/Friendship\. Justice\. Learning\./i)).toBeInTheDocument();
  });

  it("navigates to The Colony Today and shows its headline", async () => {
    render(<App />);
    await clickNavLink("The Colony Today");
    expect(await screen.findByText(/Founding Fathers, Building From Scratch/i)).toBeInTheDocument();
  });

  it("navigates to Philanthropy and shows its headline", async () => {
    render(<App />);
    await clickNavLink("Philanthropy");
    expect(await screen.findByText(/Standing With Huntsman Cancer Foundation/i)).toBeInTheDocument();
  });

  it("navigates to Join Us (Contact) and shows its headline", async () => {
    render(<App />);
    await clickNavLink("Join Us");
    expect(await screen.findByText(/Become a Founding Father/i)).toBeInTheDocument();
  });
});
