import HeroBanner from "../components/HeroBanner";
import Reveal from "../components/Reveal";
import ValueCard from "../components/ValueCard";
import ShieldCrest from "../components/ShieldCrest";
import { threeGreatAims, nationalFacts, colony } from "../data/content";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import "./Values.css";

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
        <div className="container">
          <Reveal className="aims-detail__head">
            <p className="eyebrow">The Three Great Aims</p>
            <h2>What Every Brother Signs Up For</h2>
          </Reveal>
          <div className="aims-detail__list">
            {threeGreatAims.map((aim, i) => (
              <Reveal key={aim.key} delay={i * 0.1} className="aims-detail__row">
                <ValueCard title={aim.title} body={aim.body} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section motto-section">
        <div className="container motto-section__inner">
          <Reveal className="motto-section__shield">
            <ShieldCrest size={120} />
          </Reveal>
          <Reveal delay={0.1} className="motto-section__text">
            <p className="eyebrow">The Motto</p>
            <h2>{nationalFacts.motto}</h2>
            <p className="motto-section__translation">&ldquo;{nationalFacts.mottoTranslation}&rdquo;</p>
            <p>
              The phrase is drawn from the story of the Roman emperor Constantine, who is said to have seen
              a sign of the cross in the sky before a decisive battle, along with the words <em>in hoc signo
              vinces</em>. Sigma Chi's founders adopted the motto as a call to conviction — that the values a
              man stands for are what carry him through, not the odds in front of him.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section symbols-section">
        <div className="container">
          <Reveal className="symbols-section__head">
            <p className="eyebrow">Symbols &amp; Song</p>
            <h2>The Shield, the Cross, and the Sweetheart</h2>
          </Reveal>
          <div className="symbols-section__grid">
            <Reveal delay={0.05}>
              <div className="symbols-card">
                <h3>The Norman Shield</h3>
                <p>
                  Sigma Chi's badge takes the form of a Norman shield — a symbol of the protection brothers
                  owe one another, and of a fraternity built to defend its members' character as much as its
                  name.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="symbols-card">
                <h3>The White Cross</h3>
                <p>
                  A plain white cross sits at the shield's center, echoing the sign referenced in the
                  fraternity's motto — a mark of the conviction that guides members long after their
                  undergraduate years.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="symbols-card">
                <h3>{nationalFacts.sweetheartSong.title}</h3>
                <p>
                  Written in {nationalFacts.sweetheartSong.year} by {nationalFacts.sweetheartSong.authors},
                  the song has become one of the fraternity's most enduring cultural touchstones,
                  still sung by brothers generations after its debut.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section values-building">
        <div className="container values-building__inner">
          <Reveal>
            <h2>Building Our Own Traditions</h2>
            <p>{colony.note}</p>
            <p className="values-building__forward">
              As the founding class grows, look for the WashU colony's own traditions to take shape around
              these same three aims — friendship, justice, and learning — rather than borrowing anyone
              else's.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
