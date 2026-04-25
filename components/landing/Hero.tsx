"use client";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <div ref={ref}>{count}{suffix}</div>;
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scaleImg = useTransform(scrollYProgress, [0, 0.5], [1.05, 1.15]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 30;
    const y = (e.clientY - rect.top - rect.height / 2) / 30;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex items-end justify-center overflow-hidden bg-[#0A0A0F]"
    >
      {/* Full-bleed Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: yParallax, scale: scaleImg }}>
        <img
          src="/hero-bg-v3.png"
          alt="Neural Network Visualization"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Multi-layer Gradient Overlays for depth */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0A0F]/70 via-[#0A0A0F]/20 to-[#0A0A0F]" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0A0A0F]/50 via-transparent to-[#0A0A0F]/50" />

      {/* Animated Atmospheric Orbs */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute top-[10%] left-[8%] w-[600px] h-[600px] bg-indigo-600/20 blur-[200px] rounded-full z-[1]"
        animate={{ scale: [1, 1.1, 0.95, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[3%] w-[500px] h-[500px] bg-violet-500/15 blur-[180px] rounded-full z-[1]"
        animate={{ scale: [1, 0.9, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-[35%] right-[25%] w-[400px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full z-[1]"
        animate={{ scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Main Content */}
      <motion.div style={{ opacity: opacityFade }} className="relative z-10 w-full max-w-[1400px] px-6 pb-20 md:pb-36">
        <div className="flex flex-col items-center text-center">

          {/* Floating Tags with shimmer */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { label: "AI Matching", icon: Sparkles, color: "from-indigo-500/20 to-indigo-500/5" },
              { label: "Neural Search", icon: Zap, color: "from-violet-500/20 to-violet-500/5" },
              { label: "Global Scale", icon: Globe, color: "from-emerald-500/20 to-emerald-500/5" },
            ].map((tag, i) => {
              const Icon = tag.icon;
              return (
                <motion.span
                  key={tag.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 * i + 0.8, type: "spring", stiffness: 200, damping: 20 }}
                  className="relative px-5 py-2.5 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-full text-white/80 text-xs font-semibold uppercase tracking-[0.15em] overflow-hidden group flex items-center gap-2 hover:border-white/20 transition-all duration-500"
                >
                  <Icon size={13} className="opacity-60" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  {tag.label}
                </motion.span>
              );
            })}
          </div>

          {/* Massive Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-[110px] lg:text-[150px] font-black text-white leading-[0.85] tracking-[-0.04em] mb-8"
          >
            <span className="inline-block">SMART</span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-white/40 to-white/60 animate-[gradient-shift_6s_ease_infinite] bg-[length:200%_200%]">
              HIRES.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-white/45 text-lg md:text-xl max-w-2xl leading-relaxed mb-14 font-medium"
          >
            The next generation of recruitment — Mr. Hyre&apos;s AI-powered neural
            workspace delivers high-fidelity talent discovery at scale.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-5"
          >
            <Link
              href="/login"
              className="group relative px-10 py-5 bg-white text-black rounded-full text-lg font-bold flex items-center gap-3 transition-all duration-500 hover:scale-105 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-violet-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group w-16 h-16 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.12] hover:border-white/25 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <Play size={20} fill="white" className="ml-0.5" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Overlapping Stats Cards */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 translate-y-1/2 z-20 hidden lg:flex gap-6">
        {[
          { value: 98, suffix: "%", label: "Neural Accuracy", sublabel: "Matching precision across global pools", gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent", iconColor: "text-indigo-400", border: "hover:border-indigo-500/30" },
          { value: 2, suffix: ".4s", label: "Instant Parsing", sublabel: "Real-time high-fidelity vector mapping", gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent", iconColor: "text-emerald-400", border: "hover:border-emerald-500/30" },
          { value: 60, suffix: "%", label: "Faster Hiring", sublabel: "Reduced time-to-fill across all roles", gradient: "from-violet-500/20 via-violet-500/5 to-transparent", iconColor: "text-violet-400", border: "hover:border-violet-500/30" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 + 0.15 * i, duration: 0.8, type: "spring", stiffness: 80, damping: 15 }}
            className={`relative flex-1 bg-[#111118]/80 backdrop-blur-3xl border border-white/[0.07] rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:bg-[#141420]/90 ${card.border} transition-all duration-500 group overflow-hidden`}
          >
            {/* Gradient accent */}
            <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            {/* Shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className={`text-4xl font-black text-white mb-3 tracking-tight ${card.iconColor}`}>
                <AnimatedCounter target={card.value} suffix={card.suffix} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{card.label}</h3>
              <p className="text-white/25 text-sm">{card.sublabel}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Gradient Bleed */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent z-[2]" />
    </section>
  );
}