"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalScroll from "@/components/ui/HorizontalScroll";

const features = [
  {
    title: "Fast Routing",
    description:
      "Intelligent pathfinding across multiple liquidity sources to find the best rates in milliseconds.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <path
          d="M24 6L40 16V32L24 42L8 32V16L24 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <path
          d="M24 6L40 16L24 26L8 16L24 6Z"
          fill="currentColor"
          opacity="0.2"
        />
        <line
          x1="24"
          y1="26"
          x2="24"
          y2="42"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.04))",
    accentColor: "#8b5cf6",
  },
  {
    title: "Deep Liquidity",
    description:
      "Aggregate liquidity from top AMMs and order books, ensuring minimal slippage on every trade.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <circle
          cx="24"
          cy="24"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="16"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="6"
          ry="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(52, 211, 153, 0.04))",
    accentColor: "#38bdf8",
  },
  {
    title: "Open Ecosystem",
    description:
      "Permissionless integration with any token, pool, or protocol. Build freely on top of Levitex.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <ellipse
          cx="24"
          cy="24"
          rx="18"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="10"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(217, 70, 184, 0.08), rgba(139, 92, 246, 0.04))",
    accentColor: "#d946b8",
  },
];

function FeatureCard({
  feature,
  isInView,
  isCarouselActive = true,
}: {
  feature: (typeof features)[number];
  isInView: boolean;
  isCarouselActive?: boolean;
}) {
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const shouldAnimate = isInView && isCarouselActive && isTabVisible;

  return (
    <div
      className="glass-card p-6 md:p-8 h-full group cursor-default"
      style={{ background: feature.gradient }}
    >
      {/* 3D Rotating Icon */}
      <div className="mb-6 flex justify-start">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `${feature.accentColor}10`,
            border: `1px solid ${feature.accentColor}20`,
            color: feature.accentColor, // Passing standard color down to SVG currentColor
          }}
        >
          <div
            className="w-10 h-10 animate-spin-3d"
            style={{ 
              animationPlayState: shouldAnimate ? "running" : "paused",
              willChange: "transform",
              transformStyle: "preserve-3d"
            }}
          >
            {feature.icon}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3" style={{ color: "#2d3359" }}>
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
  );
}

export default function FeaturesSection({ active }: { active?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-150px" });
  const shouldAnimate = active || isInView;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 md:py-28 lg:py-36 bg-(--bg-primary)"
    >
      {/* Section header */}
      <motion.div
        className="section-container text-center mb-10 md:mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d1b69] mb-4">
          How Levitex Moves <span className="gradient-text">Liquidity</span>
        </h2>
        <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto mb-4 font-light">
          A new paradigm in decentralized trading — fast, transparent, and
          designed to move freely.
        </p>
      </motion.div>

      {/* Mobile: Horizontal scroll carousel with Reveal effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <HorizontalScroll gap={12}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              isInView={shouldAnimate}
            />
          ))}
        </HorizontalScroll>
      </motion.div>

      {/* Desktop: Grid layout */}
      <div className="section-container hidden lg:grid grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: index * 0.15 + 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <FeatureCard feature={feature} isInView={shouldAnimate} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
