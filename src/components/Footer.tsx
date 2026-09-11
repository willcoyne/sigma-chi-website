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
    </footer>
  );
}
