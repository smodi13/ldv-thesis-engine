"use client";

import { motion } from "framer-motion";

const LINKS = [
  {
    label: "Email",
    value: "modi.sahil@gmail.com",
    href: "mailto:modi.sahil@gmail.com",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "(602) 535-7223",
    href: "tel:+16025357223",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "github.com/smodi13",
    href: "https://github.com/smodi13",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Website",
    value: "sahilmodi.vercel.app",
    href: "https://sahilmodi.vercel.app",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

const CAPABILITIES = [
  {
    title: "Thesis Development",
    description: "The Groq-powered thesis generator demonstrates how I think about investment theses: market timing, defensibility, target archetypes, and risks.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Deal Sourcing",
    description: "The startup database reflects how I track emerging companies: curated by sector, scored on multiple dimensions, with structured data pipelines.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "Technical Evaluation",
    description: "Radar-chart scoring across five dimensions shows how I evaluate technical defensibility, market size, team quality, timing, and traction.",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6" style={{ background: "#F7F8FA" }}>
      <div className="max-w-5xl mx-auto">
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
              Application Context
            </span>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: "#0B1426", letterSpacing: "-0.02em" }}>
            About This Project
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border p-8 h-full" style={{ background: "white", borderColor: "#E2E6EE" }}>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#C9A84C" }}>
                  Built by
                </p>
                <h3 className="text-2xl font-bold" style={{ color: "#0B1426" }}>Sahil Modi</h3>
                <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>
                  Applicant, Investment Associate at LDV Partners
                </p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#374151" }}>
                <p>
                  This application was built specifically for my Investment Associate application at LDV Partners. It demonstrates the three core skills the role requires: sourcing, thesis development, and technical evaluation, implemented as a working full-stack product.
                </p>
                <p>
                  LDV explicitly values technical builders who ship side projects. This is that. The thesis generator uses the Groq API to stream structured investment memos in real time. The startup database is a curated set of companies across LDV focus areas, scored on a five-dimension rubric and visualized as interactive radar charts.
                </p>
                <p>
                  I built this in a single session with Next.js 14, Tailwind CSS, Framer Motion, Recharts, and the Groq API. The architecture is clean and extensible: all startup data lives in a typed JSON file, the API route is fully streaming, and the UI is responsive and production-ready.
                </p>
                <p>
                  I am genuinely excited about the work LDV does at the intersection of AI, robotics, and data, and I want to be part of finding and funding the companies that define the next decade of the technical stack.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "#E2E6EE" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "#6B7A99" }}>
                  What This Demonstrates
                </p>
                <div className="space-y-4">
                  {CAPABILITIES.map((cap) => (
                    <div key={cap.title} className="flex gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                      >
                        {cap.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "#0B1426" }}>{cap.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "#6B7A99" }}>{cap.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-2xl border p-6" style={{ background: "#0B1426", borderColor: "#1E2D4A" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Get in Touch
                </p>
                <div className="space-y-3">
                  {LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#C9A84C" }}
                      >
                        {link.icon}
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{link.label}</p>
                        <p
                          className="text-sm font-medium transition-colors"
                          style={{ color: "white" }}
                        >
                          {link.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stack callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 rounded-2xl border p-6"
          style={{ background: "white", borderColor: "#E2E6EE" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7A99" }}>
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Groq API (llama-3.3-70b)", "Recharts", "App Router", "Streaming SSE"].map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: "#F7F8FA",
                  color: "#374151",
                  border: "1px solid #E2E6EE",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
