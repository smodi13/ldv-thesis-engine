"use client";

import { useState } from "react";
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

const SECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  AI: { bg: "#EEF2FF", text: "#3730A3" },
  Robotics: { bg: "#FFF7ED", text: "#9A3412" },
  Software: { bg: "#F0FDF4", text: "#166534" },
  Biotech: { bg: "#FDF4FF", text: "#7E22CE" },
  "Deep Tech": { bg: "#FFF1F2", text: "#9F1239" },
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
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E2E6EE" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #C9A84C, #E8C97A)" }}
        />
      </div>
      <span className="text-xs font-semibold w-4 text-right" style={{ color: "#0B1426" }}>
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
        <circle cx="30" cy="30" r={radius} fill="none" stroke="#E2E6EE" strokeWidth="3" />
        <motion.circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 30 30)"
        />
        <text x="30" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0B1426">
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium mt-1" style={{ color: "#6B7A99" }}>Fit Score</span>
    </div>
  );
}

function StartupModal({ startup, onClose }: { startup: Startup; onClose: () => void }) {
  const radarData = SCORE_KEYS.map((key) => ({
    subject: SCORE_LABELS[key],
    score: startup.scores[key],
    fullMark: 10,
  }));

  const sectorColors = SECTOR_COLORS[startup.sector] ?? { bg: "#F3F4F6", text: "#374151" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(11,20,38,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b" style={{ borderColor: "#E2E6EE" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: sectorColors.bg, color: sectorColors.text }}
                >
                  {startup.sector}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#F7F8FA", color: "#6B7A99" }}>
                  {startup.stage}
                </span>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: "#0B1426" }}>{startup.name}</h3>
              <p className="text-sm mt-1.5" style={{ color: "#6B7A99" }}>{startup.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 mt-1 p-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F8FA"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-0" style={{ borderTop: "none" }}>
          {/* Radar chart */}
          <div className="p-8 border-r" style={{ borderColor: "#E2E6EE" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "#6B7A99" }}>
              Scoring Radar
            </p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                  <PolarGrid stroke="#E2E6EE" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 9, fill: "#6B7A99", fontWeight: 500 }}
                  />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name={startup.name}
                    dataKey="score"
                    stroke="#C9A84C"
                    fill="#C9A84C"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #E2E6EE",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value) => [`${value}/10`, ""] as [string, string]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7A99" }}>
                Dimension Scores
              </p>
              <FitScoreRing score={startup.fitScore} />
            </div>
            <div className="flex flex-col gap-4">
              {SCORE_KEYS.map((key) => (
                <div key={key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "#374151" }}>
                      {SCORE_LABELS[key]}
                    </span>
                  </div>
                  <ScoreBar score={startup.scores[key]} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="px-8 py-5 border-t flex items-center gap-3" style={{ borderColor: "#E2E6EE" }}>
          <div className="flex flex-wrap gap-2">
            {startup.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#F7F8FA", color: "#6B7A99", border: "1px solid #E2E6EE" }}>
                {tag}
              </span>
            ))}
          </div>
          <span className="ml-auto text-xs" style={{ color: "#9CA3AF" }}>Founded {startup.founded}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StartupCard({ startup, onClick }: { startup: Startup; onClick: () => void }) {
  const sectorColors = SECTOR_COLORS[startup.sector] ?? { bg: "#F3F4F6", text: "#374151" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="rounded-2xl border p-6 cursor-pointer transition-all duration-200"
      style={{ background: "white", borderColor: "#E2E6EE" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#C9A84C";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(11,20,38,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E2E6EE";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2.5"
            style={{ background: sectorColors.bg, color: sectorColors.text }}
          >
            {startup.sector}
          </span>
          <h3 className="font-bold text-base" style={{ color: "#0B1426" }}>{startup.name}</h3>
        </div>
        <div className="flex flex-col items-end flex-shrink-0 ml-3">
          <span className="text-2xl font-bold" style={{ color: "#C9A84C" }}>{startup.fitScore}</span>
          <span className="text-xs" style={{ color: "#9CA3AF" }}>fit score</span>
        </div>
      </div>

      <p className="text-sm mb-4 line-clamp-2" style={{ color: "#6B7A99", lineHeight: 1.6 }}>
        {startup.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: "#F7F8FA", color: "#6B7A99" }}>
          {startup.stage}
        </span>
        <span className="text-xs font-medium" style={{ color: "#C9A84C" }}>
          View analysis
        </span>
      </div>
    </motion.div>
  );
}

export default function StartupScoring() {
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState<Startup | null>(null);

  const filtered = sector === "All"
    ? startups
    : startups.filter((s) => s.sector === sector);

  return (
    <section id="sourcing" className="py-24 px-6" style={{ background: "white" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: "#C9A84C" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A84C" }}>
              Curated Database
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#0B1426", letterSpacing: "-0.02em" }}>
            Startup Sourcing and Scoring
          </h2>
          <p className="text-base max-w-xl mb-8" style={{ color: "#6B7A99" }}>
            {startups.length} emerging companies across LDV focus areas, scored on technical defensibility, market size, team strength, timing, and traction.
          </p>

          {/* Sector filter */}
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
                style={{
                  background: sector === s ? "#0B1426" : "#F7F8FA",
                  color: sector === s ? "white" : "#6B7A99",
                  border: `1px solid ${sector === s ? "#0B1426" : "#E2E6EE"}`,
                }}
              >
                {s}
                {s !== "All" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {startups.filter((x) => x.sector === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Scoring rubric */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border p-6 mb-10 grid grid-cols-5 gap-4"
          style={{ background: "#F7F8FA", borderColor: "#E2E6EE" }}
        >
          {SCORE_KEYS.map((key) => (
            <div key={key} className="text-center">
              <div className="text-sm font-semibold mb-1" style={{ color: "#0B1426" }}>{SCORE_LABELS[key]}</div>
              <div className="text-xs" style={{ color: "#9CA3AF" }}>scored 1-10</div>
            </div>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
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
