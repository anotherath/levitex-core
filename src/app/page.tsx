"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  Variants,
} from "framer-motion";
import SwapPreviewCard from "@/components/home/SwapPreviewCard";
import FloatingTokens from "@/components/home/FloatingTokens";
import FeaturesSection from "@/components/home/FeaturesSection";
import LiquiditySection from "@/components/home/LiquiditySection";
import EcosystemSection from "@/components/home/EcosystemSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Lazy load Three.js to avoid SSR issues
const HeroScene = dynamic<{ active?: boolean }>(
  () => import("@/components/home/HeroScene").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

function HeroSection() {
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    // Delay heavy Three.js shader compilation so it doesn't block the main thread and stutter Framer Motion animations
    const timer = setTimeout(() => setShowScene(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-(--bg-primary)">
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
      <div className="absolute inset-0 z-0">
        {showScene && <HeroScene active={true} />}
      </div>

      {/* Floating token chips */}
      <div className="absolute inset-0 z-10">
        {showScene && <FloatingTokens />}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pointer-events-none">
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
      </div>
    </section>
  );
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for down, -1 for up
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const sections = useMemo(
    () => [
      { id: "hero", component: (active: boolean) => <HeroSection /> }, // HeroSection doesn't need it as it's first
      {
        id: "features",
        component: (active: boolean) => <FeaturesSection active={active} />,
      },
      {
        id: "liquidity",
        component: (active: boolean) => <LiquiditySection active={active} />,
      },
      {
        id: "ecosystem",
        component: (active: boolean) => <EcosystemSection active={active} />,
      },
      {
        id: "cta",
        component: (active: boolean) => <CTASection active={active} />,
      },
      { id: "footer", component: (active: boolean) => <Footer /> },
    ],
    [],
  );

  const lastScrollTime = useRef(0);
  const scrollCooldown = isMobile ? 500 : 1000; // ms
  const animationDuration = isMobile ? 0.4 : 0.8; // s

  const handleNext = useCallback(() => {
    const now = Date.now();
    if (
      isAnimating ||
      activeIndex >= sections.length - 1 ||
      now - lastScrollTime.current < scrollCooldown
    )
      return;

    lastScrollTime.current = now;
    setDirection(1);
    setIsAnimating(true);
    setActiveIndex((prev) => prev + 1);
  }, [activeIndex, isAnimating, sections.length]);

  const handlePrev = useCallback(() => {
    const now = Date.now();
    if (
      isAnimating ||
      activeIndex <= 0 ||
      now - lastScrollTime.current < scrollCooldown
    )
      return;

    lastScrollTime.current = now;
    setDirection(-1);
    setIsAnimating(true);
    setActiveIndex((prev) => prev - 1);
  }, [activeIndex, isAnimating]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;

      // Touchpads send many small events. Threshold 40 helps filter jitters.
      if (Math.abs(e.deltaY) < 40) return;

      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        handlePrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating || touchStart.current === null) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart.current - touchEnd;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      touchStart.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false }); // Set passive false to potentially prevent default if needed
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleNext, handlePrev, isAnimating]);

  useEffect(() => {
    // Notify components (like Navbar) about the current active section
    window.dispatchEvent(
      new CustomEvent("activeSection", { detail: activeIndex }),
    );
  }, [activeIndex]);

  // Variants for the section transitions
  const variants: Variants = {
    initial: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1,
    }),
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: animationDuration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95, // Subtle scale down when flying away
      transition: {
        duration: animationDuration,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <main className="fixed inset-0 h-screen w-full overflow-hidden bg-[#f6f8fb]">
      <div className="relative w-full h-full">
        {sections.map((section, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isFuture = index > activeIndex;

          return (
            <motion.div
              key={section.id}
              className="absolute inset-0 w-full h-full overflow-hidden"
              initial={false}
              animate={{
                y: isActive ? "0%" : isPast ? "-100%" : "100%",
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : isPast ? 0.95 : 1,
                zIndex: isActive ? 20 : 10,
              }}
              transition={{
                duration: animationDuration,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => {
                if (isActive) setIsAnimating(false);
              }}
              style={{
                pointerEvents: isActive ? "auto" : "none",
                visibility:
                  isActive || Math.abs(index - activeIndex) <= 1
                    ? "visible"
                    : "hidden",
              }}
            >
              {section.component(isActive)}
            </motion.div>
          );
        })}
      </div>

      {/* Vertical Navigation Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (isAnimating || i === activeIndex) return;
              setDirection(i > activeIndex ? 1 : -1);
              setIsAnimating(true);
              setActiveIndex(i);
            }}
            className="group relative flex items-center justify-end p-2 focus:outline-hidden"
            aria-label={`Go to section ${i + 1}`}
          >
            <span
              className={`w-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-[#6366f1] h-8"
                  : "bg-gray-400 h-2 opacity-50 group-hover:opacity-100"
              }`}
            />
          </button>
        ))}
      </div>

      <ScrollToTop
        forceVisible={activeIndex > 0}
        onClick={() => {
          if (isAnimating) return;
          setDirection(-1);
          setIsAnimating(true);
          setActiveIndex(0);
        }}
      />
    </main>
  );
}
