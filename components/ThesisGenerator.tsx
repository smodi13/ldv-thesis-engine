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
      <div
        className={`text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? "streaming-cursor" : ""}`}
        style={{ color: "#94A3B8" }}
      >
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
        <div key={i} className="mb-7">
          <h4
            className="font-semibold text-sm mb-3 flex items-center gap-2"
            style={{ color: "#E2E8F0" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#C9A84C" }}
            />
            {heading}
          </h4>
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap pl-4"
            style={{
              color: "#94A3B8",
              borderLeft: "2px solid rgba(201,168,76,0.25)",
              paddingLeft: 16,
            }}
          >
            {body.trim()}
          </div>
        </div>
      );
      i += 2;
    } else {
      rendered.push(
        <div key={i} className="text-sm leading-relaxed mb-4" style={{ color: "#94A3B8" }}>
          {part.trim()}
        </div>
      );
      i++;
    }
  }

  return (
    <div className={isStreaming ? "streaming-cursor" : ""}>{rendered}</div>
  );
}

export default function ThesisGenerator({ onNewThesis }: ThesisGeneratorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState("");
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const activeThesis = theses.find((t) => t.id === activeId);

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
            scrollTrigger: { trigger: el, start: "top 80%" },
          }
        );

        gsap.fromTo(
          el.querySelector(".thesis-panel"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: { trigger: el, start: "top 80%" },
          }
        );
      });
    });
  }, []);

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
        throw new Error((data as { error?: string }).error ?? "Generation failed");
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

  const displayContent =
    isStreaming && activeId === theses[0]?.id
      ? streamingContent
      : activeThesis?.content ?? "";

  return (
    <section
      ref={sectionRef}
      id="thesis"
      className="py-28"
      style={{ background: "#0B1426", borderTop: "1px solid rgba(255,255,255,0.06)" }}
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
              AI-Powered
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
            Thesis Generator
          </h2>
          <p style={{ color: "#94A3B8", maxWidth: 520, lineHeight: 1.7, fontSize: "0.95rem" }}>
            Enter a technology theme and get a structured investment thesis covering market timing, sub-sectors, defensibility, risks, and target archetypes.
          </p>
        </div>

        {/* Panel */}
        <div
          className="thesis-panel"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr",
            gap: 20,
            opacity: 0,
          }}
        >
          {/* Left: input */}
          <div
            className="flex flex-col gap-5 rounded-2xl p-7"
            style={{
              background: "#162035",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
              >
                Technology Theme
              </label>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. AI robotics, biology data infrastructure..."
                rows={3}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  lineHeight: 1.6,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                Cmd+Enter to generate
              </p>
            </div>

            {/* Example chips */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
              >
                Examples
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_THEMES.map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => setTheme(t)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150"
                    style={{
                      border: "1px solid rgba(201,168,76,0.3)",
                      color: "#C9A84C",
                      background: "rgba(201,168,76,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(201,168,76,0.15)";
                      e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                      e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                    }}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={generate}
              disabled={!theme.trim() || isStreaming}
              whileHover={!theme.trim() || isStreaming ? {} : { scale: 1.02, boxShadow: "0 0 20px rgba(201,168,76,0.35)" }}
              whileTap={!theme.trim() || isStreaming ? {} : { scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-bold text-sm"
              style={{
                background: !theme.trim() || isStreaming ? "rgba(255,255,255,0.08)" : "#C9A84C",
                color: !theme.trim() || isStreaming ? "rgba(255,255,255,0.3)" : "#0B1426",
                cursor: !theme.trim() || isStreaming ? "not-allowed" : "pointer",
                letterSpacing: "0.03em",
                transition: "background 0.2s",
              }}
            >
              {isStreaming ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
                  />
                  Generating...
                </span>
              ) : (
                "Generate Thesis"
              )}
            </motion.button>

            {error && (
              <p
                className="text-xs rounded-lg px-3 py-2"
                style={{
                  color: "#FCA5A5",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </p>
            )}

            {/* Session history */}
            {theses.length > 0 && (
              <div className="flex-1 overflow-hidden">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
                >
                  Session History
                </p>
                <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 160 }}>
                  {theses.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveId(t.id)}
                      className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150"
                      style={{
                        border: `1px solid ${activeId === t.id ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
                        background:
                          activeId === t.id
                            ? "rgba(201,168,76,0.1)"
                            : "rgba(255,255,255,0.03)",
                        color: activeId === t.id ? "#C9A84C" : "#94A3B8",
                      }}
                    >
                      <span className="truncate block">{t.theme}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: output */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#162035",
              border: "1px solid rgba(255,255,255,0.07)",
              minHeight: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {displayContent ? (
              <>
                <div
                  className="px-7 py-5 flex-shrink-0 flex items-center justify-between"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    borderLeft: "3px solid #C9A84C",
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-1"
                      style={{ color: "#C9A84C", letterSpacing: "0.12em" }}
                    >
                      Investment Thesis
                    </p>
                    <h3
                      className="font-bold capitalize"
                      style={{ color: "white", fontSize: "1.05rem" }}
                    >
                      {activeThesis?.theme ?? theses[0]?.theme}
                    </h3>
                  </div>
                  {isStreaming && (
                    <span
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{
                        background: "rgba(201,168,76,0.12)",
                        color: "#C9A84C",
                        border: "1px solid rgba(201,168,76,0.25)",
                      }}
                    >
                      Streaming...
                    </span>
                  )}
                </div>
                <div
                  ref={outputRef}
                  className="flex-1 overflow-y-auto p-7"
                >
                  <ThesisContent content={displayContent} isStreaming={isStreaming} />
                </div>
              </>
            ) : (
              <div
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                style={{ minHeight: 500 }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(201,168,76,0.1)" }}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#C9A84C"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <p className="font-semibold mb-2" style={{ color: "white" }}>
                  Enter a theme to generate your thesis
                </p>
                <p className="text-sm" style={{ color: "#94A3B8" }}>
                  Try "AI robotics" or "biology data infrastructure" to see an example.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
