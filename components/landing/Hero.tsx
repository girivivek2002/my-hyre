"use client";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const stepTime = Math.max(duration * 1000 / end, 20);
    const timer = setInterval(() => {
      start += value / (duration * 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={ref}>{count.toFixed(1)}</span>;
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3D Parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleTiltMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleTiltLeave = () => { x.set(0); y.set(0); };

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 24, duration: 0.8 } }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">

      {/* Multi-color animated orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-indigo-500/15 blur-[140px] rounded-full pointer-events-none z-0"
        animate={{
          x: mousePos.x - 300,
          y: mousePos.y - 300,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 2.5 }}
      />
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none animate-orb-drift" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-cyan-500/8 blur-[100px] rounded-full pointer-events-none animate-orb-drift-reverse" />

      {/* Subtle fallback glow for mobile */}
      <div className="absolute lg:hidden w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full top-20 left-1/2 -translate-x-1/2 -z-10" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 dark:opacity-30 -z-10 transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-8">

        {/* Left Text */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start pt-10 lg:pt-0"
        >
          {/* Badge */}
          <motion.div variants={itemVars} className="group inline-flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 backdrop-blur-sm cursor-pointer hover:bg-indigo-500/20 transition-all duration-300">
            <Sparkles size={14} className="animate-pulse" />
            <span className="tracking-wide">AI POWERED INTELLIGENT MATCHING</span>
          </motion.div>

          <motion.h1 variants={itemVars} className="text-4xl sm:text-6xl lg:text-[76px] leading-[1.08] font-extrabold mb-6 sm:mb-8 tracking-tight text-slate-900 dark:text-white">
            Hire the Right <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="text-gradient-primary pb-2">Talent</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-[4px] sm:h-[5px] bg-gradient-to-r from-indigo-500 via-violet-500 to-transparent rounded-full origin-left"
              />
            </span>{" "}Faster with AI
          </motion.h1>

          <motion.p variants={itemVars} className="text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-[600px]">
            Mr. Hyre bridges the gap between ambition and opportunity using neural matching algorithms that understand potential, not just keywords.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto mt-4">
            <Link href="/login?role=recruiter">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-primary px-8 py-4 rounded-xl text-base w-full sm:w-auto flex items-center justify-center gap-2 group"
              >
                Find Talent
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>

            <Link href="/login?role=candidate">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group relative bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] px-8 py-4 rounded-xl text-base font-semibold text-slate-900 dark:text-white hover:border-indigo-400/50 dark:hover:border-indigo-400/30 transition-all overflow-hidden w-full sm:w-auto shadow-premium dark:shadow-premium-dark"
              >
                <span className="relative z-10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">Get Hired</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Dashboard Preview with 3D Tilt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
          className="relative w-full max-w-[720px] lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0"
          style={{ perspective: 1200 }}
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:h-[580px] bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/[0.06] rounded-2xl sm:rounded-3xl shadow-premium dark:shadow-premium-dark p-2 sm:p-4 hover:border-indigo-400/30 dark:hover:border-indigo-400/20 transition-colors duration-500"
          >
            {/* Gradient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/8 via-transparent to-violet-500/8 rounded-2xl pointer-events-none" />

            <motion.img
              initial={{ z: 30 }}
              src="/dashboard.png"
              alt="Platform Dashboard Preview"
              loading="eager"
              className="w-full h-full object-cover rounded-xl shadow-inner relative z-10"
            />

            {/* Floating AI Match Score — animated counter */}
            <motion.div
              initial={{ z: 60 }}
              className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 sm:left-[-40px] sm:translate-x-0 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-premium dark:shadow-premium-dark flex flex-col gap-1 z-30 min-w-[140px] animate-float"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold tracking-wide">AI MATCH SCORE</p>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 text-2xl sm:text-3xl font-bold tracking-tight">
                {mounted ? <AnimatedCounter value={98.4} duration={2.5} /> : "98.4"}%
              </p>
            </motion.div>

            {/* Secondary Floating Card */}
            <motion.div
              initial={{ z: 40 }}
              className="absolute top-10 sm:top-20 -right-2 sm:-right-8 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] px-4 py-3 rounded-xl shadow-premium dark:shadow-premium-dark z-20 hidden md:block animate-float-delayed"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/15 dark:bg-violet-500/20 flex items-center justify-center text-sm">⚡</div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Time to Hire</p>
                  <p className="text-sm font-bold text-emerald-500">-45%</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>

    </section>
  );
}