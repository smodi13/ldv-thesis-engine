"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  thesisCount: number;
  onNavigate: (section: string) => void;
}

const WORDS = ["LDV", "Thesis", "Engine"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function Hero({ thesisCount, onNavigate }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const counter1Ref = useRef<HTMLSpanElement>(null);
  const counter2Ref = useRef<HTMLSpanElement>(null);

  const [thesisDisplay, setThesisDisplay] = useState(thesisCount);
  useEffect(() => setThesisDisplay(thesisCount), [thesisCount]);

  useEffect(() => {
    import("gsap").then(({ default: gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Floating orbs
        if (orb1Ref.current) {
          gsap.to(orb1Ref.current, {
            x: 70, y: -50, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut",
          });
        }
        if (orb2Ref.current) {
          gsap.to(orb2Ref.current, {
            x: -60, y: 80, duration: 13, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 3,
          });
        }
        if (orb3Ref.current) {
          gsap.to(orb3Ref.current, {
            x: 50, y: 60, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5,
          });
        }

        // Count-up animations
        const c1 = { val: 0 };
        const c2 = { val: 0 };

        gsap.to(c1, {
          val: 5, duration: 1.8, delay: 1, ease: "power2.out",
          onUpdate: () => {
            if (counter1Ref.current) counter1Ref.current.textContent = String(Math.round(c1.val));
          },
        });
        gsap.to(c2, {
          val: 16, duration: 2, delay: 1.1, ease: "power2.out",
          onUpdate: () => {
            if (counter2Ref.current) counter2Ref.current.textContent = String(Math.round(c2.val));
          },
        });
      });
    });
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #ffffff 0%, #f8f9fc 60%, #f1f4f9 100%)",
        paddingTop: 160,
        paddingBottom: 120,
      }}
    >
      {/* Subtle background orbs */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        style={{
          top: "-8%", left: "-6%",
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        style={{
          bottom: "-15%", right: "-8%",
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute pointer-events-none"
        style={{
          top: "20%", right: "10%",
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />

      {/* Content */}
      <div className="container-lg relative z-10 text-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
            style={{
              color: "#C9A84C",
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            Early-Stage Venture Intelligence
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-bold mb-7"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 0.25em",
            color: "#0F172A",
          }}
        >
          {WORDS.map((word) => (
            <motion.span
              key={word}
              variants={wordVariants}
              style={{
                display: "inline-block",
                color: word === "Thesis" ? "#C9A84C" : "#0F172A",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={0.95}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-16"
          style={{
            color: "#64748B",
            fontSize: "1.15rem",
            lineHeight: 1.7,
            maxWidth: 560,
          }}
        >
          Sourcing and evaluating the next generation of category-defining startups across AI, robotics, software, biotech, and deep tech.
        </motion.p>

        {/* Stats */}
        <motion.div
          custom={1.15}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-14"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(40px, 8vw, 100px)",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Technology Sectors", ref: counter1Ref, init: "0" },
            { label: "Startups in Database", ref: counter2Ref, init: "0" },
            { label: "Theses Generated", ref: null, value: thesisDisplay },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center" style={{ minWidth: 100 }}>
              <span
                className="font-bold mb-2"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "#0B1426",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.ref ? <span ref={stat.ref}>{stat.init}</span> : stat.value}
              </span>
              <div
                className="w-8 mb-3"
                style={{ height: 2, background: "#C9A84C", borderRadius: 1 }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          custom={1.35}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 justify-center"
        >
          <motion.button
            onClick={() => onNavigate("thesis")}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(11,20,38,0.2)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-8 py-3.5 rounded-xl font-bold text-sm"
            style={{
              background: "#0B1426",
              color: "white",
              letterSpacing: "0.02em",
            }}
          >
            Generate a Thesis
          </motion.button>

          <motion.button
            onClick={() => onNavigate("sourcing")}
            whileHover={{ scale: 1.03, background: "rgba(11,20,38,0.05)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-8 py-3.5 rounded-xl font-bold text-sm"
            style={{
              color: "#0B1426",
              border: "1.5px solid #0B1426",
              background: "transparent",
              letterSpacing: "0.02em",
            }}
          >
            Browse Startups
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 80,
          background: "linear-gradient(to bottom, transparent, rgba(248,249,252,0.5))",
        }}
      />
    </section>
  );
}
