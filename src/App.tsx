import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import History from "./pages/History";
import Values from "./pages/Values";
import Colony from "./pages/Colony";
import Philanthropy from "./pages/Philanthropy";
import Contact from "./pages/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
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
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <NavBar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  );
}
