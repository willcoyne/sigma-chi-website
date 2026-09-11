import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import StatusBadge from "../components/StatusBadge";
import QuoteBlock from "../components/QuoteBlock";
import InstagramEmbed from "../components/InstagramEmbed";
import { colony, university } from "../data/content";
import "./Colony.css";

export default function Colony() {
  return (
    <>
      <HeroBanner
        eyebrow="The Colony Today"
        title="Founding Fathers, Building From Scratch"
        subtitle={`In spring 2026, Sigma Chi began recruiting its first class of founding fathers at ${university.name} — already in Good Standing with WashU's Interfraternity Council.`}
        size="small"
      />

      <section className="section colony-explainer">
        <div className="container colony-explainer__inner">
          <Reveal>
            <p className="eyebrow">Colony vs. Chapter</p>
            <h2>What It Means to Be a Colony</h2>
            <p>
              A colony is a fraternity in its developing stage — a group of men who have committed to Sigma
              Chi but haven't yet earned a permanent charter. Before a colony can become a fully chartered
              chapter, its founding members have to prove out the fraternity's standards for themselves:
              building real membership, real academics, and real community involvement, with the support
              of Sigma Chi's national organization along the way.
            </p>
            <p>
              That's exactly the work underway at WashU right now. There's no shortcut and no borrowed
              history to lean on — just a founding class establishing what Sigma Chi looks like on this
              campus for the first time.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section colony-status">
        <div className="container colony-status__inner">
          <Reveal>
            <StatusBadge>{colony.ifcStatus}</StatusBadge>
            <QuoteBlock quote={colony.coordinatorQuote} attribution={`${colony.expansionCoordinator}, Expansion Coordinator`} />
          </Reveal>
        </div>
      </section>

      <section className="section colony-leadership">
        <div className="container colony-leadership__grid">
          <Reveal>
            <div className="colony-leadership__card">
              <p className="eyebrow">National Oversight</p>
              <h3>{colony.grandPraetor}</h3>
              <p>
                As Grand Praetor, {colony.grandPraetor} provides Sigma Chi's national oversight for the
                WashU colony as it works toward a future charter.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="colony-leadership__card">
              <p className="eyebrow">Founding Father</p>
              <h3>{colony.foundingMember}</h3>
              <p>
                {colony.foundingMember} is among the founding fathers building this colony's first class —
                the group that future brothers will look back on as the ones who started it all.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <InstagramEmbed />

      <section className="section colony-cta">
        <div className="container colony-cta__inner">
          <Reveal>
            <h2>Want to Be Part of the Founding Class?</h2>
            <p>Reach out and start the conversation about joining Sigma Chi at WashU.</p>
            <CTAButton to="/contact" variant="filled">
              Get in Touch
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
