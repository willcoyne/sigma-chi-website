import HeroBanner from "../components/HeroBanner";
import CTAButton from "../components/CTAButton";
import Reveal from "../components/Reveal";
import "./NotFound.css";

export default function NotFound() {
  return (
    <>
      <HeroBanner
        eyebrow="404"
        title="Page Not Found"
        subtitle="This page isn't here — the link may be out of date, or the address may have a typo in it."
        size="small"
      />

      <section className="section not-found">
        <div className="container not-found__inner">
          <Reveal>
            <h2>Let's Get You Back on Track</h2>
            <p>
              Head back to the front page to read about the colony, or reach out directly if you were
              looking for something specific and couldn't find it.
            </p>
            <div className="not-found__actions">
              <CTAButton to="/" variant="filled">
                Back to Home
              </CTAButton>
              <CTAButton to="/contact" variant="outline-dark">
                Get in Touch
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
