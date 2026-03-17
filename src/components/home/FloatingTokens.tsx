"use client";

import { motion } from "framer-motion";

const floatingTokens = [
  {
    symbol: "ETH",
    color: "#627eea",
    x: "8%",
    y: "18%",
    delay: 0,
    duration: 14.5,
  },
  {
    symbol: "BTC",
    color: "#f7931a",
    x: "85%",
    y: "22%",
    delay: 0.5,
    duration: 16.2,
  },
  {
    symbol: "SOL",
    color: "#9945ff",
    x: "12%",
    y: "72%",
    delay: 1.0,
    duration: 13.8,
  },
  {
    symbol: "ARB",
    color: "#28a0f0",
    x: "88%",
    y: "68%",
    delay: 0.3,
    duration: 17.1,
  },
  {
    symbol: "OP",
    color: "#ff0420",
    x: "5%",
    y: "45%",
    delay: 0.8,
    duration: 15.4,
  },
  {
    symbol: "MATIC",
    color: "#8247e5",
    x: "92%",
    y: "45%",
    delay: 0.6,
    duration: 14.9,
  },
  {
    symbol: "AVAX",
    color: "#e84142",
    x: "20%",
    y: "85%",
    delay: 1.2,
    duration: 16.7,
  },
  {
    symbol: "LINK",
    color: "#2a5ada",
    x: "78%",
    y: "82%",
    delay: 0.2,
    duration: 15.2,
  },
  {
    symbol: "UNI",
    color: "#ff007a",
    x: "25%",
    y: "35%",
    delay: 0.7,
    duration: 14.2,
  },
  {
    symbol: "AAVE",
    color: "#b6509e",
    x: "72%",
    y: "32%",
    delay: 1.1,
    duration: 15.8,
  },
  {
    symbol: "DAI",
    color: "#f5ac37",
    x: "18%",
    y: "55%",
    delay: 0.4,
    duration: 13.5,
  },
  {
    symbol: "SNX",
    color: "#00d1ff",
    x: "76%",
    y: "58%",
    delay: 0.9,
    duration: 14.7,
  },
];

export default function FloatingTokens() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingTokens.map((token) => (
        <motion.div
          key={token.symbol}
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: token.x,
            top: token.y,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: token.delay * 0.1,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="opacity-20 sm:opacity-30 md:opacity-45 lg:opacity-60 hover:opacity-100! transition-opacity duration-300"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                y: [0, -12, 0, 8, 0],
                x: [0, 5, -3, 6, 0],
                rotate: [0, 3, -2, 4, 0],
              }}
              transition={{
                duration: token.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: token.delay,
              }}
            >
              <div className="token-chip">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${token.color}, ${token.color}88)`,
                    boxShadow: `0 2px 10px ${token.color}33`,
                  }}
                >
                  <span className="text-[8px] font-bold text-white">
                    {token.symbol.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-medium">{token.symbol}</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
