"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

function formatMemoHtml(text: string): string {
  const sections = text.split(/^(##\s.+)$/m).filter(Boolean);
  if (sections.length <= 1) return `<p>${text}</p>`;
  let html = "";
  let i = 0;
  while (i < sections.length) {
    const part = sections[i];
    if (part.startsWith("## ")) {
      const heading = part.replace("## ", "").trim();
      const body = (sections[i + 1] ?? "").trim();
      const isRec = heading.toLowerCase().includes("recommendation");
      html += `<h2>${heading}</h2>`;
      if (isRec) {
        html += `<div class="recommendation">${body.replace(/\n/g, "<br>")}</div>`;
      } else {
        const lines = body.split("\n").filter((l) => l.trim());
        const hasBullets = lines.some((l) => l.trim().startsWith("-") || l.trim().startsWith("*") || l.trim().match(/^\d+\./));
        if (hasBullets) {
          html += "<ul>" + lines.filter((l) => l.trim()).map((l) => `<li>${l.replace(/^[-*\d.]+\s*/, "").trim()}</li>`).join("") + "</ul>";
        } else {
          html += `<p>${body.replace(/\n/g, "<br>")}</p>`;
        }
      }
      i += 2;
    } else {
      html += `<p>${part.trim()}</p>`;
      i++;
    }
  }
  return html;
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
  const [memoLoading, setMemoLoading] = useState(false);

  const generateMemo = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (memoLoading) return;
    setMemoLoading(true);

    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: startup.name,
          sector: startup.sector,
          description: startup.description,
          stage: startup.stage,
          scores: startup.scores,
        }),
      });

      if (!res.ok) throw new Error("Memo generation failed");
      const { memo } = await res.json() as { memo: string };

      // Format memo as HTML and print in a new window
      const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const html = `<!DOCTYPE html>
<html>
<head>
  <title>${startup.name} Investment Memo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0F172A; padding: 48px; max-width: 780px; margin: 0 auto; }
    .header { border-bottom: 2px solid #C9A84C; padding-bottom: 20px; margin-bottom: 28px; }
    .header h1 { font-size: 1.8rem; font-weight: 700; color: #0B1426; margin-bottom: 6px; letter-spacing: -0.02em; }
    .meta { display: flex; gap: 16px; flex-wrap: wrap; }
    .meta span { font-size: 0.8rem; color: #64748B; font-weight: 500; }
    .badge { background: rgba(201,168,76,0.12); color: #C9A84C; padding: 2px 10px; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.7rem; }
    h2 { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #C9A84C; margin-bottom: 8px; margin-top: 24px; }
    p, li { font-size: 0.9rem; line-height: 1.75; color: #374151; }
    ul { padding-left: 18px; }
    li { margin-bottom: 4px; }
    .recommendation { background: #F8F9FC; border-left: 3px solid #C9A84C; padding: 14px 18px; border-radius: 4px; margin-top: 8px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #94A3B8; }
    @media print { body { padding: 32px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${startup.name}</h1>
    <div class="meta">
      <span class="badge">${startup.sector}</span>
      <span>${startup.stage}</span>
      <span>Generated ${date}</span>
      <span>Fit Score: ${startup.fitScore}/100</span>
    </div>
  </div>
  <div class="content">${formatMemoHtml(memo)}</div>
  <div class="footer">
    Generated by the LDV Thesis Engine, built by Sahil Modi &mdash; ldv-thesis-engine.vercel.app
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

      const w = window.open("", "_blank");
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    } catch {
      alert("Failed to generate memo. Please try again.");
    } finally {
      setMemoLoading(false);
    }
  }, [startup, memoLoading]);

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

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ background: "#F8F9FC", color: "#64748B", border: "1px solid #E2E8F0" }}
        >
          {startup.stage}
        </span>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {/* Generate Memo button */}
          <button
            onClick={generateMemo}
            disabled={memoLoading}
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{
              color: memoLoading ? "#94A3B8" : "#0B1426",
              border: `1px solid ${memoLoading ? "#E2E8F0" : "#0B1426"}`,
              padding: "4px 10px",
              borderRadius: 6,
              background: "transparent",
              cursor: memoLoading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { if (!memoLoading) e.currentTarget.style.background = "rgba(11,20,38,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {memoLoading ? (
              <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            )}
            {memoLoading ? "Generating..." : "Memo"}
          </button>

          {/* View analysis */}
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#C9A84C" }}>
            View analysis
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
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
