"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import SwapPreviewCard from "@/components/home/SwapPreviewCard";
import FloatingTokens from "@/components/home/FloatingTokens";
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

export default function BridgePage() {
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

  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    // Delay heavy Three.js shader compilation so it doesn't block the main thread and stutter Framer Motion animations
    const timer = setTimeout(() => setShowScene(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const sections = useMemo(
    () => [
      {
        id: "bridge",
        component: (active: boolean) => (
          <section className="relative w-full h-full flex items-center justify-center overflow-hidden bg-(--bg-primary)">
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

            {/* Floating geometric shapes */}
            <div className="absolute top-24 left-[15%] w-8 h-8 border border-[rgba(139,92,246,0.2)] rounded-lg pointer-events-none animate-levitate" />
            <div
              className="absolute bottom-32 right-[18%] w-6 h-6 rounded-full pointer-events-none animate-levitate-reverse"
              style={{ background: "rgba(56, 189, 248, 0.15)" }}
            />
            <div className="absolute top-1/3 right-[15%] w-10 h-10 pointer-events-none animate-spin-slow">
              <svg viewBox="0 0 40 40" fill="none">
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  stroke="rgba(52, 211, 153, 0.2)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Three.js Scene */}
            <div className="absolute inset-0 z-0">
              {showScene && <HeroScene active={active} />}
            </div>

            {/* Floating token chips */}
            <div className="absolute inset-0 z-10">
              {showScene && <FloatingTokens />}
            </div>

            {/* Hero Content */}
            <div className="container max-w-6xl mx-auto px-4 relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-10 max-w-4xl"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d1b69] mb-4">
                  Bridge <span className="gradient-text">Assets</span>
                </h1>
                <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto mb-4 font-light">
                  Transfer your tokens across different networks securely and
                  efficiently.
                </p>
              </motion.div>

              <div className="w-full max-w-[480px]">
                <SwapPreviewCard
                  mode="bridge"
                  isStatic={true}
                  isInteractive={true}
                  buttonText="Connect Wallet"
                />
              </div>
            </div>
          </section>
        ),
      },
      {
        id: "footer",
        component: (active: boolean) => (
          <section className="relative w-full h-full flex flex-col justify-end bg-(--bg-primary)">
            <Footer />
          </section>
        ),
      },
    ],
    [],
  );

  const lastScrollTime = useRef(0);
  const scrollCooldown = isMobile ? 500 : 1000;
  const animationDuration = isMobile ? 0.4 : 0.8;

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
  }, [activeIndex, isAnimating, sections.length, scrollCooldown]);

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
  }, [activeIndex, isAnimating, scrollCooldown]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;
      if (Math.abs(e.deltaY) < 40) return;
      if (e.deltaY > 0) handleNext();
      else handlePrev();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") handleNext();
      else if (e.key === "ArrowUp" || e.key === "PageUp") handlePrev();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating || touchStart.current === null) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart.current - touchEnd;
      if (Math.abs(diff) > 50) {
        if (diff > 0) handleNext();
        else handlePrev();
      }
      touchStart.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
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
    window.dispatchEvent(
      new CustomEvent("activeSection", { detail: activeIndex }),
    );
  }, [activeIndex]);

  return (
    <main className="fixed inset-0 h-screen w-full overflow-hidden bg-[#f6f8fb]">
      <div className="relative w-full h-full">
        {sections.map((section, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

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
            className="group relative flex items-center justify-end p-2 focus:outline-hidden cursor-pointer"
          >
            <span
              className={`w-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-[#6366f1] h-8" : "bg-gray-400 h-2 opacity-30 group-hover:opacity-100"}`}
            />
          </button>
        ))}
      </div>

      <ScrollToTop
        forceVisible={activeIndex > 0}
        onClick={() => {
          if (isAnimating || activeIndex === 0) return;
          setDirection(-1);
          setIsAnimating(true);
          setActiveIndex(0);
        }}
      />
    </main>
  );
}
