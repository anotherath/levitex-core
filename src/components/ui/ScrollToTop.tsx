"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollToTopProps {
  /**
   * Optional manual control for visibility. 
   * Useful for full-page scroll systems where window.scrollY is always 0.
   */
  forceVisible?: boolean;
  /**
   * Custom click handler.
   */
  onClick?: () => void;
}

export default function ScrollToTop({ forceVisible, onClick }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If forceVisible is provided, we don't need the scroll listener
    if (forceVisible !== undefined) return;

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [forceVisible]);

  const scrollToTop = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const show = forceVisible !== undefined ? forceVisible : isVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.9)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-100 w-12 h-12 rounded-full flex items-center justify-center glass-card border-[rgba(99,102,241,0.2)] text-[#6366f1] shadow-lg cursor-pointer backdrop-blur-xl transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
