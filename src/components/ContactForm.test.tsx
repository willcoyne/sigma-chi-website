import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ContactForm from "./ContactForm";

const TEST_ENDPOINT = "https://formspree.io/f/testform";

// The form links to /privacy, so it needs a router around it.
function renderForm() {
  return render(
    <MemoryRouter>
      <ContactForm />
    </MemoryRouter>
  );
}

// The form drops submissions that arrive sooner than a person could plausibly type
// (MIN_FILL_MS). Tests that want the real submit path have to look slower than that.
// Call this *after* render, so the mount timestamp is the real one and only the
// elapsed time is shifted. Time still advances, so user-event isn't frozen.
const realDateNow = Date.now;
function lookLikeAHuman() {
  vi.spyOn(Date, "now").mockImplementation(() => realDateNow.call(Date) + 10_000);
}

// The mirror image: freeze the clock at mount time so every submit reads as instant.
function lookLikeABot() {
  const frozen = realDateNow.call(Date);
  vi.spyOn(Date, "now").mockImplementation(() => frozen);
}

function mockFetchOk() {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("VITE_FORMSPREE_ENDPOINT", TEST_ENDPOINT);
  return fetchMock;
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>, email = "founder@example.com") {
  await user.type(screen.getByLabelText(/^Name/), "Founding Father");
  await user.type(screen.getByLabelText(/^Email/), email);
  await user.selectOptions(screen.getByLabelText(/^Year/), "Sophomore");
  await user.type(screen.getByLabelText(/^Message/), "Interested in joining the founding class.");
}

function submitButton() {
  return screen.getByRole("button", { name: "Send Message" });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("ContactForm", () => {
  it("shows a validation error when submitted with empty fields", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(submitButton());

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please fill out every required field before sending."
    );
  });

  it("marks every empty required field invalid and focuses the first one", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(submitButton());

    const name = screen.getByLabelText(/^Name/);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAttribute("aria-describedby", "name-error");
    expect(screen.getByText("Enter your name.")).toHaveAttribute("id", "name-error");
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/^Year/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/^Message/)).toHaveAttribute("aria-invalid", "true");
    // First invalid field in document order takes focus.
    expect(name).toHaveFocus();
  });

  it("focuses the one missing field when the rest are filled in", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^Name/), "Founding Father");
    await user.type(screen.getByLabelText(/^Email/), "founder@example.com");
    await user.type(screen.getByLabelText(/^Message/), "Interested in joining.");
    await user.click(submitButton());

    const year = screen.getByLabelText(/^Year/);
    expect(year).toHaveAttribute("aria-invalid", "true");
    expect(year).toHaveFocus();
    expect(screen.getByLabelText(/^Name/)).not.toHaveAttribute("aria-invalid");
  });

  it("rejects an email that isn't a valid address", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOk();
    renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user, "founder@example");
    await user.click(submitButton());

    const email = screen.getByLabelText(/^Email/);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveFocus();
    expect(screen.getByText("Enter an email address in the format name@example.com.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText("Thank you.")).not.toBeInTheDocument();
  });

  it("shows a success message once all required fields are filled in", async () => {
    const user = userEvent.setup();
    renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(screen.getByText("Thank you.")).toBeInTheDocument();
    expect(
      screen.getByText("We've received your message and a member of the colony will follow up soon.")
    ).toBeInTheDocument();
  });

  it("moves focus to the success message so it is announced", async () => {
    const user = userEvent.setup();
    renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user);
    await user.click(submitButton());

    const success = screen.getByRole("status");
    expect(success).toHaveTextContent("Thank you.");
    expect(success).toHaveFocus();
  });

  it("posts a valid submission to the Formspree endpoint", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOk();
    renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(TEST_ENDPOINT);
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
    const body = init.body as FormData;
    expect(body.get("name")).toBe("Founding Father");
    expect(body.get("email")).toBe("founder@example.com");
    expect(body.get("year")).toBe("Sophomore");
    expect(await screen.findByText("Thank you.")).toBeInTheDocument();
  });

  it("silently shows success without posting when the honeypot is filled", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOk();
    const { container } = renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user);
    const honeypot = container.querySelector<HTMLInputElement>('input[name="_gotcha"]');
    expect(honeypot).not.toBeNull();
    fireEvent.change(honeypot as HTMLInputElement, { target: { value: "https://spam.example" } });
    await user.click(submitButton());

    // A caught bot sees the same screen a person does, and nothing is sent.
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Thank you.")).toBeInTheDocument();
  });

  it("silently shows success without posting when the form is submitted too fast", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOk();
    renderForm();
    lookLikeABot();

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Thank you.")).toBeInTheDocument();
  });

  it("keeps the honeypot out of the tab order and away from assistive technology", () => {
    const { container } = renderForm();

    const honeypot = container.querySelector<HTMLInputElement>('input[name="_gotcha"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot?.closest("div")).toHaveAttribute("aria-hidden", "true");
  });

  it("reports a server-side failure in the shared alert and keeps the form", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ errors: [{ message: "Form is not accepting submissions" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VITE_FORMSPREE_ENDPOINT", TEST_ENDPOINT);
    renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent("Form is not accepting submissions");
    expect(submitButton()).toBeEnabled();
  });

  it("disables the submit button and marks it busy while a submission is in flight", async () => {
    const user = userEvent.setup();
    let resolveFetch!: (value: { ok: boolean; json: () => Promise<unknown> }) => void;
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VITE_FORMSPREE_ENDPOINT", TEST_ENDPOINT);
    renderForm();
    lookLikeAHuman();

    await fillRequiredFields(user);
    await user.click(submitButton());

    const sending = await screen.findByRole("button", { name: "Sending…" });
    expect(sending).toBeDisabled();
    expect(sending).toHaveAttribute("aria-busy", "true");

    resolveFetch({ ok: true, json: async () => ({ ok: true }) });
    expect(await screen.findByText("Thank you.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("marks the required fields as required and the optional ones as optional", () => {
    renderForm();

    expect(screen.getByLabelText(/^Name/)).toHaveAttribute("aria-required", "true");
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-required", "true");
    expect(screen.getByLabelText(/^Year/)).toHaveAttribute("aria-required", "true");
    expect(screen.getByLabelText(/^Message/)).toHaveAttribute("aria-required", "true");
    expect(screen.getByLabelText("Major (optional)")).not.toHaveAttribute("aria-required");
    expect(screen.getByText("Fields marked with an asterisk (*) are required.")).toBeInTheDocument();
  });

  it("links to the privacy policy at the point of collection", () => {
    renderForm();

    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  });
});
