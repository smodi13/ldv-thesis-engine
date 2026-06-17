"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

const stats = [
  { label: "Technology Sectors", value: 5, suffix: "" },
  { label: "Startups in Database", value: 16, suffix: "" },
  { label: "Theses Generated", value: 0, suffix: "", live: true },
];

interface HeroProps {
  thesisCount: number;
  onNavigate: (section: string) => void;
}

export default function Hero({ thesisCount, onNavigate }: HeroProps) {
  const [started, setStarted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const sectors = useCountUp(5, 1600, started);
  const startups = useCountUp(16, 2000, started);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0B1426" }}
    >
      {/* Gradient orbs */}
      <motion.div
        ref={orb1Ref}
        style={{ y: orb1Y }}
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.18, 0.26, 0.18],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      <motion.div
        ref={orb2Ref}
        style={{ y: orb2Y }}
        className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(30,80,200,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      <motion.div
        ref={orb3Ref}
        style={{ y: orb3Y }}
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.5) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5"
        >
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border"
            style={{
              color: "#C9A84C",
              borderColor: "rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.08)",
            }}
          >
            Early-Stage Venture Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-bold text-white mb-6"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          LDV{" "}
          <span style={{ color: "#C9A84C" }}>Thesis</span>{" "}
          Engine
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg mb-12 max-w-2xl mx-auto"
          style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}
        >
          Sourcing and evaluating the next generation of category-defining startups across AI, robotics, software, biotech, and deep tech.
        </motion.p>

        {/* Stat counters */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-3 gap-px mb-12 max-w-xl mx-auto rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {[
            { label: "Technology Sectors", value: sectors },
            { label: "Startups in Database", value: startups },
            { label: "Theses Generated", value: thesisCount },
          ].map((stat, i) => (
            <div
              key={i}
              className="py-6 px-4 text-center"
              style={{ background: "rgba(11,20,38,0.6)" }}
            >
              <div
                className="text-4xl font-bold mb-1"
                style={{ color: "#C9A84C", fontVariantNumeric: "tabular-nums" }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => onNavigate("thesis")}
            className="px-8 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200"
            style={{
              background: "#C9A84C",
              color: "#0B1426",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "#E8C97A";
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "#C9A84C";
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Generate a Thesis
          </button>
          <button
            onClick={() => onNavigate("sourcing")}
            className="px-8 py-3.5 rounded-lg font-semibold text-sm border transition-all duration-200"
            style={{
              color: "white",
              borderColor: "rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.5)";
              (e.target as HTMLButtonElement).style.background = "rgba(201,168,76,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
            }}
          >
            Browse Startups
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
