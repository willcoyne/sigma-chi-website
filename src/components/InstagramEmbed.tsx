import Reveal from "./Reveal";
import CTAButton from "./CTAButton";
import { colony } from "../data/content";
import "./InstagramEmbed.css";

const PROFILE_URL = "https://instagram.com/sigmachiwashu";

/*
 * Centralizes the colony's "Follow Along" Instagram section so it lives in
 * one place instead of being hand-copied onto every page that wants it.
 *
 * There's no embed-service account connected yet, so by default this just
 * renders the same static bio + "Follow on Instagram" link that used to be
 * hard-coded on the Colony page. Once the colony sets one up, set the
 * VITE_INSTAGRAM_EMBED_URL environment variable and this will automatically
 * switch to rendering a real, live embedded feed instead.
 *
 * To go live later:
 *   1. Sign up @sigmachiwashu with a free Instagram-embed service, e.g.
 *      https://behold.so or https://snapwidget.com (both support embedding
 *      a public Instagram feed without needing Meta developer API access).
 *   2. Copy the embeddable feed URL that service gives you.
 *   3. Set VITE_INSTAGRAM_EMBED_URL to that URL (in a local .env file, or
 *      in the hosting provider's environment variable settings) and
 *      rebuild/redeploy the site.
 * No further code changes are required — this component reads the env var
 * at build time and swaps in the iframe automatically.
 */
export default function InstagramEmbed() {
  const embedUrl = import.meta.env.VITE_INSTAGRAM_EMBED_URL;

  return (
    <section className="section instagram-embed">
      <div className="container instagram-embed__inner">
        <Reveal>
          <p className="eyebrow">Follow Along</p>
          <h2>{colony.instagram}</h2>
          {embedUrl ? (
            <>
              <div className="instagram-embed__frame">
                <iframe
                  src={embedUrl}
                  title={`${colony.instagram} Instagram feed`}
                  loading="lazy"
                  className="instagram-embed__iframe"
                />
              </div>
              <CTAButton href={PROFILE_URL} variant="outline">
                Follow on Instagram
              </CTAButton>
            </>
          ) : (
            <>
              <p className="instagram-embed__bio">&ldquo;{colony.instagramBio}&rdquo;</p>
              <CTAButton href={PROFILE_URL} variant="outline">
                Follow on Instagram
              </CTAButton>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
