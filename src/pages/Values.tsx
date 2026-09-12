import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";
import ValueCard from "../components/ValueCard";
import ShieldCrest from "../components/ShieldCrest";
import IndexRow from "../components/IndexRow";
import CTAButton from "../components/CTAButton";
import MaskedText from "../components/motion/MaskedText";
import ScrollRail from "../components/motion/ScrollRail";
import ScrollWordReveal from "../components/motion/ScrollWordReveal";
import VelocityMarquee from "../components/motion/VelocityMarquee";
import Magnetic from "../components/motion/Magnetic";
import { threeGreatAims, nationalFacts, colony } from "../data/content";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./Values.css";

const symbols = [
  {
    title: "The Norman Shield",
    meta: "The Badge",
    body: "Sigma Chi's badge takes the form of a Norman shield — a symbol of the protection brothers owe one another, and of a fraternity built to defend its members' character as much as its name.",
  },
  {
    title: "The White Cross",
    meta: "The Mark",
    body: "A plain white cross sits at the shield's center, echoing the sign referenced in the fraternity's motto — a mark of the conviction that guides members long after their undergraduate years.",
  },
  {
    title: nationalFacts.sweetheartSong.title,
    meta: nationalFacts.sweetheartSong.year,
    body: `Written in ${nationalFacts.sweetheartSong.year} by ${nationalFacts.sweetheartSong.authors}, the song has become one of the fraternity's most enduring cultural touchstones, still sung by brothers generations after its debut.`,
  },
];

export default function Values() {
  useDocumentMeta(
    "Values & Creed",
    "Friendship, Justice and Learning — the Three Great Aims behind the motto In Hoc Signo Vinces, plus the shield, the white cross and the Sweetheart song.",
  );

  return (
    <>
      <HeroBanner
        eyebrow="Values & Creed"
        title="Friendship. Justice. Learning."
        subtitle={`"${nationalFacts.motto}" — ${nationalFacts.mottoTranslation}. Three great aims have guided Sigma Chi since 1855, and they're the foundation the WashU colony is building on today.`}
        size="small"
      />

      <section className="section aims-detail">
        <div className="container section-split section-split--rail">
          <ScrollRail />
          <Reveal className="section-split__head">
            <p className="eyebrow">The Three Great Aims</p>
            <MaskedText text="What Every Brother Signs Up For" />
            <p className="section-split__note">Unchanged since 1855</p>
          </Reveal>
          <div className="index-list section-split__body">
            {threeGreatAims.map((aim, i) => (
              <ValueCard key={aim.key} title={aim.title} body={aim.body} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <VelocityMarquee
        items={threeGreatAims.map((aim) => aim.title)}
        tone="gold"
        baseVelocity={1.8}
      />

      <section className="motto-section">
        <div className="container motto-section__inner">
          <div className="motto-section__shield">
            <ShieldCrest size={260} animate />
          </div>
          <div className="motto-section__text">
            <Reveal>
              <p className="eyebrow">The Motto</p>
            </Reveal>
            <MaskedText text={nationalFacts.motto} as="h2" className="motto-section__latin" />
            <Reveal delay={0.25}>
              <p className="motto-section__translation">
                &ldquo;{nationalFacts.mottoTranslation}&rdquo;
              </p>
              <p>
                The phrase is drawn from the story of the Roman emperor Constantine, who is said to
                have seen a sign of the cross in the sky before a decisive battle, along with the
                words <em>in hoc signo vinces</em>. Sigma Chi's founders adopted the motto as a call
                to conviction — that the values a man stands for are what carry him through, not the
                odds in front of him.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section symbols-section">
        <div className="container section-split">
          <Reveal className="section-split__head">
            <p className="eyebrow">Symbols &amp; Song</p>
            <MaskedText text="The Shield, the Cross, and the Sweetheart" />
          </Reveal>
          <div className="index-list section-split__body">
            {symbols.map((symbol, i) => (
              <IndexRow
                key={symbol.title}
                index={i}
                ordinal={String(i + 1).padStart(2, "0")}
                title={symbol.title}
                meta={symbol.meta}
              >
                <p>{symbol.body}</p>
              </IndexRow>
            ))}
          </div>
        </div>
      </section>

      <ScrollWordReveal
        kicker="Our Own Traditions"
        statement="As the founding class grows, the colony's traditions will take shape around these same three aims — not borrowed from anyone else."
        footnote={colony.note}
        tone="navy"
      />

      <section className="section values-building">
        <div className="container values-building__inner">
          <Reveal>
            <p className="eyebrow">Where That Leaves Us</p>
            <MaskedText text="Building Our Own Traditions" />
            <p className="lede">
              Three aims, one campus, and a founding class that gets to decide what they look like
              here.
            </p>
            <Magnetic>
              <CTAButton to="/contact" variant="filled">
                Join Our Founding Class
              </CTAButton>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
