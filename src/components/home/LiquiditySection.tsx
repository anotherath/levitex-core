"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function LiquiditySection() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [, setTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Wave parameters
    const waves = [
      { color: "rgba(139, 92, 246, 0.15)", amplitude: 30, frequency: 0.008, speed: 0.015, offset: 0 },
      { color: "rgba(56, 189, 248, 0.12)", amplitude: 25, frequency: 0.01, speed: 0.02, offset: 50 },
      { color: "rgba(52, 211, 153, 0.10)", amplitude: 20, frequency: 0.012, speed: 0.018, offset: 100 },
      { color: "rgba(217, 70, 184, 0.08)", amplitude: 35, frequency: 0.006, speed: 0.012, offset: -30 },
      { color: "rgba(167, 139, 250, 0.10)", amplitude: 22, frequency: 0.014, speed: 0.022, offset: 70 },
    ];

    let time = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const centerY = h / 2;

      for (const wave of waves) {
        ctx.beginPath();
        ctx.moveTo(0, centerY + wave.offset);

        for (let x = 0; x <= w; x += 2) {
          const y =
            centerY +
            wave.offset +
            Math.sin(x * wave.frequency + time * wave.speed * 60) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 30) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, centerY - 50, 0, h);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(1, "rgba(246, 248, 251, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw the line on top
        ctx.beginPath();
        ctx.moveTo(0, centerY + wave.offset);
        for (let x = 0; x <= w; x += 2) {
          const y =
            centerY +
            wave.offset +
            Math.sin(x * wave.frequency + time * wave.speed * 60) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 30) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, "0.5)");
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Flowing particles along waves
      for (let i = 0; i < 15; i++) {
        const wave = waves[i % waves.length];
        const px = ((time * 40 + i * 120) % w);
        const py =
          centerY +
          wave.offset +
          Math.sin(px * wave.frequency + time * wave.speed * 60) * wave.amplitude +
          Math.sin(px * wave.frequency * 0.5 + time * wave.speed * 30) * wave.amplitude * 0.5;

        const particleGlow = ctx.createRadialGradient(px, py, 0, px, py, 6);
        particleGlow.addColorStop(0, wave.color.replace(/[\d.]+\)$/, "0.8)"));
        particleGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = particleGlow;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = wave.color.replace(/[\d.]+\)$/, "1)");
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Force re-render for view tracking
    const interval = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 lg:py-28 overflow-hidden bg-(--bg-primary)"
    >
      <motion.div
        className="section-container text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-(--text-primary) mb-4">
          Liquidity in{" "}
          <span className="gradient-text">Motion</span>
        </h2>
        <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto">
          Watch how liquidity flows through our protocol — dynamic, efficient,
          and always in motion.
        </p>
      </motion.div>

      <motion.div
        className="relative w-full h-[300px] md:h-[400px]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />
      </motion.div>
    </section>
  );
}
