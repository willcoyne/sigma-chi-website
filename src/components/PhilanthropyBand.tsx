import Reveal from "./Reveal";
import CTAButton from "./CTAButton";
import { nationalFacts } from "../data/content";
import "./PhilanthropyBand.css";

export default function PhilanthropyBand() {
  return (
    <section className="philanthropy-band">
      <div className="container philanthropy-band__inner">
        <Reveal>
          <p className="eyebrow">National Philanthropy</p>
          <h2>Huntsman Cancer Foundation</h2>
          <p className="philanthropy-band__body">
            Since {nationalFacts.philanthropySince}, the Huntsman Cancer Foundation has been Sigma Chi's sole
            national philanthropic partner — {nationalFacts.philanthropyPledged}. As a growing colony, we're
            building our own on-campus participation in that mission from day one.
          </p>
          <CTAButton to="/philanthropy" variant="outline-dark">
            Learn About Our Philanthropy
          </CTAButton>
        </Reveal>
      </div>
    </section>
  );
}
