import { Link } from "react-router-dom";
import ShieldCrest from "./ShieldCrest";
import { colony, university } from "../data/content";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <ShieldCrest size={44} />
          <div>
            <p className="footer__title">Sigma Chi Fraternity</p>
            <p className="footer__subtitle">{university.name} &middot; Beta Colony</p>
          </div>
        </div>

        <nav className="footer__links">
          <Link to="/history">Our History</Link>
          <Link to="/values">Values &amp; Creed</Link>
          <Link to="/colony">The Colony Today</Link>
          <Link to="/philanthropy">Philanthropy</Link>
          <Link to="/contact">Join Us</Link>
        </nav>

        <div className="footer__connect">
          <a href={`https://instagram.com/${colony.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
            {colony.instagram} on Instagram
          </a>
          <span className="washu-hairline" aria-hidden="true" />
          <p className="footer__campus">{university.campus}, St. Louis, Missouri</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {new Date().getFullYear()} Sigma Chi at Washington University in St. Louis. Est. 1855.</p>
        <p className="footer__disclaimer">
          Unofficial colony site. Not an official publication of Sigma Chi Fraternity (International Headquarters) or
          Washington University in St. Louis.
        </p>
      </div>

      <div className="container footer__legal">
        <nav className="footer__legal-links" aria-label="Legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/accessibility">Accessibility</Link>
        </nav>

        <p className="footer__legal-note">
          Sigma Chi, the White Cross, and related names and insignia are trademarks of Sigma Chi Fraternity.
          &ldquo;Washington University in St. Louis&rdquo; and &ldquo;WashU&rdquo; are trademarks of Washington
          University. The shield mark used on this site was drawn for the colony and is not a reproduction of the
          official Sigma Chi coat of arms.
        </p>

        <p className="footer__legal-note">
          Membership selection does not discriminate on the basis of race, color, religion, national origin, ancestry,
          disability, sexual orientation, gender identity, or veteran status. Hazing is prohibited here in every form:
          it is contrary to Sigma Chi policy and to Missouri law.
        </p>
      </div>
    </footer>
  );
}
