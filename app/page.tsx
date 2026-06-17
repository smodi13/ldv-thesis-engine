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

function Nav({ activeSection, thesisCount }: { activeSection: string; thesisCount: number }) {
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
        background: scrolled ? "rgba(255,255,255,0.94)" : "white",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: "1px solid #E2E8F0",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div
        className="container-lg"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 font-bold text-sm tracking-tight"
          style={{ color: "#0F172A" }}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "#0B1426", color: "#C9A84C" }}
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
              style={{ color: activeSection === item.id ? "#0B1426" : "#64748B" }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = "#0F172A";
                  e.currentTarget.style.background = "#F8F9FC";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.color = "#64748B";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {item.label}
              {item.id === "thesis" && thesisCount > 0 && (
                <span
                  className="ml-1.5 inline-flex items-center justify-center rounded-full"
                  style={{ background: "#C9A84C", color: "#0B1426", fontSize: 10, fontWeight: 700, width: 16, height: 16 }}
                >
                  {thesisCount}
                </span>
              )}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
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
          style={{ color: "#64748B" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
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
            style={{ background: "white", borderTop: "1px solid #E2E8F0" }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-left px-6 py-4 text-sm font-medium"
                style={{
                  color: activeSection === item.id ? "#0B1426" : "#64748B",
                  borderBottom: "1px solid #F8F9FC",
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
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
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
      <main style={{ background: "white", paddingTop: 64 }}>
        <Hero thesisCount={thesisCount} onNavigate={handleNavigate} />
        <ThesisGenerator onNewThesis={() => setThesisCount((c) => c + 1)} />
        <StartupScoring />
        <About />
        <footer
          style={{
            borderTop: "1px solid #E2E8F0",
            padding: "28px 0",
            textAlign: "center",
            background: "white",
          }}
        >
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            Built by Sahil Modi for LDV Partners. All startup data is publicly known.
          </p>
        </footer>
      </main>
    </>
  );
}
