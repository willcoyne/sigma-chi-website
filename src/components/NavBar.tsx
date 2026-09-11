import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ShieldCrest from "./ShieldCrest";
import "./NavBar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/history", label: "Our History" },
  { to: "/values", label: "Values & Creed" },
  { to: "/colony", label: "The Colony Today" },
  { to: "/philanthropy", label: "Philanthropy" },
  { to: "/contact", label: "Join Us" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled || !isHome ? "nav--solid" : ""}`}>
      <div className="container nav__inner">
        <NavLink to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
          <ShieldCrest size={36} />
          <span>
            Sigma Chi <em>WashU</em>
          </span>
        </NavLink>

        <nav className={`nav__links ${menuOpen ? "nav__links--open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="nav__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
