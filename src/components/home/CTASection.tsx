"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

export default function CTASection({ active }: { active?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-150px" });
  const shouldAnimate = active || isInView;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-32 lg:py-44 overflow-hidden bg-(--bg-primary)"
    >
      {/* Background orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.06) 0%, transparent 70%)",
          animation: "pulse-glow 6s ease-in-out infinite 1s",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 70, 184, 0.06) 0%, transparent 70%)",
          animation: "pulse-glow 5s ease-in-out infinite 2s",
        }}
      />

      {/* Floating geometric shapes — CSS-driven instead of JS-driven */}
      <div
        className="absolute top-16 left-[10%] w-8 h-8 border border-[rgba(139,92,246,0.2)] rounded-lg pointer-events-none animate-levitate"
      />
      <div
        className="absolute bottom-20 right-[12%] w-6 h-6 rounded-full pointer-events-none animate-levitate-reverse"
        style={{ background: "rgba(56, 189, 248, 0.15)" }}
      />
      <div
        className="absolute top-1/3 right-[20%] w-10 h-10 pointer-events-none animate-spin-slow"
      >
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

      {/* Content */}
      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d1b69] mb-6 leading-tight">
            Let your assets{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">move freely.</span>
          </h2>
          <p className="text-base md:text-lg text-(--text-secondary) max-w-xl mx-auto mb-10 font-light">
            Join a new generation of traders who believe in open, transparent,
            and frictionless decentralized finance.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={shouldAnimate ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/swap">
              <button className="gradient-button text-lg px-12 py-5 rounded-2xl">
                <span className="flex items-center gap-2">
                  Launch App
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-14 flex-wrap"
            initial={{ opacity: 0 }}
            animate={shouldAnimate ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {["Audited", "Non-Custodial", "Open Source", "Multi-chain"].map(
              (badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-xs font-medium text-(--text-tertiary)"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-(--accent-mint)" />
                  {badge}
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
