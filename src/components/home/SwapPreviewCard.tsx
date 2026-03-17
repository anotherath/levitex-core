import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const tokens = {
  ETH: { symbol: "ETH", name: "Ethereum", color: "#627eea" },
  USDC: { symbol: "USDC", name: "USD Coin", color: "#2775ca" },
};

export default function SwapPreviewCard() {
  const [ethPrice, setEthPrice] = useState<number>(3245.8);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        ).catch(() => null);

        if (!response || !response.ok) return;

        const data = await response.json();
        if (data.ethereum && data.ethereum.usd) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        // Silently fail and use default price
      }
    };

    fetchPrice();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 40, 
        rotate: 3 
      }}
      animate={{ 
        opacity: 1, 
        y: [0, -15, 0],
        rotate: [3, 1.5, 3]
      }}
      transition={{ 
        opacity: { duration: 1, delay: 0.4, ease: "easeOut" },
        y: { 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        rotate: { 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        default: { duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      className="relative z-10 origin-center"
    >
      <motion.div
        className="relative w-full max-w-[420px] mx-auto rounded-[28px] overflow-hidden transition-colors duration-300"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(139, 92, 246, 0.12)",
          boxShadow:
            "0 20px 60px rgba(139, 92, 246, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold text-(--text-primary)">
              Swap
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[rgba(139,92,246,0.06)] hover:bg-[rgba(139,92,246,0.12)] transition-colors cursor-pointer">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-(--text-secondary)"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sell Field */}
          <div
            className="rounded-2xl p-4 mb-1.5"
            style={{
              background: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-(--text-tertiary)">
                You sell
              </span>
              <span className="text-xs text-(--text-tertiary)">
                Balance: 2.458
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-(--text-primary) tabular-nums">
                1.00
              </span>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-[1.03]"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(139, 92, 246, 0.12)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: tokens.ETH.color }}
                >
                  Ξ
                </div>
                <span className="text-sm font-semibold text-(--text-primary)">
                  ETH
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-(--text-tertiary)"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <span className="text-xs text-(--text-tertiary) mt-1 block">
              ≈ ${formatPrice(ethPrice)}
            </span>
          </div>

          {/* Swap Arrow */}
          <div className="flex items-center justify-center -my-2 relative z-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:rotate-180"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14m-7-7l7 7 7-7" />
              </svg>
            </div>
          </div>

          {/* Buy Field */}
          <div
            className="rounded-2xl p-4 mt-1.5"
            style={{
              background: "rgba(56, 189, 248, 0.04)",
              border: "1px solid rgba(56, 189, 248, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-(--text-tertiary)">
                You buy
              </span>
              <span className="text-xs text-(--text-tertiary)">
                Balance: 5,240.00
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-(--text-primary) tabular-nums">
                {formatPrice(ethPrice)}
              </span>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-[1.03]"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(56, 189, 248, 0.12)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: tokens.USDC.color }}
                >
                  $
                </div>
                <span className="text-sm font-semibold text-(--text-primary)">
                  USDC
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-(--text-tertiary)"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <span className="text-xs text-(--text-tertiary) mt-1 block">
              ≈ ${formatPrice(ethPrice)}
            </span>
          </div>

          {/* Get Started Button */}
          <Link href="/swap" className="block mt-5">
            <div
              className="w-full py-4 rounded-2xl text-center font-semibold text-white text-base cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #38bdf8 100%)",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
              }}
            >
              Get Started
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
