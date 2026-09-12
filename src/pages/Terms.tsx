import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";
import CTAButton from "../components/CTAButton";
import ScrollRail from "../components/motion/ScrollRail";
import { LEGAL_LAST_UPDATED, legalContactRoute } from "../data/legal";
import "./Legal.css";
import "./Terms.css";

export default function Terms() {
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
        title="Terms of Use"
        subtitle="The ground rules for this website: what it is, what it isn't, and what belongs to whom."
        size="small"
      />

      <section className="section legal terms-intro">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="legal__updated">Last updated: {LEGAL_LAST_UPDATED}</p>
            <h2>About this site</h2>
            <p className="legal__lead">
              washusigmachi.org is an informational and recruitment site for the Sigma Chi colony at
              Washington University in St. Louis. By using it, you agree to the terms on this page. If
              you do not agree with them, please don't use the site.
            </p>
            <p>
              Everything here is provided for general information. The colony tries to keep the site
              accurate, but it is maintained by students between classes, and details about membership,
              events and timelines can change without the page catching up. The site is provided
              &ldquo;as is,&rdquo; without warranties of any kind, express or implied, including any
              implied warranty of merchantability, fitness for a particular purpose, or
              non-infringement. The colony and its members are not liable for any loss arising from
              reliance on the content here, to the fullest extent the law allows.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream terms-unofficial">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">Status</p>
            <h2>This is an unofficial colony site</h2>
            <div className="legal__callout">
              <p>
                Unofficial colony site. Not an official publication of Sigma Chi Fraternity
                (International Headquarters) or Washington University in St. Louis.
              </p>
            </div>
            <p>
              The same line appears in the footer of every page, and it means what it says. Nothing on
              this site is an official statement of Sigma Chi Fraternity or of the university, and
              neither organization reviews or approves what is published here. Where an official
              position matters — recruitment rules, university policy, fraternity governance — the
              relevant organization's own materials govern, not this site.
            </p>
            <p>
              The colony is pre-charter. It is a colony, not yet a chartered chapter, and nothing here
              should be read as promising that a charter will be granted or when.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal terms-ip">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">Ownership</p>
            <h2>Content and marks</h2>
            <p>
              The written content, layout and code of this site were produced by the colony for the
              colony's own use. You are welcome to read it, link to it, and quote short passages with
              attribution. Republishing pages wholesale, or reusing the site's design to represent
              another organization, is not permitted.
            </p>
            <p>
              The names and marks referenced here belong to other people:
            </p>
            <ul className="legal__list">
              <li>
                &ldquo;Sigma Chi,&rdquo; the White Cross, the coat of arms, the Norman Shield and
                related names, badges and symbols are the property of Sigma Chi Fraternity. They appear
                here under the colony's affiliation with the fraternity, not as a transfer of any
                rights.
              </li>
              <li>
                &ldquo;Washington University in St. Louis&rdquo; and &ldquo;WashU,&rdquo; along with the
                university's seals and logos, belong to the university.
              </li>
              <li>
                Any other product, service or organization name mentioned on the site belongs to its
                respective owner.
              </li>
            </ul>
            <p>
              Nothing on this site grants you a license to use any of those marks. If you believe
              something published here infringes your rights, tell us through {contactLink} and we will
              look into it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream terms-links">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">Third Parties</p>
            <h2>Links and outside services</h2>
            <p>
              The site links to and relies on services the colony does not control, including Instagram
              (Meta), Formspree, which handles contact form submissions, and the Huntsman Cancer
              Foundation. Following a link takes you to somebody else's site, governed by their terms
              and their privacy policy.
            </p>
            <p>
              A link here is not an endorsement of everything on the other end, and the colony is not
              responsible for the availability, accuracy or conduct of those sites. Third-party
              services can change, break or disappear without notice. What happens to information you
              send through the contact form is described on the{" "}
              <Link className="legal__link" to="/privacy">
                privacy policy
              </Link>{" "}
              page.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal terms-money">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">No Solicitation</p>
            <h2>This site does not ask for money</h2>
            <p>
              There is no donate button, no payment form, no merchandise, no dues portal, and no
              affiliate link anywhere on this site. It does not collect money from anyone, and it never
              asks you to pay or pledge anything.
            </p>
            <p>
              The{" "}
              <Link className="legal__link" to="/philanthropy">
                philanthropy page
              </Link>{" "}
              is informational. It describes Sigma Chi Fraternity's national partnership with the
              Huntsman Cancer Foundation and the colony's intention to take part in it. It is not a
              fundraising appeal, not a solicitation of donations, and not a request for contributions
              on behalf of the Huntsman Cancer Foundation or anyone else. If you want to give to the
              Huntsman Cancer Foundation, do it through that organization directly.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal legal--cream terms-form">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <p className="eyebrow">The Contact Form</p>
            <h2>Sending a message is not an application</h2>
            <p>
              Filling out the contact form starts a conversation. It is not an application for
              membership, not a bid, and not an offer of one. It creates no obligation on you to join
              and no obligation on the colony to extend an invitation. Membership decisions are made
              through the colony's recruitment process and Sigma Chi's own standards, not through this
              website.
            </p>
            <p>
              Please send only information you are comfortable sharing, keep it accurate, and don't
              submit anything unlawful, abusive, or belonging to someone else. We may decline to
              respond to messages that fall outside what the form is for.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal terms-law">
        <div className="container legal__inner legal__body">
          <ScrollRail />
          <Reveal>
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the State of Missouri, without regard to its
              conflict-of-laws rules. Any dispute arising from the site or these terms will be brought
              in the state or federal courts located in Missouri.
            </p>
            <h2>Changes</h2>
            <p>
              These terms may be updated as the site changes. The date at the top of this page shows
              when it was last revised, and continuing to use the site after a revision means the
              current version applies.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section legal__cta terms-cta">
        <div className="container legal__cta-inner">
          <Reveal>
            <h2>Something Here Look Wrong?</h2>
            <p>If a page is out of date or a mark is used incorrectly, tell us and we'll fix it.</p>
            <CTAButton to="/contact" variant="filled">
              Get in Touch
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
