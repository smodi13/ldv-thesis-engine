"use client";

import { useState, useRef, useEffect, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Thesis {
  id: string;
  theme: string;
  content: string;
  createdAt: Date;
}

interface ThesisGeneratorProps {
  onNewThesis: () => void;
}

const EXAMPLE_THEMES = [
  "AI robotics",
  "biology data infrastructure",
  "defense tech",
  "autonomous vehicles",
  "quantum computing",
  "spatial computing",
];

function ThesisContent({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  const sections = content.split(/^(##\s.+)$/m).filter(Boolean);

  if (sections.length <= 1) {
    return (
      <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? "streaming-cursor" : ""}`}
        style={{ color: "#374151" }}>
        {content}
      </div>
    );
  }

  const rendered: ReactElement[] = [];
  let i = 0;
  while (i < sections.length) {
    const part = sections[i];
    if (part.startsWith("## ")) {
      const heading = part.replace("## ", "").trim();
      const body = sections[i + 1] ?? "";
      rendered.push(
        <div key={i} className="mb-6">
          <h4 className="font-semibold text-sm mb-2.5 flex items-center gap-2" style={{ color: "#0B1426" }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C9A84C" }} />
            {heading}
          </h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap pl-4 border-l-2"
            style={{ color: "#4B5563", borderColor: "#E2E6EE" }}>
            {body.trim()}
          </div>
        </div>
      );
      i += 2;
    } else {
      rendered.push(
        <div key={i} className="text-sm leading-relaxed mb-4" style={{ color: "#374151" }}>
          {part.trim()}
        </div>
      );
      i++;
    }
  }

  return (
    <div className={isStreaming ? "streaming-cursor" : ""}>
      {rendered}
    </div>
  );
}

export default function ThesisGenerator({ onNewThesis }: ThesisGeneratorProps) {
  const [theme, setTheme] = useState("");
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const activeThesis = theses.find((t) => t.id === activeId);

  async function generate() {
    if (!theme.trim() || isStreaming) return;
    setError("");
    setIsStreaming(true);
    setStreamingContent("");

    const newId = Date.now().toString();
    const newThesis: Thesis = {
      id: newId,
      theme: theme.trim(),
      content: "",
      createdAt: new Date(),
    };

    setTheses((prev) => [newThesis, ...prev]);
    setActiveId(newId);

    try {
      const res = await fetch("/api/thesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: theme.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Generation failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);

        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }

      setTheses((prev) =>
        prev.map((t) => (t.id === newId ? { ...t, content: accumulated } : t))
      );
      onNewThesis();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setTheses((prev) => prev.filter((t) => t.id !== newId));
      setActiveId(theses[0]?.id ?? null);
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate();
  }

  const displayContent = isStreaming && activeId === theses[0]?.id
    ? streamingContent
    : (activeThesis?.content ?? "");

  return (
    <section id="thesis" className="py-24 px-6" style={{ background: "#F7F8FA" }}>
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
              AI-Powered
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#0B1426", letterSpacing: "-0.02em" }}>
            Thesis Generator
          </h2>
          <p className="text-base max-w-xl" style={{ color: "#6B7A99" }}>
            Enter a technology theme and get a structured investment thesis brief covering market timing, sub-sectors, defensibility, risks, and target archetypes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border p-6 h-full flex flex-col gap-5" style={{ background: "white", borderColor: "#E2E6EE" }}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#6B7A99" }}>
                  Technology Theme
                </label>
                <textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. AI robotics, biology data infrastructure, defense tech..."
                  rows={3}
                  className="w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all duration-200"
                  style={{
                    borderColor: "#E2E6EE",
                    color: "#0B1426",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C9A84C";
                    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E6EE";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: "#9CA3AF" }}>Cmd+Enter to generate</p>
              </div>

              {/* Example chips */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#6B7A99" }}>
                  Examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_THEMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all duration-150"
                      style={{ borderColor: "#E2E6EE", color: "#6B7A99", background: "#F7F8FA" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget).style.borderColor = "#C9A84C";
                        (e.currentTarget).style.color = "#C9A84C";
                        (e.currentTarget).style.background = "rgba(201,168,76,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget).style.borderColor = "#E2E6EE";
                        (e.currentTarget).style.color = "#6B7A99";
                        (e.currentTarget).style.background = "#F7F8FA";
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={!theme.trim() || isStreaming}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: !theme.trim() || isStreaming ? "#E2E6EE" : "#0B1426",
                  color: !theme.trim() || isStreaming ? "#9CA3AF" : "white",
                  cursor: !theme.trim() || isStreaming ? "not-allowed" : "pointer",
                }}
              >
                {isStreaming ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Thesis"
                )}
              </button>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Saved theses list */}
              {theses.length > 0 && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#6B7A99" }}>
                    Session History
                  </p>
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-48">
                    {theses.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveId(t.id)}
                        className="text-left px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-150"
                        style={{
                          borderColor: activeId === t.id ? "#C9A84C" : "#E2E6EE",
                          background: activeId === t.id ? "rgba(201,168,76,0.06)" : "#F7F8FA",
                          color: activeId === t.id ? "#0B1426" : "#6B7A99",
                        }}
                      >
                        <span className="truncate block">{t.theme}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Output panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-2xl border h-full overflow-hidden"
              style={{ background: "white", borderColor: "#E2E6EE", minHeight: 480 }}
            >
              {displayContent ? (
                <div className="h-full flex flex-col">
                  <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "#E2E6EE" }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#C9A84C" }}>
                        Investment Thesis
                      </p>
                      <h3 className="font-bold text-base capitalize" style={{ color: "#0B1426" }}>
                        {activeThesis?.theme ?? theses[0]?.theme}
                      </h3>
                    </div>
                    {isStreaming && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C" }}>
                        Streaming...
                      </span>
                    )}
                  </div>
                  <div ref={outputRef} className="flex-1 overflow-y-auto p-6">
                    <ThesisContent content={displayContent} isStreaming={isStreaming} />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center" style={{ minHeight: 480 }}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(201,168,76,0.08)" }}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="font-semibold mb-2" style={{ color: "#0B1426" }}>Enter a theme to generate your thesis</p>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    Try "AI robotics" or "biology data infrastructure" to see an example thesis.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
