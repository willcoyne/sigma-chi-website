import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, useScroll } from "motion/react";
import ShieldCrest from "./ShieldCrest";
import { EASE_PREMIUM } from "../lib/motion";
import "./NavBar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/history", label: "Our History" },
  { to: "/values", label: "Values & Creed" },
  { to: "/colony", label: "The Colony Today" },
  { to: "/philanthropy", label: "Philanthropy" },
  { to: "/contact", label: "Join Us" },
];

/** Half the distance between bar centres, used to fold the menu icon into an X. */
const BAR_OFFSET = 7;

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { scrollYProgress } = useScroll();

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
              {({ isActive }) => (
                <>
                  {link.label}
                  {/*
                    One underline shared across every link. Because each copy
                    carries the same layoutId, Motion treats them as the same
                    element and slides the rule from the old tab to the new one
                    instead of cross-fading two separate rules.
                  */}
                  {isActive && (
                    <motion.span
                      className="nav__underline"
                      layoutId="nav-underline"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="nav__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {/* Three bars that fold into an X, rather than swapping icons. */}
          <motion.span
            animate={menuOpen ? { y: BAR_OFFSET, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2, ease: EASE_PREMIUM }}
          />
          <motion.span
            animate={menuOpen ? { y: -BAR_OFFSET, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
          />
        </button>
      </div>

      {/*
        Reading progress for the whole document, pinned to the header's bottom
        edge. Decorative: the same information is already available from the
        scrollbar, so it is hidden from assistive tech.
      */}
      <motion.div className="nav__progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </header>
  );
}
