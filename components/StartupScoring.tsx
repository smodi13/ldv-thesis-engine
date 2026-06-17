"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import startups from "../data/startups.json";

type Startup = (typeof startups)[0];

const SECTORS = ["All", "AI", "Robotics", "Software", "Biotech", "Deep Tech"];

const SECTOR_COLORS: Record<string, { color: string; bg: string }> = {
  AI: { color: "#C9A84C", bg: "rgba(201,168,76,0.12)" },
  Robotics: { color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  Software: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  Biotech: { color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  "Deep Tech": { color: "#F87171", bg: "rgba(248,113,113,0.12)" },
};

const SCORE_KEYS: (keyof Startup["scores"])[] = [
  "technicalDefensibility",
  "marketSize",
  "teamStrength",
  "timing",
  "traction",
];

const SCORE_LABELS: Record<string, string> = {
  technicalDefensibility: "Tech Defensibility",
  marketSize: "Market Size",
  teamStrength: "Team Strength",
  timing: "Timing",
  traction: "Traction",
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 4, background: "rgba(255,255,255,0.08)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #C9A84C, #E8C97A)" }}
        />
      </div>
      <span
        className="text-xs font-bold w-4 text-right"
        style={{ color: "#C9A84C", fontVariantNumeric: "tabular-nums" }}
      >
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
        <circle
          cx="30" cy="30" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <motion.circle
          cx="30" cy="30" r={radius}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 30 30)"
        />
        <text x="30" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#C9A84C">
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium mt-1" style={{ color: "#94A3B8" }}>Fit Score</span>
    </div>
  );
}

function StartupModal({ startup, onClose }: { startup: Startup; onClose: () => void }) {
  const radarData = SCORE_KEYS.map((key) => ({
    subject: SCORE_LABELS[key],
    score: startup.scores[key],
    fullMark: 10,
  }));

  const sc = SECTOR_COLORS[startup.sector] ?? { color: "#C9A84C", bg: "rgba(201,168,76,0.12)" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,10,20,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "#162035",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: 680,
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-8 py-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: sc.bg, color: sc.color, letterSpacing: "0.08em" }}
                >
                  {startup.sector}
                </span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: "#94A3B8",
                  }}
                >
                  {startup.stage}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1.5" style={{ color: "white" }}>
                {startup.name}
              </h3>
              <p className="text-sm" style={{ color: "#94A3B8", lineHeight: 1.6 }}>
                {startup.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 mt-1 p-2 rounded-lg flex-shrink-0 transition-colors duration-150"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748B";
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Charts */}
        <div
          className="grid grid-cols-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="p-8"
            style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
            >
              Scoring Radar
            </p>
            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 9, fill: "#64748B", fontWeight: 600 }}
                  />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name={startup.name}
                    dataKey="score"
                    stroke="#C9A84C"
                    fill="#C9A84C"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0B1426",
                      border: "1px solid rgba(201,168,76,0.3)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "white",
                    }}
                    formatter={(value) => [`${value}/10`, ""] as [string, string]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
              >
                Dimension Scores
              </p>
              <FitScoreRing score={startup.fitScore} />
            </div>
            <div className="flex flex-col gap-4">
              {SCORE_KEYS.map((key) => (
                <div key={key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>
                      {SCORE_LABELS[key]}
                    </span>
                  </div>
                  <ScoreBar score={startup.scores[key]} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags + founded */}
        <div className="px-8 py-5 flex items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {startup.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#94A3B8",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="ml-auto text-xs" style={{ color: "#475569" }}>
            Founded {startup.founded}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StartupCard({
  startup,
  onClick,
  index,
}: {
  startup: Startup;
  onClick: () => void;
  index: number;
}) {
  const sc = SECTOR_COLORS[startup.sector] ?? { color: "#C9A84C", bg: "rgba(201,168,76,0.12)" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
      onClick={onClick}
      className="startup-card rounded-2xl p-6 cursor-pointer"
      style={{
        background: "#162035",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
          style={{
            background: sc.bg,
            color: sc.color,
            letterSpacing: "0.06em",
          }}
        >
          {startup.sector}
        </span>
        <div className="flex flex-col items-end ml-3">
          <span
            className="text-2xl font-bold leading-none"
            style={{ color: "#C9A84C", fontVariantNumeric: "tabular-nums" }}
          >
            {startup.fitScore}
          </span>
          <span className="text-xs mt-0.5" style={{ color: "#475569" }}>
            fit score
          </span>
        </div>
      </div>

      <h3 className="font-bold text-base mb-2" style={{ color: "white" }}>
        {startup.name}
      </h3>

      <p
        className="text-sm mb-5 line-clamp-2"
        style={{ color: "#94A3B8", lineHeight: 1.6 }}
      >
        {startup.description}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#94A3B8",
          }}
        >
          {startup.stage}
        </span>
        <span
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: "#C9A84C" }}
        >
          View analysis
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

  const filtered =
    sector === "All" ? startups : startups.filter((s) => s.sector === sector);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const el = sectionRef.current;
        if (!el) return;

        gsap.fromTo(
          el.querySelector(".section-header"),
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          }
        );

        gsap.fromTo(
          el.querySelector(".rubric-bar"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.2,
            scrollTrigger: { trigger: el, start: "top 75%" },
          }
        );
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sourcing"
      className="py-28"
      style={{ background: "#0D1829", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className="section-header mb-14" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px" style={{ background: "#C9A84C" }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#C9A84C", letterSpacing: "0.12em" }}
            >
              Curated Database
            </span>
          </div>
          <h2
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Startup Sourcing and Scoring
          </h2>
          <p
            style={{ color: "#94A3B8", maxWidth: 520, lineHeight: 1.7, fontSize: "0.95rem", marginBottom: 28 }}
          >
            {startups.length} emerging companies across LDV focus areas, each scored on a five-dimension rubric reflecting the criteria that matter at the early stage.
          </p>

          {/* Sector filter */}
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => {
              const active = sector === s;
              const sc = SECTOR_COLORS[s];
              return (
                <motion.button
                  key={s}
                  onClick={() => setSector(s)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150"
                  style={{
                    background: active
                      ? s === "All"
                        ? "#C9A84C"
                        : sc?.bg ?? "rgba(201,168,76,0.12)"
                      : "rgba(255,255,255,0.05)",
                    color: active
                      ? s === "All"
                        ? "#0B1426"
                        : sc?.color ?? "#C9A84C"
                      : "#94A3B8",
                    border: active
                      ? `1px solid ${s === "All" ? "transparent" : sc?.color ?? "#C9A84C"}30`
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {s}
                  {s !== "All" && (
                    <span className="ml-1.5 text-xs opacity-60">
                      {startups.filter((x) => x.sector === s).length}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Rubric bar */}
        <div
          className="rubric-bar rounded-2xl p-5 mb-10 grid grid-cols-5 gap-4"
          style={{
            background: "#162035",
            border: "1px solid rgba(255,255,255,0.07)",
            opacity: 0,
          }}
        >
          {SCORE_KEYS.map((key) => (
            <div key={key} className="text-center">
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: "white" }}
              >
                {SCORE_LABELS[key]}
              </div>
              <div className="text-xs" style={{ color: "#475569" }}>
                scored 1-10
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
          className="startup-grid"
        >
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
        {selected && (
          <StartupModal startup={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
