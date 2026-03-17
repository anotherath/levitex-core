"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook that implements fullpage scroll snapping behavior.
 * Listens for wheel events and smoothly scrolls to the nearest section.
 * Does NOT use CSS scroll-snap, so it won't conflict with framer-motion.
 */
export function useFullpageScroll(containerRef: React.RefObject<HTMLElement | null>) {
  const isScrolling = useRef(false);
  const currentIndex = useRef(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scrollToSection = useCallback((index: number) => {
    const sections = sectionsRef.current;
    if (index < 0 || index >= sections.length || isScrolling.current) return;

    isScrolling.current = true;
    currentIndex.current = index;

    sections[index].scrollIntoView({ behavior: "smooth" });

    // Cooldown to prevent rapid scroll — wait for animation to finish
    clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      isScrolling.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Gather all direct children (which are now snap-start containers)
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(":scope > *")
    );

    // If no footer found in container, look for a global footer
    if (!sections.some((s) => s.tagName.toLowerCase() === "footer")) {
      const globalFooter = document.querySelector("footer");
      if (globalFooter) {
        sections.push(globalFooter as HTMLElement);
      }
    }

    sectionsRef.current = sections;

    // Determine which section is currently in view on load
    const updateCurrentIndex = () => {
      const scrollY = window.scrollY;
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      sections.forEach((section, i) => {
        const dist = Math.abs(section.offsetTop - scrollY);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestIndex = i;
        }
      });
      
      currentIndex.current = closestIndex;
    };

    updateCurrentIndex();

    const handleWheel = (e: WheelEvent) => {
      // Allow normal scroll inside interactive elements (e.g., modals, dropdowns)
      const target = e.target as HTMLElement;
      if (target.closest("[data-scroll-free]")) return;

      // Only intercept significant scroll gestures
      if (Math.abs(e.deltaY) < 30) return;

      e.preventDefault();

      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        // Scroll down
        scrollToSection(currentIndex.current + 1);
      } else {
        // Scroll up
        scrollToSection(currentIndex.current - 1);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        scrollToSection(currentIndex.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection(currentIndex.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToSection(sectionsRef.current.length - 1);
      }
    };

    // Touch support for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) < 50) return; // Ignore small swipes

      if (diff > 0) {
        scrollToSection(currentIndex.current + 1);
      } else {
        scrollToSection(currentIndex.current - 1);
      }
    };

    updateCurrentIndex();

    const handleScroll = () => {
      if (isScrolling.current) return;
      updateCurrentIndex();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(cooldownTimer.current);
    };
  }, [containerRef, scrollToSection]);
}
