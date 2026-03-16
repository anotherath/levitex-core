"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    title: "Fast Routing",
    description:
      "Intelligent pathfinding across multiple liquidity sources to find the best rates in milliseconds.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 16h6l3-8 6 16 3-8h6" stroke="url(#grad1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="grad1" x1="6" y1="16" x2="30" y2="16">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.04))",
    accentColor: "#8b5cf6",
    shape: "cube",
  },
  {
    title: "Deep Liquidity",
    description:
      "Aggregate liquidity from top AMMs and order books, ensuring minimal slippage on every trade.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="url(#grad2)" strokeWidth="2" />
        <circle cx="16" cy="16" r="5" stroke="url(#grad2)" strokeWidth="2" />
        <circle cx="16" cy="16" r="2" fill="url(#grad2)" />
        <defs>
          <linearGradient id="grad2" x1="6" y1="6" x2="26" y2="26">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(52, 211, 153, 0.04))",
    accentColor: "#38bdf8",
    shape: "sphere",
  },
  {
    title: "Open Ecosystem",
    description:
      "Permissionless integration with any token, pool, or protocol. Build freely on top of Levitex.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="8" y="8" width="16" height="16" rx="4" stroke="url(#grad3)" strokeWidth="2" />
        <path d="M16 4v4m0 16v4m8-12h4M4 16h4" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="grad3" x1="4" y1="4" x2="28" y2="28">
            <stop stopColor="#d946b8" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(217, 70, 184, 0.08), rgba(139, 92, 246, 0.04))",
    accentColor: "#d946b8",
    shape: "torus",
  },
];

function AnimatedGeometricIcon({ shape, color }: { shape: string; color: string }) {
  return (
    <motion.div
      className="relative w-12 h-12"
      animate={{ rotateY: 360, rotateX: 15 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {shape === "cube" && (
        <svg viewBox="0 0 48 48" className="w-full h-full" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
          <path d="M24 6L40 16V32L24 42L8 32V16L24 6Z" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
          <path d="M24 6L40 16L24 26L8 16L24 6Z" fill={`${color}15`} stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="24" y1="26" x2="24" y2="42" stroke={color} strokeWidth="1" opacity="0.3" />
        </svg>
      )}
      {shape === "sphere" && (
        <svg viewBox="0 0 48 48" className="w-full h-full" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
          <circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="24" cy="24" rx="16" ry="6" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
          <ellipse cx="24" cy="24" rx="6" ry="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
        </svg>
      )}
      {shape === "torus" && (
        <svg viewBox="0 0 48 48" className="w-full h-full" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
          <ellipse cx="24" cy="24" rx="18" ry="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="24" cy="24" rx="10" ry="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
        </svg>
      )}
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-28 lg:py-36 bg-linear-to-b from-(--bg-secondary) to-(--bg-primary)"
    >
      {/* Section header */}
      <motion.div
        className="section-container text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-(--text-primary) mb-4">
          How Levitex Moves{" "}
          <span className="gradient-text">Liquidity</span>
        </h2>
        <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto">
          A new paradigm in decentralized trading — fast, transparent, and
          designed to move freely.
        </p>
      </motion.div>

      {/* Feature cards */}
      <div className="section-container grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: index * 0.15 + 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="glass-card p-8 h-full group cursor-default"
              style={{ background: feature.gradient }}
            >
              {/* Icon */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.accentColor}10`,
                    border: `1px solid ${feature.accentColor}20`,
                  }}
                >
                  {feature.icon}
                </div>
                <AnimatedGeometricIcon
                  shape={feature.shape}
                  color={feature.accentColor}
                />
              </div>

              <h3 className="text-xl font-bold text-(--text-primary) mb-3">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--text-secondary)">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div
                className="mt-6 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${feature.accentColor}, transparent)`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
