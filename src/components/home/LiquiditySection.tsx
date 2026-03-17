"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export default function LiquiditySection({ active }: { active?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const shouldAnimate = active || isInView;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isRunning = false;
    const dpr = Math.min(window.devicePixelRatio, 1.5);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
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
      if (!isRunning) return;

      animationId = requestAnimationFrame(draw);

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);

      const centerY = h / 2;

      for (const wave of waves) {
        ctx.beginPath();
        ctx.moveTo(0, centerY + wave.offset);

        for (let x = 0; x <= w; x += 3) {
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

        ctx.beginPath();
        ctx.moveTo(0, centerY + wave.offset);
        for (let x = 0; x <= w; x += 3) {
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

      for (let i = 0; i < 10; i++) {
        const wave = waves[i % waves.length];
        const px = (time * 40 + i * 120) % w;
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
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        draw();
      }
    };
    const stopLoop = () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
    };

    let isIntersecting = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && !document.hidden) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isIntersecting || active) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (active && (!document.hidden || !isIntersecting)) {
      startLoop();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 lg:py-28 overflow-hidden bg-(--bg-primary)"
    >
      <motion.div
        className="section-container text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d1b69] mb-4">
          Liquidity in <span className="gradient-text">Motion</span>
        </h2>
        <p className="text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto font-light">
          Watch how liquidity flows through our protocol — dynamic, efficient,
          and <br className="hidden md:block" /> always in motion.
        </p>
      </motion.div>

      <motion.div
        className="relative w-full h-[300px] md:h-[400px]"
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
