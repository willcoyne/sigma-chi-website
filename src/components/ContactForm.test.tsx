import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  it("shows a validation error when submitted with empty fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please fill out every required field before sending."
    );
  });

  it("shows a success message once all required fields are filled in", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Founding Father");
    await user.type(screen.getByLabelText("Email"), "founder@example.com");
    await user.selectOptions(screen.getByLabelText("Year"), "Sophomore");
    await user.type(screen.getByLabelText("Message"), "Interested in joining the founding class.");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByText("Thank you.")).toBeInTheDocument();
    expect(
      screen.getByText("We've received your message and a member of the colony will follow up soon.")
    ).toBeInTheDocument();
  });
});
