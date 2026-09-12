import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";
import CTAButton from "../components/CTAButton";
import { LEGAL_LAST_UPDATED, legalContactRoute } from "../data/legal";
import "./Legal.css";
import "./Accessibility.css";

export default function Accessibility() {
  const contact = legalContactRoute();

  const contactLink =
    contact.kind === "email" ? (
      <a className="legal__link" href={`mailto:${contact.value}`}>
        {contact.value}
      </a>
    ) : (
      <Link className="legal__link" to={contact.value}>
        the contact form
      </Link>
    );

  return (
    <>
      <HeroBanner
        eyebrow="Legal"
        title="Accessibility Statement"
        subtitle="What we have built into this site so far, what we know is still missing, and how to tell us when something doesn't work for you."
        size="small"
      />

      <section className="section legal a11y-intro">
        <div className="container legal__inner legal__body">
          <Reveal>
            <p className="legal__updated">Last updated: {LEGAL_LAST_UPDATED}</p>
            <h2>Our commitment</h2>
            <p className="legal__lead">
              The Sigma Chi colony at Washington University in St. Louis wants this site to be usable by
              everyone interested in joining, including people who browse with a keyboard, a screen
              reader, magnification, or reduced motion turned on.
            </p>
            <p>
              We are working toward the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA as
              our target standard. We are not claiming that the site fully conforms to it, and we hold
              no accessibility certification. This page describes the current state honestly rather than
              presenting a badge.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream a11y-measures">
        <div className="container legal__inner legal__body">
          <Reveal>
            <p className="eyebrow">What's In Place</p>
            <h2>Measures built into the site</h2>
            <p>Each item below is implemented in the site's source code today:</p>
            <ul className="legal__list">
              <li>
                <strong>Semantic landmarks.</strong> Pages are built from real{" "}
                <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code> and{" "}
                <code>&lt;footer&gt;</code> regions, with content organized under headings, so assistive
                technology can jump between sections.
              </li>
              <li>
                <strong>Skip link.</strong> A &ldquo;Skip to main content&rdquo; link is the first thing
                in the tab order on every page. It stays hidden until it receives focus, then appears
                above the navigation bar.
              </li>
              <li>
                <strong>Keyboard-operable navigation.</strong> Navigation is made of real links and the
                mobile menu is a real button carrying an accessible name and an{" "}
                <code>aria-expanded</code> state, so the whole header works without a mouse.
              </li>
              <li>
                <strong>Focus moves on page change.</strong> Because this is a single-page app, changing
                route moves keyboard focus into the main region and announces the new page name through
                a polite live region, instead of leaving focus parked on the old page.
              </li>
              <li>
                <strong>Visible focus indicators.</strong> A gold <code>:focus-visible</code> outline
                with an offset is defined globally, so the focused element is always distinguishable
                from a hovered one.
              </li>
              <li>
                <strong>Reduced-motion support.</strong> If your system asks for reduced motion, the
                animation library is configured to honor that setting, and a{" "}
                <code>prefers-reduced-motion</code> rule reduces CSS animations, transitions and smooth
                scrolling site-wide.
              </li>
              <li>
                <strong>Labeled form fields.</strong> Every field on the contact form has a visible
                label tied to its input. Required fields carry <code>required</code> and{" "}
                <code>aria-required</code>, a note at the top of the form explains what the asterisk
                means, and validation messages are tied to their field with{" "}
                <code>aria-describedby</code> and <code>aria-invalid</code> rather than being signaled
                by color alone.
              </li>
              <li>
                <strong>Decorative graphics are hidden.</strong> Ornamental elements such as the hero
                backdrop and the accent hairline are marked <code>aria-hidden</code> so they are not
                read out as meaningless content.
              </li>
              <li>
                <strong>Self-hosted fonts.</strong> Typefaces are bundled with the site rather than
                fetched from a third-party font service, so text renders reliably and without an outside
                request.
              </li>
              <li>
                <strong>Responsive, zoomable layout.</strong> Layouts are fluid and type sizes scale
                with the viewport, so the site reflows rather than breaking when text or the page is
                enlarged.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section legal a11y-limits">
        <div className="container legal__inner legal__body">
          <Reveal>
            <p className="eyebrow">Known Limitations</p>
            <h2>Where we fall short</h2>
            <p>
              We would rather list these than let you discover them on your own:
            </p>
            <ul className="legal__list">
              <li>
                The site has never had a third-party or independent accessibility audit. Everything we
                know about it comes from our own checks.
              </li>
              <li>
                It has not been tested across every screen reader and browser combination. Behavior
                with combinations we have not tried is genuinely unknown to us.
              </li>
              <li>
                We have not carried out a full manual WCAG 2.1 Level AA audit, so there may be Level AA
                criteria the site does not currently meet.
              </li>
              <li>
                Color contrast has been chosen with care but has not been verified against every text
                and background pairing on the site.
              </li>
              <li>
                Pages use motion for entrance animations and page transitions. Reduced-motion settings
                are respected, but there is no in-page control to turn animation off independently of
                your system setting.
              </li>
              <li>
                Content we link to — Instagram, the Huntsman Cancer Foundation, and other outside sites
                — is outside our control, and we cannot speak for its accessibility.
              </li>
            </ul>
            <p>
              This is a volunteer-run student site, so fixes happen as members find time. We would
              still rather hear about a problem than not.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream a11y-feedback">
        <div className="container legal__inner legal__body">
          <Reveal>
            <p className="eyebrow">Feedback</p>
            <h2>Tell us what isn't working</h2>
            <p>
              If any part of this site is difficult or impossible for you to use, get in touch through{" "}
              {contactLink}, or message the colony's public Instagram account, @sigmachiwashu. It helps
              us if you can say which page you were on, what you were trying to do, and what device,
              browser or assistive technology you were using — but send us what you have either way.
            </p>
            <div className="legal__callout">
              <p>
                If the barrier is the contact form itself, reach us on Instagram at @sigmachiwashu
                instead, and someone will follow up there.
              </p>
            </div>
            <p>
              We will acknowledge your message and tell you what we can do about it. If a fix isn't
              possible quickly, we will try to get you the information you were after another way.
            </p>
            <h3>Review date</h3>
            <p>
              This statement was last reviewed on {LEGAL_LAST_UPDATED}. We revisit it when the site
              changes in a way that affects accessibility.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal__cta a11y-cta">
        <div className="container legal__cta-inner">
          <Reveal>
            <h2>Run Into a Barrier?</h2>
            <p>Report it and we'll work on it. Every report helps us find what we missed.</p>
            <CTAButton to="/contact" variant="filled">
              Get in Touch
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
