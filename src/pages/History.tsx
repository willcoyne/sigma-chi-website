import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import Timeline from "../components/Timeline";
import IndexRow from "../components/IndexRow";
import MaskedText from "../components/motion/MaskedText";
import ScrollRail from "../components/motion/ScrollRail";
import ScrollWordReveal from "../components/motion/ScrollWordReveal";
import VelocityMarquee from "../components/motion/VelocityMarquee";
import Magnetic from "../components/motion/Magnetic";
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
        <div className="container section-split section-split--rail">
          <ScrollRail />
          <Reveal className="section-split__head">
            <p className="eyebrow">{nationalFacts.founded}</p>
            <MaskedText text="Seven Students, One Idea" />
            <p className="section-split__note">{nationalFacts.foundedLocation}</p>
          </Reveal>
          <div className="section-split__body">
            <Reveal>
              <p className="lede">
                Seven students chose to break away from an existing society and build something of
                their own — a fraternity founded on friendship, justice and learning rather than
                convenience.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Every chapter and colony that has followed, including the one now forming at WashU,
                traces back to that decision. The fraternity they started has outlived all seven of
                them by more than a century, and the standard they set is still the one a colony has
                to meet before it earns a charter.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section history-founders">
        <div className="container section-split">
          <div className="section-split__head">
            <Reveal>
              <p className="eyebrow">The Constantine Seven</p>
              <MaskedText text="The Founders" />
              <p className="section-split__note">Miami University, 1855</p>
            </Reveal>
          </div>
          <ol className="index-list section-split__body">
            {founders.map((name, i) => (
              <IndexRow
                key={name}
                as="li"
                index={i}
                ordinal={String(i + 1).padStart(2, "0")}
                title={name}
              />
            ))}
          </ol>
        </div>
      </section>

      <VelocityMarquee
        items={["Oxford, Ohio", "June 28 1855", "Seven Founders", nationalFacts.motto]}
        tone="navy"
      />

      <section className="section history-timeline">
        <div className="container section-split">
          <Reveal className="section-split__head">
            <p className="eyebrow">From Oxford, Ohio to St. Louis</p>
            <MaskedText text="How We Got Here" />
          </Reveal>
          <div className="section-split__body">
            <Timeline items={timeline} />
          </div>
        </div>
      </section>

      <ScrollWordReveal
        kicker="A New Colony"
        statement="This is not a revival. No borrowed history, no inherited roster — a founding class starting Sigma Chi at WashU for the first time."
        footnote={colony.note}
        tone="cream"
      />

      <section className="section bleed-band history-cta">
        <div className="container history-cta__inner">
          <Reveal>
            <p className="eyebrow">What Happens Next</p>
            <MaskedText text="The Next Chapter Starts Now" />
            <p>Meet the founding fathers building Sigma Chi's future at WashU.</p>
            <Magnetic>
              <CTAButton to="/colony" variant="outline">
                Meet the Colony
              </CTAButton>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
