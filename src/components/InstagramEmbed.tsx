import { useEffect, useRef, useState } from "react";
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
 * switch to offering a real, live embedded feed instead.
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
 * at build time and swaps in the consent gate automatically.
 *
 * Consent gate: even when the env var is set, the <iframe> is NOT mounted on
 * page view. An embedded frame is a request the visitor never asked to make —
 * it hands their IP address and user agent to the embed host (and, through it,
 * to Instagram) and lets that host set its own cookies. The referrer is
 * suppressed below, but the IP address cannot be.
 * So the frame only mounts after an explicit click, and visitors who just
 * want the feed can use the plain profile link instead, which sends nothing
 * anywhere until they choose to follow it.
 *
 * The choice is intentionally NOT persisted. This site writes no cookies and
 * nothing to localStorage or sessionStorage, the privacy policy says so, and
 * storing a consent flag would quietly make that untrue. Per-visit React
 * state only — reloading the page returns to the un-loaded state.
 */
export default function InstagramEmbed() {
  const embedUrl = import.meta.env.VITE_INSTAGRAM_EMBED_URL;
  const [feedLoaded, setFeedLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Clicking Load unmounts the button that had keyboard focus, which would
  // otherwise dump focus back to the top of the document. Move it onto the
  // newly mounted frame instead so a keyboard user carries on from here.
  useEffect(() => {
    if (feedLoaded) {
      frameRef.current?.focus();
    }
  }, [feedLoaded]);

  return (
    <section className="section instagram-embed">
      <div className="container instagram-embed__inner">
        <Reveal>
          <p className="eyebrow">Follow Along</p>
          <h2>{colony.instagram}</h2>
          {embedUrl ? (
            feedLoaded ? (
              <>
                <div className="instagram-embed__frame" ref={frameRef} tabIndex={-1}>
                  <iframe
                    src={embedUrl}
                    title={`${colony.instagram} Instagram feed`}
                    loading="lazy"
                    /* Don't tell the embed host which page of ours you came from. */
                    referrerPolicy="no-referrer"
                    /*
                     * Minimum the embed actually needs. allow-scripts lets the
                     * widget render its feed; allow-popups lets a post open in
                     * a new tab. allow-same-origin is required because the
                     * frame is served from the embed host's own origin and has
                     * to read its own cookies/storage and call its own API to
                     * fetch posts — without it the frame is forced into an
                     * opaque origin and the feed comes up empty. It does not
                     * grant access to this site's origin. Everything else
                     * (forms, top-level navigation, downloads) stays blocked.
                     */
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    className="instagram-embed__iframe"
                  />
                </div>
                <CTAButton href={PROFILE_URL} variant="outline">
                  Follow on Instagram
                </CTAButton>
              </>
            ) : (
              <div className="instagram-embed__gate">
                <p className="instagram-embed__gate-text">
                  The Instagram feed is hosted by a third party, not by us. Loading it shares your IP address
                  and browser details with that service and lets it set its own cookies. We don&rsquo;t load it
                  until you ask us to.
                </p>
                <p className="instagram-embed__gate-text instagram-embed__gate-text--fine">
                  This applies to this visit only &mdash; we store nothing on your device to remember it. The
                  Instagram link sends nothing anywhere until you choose to follow it.
                </p>
                <div className="instagram-embed__gate-actions">
                  <CTAButton variant="filled" onClick={() => setFeedLoaded(true)}>
                    Load the Instagram feed
                  </CTAButton>
                  <CTAButton href={PROFILE_URL} variant="outline">
                    Follow on Instagram
                  </CTAButton>
                </div>
              </div>
            )
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
