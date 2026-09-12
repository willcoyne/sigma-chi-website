import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import History from "./pages/History";
import Values from "./pages/Values";
import Colony from "./pages/Colony";
import Philanthropy from "./pages/Philanthropy";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";

const MAIN_CONTENT_ID = "main-content";

/** Spoken page names for the route announcer, keyed by pathname. */
const ROUTE_NAMES: Record<string, string> = {
  "/": "Home",
  "/history": "Our History",
  "/values": "Values & Creed",
  "/colony": "The Colony Today",
  "/philanthropy": "Philanthropy",
  "/contact": "Join Us",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Use",
  "/accessibility": "Accessibility",
};

/**
 * On every route change, reset scroll position and move focus into <main> so
 * keyboard and screen reader users land on the new page instead of staying
 * parked wherever the old page left them. The initial mount is skipped so the
 * first paint doesn't steal focus from the document.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}

/**
 * Visually hidden live region (WCAG 2.1 SC 4.1.3). Announces the new page name
 * after client-side navigation, which otherwise happens silently.
 */
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const name = ROUTE_NAMES[pathname] ?? "Page Not Found";
    // Written straight to the DOM rather than held in state. A live region only
    // announces when its text changes while the element is already mounted, so
    // there is nothing for React to own here, and this avoids a second render
    // on every navigation.
    if (ref.current) {
      ref.current.textContent = `${name} page loaded`;
    }
  }, [pathname]);

  return <p ref={ref} className="sr-only" role="status" aria-live="polite" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/values" element={<Values />} />
          <Route path="/colony" element={<Colony />} />
          <Route path="/philanthropy" element={<Philanthropy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
          Skip to main content
        </a>
        <ScrollToTop />
        <RouteAnnouncer />
        <NavBar />
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>
          <AnimatedRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  );
}
