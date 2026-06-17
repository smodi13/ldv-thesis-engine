"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import startups from "../data/startups.json";

type Startup = (typeof startups)[0];

const SECTORS = ["All", "AI", "Robotics", "Software", "Biotech", "Deep Tech"];

const SECTOR_COLORS: Record<string, string> = {
  AI: "#C9A84C",
  Robotics: "#3B82F6",
  Software: "#8B5CF6",
  Biotech: "#10B981",
  "Deep Tech": "#EF4444",
};

const SCORE_KEYS: (keyof Startup["scores"])[] = [
  "technicalDefensibility", "marketSize", "teamStrength", "timing", "traction",
];

const SCORE_LABELS: Record<string, string> = {
  technicalDefensibility: "Tech Defensibility",
  marketSize: "Market Size",
  teamStrength: "Team Strength",
  timing: "Timing",
  traction: "Traction",
};

function SectionHeader() {
  return (
    <div className="section-header mb-14" style={{ opacity: 0 }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A84C", letterSpacing: "0.14em" }}>
        Curated Database
      </p>
      <h2 className="font-bold mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
        Startup Sourcing and Scoring
      </h2>
      <p style={{ color: "#64748B", maxWidth: 520, lineHeight: 1.7, fontSize: "0.95rem" }}>
        {startups.length} emerging companies across LDV focus areas, each scored across five dimensions that matter at the early stage.
      </p>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: "#F1F5F9" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #C9A84C, #E8C97A)" }}
        />
      </div>
      <span className="text-xs font-bold w-4 text-right" style={{ color: "#0B1426", fontVariantNumeric: "tabular-nums" }}>
        {score}
      </span>
    </div>
  );
}

function FitScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="60" height="60">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="3" />
        <motion.circle
          cx="30" cy="30" r={radius} fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 30 30)"
        />
        <text x="30" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0B1426">{score}</text>
      </svg>
      <span className="text-xs font-medium mt-1" style={{ color: "#94A3B8" }}>Fit Score</span>
    </div>
  );
}

function StartupModal({ startup, onClose }: { startup: Startup; onClose: () => void }) {
  const radarData = SCORE_KEYS.map((key) => ({
    subject: SCORE_LABELS[key], score: startup.scores[key], fullMark: 10,
  }));
  const sectorColor = SECTOR_COLORS[startup.sector] ?? "#C9A84C";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid #E2E8F0",
          boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
          maxWidth: 680,
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    color: sectorColor,
                    background: `${sectorColor}14`,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 9999,
                    whiteSpace: "nowrap",
                    minWidth: 28,
                  }}
                >
                  {startup.sector}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#F8F9FC", color: "#64748B", border: "1px solid #E2E8F0" }}>
                  {startup.stage}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1.5" style={{ color: "#0F172A" }}>{startup.name}</h3>
              <p className="text-sm" style={{ color: "#64748B", lineHeight: 1.6 }}>{startup.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 mt-1 p-2 rounded-lg flex-shrink-0 transition-all duration-150"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F8F9FC"; e.currentTarget.style.color = "#64748B"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div className="p-8" style={{ borderRight: "1px solid #E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#94A3B8", letterSpacing: "0.1em" }}>
              Scoring Radar
            </p>
            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                  <PolarGrid stroke="#F1F5F9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name={startup.name} dataKey="score" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.12} strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                    formatter={(value) => [`${value}/10`, ""] as [string, string]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8", letterSpacing: "0.1em" }}>
                Dimension Scores
              </p>
              <FitScoreRing score={startup.fitScore} />
            </div>
            <div className="flex flex-col gap-4">
              {SCORE_KEYS.map((key) => (
                <div key={key}>
                  <span className="text-xs font-medium block mb-1.5" style={{ color: "#64748B" }}>{SCORE_LABELS[key]}</span>
                  <ScoreBar score={startup.scores[key]} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="px-8 py-5 flex items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {startup.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#F8F9FC", color: "#64748B", border: "1px solid #E2E8F0" }}>
                {tag}
              </span>
            ))}
          </div>
          <span className="ml-auto text-xs" style={{ color: "#CBD5E1" }}>Founded {startup.founded}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StartupCard({ startup, onClick, index }: { startup: Startup; onClick: () => void; index: number }) {
  const sectorColor = SECTOR_COLORS[startup.sector] ?? "#C9A84C";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className="startup-card rounded-2xl p-6 cursor-pointer bg-white"
      style={{ border: "1px solid #E2E8F0", boxShadow: "var(--shadow-sm)" }}
    >
      {/* Sector label + fit score */}
      <div className="flex items-start justify-between mb-4">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: sectorColor,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "3px 8px",
            background: `${sectorColor}14`,
            borderRadius: 6,
            minWidth: 28,
            whiteSpace: "nowrap",
          }}
        >
          {startup.sector}
        </span>
        <div className="flex flex-col items-end ml-2 flex-shrink-0">
          <span
            className="font-bold leading-none"
            style={{ color: "#0B1426", fontSize: "1.6rem", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
          >
            {startup.fitScore}
          </span>
          <span className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>fit score</span>
        </div>
      </div>

      <h3 className="font-bold text-base mb-2" style={{ color: "#0F172A", lineHeight: 1.3 }}>
        {startup.name}
      </h3>

      <p className="text-sm mb-5 line-clamp-2" style={{ color: "#64748B", lineHeight: 1.65 }}>
        {startup.description}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ background: "#F8F9FC", color: "#64748B", border: "1px solid #E2E8F0" }}
        >
          {startup.stage}
        </span>
        <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#C9A84C" }}>
          View analysis
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
}

