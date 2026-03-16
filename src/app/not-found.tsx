"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
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
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[-8%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
          animation: "pulse-glow 5s ease-in-out infinite 1s",
        }}
      />

      {/* Floating wireframe Icosahedron — large, decorative */}
      <motion.div
        className="absolute pointer-events-none opacity-[0.07]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg
          width="600"
          height="600"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="#2d1b69"
            strokeWidth="0.15"
            fill="none"
            strokeLinejoin="round"
            transform="rotate(36, 16, 16)"
          >
            <polygon points="16,16 16,4 27,11.5" />
            <polygon points="16,16 27,11.5 23,24" />
            <polygon points="16,16 23,24 9,24" />
            <polygon points="16,16 9,24 5,11.5" />
            <polygon points="16,16 5,11.5 16,4" />
            <polygon points="16,4 27,11.5 24,2" />
            <polygon points="27,11.5 23,24 30,17.5" />
            <polygon points="23,24 9,24 16,30" />
            <polygon points="9,24 5,11.5 2,17.5" />
            <polygon points="5,11.5 16,4 8,2" />
            <polygon points="8,2 24,2 16,4" />
            <polygon points="24,2 30,17.5 27,11.5" />
            <polygon points="30,17.5 16,30 23,24" />
            <polygon points="16,30 2,17.5 9,24" />
            <polygon points="2,17.5 8,2 5,11.5" />
          </g>
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* 404 number with gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="text-[140px] sm:text-[180px] font-extrabold leading-none tracking-tighter select-none"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #6366f1 30%, #38bdf8 70%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2d1b69] mb-3">
            Page Not Found
          </h2>
          <p className="text-base text-(--text-secondary) leading-relaxed mb-10 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to another dimension.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/">
            <div
              className="px-8 py-3.5 rounded-2xl font-semibold text-white text-sm cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #38bdf8 100%)",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
              }}
            >
              Back to Home
            </div>
          </Link>
          <Link href="/swap">
            <div
              className="px-8 py-3.5 rounded-2xl font-semibold text-sm cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98] text-[#2d1b69]"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              Go to Swap
            </div>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
