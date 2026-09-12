import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import ValueCard from "../components/ValueCard";
import StatCounter from "../components/StatCounter";
import StatusBadge from "../components/StatusBadge";
import PhilanthropyBand from "../components/PhilanthropyBand";
import SectionDivider from "../components/SectionDivider";
import { threeGreatAims, colony, university } from "../data/content";
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
        <CTAButton to="/contact" variant="filled">
          Join Our Founding Class
        </CTAButton>
        <CTAButton to="/history" variant="outline">
          Our Story
        </CTAButton>
      </HeroBanner>

      <section className="section aims-teaser">
        <div className="container aims-teaser__layout">
          <Reveal className="aims-teaser__head">
            <p className="eyebrow">The Three Great Aims</p>
            <h2>What We Stand For</h2>
          </Reveal>
          <div className="aims-teaser__grid">
            {threeGreatAims.map((aim, i) => (
              <Reveal key={aim.key} delay={i * 0.08}>
                <ValueCard title={aim.title} body={aim.body} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="stat-strip">
        <SectionDivider count={10} tone="navy" flip className="stat-strip__divider-top" />
        <div className="container stat-strip__grid">
          <Reveal delay={0}>
            <StatCounter value={1855} label="Founded Nationally" />
          </Reveal>
          <Reveal delay={0.08}>
            <StatCounter value={7} label="Founding Fathers, 1855" />
          </Reveal>
          <Reveal delay={0.16}>
            <StatCounter value={2024} label="Return to WashU Approved" />
          </Reveal>
          <Reveal delay={0.24}>
            <StatCounter value={240} suffix="+" label="Chapters &amp; Colonies Nationally" />
          </Reveal>
        </div>
      </section>

      <section className="section colony-banner">
        <div className="container colony-banner__inner">
          <Reveal>
            <StatusBadge>{colony.ifcStatus}</StatusBadge>
            <h2>We're Building Something New</h2>
            <p className="colony-banner__body">
              In spring 2026, a new class of founding fathers began forming Sigma Chi's colony at WashU — with no
              connection to the fraternity's former Tau Tau chapter. This is a clean start, focused, in the words of
              our expansion coordinator, on &ldquo;community service, more academics, and more philanthropy.&rdquo;
            </p>
            <CTAButton to="/colony" variant="outline-dark">
              Meet the Colony
            </CTAButton>
          </Reveal>
        </div>
      </section>

      <PhilanthropyBand />
    </>
  );
}
