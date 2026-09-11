import { useState } from "react";
import type { FormEvent } from "react";
import CTAButton from "./CTAButton";
import "./ContactForm.css";

// Real submission backend: this form posts to Formspree (https://formspree.io) using
// their documented AJAX/fetch integration. To receive real submissions, sign up for a
// free Formspree account, create a form, and set VITE_FORMSPREE_ENDPOINT in a local
// .env file to that form's endpoint URL (e.g. https://formspree.io/f/xxxxxxx).
// If the env var is left unset — the default in this repo, since no Formspree account
// has been created yet — the form falls back to a local-only demo mode: it still
// validates input and shows the success state, it just doesn't send anywhere.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const YEAR_OPTIONS = ["First-year", "Sophomore", "Junior", "Senior", "Graduate/Other"];
const HEARD_ABOUT_OPTIONS = ["Instagram", "A friend", "A campus event", "Other"];

interface FormspreeErrorPayload {
  errors?: { message: string }[];
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.target as HTMLFormElement & {
      name: HTMLInputElement;
      email: HTMLInputElement;
      message: HTMLTextAreaElement;
      year: HTMLSelectElement;
    };
    if (
      !form.name.value.trim() ||
      !form.email.value.trim() ||
      !form.message.value.trim() ||
      !form.year.value.trim()
    ) {
      setError("Please fill out every required field before sending.");
      return;
    }
    setError("");

    if (!FORMSPREE_ENDPOINT) {
      // Demo mode: no Formspree endpoint configured, so just show success locally.
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data: FormspreeErrorPayload | null = await response.json().catch(() => null);
        const message =
          (data?.errors && data.errors.map((err) => err.message).join(", ")) ||
          "Something went wrong sending your message. Please try again.";
        setError(message);
      }
    } catch {
      setError(
        "Something went wrong sending your message. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="contact-form contact-form--success">
        <h3>Thank you.</h3>
        <p>We've received your message and a member of the colony will follow up soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" />
      </div>
      <div className="contact-form__row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="contact-form__row contact-form__row--split">
        <div className="contact-form__col">
          <label htmlFor="year">Year</label>
          <select id="year" name="year" defaultValue="">
            <option value="" disabled>
              Select your year
            </option>
            {YEAR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="contact-form__col">
          <label htmlFor="major">Major (optional)</label>
          <input id="major" name="major" type="text" autoComplete="off" />
        </div>
      </div>
      <div className="contact-form__row">
        <label htmlFor="heardAbout">How did you hear about us? (optional)</label>
        <select id="heardAbout" name="heardAbout" defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          {HEARD_ABOUT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="contact-form__row">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} />
      </div>
      {error && (
        <p className="contact-form__error" role="alert">
          {error}
        </p>
      )}
      <CTAButton type="submit" variant="filled">
        {submitting ? "Sending…" : "Send Message"}
      </CTAButton>
    </form>
  );
}
