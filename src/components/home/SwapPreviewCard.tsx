"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const tokensList = [
  { symbol: "ETH", name: "Ethereum", color: "#627eea", balance: "2.458", icon: "https://coin-images.coingecko.com/coins/images/279/small/ethereum.png" },
  { symbol: "USDC", name: "USD Coin", color: "#2775ca", balance: "5,240.00", icon: "https://coin-images.coingecko.com/coins/images/6319/small/USDC.png" },
  { symbol: "BTC", name: "Bitcoin", color: "#f7931a", balance: "0.045", icon: "https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png" },
  { symbol: "SOL", name: "Solana", color: "#14f195", balance: "124.5", icon: "https://coin-images.coingecko.com/coins/images/4128/small/solana.png" },
  { symbol: "ARB", name: "Arbitrum", color: "#28a0f0", balance: "1,200.0", icon: "https://coin-images.coingecko.com/coins/images/16547/small/arb.jpg?1721358242" },
];

const networksList = [
  { id: "monad", name: "Monad", color: "#8b5cf6", symbol: "M", icon: "https://coin-images.coingecko.com/coins/images/38927/small/mon.png?1766029057" },
  { id: "ethereum", name: "Ethereum", color: "#627eea", symbol: "E", icon: "https://coin-images.coingecko.com/coins/images/279/small/ethereum.png?1696501628" },
];

interface SwapPreviewCardProps {
  mode?: "swap" | "bridge" | "pools" | "flux";
  isStatic?: boolean;
  isInteractive?: boolean;
  buttonText?: string;
}

