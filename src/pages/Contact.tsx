import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";
import ContactForm from "../components/ContactForm";
import CTAButton from "../components/CTAButton";
import { colony, university } from "../data/content";
import "./Contact.css";

export default function Contact() {
  return (
    <>
      <HeroBanner
        eyebrow="Join Us"
        title="Become a Founding Father"
        subtitle="Sigma Chi is rebuilding at WashU from the ground up — if you're interested in helping shape it, we want to hear from you."
        size="small"
      />

      <section className="section contact-main">
        <div className="container contact-main__grid">
          <Reveal className="contact-main__copy">
            <p className="eyebrow">Why Now</p>
            <h2>Shape the Colony From Day One</h2>
            <p>
              Founding fathers don't inherit a culture — they build one. Joining Sigma Chi's colony at WashU
              means having a direct hand in how friendship, justice, and learning actually get lived out on
              this campus, from the first members recruited to the traditions that get started along the
              way.
            </p>
            <p>
              There's no roster to fit into and no precedent to follow. Just a small founding class, backed
              by Sigma Chi's national organization, doing the early work of building something that lasts.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="contact-main__form">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="section contact-follow">
        <div className="container contact-follow__inner">
          <Reveal>
            <span className="washu-hairline" aria-hidden="true" />
            <p className="contact-follow__campus">{university.name} &middot; {university.campus}</p>
            <p className="contact-follow__ig-label">
              Follow the colony's progress on Instagram at {colony.instagram}
            </p>
            <CTAButton href="https://instagram.com/sigmachiwashu" variant="outline-dark">
              Follow on Instagram
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
