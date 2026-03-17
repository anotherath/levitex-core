"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Swap", href: "/swap" },
  { label: "Pools", href: "/pools" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Analytics", href: "/analytics" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Observe footer to hide navbar
    const footer = document.querySelector("footer");
    let observer: IntersectionObserver;

    if (footer) {
      observer = new IntersectionObserver(
        ([entry]) => {
          // Chỉ ẩn Nav trên điện thoại (mobile < 768px)
          const isMobile = window.innerWidth < 768;
          setHideNav(entry.isIntersecting && isMobile);
        },
        { threshold: 0.1 }
      );
      observer.observe(footer);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: hideNav ? 0 : 1, 
          y: hideNav ? -80 : 0 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="mx-auto transition-all duration-500"
          style={{
            maxWidth: scrolled ? "900px" : "100%",
            margin: scrolled ? "12px auto" : "0 auto",
            borderRadius: scrolled ? "20px" : "0",
            background: scrolled
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(246, 248, 251, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",

            boxShadow: scrolled
              ? "0 4px 30px rgba(139, 92, 246, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)"
              : "none",
            padding: scrolled ? "0 24px" : "0 32px",
          }}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-1 group text-[#2d1b69]"
            >
              <div className="relative flex items-center justify-center w-9 h-8">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-sm"
                >
                  <g
                    stroke="#2d1b69"
                    strokeWidth="1.1"
                    fill="none"
                    strokeLinejoin="round"
                    transform="rotate(36, 16, 16)"
                    opacity="0.9"
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
              </div>

              <span className="text-md font-bold tracking-tight">LEVITEX</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-[rgba(139,92,246,0.06)] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/swap"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px shadow-[0_4px_16px_rgba(139,92,246,0.2)]"
                style={{ background: "var(--gradient-button)" }}
              >
                Launch App
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[rgba(139,92,246,0.06)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-(--text-primary)"
              >
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/10 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-4 right-4 rounded-2xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow:
                  "0 20px 60px rgba(139, 92, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06)",
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-[rgba(139,92,246,0.06)] transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/swap"
                className="mt-4 block w-full py-3 rounded-xl text-center text-sm font-semibold text-white shadow-[0_4px_16px_rgba(139,92,246,0.2)]"
                style={{ background: "var(--gradient-button)" }}
                onClick={() => setMobileOpen(false)}
              >
                Launch App
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
