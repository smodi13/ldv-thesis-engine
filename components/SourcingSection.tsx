"use client";

import { useEffect, useRef } from "react";

interface SourcingCard {
  name: string;
  sector: string;
  stage: string;
  pitch: string;
  whyLDV: string;
}

const CARDS: SourcingCard[] = [
  {
    name: "Genesis AI",
    sector: "Deep Tech / Robotics",
    stage: "Seed, $105M raised July 2025, Palo Alto CA",
    pitch:
      "Genesis AI is building a universal robotics foundation model using a proprietary physics simulation engine that generates synthetic training data significantly faster than competitors relying on Nvidia's tools. Founded by Zhou Xian, a 2024 Carnegie Mellon robotics PhD, and Theophile Gervet, a former researcher at Mistral AI and Skild AI, the team contributed to foundational tools including PyTorch, Diffusion Policy, and the Genesis simulator. The core insight is that the bottleneck in physical AI is not model architecture but data, and Genesis is building the data generation layer that everyone else depends on. Over 95 percent of global physical labor remains unautomated and Genesis is positioning itself as the horizontal infrastructure layer that makes automation tractable across all robot embodiments.",
    whyLDV:
      "Deep tech founders from top research institutions building foundational infrastructure. Fits LDV's thesis on AI and robotics at the platform layer.",
  },
  {
    name: "Dyna Robotics",
    sector: "Robotics / Physical AI",
    stage: "Series A, $144M total raised, Redwood City CA",
    pitch:
      "Dyna Robotics is a general-purpose robotics company founded by repeat entrepreneurs Lindon Gao and York Yang, who previously built and sold Caper AI to Instacart for $350 million, alongside DeepMind research scientist Jason Ma. The company's DYNA-1 foundation model achieved a 99 percent plus success rate in 24 hours of non-stop commercial operation within one year of founding. Robots are deployed at hotels, restaurants, laundromats, and gyms today, not in a lab. The founder pedigree is exceptional: they have already proven they can build hardware-software systems that reach commercial scale and sell them to a strategic acquirer. They are doing it again, in a larger category, with a stronger team.",
    whyLDV:
      "Repeat founders with a prior exit building in exactly the physical AI thesis. Commercial traction from day one distinguishes this from pure research bets.",
  },
  {
    name: "Lila Sciences",
    sector: "Biotech / Deep Tech",
    stage: "Series A, $15M raised May 2025, Cambridge MA",
    pitch:
      "Lila Sciences is applying foundation model techniques to high-throughput experimental biology, specifically automating the flow cytometry workflows that are the rate-limiting step in drug discovery. Every AI drug discovery company has a model that generates candidate molecules. Almost none of them have solved validating those candidates in a wet lab at scale. Lila is building the autonomous wet lab infrastructure that closes this loop, using computer vision and robotics to read cell morphology at petabyte scale and feed structured results back into the model pipeline. This is the data infrastructure layer of AI drug discovery, funded by Lux Capital and Fifty Years, two of the strongest deep tech investors in the world.",
    whyLDV:
      "Fits LDV's biotech and deep tech thesis at the infrastructure layer. Cambridge MA proximity gives LDV a sourcing advantage through MIT and Harvard lab relationships.",
  },
];

export default function SourcingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const el = sectionRef.current;
        if (!el) return;

        gsap.fromTo(
          el.querySelector(".section-header"),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 78%" },
          }
        );

        gsap.fromTo(
          el.querySelectorAll(".sourcing-card"),
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.14,
            ease: "power3.out",
            delay: 0.1,
            scrollTrigger: { trigger: el, start: "top 78%" },
          }
        );
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sourced"
      style={{
        background: "#F8F9FC",
        paddingTop: 112,
        paddingBottom: 112,
        borderTop: "1px solid #E2E8F0",
      }}
    >
      <div className="container-lg">
        {/* Header */}
        <div className="section-header mb-14" style={{ opacity: 0 }}>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#C9A84C", letterSpacing: "0.14em" }}
          >
            Original Sourcing
          </p>
          <h2
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
              color: "#0F172A",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Sourced by Sahil
          </h2>
          <p
            style={{
              color: "#64748B",
              maxWidth: 580,
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Three companies outside the mainstream database that I would put on LDV's radar. Early stage, under the radar, and fit the LDV thesis on AI, robotics, and deep tech.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {CARDS.map((card) => (
            <div
              key={card.name}
              className="sourcing-card rounded-2xl"
              style={{
                background: "white",
                border: "1px solid #E2E8F0",
                borderLeft: "3px solid #C9A84C",
                boxShadow: "var(--shadow-sm)",
                padding: 32,
                opacity: 0,
              }}
            >
              {/* Top row: name + badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                <h3
                  className="font-bold"
                  style={{ color: "#0B1426", fontSize: "1.35rem", letterSpacing: "-0.015em" }}
                >
                  {card.name}
                </h3>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "rgba(201,168,76,0.1)",
                    color: "#C9A84C",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {card.sector}
                </span>
              </div>

              {/* Stage */}
              <p
                className="text-xs font-medium mb-5"
                style={{ color: "#94A3B8", letterSpacing: "0.02em" }}
              >
                {card.stage}
              </p>

              {/* Pitch */}
              <p
                className="text-sm mb-6"
                style={{ color: "#475569", lineHeight: 1.8 }}
              >
                {card.pitch}
              </p>

              {/* Why LDV */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  paddingTop: 16,
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <span style={{ color: "#C9A84C", fontSize: "0.95rem", marginTop: 1 }}>
                  &#8594;
                </span>
                <p
                  className="text-sm"
                  style={{
                    color: "#C9A84C",
                    fontStyle: "italic",
                    lineHeight: 1.65,
                  }}
                >
                  <strong style={{ fontStyle: "normal", fontWeight: 600 }}>Why LDV: </strong>
                  {card.whyLDV}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
