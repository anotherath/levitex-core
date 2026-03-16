"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f6f8fb 0%, #eef2f9 40%, #f1f4f9 100%)",
      }}
    >
      {/* Background decorative orbs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 70, 184, 0.1) 0%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-12%] right-[-8%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
          animation: "pulse-glow 6s ease-in-out infinite 1.5s",
        }}
      />

      {/* Floating wireframe Octahedron — decorative */}
      <motion.div
        className="absolute pointer-events-none opacity-[0.06]"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <svg
          width="500"
          height="500"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="#2d1b69"
            strokeWidth="0.18"
            fill="none"
            strokeLinejoin="round"
          >
            {/* Octahedron wireframe */}
            <polygon points="16,2 28,16 16,30" />
            <polygon points="16,2 4,16 16,30" />
            <line x1="4" y1="16" x2="28" y2="16" />
            <line x1="16" y1="2" x2="16" y2="30" />
            <line x1="4" y1="16" x2="16" y2="2" />
            <line x1="28" y1="16" x2="16" y2="2" />
            <line x1="4" y1="16" x2="16" y2="30" />
            <line x1="28" y1="16" x2="16" y2="30" />
          </g>
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* Error icon */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(217, 70, 184, 0.1), rgba(139, 92, 246, 0.1))",
              border: "1px solid rgba(217, 70, 184, 0.15)",
              boxShadow: "0 8px 32px rgba(217, 70, 184, 0.1)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#errorGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient
                  id="errorGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#d946b8" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2d1b69] mb-3">
            Something went wrong
          </h1>
          <p className="text-base text-(--text-secondary) leading-relaxed mb-10 max-w-sm mx-auto">
            An unexpected error occurred. Don&apos;t worry, our team is on it.
            Please try again.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => reset()}
            className="px-8 py-3.5 rounded-2xl font-semibold text-white text-sm cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #38bdf8 100%)",
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
            }}
          >
            Try Again
          </button>
          <Link href="/">
            <div
              className="px-8 py-3.5 rounded-2xl font-semibold text-sm cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98] text-[#2d1b69]"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              Back to Home
            </div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
