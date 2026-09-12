import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import StatCounter from "../components/StatCounter";
import SectionDivider from "../components/SectionDivider";
import MaskedText from "../components/motion/MaskedText";
import ScrollRail from "../components/motion/ScrollRail";
import ScrollWordReveal from "../components/motion/ScrollWordReveal";
import VelocityMarquee from "../components/motion/VelocityMarquee";
import Magnetic from "../components/motion/Magnetic";
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

      <section className="philanthropy-stats">
        <SectionDivider count={10} tone="navy" flip className="philanthropy-stats__divider-top" />
        <div className="container philanthropy-stats__grid">
          <StatCounter value={2012} label="Partnership With Huntsman Began" />
          <StatCounter value={31} suffix="M+" label="Pledged Nationally as of 2025" />
          <StatCounter value={250000} suffix="+" label="Living Sigma Chi Alumni" />
        </div>
      </section>

      <ScrollWordReveal
        kicker="A National Commitment"
        statement="One partner. One fight. Every chapter and colony in the country pulling in the same direction."
        tone="cream"
      />

      <section className="section philanthropy-detail">
        <div className="container section-split section-split--rail">
          <ScrollRail />
          <Reveal className="section-split__head">
            <p className="eyebrow">Why Only One</p>
            <MaskedText text="One Partner, One Fight" />
            <p className="section-split__note">Since {nationalFacts.philanthropySince}</p>
          </Reveal>
          <div className="section-split__body">
            <Reveal>
              <p className="lede">
                Unlike fraternities that support a rotating slate of causes, Sigma Chi has kept its
                national philanthropic focus on a single partner.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Since {nationalFacts.philanthropySince}, that relationship has grown into{" "}
                {nationalFacts.philanthropyPledged}, funding cancer research and care through the
                work of chapters and colonies across the country. Concentrating on one partner is
                what makes a number that size possible in the first place.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <VelocityMarquee
        items={["Huntsman Cancer Foundation", "Since 2012", "$31M+ Pledged"]}
        tone="navy"
        baseVelocity={2}
      />

      <section className="section philanthropy-local">
        <div className="container philanthropy-local__inner">
          <Reveal>
            <p className="eyebrow">At WashU</p>
            <MaskedText text="Building Our Part of It" />
            <p>
              As a new colony, we're still establishing our own on-campus participation in Sigma
              Chi's partnership with Huntsman Cancer Foundation. As the founding class grows, look
              for the colony's own philanthropy efforts at WashU to take shape alongside it — built
              by this founding class, not inherited from anyone before them.
            </p>
            <Magnetic>
              <CTAButton to="/contact" variant="outline-dark">
                Get Involved
              </CTAButton>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
