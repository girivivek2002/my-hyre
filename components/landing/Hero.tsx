"use client";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  // Cursor tracking for background glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3D Parallax Tilt for Dashboard Image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  const handleTiltMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleTiltLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Staggered variants for texts
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">

      {/* Dynamic Cursor-Following Background Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none z-0"
        animate={{
          x: mousePos.x - 400,
          y: mousePos.y - 400,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 2 }}
      />
      {/* Fallback glow for mobile */}
      <div className="absolute lg:hidden w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full top-20 left-1/2 -translate-x-1/2 -z-10"></div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 dark:opacity-20 -z-10 transition-colors duration-300"></div>

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
          <motion.div variants={itemVars} className="group inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm cursor-pointer hover:bg-blue-500/20 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI POWERED INTELLIGENT MATCHING
          </motion.div>

          <motion.h1 variants={itemVars} className="text-5xl sm:text-6xl lg:text-[76px] leading-[1.1] font-bold mb-6 sm:mb-8 tracking-tight text-slate-900 dark:text-white">
            Hire the Right <br className="hidden sm:block" />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Talent
              {/* Highlight Underline */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, type: "spring" }}
                className="absolute -bottom-2 sm:-bottom-4 left-0 right-0 h-[4px] sm:h-[6px] bg-gradient-to-r from-blue-500 to-transparent rounded-full origin-left"
              />
            </span> Faster with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVars} className="text-slate-600 dark:text-neutral-400 mb-8 sm:mb-10 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-[600px]">
            Mr. Hyre bridges the gap between ambition and opportunity using neural matching algorithms that understand potential, not just keywords.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl text-base font-semibold shadow-[0_0_40px_rgba(37,99,235,0.2)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all w-full sm:w-auto"
            >
              Find Talent
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 px-8 py-4 rounded-xl text-base font-semibold text-slate-900 dark:text-white hover:border-blue-400 dark:hover:border-neutral-500 transition-colors overflow-hidden w-full sm:w-auto shadow-sm"
            >
              <span className="relative z-10 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">Get Hired</span>
              {/* Internal glow hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent dark:via-white/5 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Dashboard / Parallax Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100 }}
          className="relative w-full max-w-[720px] lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0 perspective-1000"
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:h-[580px] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl p-2 sm:p-4 hover:border-blue-400 dark:hover:border-neutral-700 transition-colors"
          >
            {/* Soft inner glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl pointer-events-none" />

            <motion.img
              initial={{ z: 30 }}
              src="/dashboard.png"
              alt="Platform Dashboard Preview"
              loading="eager"
              className="w-full h-full object-cover rounded-xl shadow-inner relative z-10"
            />

            {/* Floating AI Score Card (Animated continuously + popped out in 3D space) */}
            <motion.div
              initial={{ z: 60 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-4 sm:-bottom-8 -left-2 sm:-left-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-slate-200 dark:border-neutral-700/50 px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col gap-1 z-30"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 font-medium tracking-wide">AI MATCH SCORE</p>
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl font-bold tracking-tight">98.4%</p>
            </motion.div>

            {/* Secondary Floating Card */}
            <motion.div
              initial={{ z: 40 }}
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 sm:top-20 -right-2 sm:-right-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-slate-200 dark:border-neutral-700/50 px-4 py-3 rounded-xl shadow-2xl z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-sm">⚡</div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">Time to Hire</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">-45%</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>

    </section>
  );
}