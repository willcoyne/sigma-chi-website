import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import Timeline from "../components/Timeline";
import { founders, timeline, colony, nationalFacts } from "../data/content";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./History.css";

export default function History() {
  useDocumentMeta(
    "Our History",
    "Sigma Chi began with seven students at Miami University in 1855. Follow that story through to the founding class now building a colony at WashU.",
  );

  return (
    <>
      <HeroBanner
        eyebrow="Our History"
        title="A Story Still Being Written"
        subtitle={`Sigma Chi was founded at Miami University on ${nationalFacts.founded}. Nearly 170 years later, that same fraternity is returning to Washington University in St. Louis — this time, written by a new founding class.`}
        size="small"
      />

      <section className="section history-intro">
        <div className="container">
          <Reveal className="history-intro__head">
            <p className="eyebrow">June 28, 1855</p>
            <h2>Seven Students, One Idea</h2>
            <p>
              Sigma Chi began at {nationalFacts.foundedLocation}, when seven students chose to break away
              from an existing society and build something of their own — a fraternity founded on
              friendship, justice, and learning rather than convenience. Every chapter and colony that has
              followed, including the one now forming at WashU, traces back to that decision.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="history-founders">
            <h3 className="history-founders__label">The Seven Founders</h3>
            <ol className="history-founders__grid">
              {founders.map((name, i) => (
                <li key={name} className="history-founders__item">
                  <span className="history-founders__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="history-founders__name">{name}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section history-timeline">
        <div className="container">
          <Reveal className="history-timeline__head">
            <p className="eyebrow">From Oxford, Ohio to St. Louis</p>
            <h2>How We Got Here</h2>
          </Reveal>
          <Timeline items={timeline} />
        </div>
      </section>

      <section className="section history-callout">
        <div className="container">
          <Reveal>
            <div className="history-callout__card">
              <h3>A New Colony, Not a Revival</h3>
              <p>{colony.note}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section history-cta">
        <div className="container history-cta__inner">
          <Reveal>
            <h2>The Next Chapter Starts Now</h2>
            <p>Meet the founding fathers building Sigma Chi's future at WashU.</p>
            <CTAButton to="/colony" variant="outline">
              Meet the Colony
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
