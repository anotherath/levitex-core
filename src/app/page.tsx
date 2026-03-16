"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import SwapPreviewCard from "@/components/home/SwapPreviewCard";
import FloatingTokens from "@/components/home/FloatingTokens";
import FeaturesSection from "@/components/home/FeaturesSection";
import LiquiditySection from "@/components/home/LiquiditySection";
import EcosystemSection from "@/components/home/EcosystemSection";
import CTASection from "@/components/home/CTASection";
import { useFullpageScroll } from "@/hooks/useFullpageScroll";

// Lazy load Three.js to avoid SSR issues
const HeroScene = dynamic<any>(
  () => import("@/components/home/HeroScene").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

function HeroSection() {
  const heroRef = useRef(null);
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    // Delay heavy Three.js shader compilation so it doesn't block the main thread and stutter Framer Motion animations
    const timer = setTimeout(() => setShowScene(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f6f8fb 0%, #eef2f9 40%, #f1f4f9 100%)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
          animation: "pulse-glow 5s ease-in-out infinite 1s",
        }}
      />
      <div
        className="absolute top-[20%] left-[15%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.06) 0%, transparent 70%)",
          animation: "pulse-glow 7s ease-in-out infinite 2s",
        }}
      />

      {/* Three.js Scene */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity: sceneOpacity, scale: sceneScale }}
      >
        {showScene && <HeroScene />}
      </motion.div>

      {/* Floating token chips */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ opacity: sceneOpacity }}
      >
        {showScene && <FloatingTokens />}
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className="relative z-20 text-center px-4 max-w-4xl mx-auto pointer-events-none"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#2d1b69] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Trade assets that move
          <br />
          <span className="gradient-text">as freely as you do.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-(--text-secondary) max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          A lighter, faster way to explore decentralized liquidity.
        </motion.p>

        {/* Swap Preview Card */}
        <div className="pointer-events-auto inline-block w-full">
          <SwapPreviewCard />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{ opacity: heroOpacity }}
      >
        <span className="text-[11px] font-medium text-(--text-tertiary) uppercase tracking-widest">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-(--accent-violet)"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  useFullpageScroll(mainRef);

  return (
    <main ref={mainRef} className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <LiquiditySection />
      <EcosystemSection />
      <CTASection />
    </main>
  );
}
