import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import StatusBadge from "../components/StatusBadge";
import QuoteBlock from "../components/QuoteBlock";
import InstagramEmbed from "../components/InstagramEmbed";
import IndexRow from "../components/IndexRow";
import PhotoBand from "../components/PhotoBand";
import MaskedText from "../components/motion/MaskedText";
import ScrollRail from "../components/motion/ScrollRail";
import ScrollWordReveal from "../components/motion/ScrollWordReveal";
import Magnetic from "../components/motion/Magnetic";
import { colony, officers, university } from "../data/content";
import photoWide from "../assets/colony-founding-class.jpg";
import photoNarrow from "../assets/colony-founding-class-900.jpg";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./Colony.css";

export default function Colony() {
  useDocumentMeta(
    "The Colony Today",
    "What being a colony means, and where ours stands: a founding class recruiting at WashU, in Good Standing with the Interfraternity Council.",
  );

  return (
    <>
      <HeroBanner
        eyebrow="The Colony Today"
        title="Founding Fathers, Building From Scratch"
        subtitle={`In spring 2026, Sigma Chi began recruiting its first class of founding fathers at ${university.name} — already in Good Standing with WashU's Interfraternity Council.`}
        size="small"
      />

      <section className="section colony-explainer">
        <div className="container section-split section-split--rail">
          <ScrollRail />
          <Reveal className="section-split__head">
            <p className="eyebrow">Colony vs. Chapter</p>
            <MaskedText text="What It Means to Be a Colony" />
            <p className="section-split__note">Pre-charter, spring 2026</p>
          </Reveal>
          <div className="section-split__body">
            <Reveal>
              <p className="lede">
                A colony is a fraternity in its developing stage — committed to Sigma Chi, but not
                yet holding a permanent charter.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Before a colony can become a fully chartered chapter, its founding members have to
                prove out the fraternity's standards for themselves: building real membership, real
                academics, and real community involvement, with the support of Sigma Chi's national
                organization along the way.
              </p>
              <p>
                That's exactly the work underway at WashU right now. There's no shortcut and no
                borrowed history to lean on — just a founding class establishing what Sigma Chi looks
                like on this campus for the first time.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bleed-band colony-status">
        <div className="container colony-status__inner">
          <Reveal>
            <StatusBadge>{colony.ifcStatus}</StatusBadge>
          </Reveal>
          <QuoteBlock
            quote={colony.coordinatorQuote}
            attribution={`${colony.expansionCoordinator}, Expansion Coordinator`}
            tone="dark"
          />
        </div>
      </section>

      <PhotoBand
        src={photoWide}
        srcSet={`${photoNarrow} 900w, ${photoWide} 1800w`}
        width={1800}
        height={1012}
        alt="Around twenty people from Sigma Chi's WashU colony standing together for a group photo indoors."
        caption="The colony at Washington University in St. Louis"
      />

      <section className="section colony-leadership">
        <div className="container section-split">
          <Reveal className="section-split__head">
            <p className="eyebrow">Who's Involved</p>
            <MaskedText text="The People Behind It" />
            <p className="section-split__note">Founding class officers</p>
          </Reveal>
          <div className="section-split__body">
            <div className="index-list">
              {officers.map((officer, i) => (
                <IndexRow
                  key={officer.name}
                  index={i}
                  ordinal={String(i + 1).padStart(2, "0")}
                  title={officer.name}
                  meta={officer.title}
                >
                  <p>{officer.body}</p>
                </IndexRow>
              ))}
            </div>

            <Reveal delay={0.1} className="colony-oversight">
              <p className="eyebrow">National Oversight</p>
              <h3>{colony.grandPraetor}</h3>
              <p>
                As Grand Praetor, {colony.grandPraetor} provides Sigma Chi's national oversight for
                the WashU colony as it works toward a future charter. The role sits outside the
                colony rather than within it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ScrollWordReveal
        kicker="The Work Ahead"
        statement="There is no shortcut and no borrowed history to lean on — only what this founding class builds."
        tone="cream"
      />

      <InstagramEmbed />

      <section className="section colony-cta">
        <div className="container colony-cta__inner">
          <Reveal>
            <p className="eyebrow">Founding Class</p>
            <MaskedText text="Want to Be Part of It?" />
            <p className="lede">
              Reach out and start the conversation about joining Sigma Chi at WashU.
            </p>
            <Magnetic>
              <CTAButton to="/contact" variant="filled">
                Get in Touch
              </CTAButton>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
