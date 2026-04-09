"use client";
import { motion, Variants } from "framer-motion";

export default function CTA() {
  const containerVars: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2,
        when: "beforeChildren"
      } 
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1920px] mx-auto">
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black dark:from-neutral-900 dark:via-black dark:to-neutral-950 border border-slate-700 dark:border-neutral-800/80 rounded-[2rem] p-8 md:p-16 lg:p-24 text-center overflow-hidden shadow-2xl"
      >
        {/* Animated Background Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/20 blur-[100px] sm:blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none"
        ></motion.div>

        {/* Dynamic Border Shine */}
        <div className="absolute inset-0 rounded-[2rem] pointer-events-none before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-blue-500/30 before:via-transparent before:to-purple-500/30 before:rounded-[2rem] before:-z-10 before:mask-composite-exclude"></div>

        <motion.h2 
          variants={itemVars}
          className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 dark:from-white dark:to-neutral-400"
        >
          Start Hiring Smarter <span className="text-blue-400 dark:text-blue-500 transition-colors">Today</span>
        </motion.h2>

        <motion.p 
          variants={itemVars}
          className="relative text-slate-300 dark:text-neutral-400 text-base sm:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed transition-colors"
        >
          Join over 5,000+ companies who are building the future with
          Mr. Hyre's intelligent workspace. Drop the busywork and let AI do the matching.
        </motion.p>

        <motion.div variants={itemVars} className="relative flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full top-0">
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold text-lg overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-shadow duration-300"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Recruiter Sign Up
              <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>→</motion.span>
            </span>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
              />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto bg-white/10 dark:bg-neutral-900 border border-white/20 dark:border-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-white/40 dark:hover:border-neutral-500 hover:bg-white/20 dark:hover:bg-neutral-800 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 text-white dark:text-neutral-300 group-hover:text-white transition-colors">Find a Job</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </motion.button>

        </motion.div>
      </motion.div>
    </section>
  );
}