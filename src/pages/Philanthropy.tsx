import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import StatCounter from "../components/StatCounter";
import SectionDivider from "../components/SectionDivider";
import { nationalFacts } from "../data/content";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./Philanthropy.css";

export default function Philanthropy() {
  useDocumentMeta(
    "Philanthropy",
    "The Huntsman Cancer Foundation has been Sigma Chi's sole national philanthropic partner since December 2012. The WashU colony is joining that work.",
  );

  return (
    <>
      <HeroBanner
        eyebrow="Philanthropy"
        title="Standing With Huntsman Cancer Foundation"
        subtitle={`Since ${nationalFacts.philanthropySince}, the Huntsman Cancer Foundation has been Sigma Chi's sole national philanthropic partner. It's a commitment the WashU colony is joining from day one.`}
        size="small"
      />

      <section className="section philanthropy-stats">
        <SectionDivider count={10} tone="navy" flip className="philanthropy-stats__divider-top" />
        <div className="container philanthropy-stats__grid">
          <Reveal delay={0}>
            <StatCounter value={2012} label="Partnership With Huntsman Began" />
          </Reveal>
          <Reveal delay={0.08}>
            <StatCounter value={31} suffix="M+" label="Pledged Nationally as of 2025" />
          </Reveal>
          <Reveal delay={0.16}>
            <StatCounter value={250000} suffix="+" label="Living Sigma Chi Alumni" />
          </Reveal>
        </div>
      </section>

      <section className="section philanthropy-detail">
        <div className="container philanthropy-detail__inner">
          <Reveal>
            <p className="eyebrow">A National Commitment</p>
            <h2>One Partner, One Fight</h2>
            <p>
              Unlike fraternities that support a rotating slate of causes, Sigma Chi has kept its national
              philanthropic focus on a single partner: the Huntsman Cancer Foundation. Since{" "}
              {nationalFacts.philanthropySince}, that relationship has grown into {nationalFacts.philanthropyPledged},
              funding cancer research and care through the work of chapters and colonies across the country.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section philanthropy-local">
        <div className="container philanthropy-local__inner">
          <Reveal>
            <h2>Building Our Part of It</h2>
            <p>
              As a new colony, we're still establishing our own on-campus participation in Sigma Chi's
              partnership with Huntsman Cancer Foundation. As the founding class grows, look for the
              colony's own philanthropy efforts at WashU to take shape alongside it — built by this founding
              class, not inherited from anyone before them.
            </p>
            <CTAButton to="/contact" variant="outline-dark">
              Get Involved
            </CTAButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
