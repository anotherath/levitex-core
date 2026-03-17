"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode[];
  gap?: number;
  visibleCount?: number;
}

export default function HorizontalScroll({
  children,
  gap = 12,
  visibleCount: propVisibleCount,
}: HorizontalScrollProps) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(propVisibleCount || 1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propVisibleCount) {
      setVisibleCount(propVisibleCount);
      return;
    }
    const updateCount = () => {
      setVisibleCount(window.innerWidth >= 640 ? 2 : 1);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [propVisibleCount]);

  const maxIndex = Math.max(0, children.length - visibleCount);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);
  
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && index < maxIndex) {
      setIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && index > 0) {
      setIndex(prev => prev - 1);
    }
  };

  const itemWidth = `calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`;

  return (
    <div className="lg:hidden relative">
      <div 
        ref={containerRef}
        className="section-container overflow-hidden px-6"
      >
        <motion.div
          className="flex"
          style={{ gap: `${gap}px` }}
          animate={{
            x: `calc(-${index * (100 / visibleCount)}% - ${index * (gap / visibleCount)}px)`
          }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {React.Children.map(children, (child, i) => {
            // CỰC KỲ TỐI ƯU: Chỉ thẻ đang hiển thị mới được coi là "Active"
            const isVisible = i >= index && i < index + visibleCount;
            
            return (
              <motion.div
                key={i}
                className="shrink-0 min-w-0"
                style={{ width: itemWidth }}
                animate={{ 
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.85,
                  y: isVisible ? 0 : 20,
                  pointerEvents: isVisible ? "auto" : "none"
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {/* Truyền trạng thái hiển thị thực tế vào cho thẻ con */}
                {React.isValidElement(child) 
                  ? React.cloneElement(child as React.ReactElement<any>, { isCarouselActive: isVisible })
                  : child}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Indicators */}
      {children.length > visibleCount && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: children.length - visibleCount + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: index === i ? 24 : 8,
                height: 8,
                background:
                  index === i
                    ? "#8b5cf6"
                    : "rgba(139, 92, 246, 0.15)",
              }}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
