"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import HorizontalScroll from "@/components/ui/HorizontalScroll";

const ecosystemItems = [
  {
    title: "Tokens",
    description:
      "Trade thousands of tokens across multiple chains with best-in-class routing.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <path
          d="M24 6L40 36H8L24 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <polygon points="24,6 40,36 24,30" fill="currentColor" opacity="0.2" />
        <line
          x1="24"
          y1="6"
          x2="24"
          y2="30"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="8"
          y1="36"
          x2="24"
          y2="30"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(167, 139, 250, 0.03))",
    accentColor: "#8b5cf6",
  },
  {
    title: "Pools",
    description:
      "Provide liquidity and earn fees with concentrated and full-range positions.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <path
          d="M24 4L40 24L24 44L8 24L24 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <polygon points="24,4 40,24 24,24" fill="currentColor" opacity="0.2" />
        <line
          x1="8"
          y1="24"
          x2="40"
          y2="24"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="24"
          y1="4"
          x2="24"
          y2="44"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(56, 189, 248, 0.06), rgba(103, 232, 249, 0.03))",
    accentColor: "#38bdf8",
  },
  {
    title: "Analytics",
    description:
      "Real-time dashboards with volume, TVL, and performance metrics at your fingertips.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <ellipse
          cx="24"
          cy="12"
          rx="14"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <ellipse
          cx="24"
          cy="12"
          rx="14"
          ry="6"
          fill="currentColor"
          opacity="0.2"
        />
        <ellipse
          cx="24"
          cy="36"
          rx="14"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <line
          x1="10"
          y1="12"
          x2="10"
          y2="36"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="38"
          y1="12"
          x2="38"
          y2="36"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="24"
          y1="18"
          x2="24"
          y2="42"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.4"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(52, 211, 153, 0.06), rgba(110, 231, 183, 0.03))",
    accentColor: "#34d399",
  },
  {
    title: "Community",
    description:
      "Join a global community of traders, builders, and liquidity providers shaping DeFi.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
      >
        <polygon
          points="16,10 32,10 40,16 32,22 16,22 8,16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <polygon
          points="16,10 32,10 40,16 32,22 16,22 8,16"
          fill="currentColor"
          opacity="0.2"
        />
        <polygon
          points="16,32 32,32 40,38 32,44 16,44 8,38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <line
          x1="8"
          y1="16"
          x2="8"
          y2="38"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="40"
          y1="16"
          x2="40"
          y2="38"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="16"
          y1="22"
          x2="16"
          y2="44"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1="32"
          y1="22"
          x2="32"
          y2="44"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>
    ),
    gradient:
      "linear-gradient(135deg, rgba(217, 70, 184, 0.06), rgba(240, 171, 252, 0.03))",
    accentColor: "#d946b8",
  },
];

function EcosystemCard({
  item,
  isInView,
  isCarouselActive = true,
}: {
  item: (typeof ecosystemItems)[number];
  isInView: boolean;
  isCarouselActive?: boolean;
}) {
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const shouldAnimate = (isInView || isCarouselActive) && isTabVisible;

  return (
    <div
      className="glass-card p-6 h-full group cursor-default text-center transition-all duration-300 hover:-translate-y-2"
      style={{ background: item.gradient }}
    >
      {/* 3D Rotating Icon Container */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110"
        style={{
          background: `${item.accentColor}10`,
          border: `1px solid ${item.accentColor}20`,
          color: item.accentColor, // Passing standard color down to SVG currentColor
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
          {item.icon}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2" style={{ color: "#2d3359" }}>
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-(--text-secondary)">
        {item.description}
      </p>

      {/* Hover dot */}
      <div className="flex justify-center mt-5">
        <div
          className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: item.accentColor }}
        />
      </div>
    </div>
  );
}

export default function EcosystemSection({ active }: { active?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-150px" });
  const shouldAnimate = active || isInView;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 md:py-28 lg:py-36 bg-(--bg-primary)"
    >
      <motion.div
        className="section-container text-center mb-10 md:mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d1b69] mb-4">
          Explore the <span className="gradient-text">Ecosystem</span>
        </h2>
        <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto mb-4 font-light">
          Everything you need to trade, earn, and build — all in one lightweight
          protocol.
        </p>
      </motion.div>

      {/* Mobile & Tablet: Horizontal scroll carousel with Reveal effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <HorizontalScroll gap={12}>
          {ecosystemItems.map((item) => (
            <EcosystemCard key={item.title} item={item} isInView={shouldAnimate} />
          ))}
        </HorizontalScroll>
      </motion.div>

      {/* Desktop: Grid layout */}
      <div className="section-container hidden lg:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecosystemItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={
              shouldAnimate
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 40, scale: 0.95 }
            }
            transition={{
              duration: 0.6,
              delay: index * 0.1 + 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <EcosystemCard item={item} isInView={shouldAnimate} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
