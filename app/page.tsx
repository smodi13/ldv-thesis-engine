"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import ThesisGenerator from "../components/ThesisGenerator";
import StartupScoring from "../components/StartupScoring";
import About from "../components/About";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "thesis", label: "Thesis Generator" },
  { id: "sourcing", label: "Startup Sourcing" },
  { id: "about", label: "About" },
];

function Nav({
  activeSection,
  thesisCount,
}: {
  activeSection: string;
  thesisCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: scrolled ? "rgba(11,20,38,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition:
          "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 font-bold text-sm tracking-tight"
          style={{ color: "white" }}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "#C9A84C", color: "#0B1426" }}
          >
            L
          </span>
          <span>LDV Thesis Engine</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
              style={{
                color: activeSection === item.id ? "#C9A84C" : "rgba(255,255,255,0.55)",
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {item.label}
              {item.id === "thesis" && thesisCount > 0 && (
                <span
                  className="ml-1.5 inline-flex items-center justify-center rounded-full"
                  style={{
                    background: "#C9A84C",
                    color: "#0B1426",
                    fontSize: 10,
                    fontWeight: 700,
                    width: 16,
                    height: 16,
                  }}
                >
                  {thesisCount}
                </span>
              )}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-4 right-4 h-px"
                  style={{ background: "#C9A84C" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "rgba(255,255,255,0.7)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(11,20,38,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-left px-6 py-4 text-sm font-medium transition-colors"
                style={{
                  color:
                    activeSection === item.id
                      ? "#C9A84C"
                      : "rgba(255,255,255,0.65)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [thesisCount, setThesisCount] = useState(0);

  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function handleNavigate(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Nav activeSection={activeSection} thesisCount={thesisCount} />
      <main style={{ background: "#0B1426" }}>
        <Hero thesisCount={thesisCount} onNavigate={handleNavigate} />
        <ThesisGenerator onNewThesis={() => setThesisCount((c) => c + 1)} />
        <StartupScoring />
        <About />
      </main>
    </>
  );
}