export default function StartupScoring() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState<Startup | null>(null);
  const filtered = sector === "All" ? startups : startups.filter((s) => s.sector === sector);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const el = sectionRef.current;
        if (!el) return;
        gsap.fromTo(
          el.querySelector(".section-header"),
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 78%" } }
        );
        gsap.fromTo(
          el.querySelector(".rubric-row"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1, scrollTrigger: { trigger: el, start: "top 78%" } }
        );
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sourcing"
      style={{
        background: "white",
        paddingTop: 112,
        paddingBottom: 112,
        borderTop: "1px solid #E2E8F0",
      }}
    >
      <div className="container-lg">
        <SectionHeader />

        {/* Filter + rubric row */}
        <div className="rubric-row mb-10" style={{ opacity: 0 }}>
          {/* Sector filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {SECTORS.map((s) => {
              const active = sector === s;
              const color = SECTOR_COLORS[s] ?? "#C9A84C";
              return (
                <motion.button
                  key={s}
                  onClick={() => setSector(s)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: active ? (s === "All" ? "#0B1426" : `${color}14`) : "#F8F9FC",
                    color: active ? (s === "All" ? "white" : color) : "#64748B",
                    border: active
                      ? `1px solid ${s === "All" ? "#0B1426" : color}`
                      : "1px solid #E2E8F0",
                    padding: "7px 16px",
                    borderRadius: 9999,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                  }}
                >
                  {s}
                  {s !== "All" && (
                    <span style={{ marginLeft: 5, fontSize: "0.75rem", opacity: 0.6 }}>
                      {startups.filter((x) => x.sector === s).length}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Rubric bar */}
          <div
            className="rounded-2xl grid grid-cols-5 gap-4 p-5"
            style={{ background: "#F8F9FC", border: "1px solid #E2E8F0" }}
          >
            {SCORE_KEYS.map((key) => (
              <div key={key} className="text-center">
                <div className="text-sm font-semibold mb-1" style={{ color: "#0F172A" }}>
                  {SCORE_LABELS[key]}
                </div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>scored 1-10</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="startup-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((startup, i) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                index={i}
                onClick={() => setSelected(startup)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selected && <StartupModal startup={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
