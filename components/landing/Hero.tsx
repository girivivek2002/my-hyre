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
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scaleImg = useTransform(scrollYProgress, [0, 0.5], [1.02, 1.1]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full min-h-[115vh] flex items-end justify-center bg-gradient-to-b from-[#F0F0FF] via-[#FAFBFD] to-[#FAFBFD]">
      {/* Background Container to prevent overflow of orbs without clipping the cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Background Image */}
        <motion.div className="absolute inset-0 z-0 opacity-40" style={{ y: yParallax, scale: scaleImg }}>
        <img src="/hero-light.png" alt="Abstract Background" className="w-full h-full object-cover" />
      </motion.div>

      {/* Soft gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#F0F0FF]/80 via-transparent to-[#FAFBFD]" />

      {/* Animated Soft Orbs */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-300/20 blur-[150px] rounded-full z-[1]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-violet-300/15 blur-[130px] rounded-full z-[1]"
        animate={{ scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-rose-200/10 blur-[120px] rounded-full z-[1]"
          animate={{ scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* Main Content */}
      <motion.div style={{ opacity: opacityFade }} className="relative z-10 w-full max-w-7xl px-6 pb-40 md:pb-52">
        <div className="flex flex-col items-center text-center">

          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { label: "AI Matching", icon: Sparkles, color: "bg-indigo-50 text-indigo-600 border-indigo-200/60" },
              { label: "Neural Search", icon: Zap, color: "bg-violet-50 text-violet-600 border-violet-200/60" },
              { label: "Global Scale", icon: Globe, color: "bg-emerald-50 text-emerald-600 border-emerald-200/60" },
            ].map((tag, i) => {
              const Icon = tag.icon;
              return (
                <motion.span
                  key={tag.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 * i + 0.8, type: "spring", stiffness: 200, damping: 20 }}
                  className={`px-4 py-2 ${tag.color} border rounded-full text-xs font-semibold uppercase tracking-[0.1em] flex items-center gap-2 hover:shadow-md transition-shadow duration-300`}
                >
                  <Icon size={13} />
                  {tag.label}
                </motion.span>
              );
            })}
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[100px] lg:text-[130px] font-black text-slate-900 leading-[0.9] tracking-[-0.04em] mb-8"
          >
            <span className="inline-block">SMART</span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
              HIRES.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-14 font-medium"
          >
            The next generation of recruitment — Mr. Hyre&apos;s AI-powered neural
            workspace delivers high-fidelity talent discovery at scale.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-indigo-600 text-white rounded-full text-base font-semibold flex items-center gap-2.5 transition-all duration-300 hover:bg-indigo-700 hover:scale-105 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)]"
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stat Cards overlapping into next section */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 translate-y-1/2 z-20 hidden lg:flex gap-5">
        {[
          { value: 98, suffix: "%", label: "Neural Accuracy", sublabel: "Matching precision across global pools", accent: "text-indigo-600", dotColor: "bg-indigo-500" },
          { value: 2, suffix: ".4s", label: "Instant Parsing", sublabel: "Real-time high-fidelity vector mapping", accent: "text-emerald-600", dotColor: "bg-emerald-500" },
          { value: 60, suffix: "%", label: "Faster Hiring", sublabel: "Reduced time-to-fill across all roles", accent: "text-violet-600", dotColor: "bg-violet-500" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 + 0.15 * i, type: "spring", stiffness: 80, damping: 15 }}
            className="flex-1 bg-white border border-slate-100 rounded-2xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${card.dotColor}`} />
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{card.label}</span>
            </div>
            <div className={`text-3xl font-black ${card.accent} mb-1 tracking-tight`}>
              <AnimatedCounter target={card.value} suffix={card.suffix} />
            </div>
            <p className="text-slate-400 text-xs">{card.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Smooth gradient bleed into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFBFD] to-transparent z-[2]" />
    </section>
  );
}