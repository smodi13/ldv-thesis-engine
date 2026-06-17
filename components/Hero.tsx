"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  thesisCount: number;
  onNavigate: (section: string) => void;
}

const WORDS = ["LDV", "Thesis", "Engine"];

const wordVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function Hero({ thesisCount, onNavigate }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const counter1Ref = useRef<HTMLSpanElement>(null);
  const counter2Ref = useRef<HTMLSpanElement>(null);

  const [thesisDisplay, setThesisDisplay] = useState(thesisCount);

  useEffect(() => {
    setThesisDisplay(thesisCount);
  }, [thesisCount]);

  useEffect(() => {
    let gsapInstance: typeof import("gsap").gsap | null = null;
    let scrollTriggerCleanup: (() => void) | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;

        const orb1 = orb1Ref.current;
        const orb2 = orb2Ref.current;
        const orb3 = orb3Ref.current;

        if (orb1) {
          gsap.to(orb1, {
            x: 60,
            y: -80,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
        if (orb2) {
          gsap.to(orb2, {
            x: -80,
            y: 60,
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2,
          });
        }
        if (orb3) {
          gsap.to(orb3, {
            x: 40,
            y: 50,
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1,
          });
        }

        const c1 = { val: 0 };
        const c2 = { val: 0 };

        gsap.to(c1, {
          val: 5,
          duration: 2,
          delay: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            if (counter1Ref.current) {
              counter1Ref.current.textContent = String(Math.round(c1.val));
            }
          },
        });

        gsap.to(c2, {
          val: 16,
          duration: 2.2,
          delay: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            if (counter2Ref.current) {
              counter2Ref.current.textContent = String(Math.round(c2.val));
            }
          },
        });

        if (gridRef.current && heroRef.current) {
          const st = ScrollTrigger.create({
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              if (gridRef.current) {
                gsap.set(gridRef.current, {
                  backgroundPositionY: `${self.progress * -120}px`,
                });
              }
            },
          });

          scrollTriggerCleanup = () => st.kill();
        }
      });
    });

    return () => {
      if (scrollTriggerCleanup) scrollTriggerCleanup();
      if (gsapInstance) {
        gsapInstance.killTweensOf([
          orb1Ref.current,
          orb2Ref.current,
          orb3Ref.current,
        ]);
      }
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0B1426" }}
    >
      {/* Animated grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          willChange: "background-position-y",
        }}
      />

      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(11,20,38,0.6) 100%)",
        }}
      />

      {/* Orb 1: gold, top-left */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          left: "-10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 65%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />

      {/* Orb 2: blue, bottom-right */}
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: 750,
          height: 750,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,70,200,0.28) 0%, transparent 65%)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />

      {/* Orb 3: gold, center-right */}
      <div
        ref={orb3Ref}
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          right: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-6 w-full"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-7"
        >
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full"
            style={{
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.3)",
              background: "rgba(201,168,76,0.07)",
              letterSpacing: "0.12em",
            }}
          >
            Early-Stage Venture Intelligence
          </span>
        </motion.div>

        {/* Word-by-word title */}
        <motion.h1
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          className="font-bold text-white mb-7"
          style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.3em",
          }}
        >
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              variants={letterVariants}
              style={{
                display: "inline-block",
                color: i === 1 ? "#C9A84C" : "white",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mb-14 mx-auto"
          style={{
            color: "#94A3B8",
            lineHeight: 1.75,
            fontSize: "1.1rem",
            maxWidth: 600,
          }}
        >
          Sourcing and evaluating the next generation of category-defining startups across AI, robotics, software, biotech, and deep tech.
        </motion.p>

        {/* Stat counters */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25 }}
          className="mb-12 mx-auto"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            maxWidth: 540,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[
            { label: "Technology Sectors", ref: counter1Ref, init: "0" },
            { label: "Startups in Database", ref: counter2Ref, init: "0" },
            { label: "Theses Generated", ref: null, value: thesisDisplay },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center py-7 px-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                className="text-4xl font-bold mb-1.5"
                style={{
                  color: "#C9A84C",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.ref ? (
                  <span ref={stat.ref}>{stat.init}</span>
                ) : (
                  stat.value
                )}
              </div>
              <div
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            onClick={() => onNavigate("thesis")}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 28px rgba(201,168,76,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-9 py-4 rounded-xl font-bold text-sm"
            style={{
              background: "#C9A84C",
              color: "#0B1426",
              letterSpacing: "0.02em",
            }}
          >
            Generate a Thesis
          </motion.button>

          <motion.button
            onClick={() => onNavigate("sourcing")}
            whileHover={{
              scale: 1.04,
              borderColor: "rgba(201,168,76,0.6)",
              boxShadow: "0 0 20px rgba(201,168,76,0.12)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-9 py-4 rounded-xl font-bold text-sm"
            style={{
              color: "white",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.05)",
              letterSpacing: "0.02em",
            }}
          >
            Browse Startups
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
        style={{ transform: "translateX(-50%)", color: "rgba(255,255,255,0.25)" }}
      >
        <span className="text-xs tracking-widest uppercase" style={{ letterSpacing: "0.15em" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 36,
            background: "linear-gradient(to bottom, rgba(201,168,76,0.7), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
