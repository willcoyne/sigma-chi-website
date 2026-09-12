import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";
import CTAButton from "../components/CTAButton";
import ScrollRail from "../components/motion/ScrollRail";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_CONTACT_EMAIL,
  DATA_RECIPIENTS,
  FORM_FIELDS_COLLECTED,
  legalContactRoute,
} from "../data/legal";
import "./Legal.css";
import "./Privacy.css";

export default function Privacy() {
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
        title="Privacy Policy"
        subtitle="This site collects one thing: what you type into the contact form. Here is exactly what happens to it."
        size="small"
      />

      <section className="section legal privacy-intro">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="legal__updated">Last updated: {LEGAL_LAST_UPDATED}</p>
            <h2>What this policy covers</h2>
            <p className="legal__lead">
              This policy describes how the Sigma Chi colony at Washington University in St. Louis
              handles personal information on washusigmachi.org. It covers this website only. It does
              not cover Sigma Chi Fraternity's international headquarters, the university, or any other
              site you reach by following a link from here.
            </p>
            <p>
              The site is a recruitment and information page run by students. There are no accounts, no
              logins, no shopping, and no payments. The contact form is the only part of this site that
              collects anything about you.
            </p>
            <p>
              You can also email the colony directly at{" "}
              <a className="legal__link" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
                {LEGAL_CONTACT_EMAIL}
              </a>
              . That is worth knowing for a different reason: an email you send goes straight to the
              colony's mailbox and is never handled by Formspree, the service described below. It is
              received in Gmail, so Google handles it as the mail provider, and it stays in that inbox
              until someone deletes it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream privacy-collect">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">What We Collect</p>
            <h2>Every field on the contact form</h2>
            <p>
              The table below lists each field the contact form sends, whether it is required, and why
              it is asked for. This is the complete set of personal information the site collects.
            </p>
            <div className="legal__table-wrap">
              <table className="legal__table">
                <caption>Fields submitted by the contact form at /contact.</caption>
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Required</th>
                    <th scope="col">Why we ask</th>
                  </tr>
                </thead>
                <tbody>
                  {FORM_FIELDS_COLLECTED.map((entry) => (
                    <tr key={entry.field}>
                      <th scope="row">
                        {entry.label}
                        <span className="privacy-collect__key">{entry.field}</span>
                      </th>
                      <td>
                        <span
                          className={`legal__tag ${
                            entry.required ? "legal__tag--required" : "legal__tag--optional"
                          }`}
                        >
                          {entry.required ? "Required" : "Optional"}
                        </span>
                      </td>
                      <td>{entry.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Nothing else is gathered about you. The form does carry one hidden anti-spam field, which
              is always empty for a real person and is only there so automated submissions can be thrown
              away. The site does not ask for your student ID, your date of birth, your address, or your
              phone number, and you should not put information like that in the message box.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal privacy-recipients">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">Who Receives It</p>
            <h2>Where a submission goes</h2>
            <p>
              When you press send, your submission is posted to Formspree, a form-handling service
              based in the United States. Formspree stores the submission in its dashboard and emails a
              copy to the colony's maintainer inbox, where members of the colony read it and reply.
              Every submission passes through Formspree; there is no path that avoids it.
            </p>
            <div className="privacy-recipients__list">
              {DATA_RECIPIENTS.map((recipient) => (
                <div
                  className={`privacy-recipients__card ${
                    recipient.active ? "privacy-recipients__card--active" : ""
                  }`}
                  key={recipient.name}
                >
                  <p className="privacy-recipients__status">
                    <span
                      className={`legal__tag ${
                        recipient.active ? "legal__tag--required" : "legal__tag--optional"
                      }`}
                    >
                      {recipient.active ? "In use today" : "Not enabled"}
                    </span>
                  </p>
                  <h3>{recipient.name}</h3>
                  <p className="privacy-recipients__role">{recipient.role}</p>
                  <p>{recipient.detail}</p>
                  <p className="privacy-recipients__links">
                    <a
                      className="legal__link"
                      href={recipient.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {recipient.name} website
                    </a>
                    <span aria-hidden="true"> &middot; </span>
                    <a
                      className="legal__link"
                      href={recipient.privacyUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Its privacy policy
                    </a>
                  </p>
                </div>
              ))}
            </div>
            <p>
              If you are outside the United States, sending the form means your information is
              transferred to and stored in the United States by these services.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream privacy-not">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">What We Don't Do</p>
            <h2>Things this site does not do</h2>
            <ul className="legal__list">
              <li>
                It sets no cookies and writes nothing to localStorage or sessionStorage. There is no
                cookie banner because there is nothing to consent to.
              </li>
              <li>
                It does not sell or share personal information, and it does not trade it for anything of
                value.
              </li>
              <li>
                It runs no advertising, no ad pixels, no remarketing tags, and no cross-site tracking.
              </li>
              <li>
                It does not build profiles, score visitors, or make automated decisions about anyone.
              </li>
              <li>
                It does not add you to a mailing list. If you write to us, we reply to you; that is the
                extent of it.
              </li>
            </ul>
            <h3>Analytics</h3>
            <p>
              As the section above notes, analytics is switched off. No measurement script is loaded
              and no request is made to any analytics service when you visit. If the colony ever turns
              it on it will be Plausible, which is cookieless and counts page views rather than people,
              and this page will be updated before that change ships.
            </p>
            <h3>Instagram embed</h3>
            <p>
              The colony's Instagram section currently renders a plain link to @sigmachiwashu, so no
              third-party frame loads and Meta receives nothing about your visit. If an embedded feed is
              switched on later, it still will not load on its own: the page shows a notice and a
              button, and the frame is only requested after you click it. Loading it would let the
              embed host see your IP address, your browser details and the page you came from, and set
              its own cookies under its own policy.
            </p>
            <p>
              That choice applies to a single visit and is deliberately not remembered — storing a
              preference would mean writing to your device, which would make the first item in this
              list untrue.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal privacy-retention">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">Retention</p>
            <h2>How long submissions are kept</h2>
            <p>
              A submission lives in two places: Formspree's dashboard for the colony's form, and the
              email inbox it was delivered to. We will be plain about this — there is no automated
              deletion schedule today. Submissions stay in those two places until someone deletes them
              by hand.
            </p>
            <p>
              You can ask us to delete yours at any time, and we will remove it from both the Formspree
              dashboard and the inbox.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream privacy-rights">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">Your Choices</p>
            <h2>Access, correction and deletion</h2>
            <p>
              You can ask us for a copy of what you sent, ask us to correct it, or ask us to delete it.
              To make any of those requests, reach us through {contactLink}, or send a message to the
              colony's public Instagram account, @sigmachiwashu.
            </p>
            <div className="legal__callout">
              <p>
                Because the only record we hold is the message you sent us, requests are handled by a
                student volunteer, not a support desk. We will confirm when a request has been carried
                out. Please give us a reasonable amount of time during term.
              </p>
            </div>
            <p>
              Depending on where you live, you may have additional rights under local privacy law. We
              handle every request the same way regardless of where it comes from.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal privacy-other">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <h2>Age</h2>
            <p>
              This site is aimed at students enrolled at Washington University in St. Louis. It is not
              directed to children under 13, and we do not knowingly collect information from them. If
              you believe a child has sent us something through the form, contact us and we will delete
              it.
            </p>
            <h2>Server logs</h2>
            <p>
              The site is hosted on GitHub Pages. Like any web host, GitHub's infrastructure logs
              requests it serves, which can include IP addresses. The colony does not operate that
              logging, does not configure it, and has no access to those logs — they are governed by
              GitHub's own privacy practices.
            </p>
            <h2>Changes to this policy</h2>
            <p>
              If what the site does changes — a new form field, analytics being switched on, an embed
              being enabled — this page is updated and the date at the top changes with it. There is no
              separate notification list.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal__cta privacy-cta">
        <div className="container legal__cta-inner">
          <Reveal>
            <h2>Questions About Your Information?</h2>
            <p>Ask us directly. The same form is the fastest way to reach the colony.</p>
            <CTAButton to="/contact" variant="filled">
              Get in Touch
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
