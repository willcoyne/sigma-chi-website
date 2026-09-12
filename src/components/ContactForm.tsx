import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import CTAButton from "./CTAButton";
import "./ContactForm.css";

// Real submission backend: this form posts to Formspree (https://formspree.io) using
// their documented AJAX/fetch integration. The endpoint lives in VITE_FORMSPREE_ENDPOINT
// (set in .env.production); the build fails if it is missing from the bundle, see
// scripts/check-form-endpoint.mjs. If it is unset — e.g. in the test environment — the
// form falls back to a local-only demo mode: it still validates input and shows the
// success state, it just doesn't send anywhere.
// Read through a function rather than a module-level const so the value is resolved at
// submit time (Vite still inlines the literal, and tests can stub the env var).
function formspreeEndpoint(): string | undefined {
  return import.meta.env.VITE_FORMSPREE_ENDPOINT;
}

const YEAR_OPTIONS = ["First-year", "Sophomore", "Junior", "Senior", "Graduate/Other"];
const HEARD_ABOUT_OPTIONS = ["Instagram", "A friend", "A campus event", "Other"];

// Spam mitigation without a third-party tracker (no reCAPTCHA/hCaptcha — they are
// tracking scripts and would contradict the site's privacy policy). A person needs a
// few seconds to read the labels and type; a bot posts almost immediately after load.
const MIN_FILL_MS = 3000;

// Deliberately loose. The only thing worth checking in the browser is that there is a
// local part, an "@", and a dotted domain — anything stricter rejects valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "name" | "email" | "year" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

// Document order, so the "focus the first invalid field" rule matches what the
// visitor sees on screen.
const FIELD_ORDER: FieldName[] = ["name", "email", "year", "message"];

interface FormspreeErrorPayload {
  errors?: { message: string }[];
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const gotchaRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  // A ref, not state: the mount time never needs to trigger a re-render. Stamped in an
  // effect rather than during render, because Date.now() is impure.
  const mountedAtRef = useRef<number | null>(null);

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  // SC 4.1.3 — the form is replaced by the success message, so move focus into it.
  // Without this, focus falls back to <body> and a screen reader announces nothing.
  useEffect(() => {
    if (submitted) {
      successRef.current?.focus();
    }
  }, [submitted]);

  function fieldElement(field: FieldName): HTMLElement | null {
    switch (field) {
      case "name":
        return nameRef.current;
      case "email":
        return emailRef.current;
      case "year":
        return yearRef.current;
      case "message":
        return messageRef.current;
    }
  }

  function validate(): { errors: FieldErrors; hasEmptyField: boolean } {
    const errors: FieldErrors = {};
    let hasEmptyField = false;

    if (!nameRef.current?.value.trim()) {
      errors.name = "Enter your name.";
      hasEmptyField = true;
    }

    const email = emailRef.current?.value.trim() ?? "";
    if (!email) {
      errors.email = "Enter your email address.";
      hasEmptyField = true;
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = "Enter an email address in the format name@example.com.";
    }

    if (!yearRef.current?.value.trim()) {
      errors.year = "Select your year.";
      hasEmptyField = true;
    }

    if (!messageRef.current?.value.trim()) {
      errors.message = "Enter a message.";
      hasEmptyField = true;
    }

    return { errors, hasEmptyField };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;

    const { errors, hasEmptyField } = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(
        hasEmptyField
          ? "Please fill out every required field before sending."
          : "Please check the highlighted field before sending."
      );
      const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
      if (firstInvalid) {
        fieldElement(firstInvalid)?.focus();
      }
      return;
    }

    setFieldErrors({});
    setError("");

    // Silent spam handling: a caught bot gets the same success screen a person gets,
    // so it has no signal that the submission was dropped and nothing to tune against.
    const honeypotFilled = Boolean(gotchaRef.current?.value.trim());
    // Fail open if the mount effect somehow never ran: never drop a real message.
    const msSinceMount =
      mountedAtRef.current === null ? Number.POSITIVE_INFINITY : Date.now() - mountedAtRef.current;
    const submittedTooFast = msSinceMount < MIN_FILL_MS;
    if (honeypotFilled || submittedTooFast) {
      setSubmitted(true);
      return;
    }

    const endpoint = formspreeEndpoint();
    if (!endpoint) {
      // Demo mode: no Formspree endpoint configured, so just show success locally.
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(endpoint, {
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
      <div
        className="contact-form contact-form--success"
        role="status"
        aria-live="polite"
        tabIndex={-1}
        ref={successRef}
      >
        <h3>Thank you.</h3>
        <p>We've received your message and a member of the colony will follow up soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <p className="contact-form__note">Fields marked with an asterisk (*) are required.</p>
      <div className="contact-form__row">
        <label htmlFor="name">
          Name <span className="contact-form__required" aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          ref={nameRef}
          required
          aria-required="true"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && (
          <p className="contact-form__error contact-form__error--field" id="name-error">
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div className="contact-form__row">
        <label htmlFor="email">
          Email <span className="contact-form__required" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          ref={emailRef}
          required
          aria-required="true"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <p className="contact-form__error contact-form__error--field" id="email-error">
            {fieldErrors.email}
          </p>
        )}
      </div>
      <div className="contact-form__row contact-form__row--split">
        <div className="contact-form__col">
          <label htmlFor="year">
            Year <span className="contact-form__required" aria-hidden="true">*</span>
          </label>
          <select
            id="year"
            name="year"
            defaultValue=""
            ref={yearRef}
            required
            aria-required="true"
            aria-invalid={fieldErrors.year ? true : undefined}
            aria-describedby={fieldErrors.year ? "year-error" : undefined}
          >
            <option value="" disabled>
              Select your year
            </option>
            {YEAR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.year && (
            <p className="contact-form__error contact-form__error--field" id="year-error">
              {fieldErrors.year}
            </p>
          )}
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
        <label htmlFor="message">
          Message <span className="contact-form__required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          ref={messageRef}
          required
          aria-required="true"
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message && (
          <p className="contact-form__error contact-form__error--field" id="message-error">
            {fieldErrors.message}
          </p>
        )}
      </div>
      {/* Honeypot. "_gotcha" is Formspree's own reserved honeypot field name, so a
          submission that fills it is also dropped server-side by Formspree — which
          matters because this form is on a 50-submissions-per-month free plan.
          Hidden from sight, from the tab order, and from assistive technology. */}
      <div className="contact-form__gotcha" aria-hidden="true">
        <label htmlFor="_gotcha">Leave this field empty</label>
        <input
          id="_gotcha"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={gotchaRef}
        />
      </div>
      {error && (
        <p className="contact-form__error" role="alert">
          {error}
        </p>
      )}
      <p className="contact-form__privacy">
        Your message is emailed to the colony through Formspree, a third-party form service —
        see our <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <CTAButton
        type="submit"
        variant="filled"
        disabled={submitting}
        busy={submitting}
        className="contact-form__submit"
      >
        {submitting ? "Sending…" : "Send Message"}
      </CTAButton>
    </form>
  );
}
