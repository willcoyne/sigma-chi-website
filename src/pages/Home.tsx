import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import ValueCard from "../components/ValueCard";
import StatCounter from "../components/StatCounter";
import StatusBadge from "../components/StatusBadge";
import PhilanthropyBand from "../components/PhilanthropyBand";
import SectionDivider from "../components/SectionDivider";
import MaskedText from "../components/motion/MaskedText";
import ScrollRail from "../components/motion/ScrollRail";
import VelocityMarquee from "../components/motion/VelocityMarquee";
import Magnetic from "../components/motion/Magnetic";
import { threeGreatAims, colony, university, nationalFacts } from "../data/content";
import { useDocumentMeta, HOME_DOCUMENT_TITLE } from "../hooks/useDocumentMeta";
import "./Home.css";

export default function Home() {
  useDocumentMeta(
    HOME_DOCUMENT_TITLE,
    "Sigma Chi at Washington University in St. Louis — the Beta Colony. Friendship, Justice, Learning. In Hoc Signo Vinces. Now recruiting founding fathers.",
  );

  return (
    <>
      <HeroBanner
        eyebrow={`${university.name} · Beta Colony`}
        title="Leaders of Men. Est. 1855."
        subtitle='"In Hoc Signo Vinces" — In this sign you will conquer. Sigma Chi is returning to Washington University in St. Louis, building a new colony on friendship, justice, and learning.'
      >
        <Magnetic>
          <CTAButton to="/contact" variant="filled">
            Join Our Founding Class
          </CTAButton>
        </Magnetic>
        <CTAButton to="/history" variant="outline">
          Our Story
        </CTAButton>
      </HeroBanner>

      <section className="section aims-teaser">
        <div className="container section-split section-split--rail">
          <ScrollRail />
          <Reveal className="section-split__head">
            <p className="eyebrow">The Three Great Aims</p>
            <MaskedText text="What We Stand For" />
            <p className="section-split__note">{nationalFacts.motto}</p>
          </Reveal>
          <div className="index-list section-split__body">
            {threeGreatAims.map((aim, i) => (
              <ValueCard key={aim.key} title={aim.title} body={aim.body} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="stat-strip">
        <SectionDivider count={10} tone="navy" flip className="stat-strip__divider-top" />
        <div className="container stat-strip__grid">
          <StatCounter value={1855} label="Founded Nationally" />
          <StatCounter value={7} label="Founding Fathers, 1855" />
          <StatCounter value={2024} label="Return to WashU Approved" />
          <StatCounter value={240} suffix="+" label="Chapters &amp; Colonies Nationally" />
        </div>
      </section>

      <VelocityMarquee
        items={["In Hoc Signo Vinces", "Friendship", "Justice", "Learning"]}
        tone="gold"
      />

      <section className="section colony-banner">
        <div className="container colony-banner__inner">
          <Reveal>
            <StatusBadge>{colony.ifcStatus}</StatusBadge>
            <MaskedText text="We're Building Something New" />
            <p className="lede">
              In spring 2026, a new class of founding fathers began forming Sigma Chi's colony at
              WashU — with no connection to the fraternity's former Tau Tau chapter.
            </p>
            <p className="colony-banner__body">
              This is a clean start, focused, in the words of our expansion coordinator, on
              &ldquo;community service, more academics, and more philanthropy.&rdquo;
            </p>
            <Magnetic>
              <CTAButton to="/colony" variant="outline-dark">
                Meet the Colony
              </CTAButton>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <PhilanthropyBand />
    </>
  );
}
