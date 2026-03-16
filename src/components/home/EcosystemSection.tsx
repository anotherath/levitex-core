"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ecosystemItems = [
  {
    title: "Tokens",
    description: "Trade thousands of tokens across multiple chains with best-in-class routing.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="url(#eco1)" strokeWidth="2" />
        <circle cx="14" cy="14" r="4" fill="url(#eco1)" />
        <defs>
          <linearGradient id="eco1" x1="4" y1="4" x2="24" y2="24">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(167, 139, 250, 0.03))",
    accent: "#8b5cf6",
  },
  {
    title: "Pools",
    description: "Provide liquidity and earn fees with concentrated and full-range positions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="10" width="8" height="14" rx="2" stroke="url(#eco2)" strokeWidth="2" />
        <rect x="16" y="4" width="8" height="20" rx="2" stroke="url(#eco2)" strokeWidth="2" />
        <defs>
          <linearGradient id="eco2" x1="4" y1="4" x2="24" y2="24">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.06), rgba(103, 232, 249, 0.03))",
    accent: "#38bdf8",
  },
  {
    title: "Analytics",
    description: "Real-time dashboards with volume, TVL, and performance metrics at your fingertips.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20L10 14L16 18L24 8" stroke="url(#eco3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="8" r="2" fill="url(#eco3)" />
        <defs>
          <linearGradient id="eco3" x1="4" y1="8" x2="24" y2="20">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#6ee7b7" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.06), rgba(110, 231, 183, 0.03))",
    accent: "#34d399",
  },
  {
    title: "Community",
    description: "Join a global community of traders, builders, and liquidity providers shaping DeFi.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="10" r="4" stroke="url(#eco4)" strokeWidth="2" />
        <circle cx="20" cy="12" r="3" stroke="url(#eco4)" strokeWidth="2" />
        <path d="M2 24c0-4 4-7 8-7s8 3 8 7" stroke="url(#eco4)" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="eco4" x1="2" y1="6" x2="26" y2="24">
            <stop stopColor="#d946b8" />
            <stop offset="1" stopColor="#f0abfc" />
          </linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, rgba(217, 70, 184, 0.06), rgba(240, 171, 252, 0.03))",
    accent: "#d946b8",
  },
];

export default function EcosystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-28 lg:py-36 bg-linear-to-b from-(--bg-primary) to-(--bg-secondary)"
    >
      <motion.div
        className="section-container text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-(--text-primary) mb-4">
          Explore the{" "}
          <span className="gradient-text">Ecosystem</span>
        </h2>
        <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto">
          Everything you need to trade, earn, and build — all in one lightweight protocol.
        </p>
      </motion.div>

      <div className="section-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecosystemItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: index * 0.12 + 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="glass-card p-6 h-full group cursor-default text-center"
              style={{ background: item.gradient }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Animated icon container */}
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: `${item.accent}10`,
                  border: `1px solid ${item.accent}20`,
                }}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
              >
                {item.icon}
              </motion.div>

              <h3 className="text-lg font-bold text-(--text-primary) mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--text-secondary)">
                {item.description}
              </p>

              {/* Hover dot */}
              <div className="flex justify-center mt-5">
                <div
                  className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: item.accent }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