export default function SwapPreviewCard({
  mode = "swap",
  isStatic = true,
  isInteractive = false,
  buttonText,
}: SwapPreviewCardProps) {
  const [ethPrice, setEthPrice] = useState<number>(3245.8);
  const [sellAmount, setSellAmount] = useState<string>("1.00");
  const [buyAmount, setBuyAmount] = useState<string>("3245.80");
  const [sellToken, setSellToken] = useState(tokensList[0]);
  const [buyToken, setBuyToken] = useState(tokensList[1]);

  // Bridge specific state
  const [fromNetwork, setFromNetwork] = useState(networksList[0]);
  const [toNetwork, setToNetwork] = useState(networksList[1]);

  const [showSettings, setShowSettings] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState<"sell" | "buy" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [slippage, setSlippage] = useState("0.5");

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          if (!isInteractive && mode === "swap") {
            setBuyAmount(formatPrice(data.ethereum.usd));
          }
        }
      } catch (error) {
        // Silently fail
      }
    };

    fetchPrice();
  }, [isInteractive, mode]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleMaxBalance = () => {
    if (!isInteractive) return;
    setSellAmount(sellToken.balance.replace(/,/g, ""));
  };

  const handleAction = () => {
    if (!isInteractive) return;
    if (mode === "swap" || mode === "bridge") {
      const tempToken = sellToken;
      setSellToken(buyToken);
      setBuyToken(tempToken);

      if (mode === "swap") {
        const tempAmount = sellAmount;
        setSellAmount(buyAmount);
        setBuyAmount(tempAmount);
      } else {
        const tempNet = fromNetwork;
        setFromNetwork(toNetwork);
        setToNetwork(tempNet);
      }
    }
  };

  const filteredTokens = tokensList.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const containerVariants = {
    floating: {
      initial: { opacity: 0, y: 40, rotate: 3 },
      animate: {
        opacity: 1,
        y: [0, -15, 0],
        rotate: [3, 1.5, 3],
      },
      transition: {
        opacity: { duration: 1, delay: 0.4, ease: "easeOut" as any },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" as any },
        rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" as any },
        default: { duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] as any },
      },
    },
    static: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, ease: "easeOut" as any },
    },
  };

  const currentVariant = isStatic
    ? containerVariants.static
    : containerVariants.floating;
  const displayButtonText =
    buttonText ||
    (mode === "swap"
      ? "Get Started"
      : mode === "bridge"
        ? "Bridge Assets"
        : "Enter App");

  return (
    <motion.div
      initial={currentVariant.initial}
      animate={currentVariant.animate}
      transition={currentVariant.transition}
      className={`relative z-10 origin-center ${isStatic ? "w-full" : ""}`}
    >
      <motion.div
        className="relative w-full max-w-[420px] mx-auto rounded-[28px] overflow-visible"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(139, 92, 246, 0.12)",
          boxShadow:
            "0 20px 60px rgba(139, 92, 246, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 relative">
            <span className="text-sm font-semibold text-(--text-primary) capitalize">
              {mode}
            </span>
            {mode !== "bridge" && (
              <div className="flex items-center gap-2" ref={settingsRef}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center bg-[rgba(139,92,246,0.06)] hover:bg-[rgba(139,92,246,0.12)] transition-colors ${isInteractive ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    if (isInteractive) {
                      setSellAmount("1.00");
                      if (mode === "swap") setBuyAmount(formatPrice(ethPrice));
                    }
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <polyline points="21 3 21 8 16 8" />
                  </svg>
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center bg-[rgba(139,92,246,0.06)] hover:bg-[rgba(139,92,246,0.12)] transition-colors ${isInteractive ? "cursor-pointer" : ""}`}
                  onClick={() =>
                    isInteractive && setShowSettings(!showSettings)
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>

                <AnimatePresence>
                  {showSettings && isInteractive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-10 right-0 w-64 bg-white p-4 z-50 shadow-2xl border border-violet-100 rounded-2xl"
                    >
                      <h4 className="text-sm font-bold text-(--text-primary) mb-3">
                        Settings
                      </h4>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-(--text-secondary)">
                            Slippage Tolerance
                          </span>
                          <span className="text-xs font-bold text-violet-500">
                            {slippage}%
                          </span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => setSlippage("0.5")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${slippage === "0.5" ? "bg-violet-500 text-white" : "bg-violet-50 text-violet-600 hover:bg-violet-100"}`}
                          >
                            Auto
                          </button>
                          {["0.1", "1.0"].map((v) => (
                            <button
                              key={v}
                              onClick={() => setSlippage(v)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${slippage === v ? "bg-violet-500 text-white" : "bg-violet-50 text-violet-600 hover:bg-violet-100"}`}
                            >
                              {v}%
                            </button>
                          ))}
                        </div>
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Custom slippage"
                            className={`w-full py-2 px-4 rounded-xl text-[13px] font-medium outline-none transition-all text-center border caret-[#8b5cf6] ${
                              slippage !== "0.1" &&
                              slippage !== "0.5" &&
                              slippage !== "1.0" &&
                              slippage !== ""
                                ? "bg-violet-500 text-white border-violet-400 placeholder:text-violet-200"
                                : "bg-[rgba(139,92,246,0.03)] text-(--text-primary) border-[rgba(139,92,246,0.11)] hover:border-violet-200 focus:bg-white focus:text-violet-600 focus:border-violet-300 placeholder:text-violet-400"
                            }`}
                            onChange={(e) =>
                              setSlippage(
                                e.target.value.replace(/[^0-9.]/g, ""),
                              )
                            }
                            value={
                              slippage !== "0.1" &&
                              slippage !== "0.5" &&
                              slippage !== "1.0"
                                ? slippage
                                : ""
                            }
                          />
                          <span
                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold transition-colors pointer-events-none ${
                              slippage !== "0.1" &&
                              slippage !== "0.5" &&
                              slippage !== "1.0" &&
                              slippage !== ""
                                ? "text-white"
                                : "text-violet-400 opacity-60"
                            }`}
                          >
                            %
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Sell/From Field */}
          <div
            className="rounded-2xl p-4 mb-1.5 group"
            style={{
              background: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-(--text-tertiary)">
                {mode === "bridge" ? "From Network" : "You sell"}
              </span>
              <span
                onClick={handleMaxBalance}
                className={`text-xs text-(--text-tertiary) transition-colors ${isInteractive ? "cursor-pointer" : ""}`}
              >
                Balance: {sellToken.balance}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-2xl font-semibold text-(--text-primary) tabular-nums h-auto p-0 cursor-text"
                disabled={!isInteractive}
              />
              <button
                onClick={() => isInteractive && setShowTokenModal("sell")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-[1.03] shrink-0 ${isInteractive ? "cursor-pointer" : ""}`}
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(139, 92, 246, 0.12)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="relative">
                  <img
                    src={sellToken.icon}
                    alt={sellToken.symbol}
                    className="w-6 h-6 rounded-full shadow-sm object-cover bg-white"
                  />
                  {mode === "bridge" && (
                    <img
                      src={fromNetwork.icon}
                      alt={fromNetwork.name}
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white shadow-sm object-cover bg-white"
                    />
                  )}
                </div>
                <span className="text-sm font-semibold text-(--text-primary)">
                  {sellToken.symbol}
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
            <span className="text-xs text-(--text-tertiary) mt-1 block text-center">
              ≈ ${formatPrice(parseFloat(sellAmount || "0") * ethPrice)}
            </span>
          </div>

          {/* Action Arrow */}
          <div className="flex items-center justify-center -my-2 relative z-10">
            <div
              onClick={handleAction}
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${isInteractive ? "cursor-pointer transition-all hover:scale-110 active:scale-95 group shadow-sm" : ""}`}
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
              >
                <path d="M12 5v14m-7-7l7 7 7-7" />
              </svg>
            </div>
          </div>

          {/* Buy/To Field */}
          <div
            className="rounded-2xl p-4 mt-1.5"
            style={{
              background: "rgba(56, 189, 248, 0.04)",
              border: "1px solid rgba(56, 189, 248, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-(--text-tertiary)">
                {mode === "bridge" ? "To Network" : "You buy"}
              </span>
              <span className="text-xs text-(--text-tertiary)">
                Balance: {buyToken.balance}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              {isInteractive && mode === "swap" ? (
                <input
                  type="text"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-2xl font-semibold text-(--text-primary) tabular-nums h-auto p-0 cursor-text"
                />
              ) : (
                <span className="text-2xl font-semibold text-(--text-primary) tabular-nums">
                  {mode === "swap" ? buyAmount : sellAmount}
                </span>
              )}
              <button
                onClick={() => isInteractive && setShowTokenModal("buy")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-[1.03] shrink-0 ${isInteractive ? "cursor-pointer" : ""}`}
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(139, 92, 246, 0.12)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="relative">
                  <img
                    src={buyToken.icon}
                    alt={buyToken.symbol}
                    className="w-6 h-6 rounded-full shadow-sm object-cover bg-white"
                  />
                  {mode === "bridge" && (
                    <img
                      src={toNetwork.icon}
                      alt={toNetwork.name}
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white shadow-sm object-cover bg-white"
                    />
                  )}
                </div>
                <span className="text-sm font-semibold text-(--text-primary)">
                  {buyToken.symbol}
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
            <span className="text-xs text-(--text-tertiary) mt-1 block text-center">
              ≈ $
              {formatPrice(
                parseFloat(
                  (mode === "swap" ? buyAmount : sellAmount).replace(
                    /,/g,
                    "",
                  ) || "0",
                ) * ethPrice,
              )}
            </span>
          </div>

          <div className="mt-5">
            {isInteractive ? (
              <button
                className="w-full py-4 rounded-2xl text-center font-semibold text-white text-base transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98] cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #38bdf8 100%)",
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
                }}
              >
                {displayButtonText}
              </button>
            ) : (
              <Link href={`/${mode}`} className="block">
                <div
                  className="w-full py-4 rounded-2xl text-center font-semibold text-white text-base cursor-pointer transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #38bdf8 100%)",
                    boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
                  }}
                >
                  {displayButtonText}
                </div>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Token Selection Modal */}
      <AnimatePresence>
        {showTokenModal && isInteractive && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 cursor-pointer"
              style={{
                background: "rgba(45, 27, 105, 0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              onClick={() => {
                setShowTokenModal(null);
                setSearchQuery("");
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
              className="relative w-full max-w-[420px] bg-white overflow-hidden"
              style={{
                borderRadius: "28px",
                boxShadow:
                  "0 32px 80px rgba(139, 92, 246, 0.18), 0 12px 32px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-[#2d1b69] tracking-tight">
                  Select Token
                </h3>
                <button
                  onClick={() => {
                    setShowTokenModal(null);
                    setSearchQuery("");
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-violet-50 transition-colors cursor-pointer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2d1b69"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Network Tabs (bridge only) */}
              {mode === "bridge" && (
                <div className="px-6 pb-4">
                  <div className="flex gap-2">
                    {networksList.map((net) => {
                      const isActive =
                        (showTokenModal === "sell"
                          ? fromNetwork.id
                          : toNetwork.id) === net.id;
                      return (
                        <button
                          key={net.id}
                          onClick={() => {
                            if (showTokenModal === "sell") setFromNetwork(net);
                            else setToNetwork(net);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm font-semibold ${
                            isActive
                              ? "bg-violet-500 text-white shadow-md shadow-violet-200"
                              : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                          }`}
                        >
                          <img
                            src={net.icon}
                            alt={net.name}
                            className={`w-5 h-5 rounded-full object-cover bg-white ${isActive ? "ring-2 ring-white" : ""}`}
                          />
                          <span>{net.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="px-6 pb-3">
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name or symbol..."
                    autoFocus
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 outline-none text-sm font-medium text-(--text-primary) placeholder:text-gray-300 focus:ring-2 focus:ring-violet-100 transition-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Token List */}
              <div className="px-3 pb-4 max-h-[340px] overflow-y-auto scrollbar-hide">
                {filteredTokens.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-400">
                    No tokens found
                  </div>
                ) : (
                  filteredTokens.map((t) => {
                    const isSelected =
                      showTokenModal === "sell"
                        ? sellToken.symbol === t.symbol
                        : buyToken.symbol === t.symbol;
                    return (
                      <div
                        key={t.symbol}
                        onClick={() => {
                          if (showTokenModal === "sell") setSellToken(t);
                          else setBuyToken(t);
                          setShowTokenModal(null);
                          setSearchQuery("");
                        }}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-150 group ${
                          isSelected ? "bg-violet-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={t.icon}
                            alt={t.symbol}
                            className="w-10 h-10 rounded-full shadow-md transition-transform duration-150 group-hover:scale-105 object-cover bg-white"
                            style={{
                              boxShadow: `0 4px 12px ${t.color}40`,
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-[#2d1b69] leading-tight">
                              {t.symbol}
                            </span>
                            <span className="text-xs text-gray-400 leading-tight">
                              {t.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3.5 grow justify-end">
                          <span className="text-sm font-semibold text-[#2d1b69] tabular-nums">
                            {t.balance}
                          </span>
                          <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
