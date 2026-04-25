"use client";
import { motion } from "framer-motion";

export default function Trusted() {
  const startups = [
    {
      name: "Anthropic",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 22h20L12 2z" fill="currentColor" className="text-slate-400 dark:text-neutral-400" fillOpacity="0.5"/></svg>
          <span className="font-serif text-[26px] tracking-tight font-medium text-slate-600 dark:text-neutral-300">Anthropic</span>
        </div>
      )
    },
    {
      name: "Vercel",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L24 22H0L12 2Z"/></svg>
          <span className="font-sans text-[26px] font-bold tracking-tighter text-slate-900 dark:text-white">Vercel</span>
        </div>
      )
    },
    {
      name: "Linear",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-slate-400 dark:text-neutral-300" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M7 12L17 4M7 20L17 12" stroke="currentColor" strokeWidth="2"/></svg>
          <span className="font-sans text-[22px] tracking-[0.2em] font-bold text-slate-700 dark:text-neutral-200">LINEAR</span>
        </div>
      )
    },
    {
      name: "Supabase",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#10B981"/></svg>
          <span className="font-sans text-[26px] lowercase font-semibold tracking-tight text-[#10B981]">supabase</span>
        </div>
      )
    },
    {
      name: "Perplexity",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 dark:text-neutral-300" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/></svg>
          <span className="font-mono text-[24px] lowercase font-bold text-slate-600 dark:text-neutral-300">perplexity</span>
        </div>
      )
    },
    {
      name: "Raycast",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="4" fill="#EF4444"/><circle cx="12" cy="12" r="3" fill="white"/></svg>
          <span className="font-sans text-[26px] font-bold text-slate-900 dark:text-white tracking-tight">Raycast</span>
        </div>
      )
    },
    {
      name: "Cohere",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="12" r="6" fill="#60A5FA"/><circle cx="16" cy="12" r="6" fill="#3B82F6" fillOpacity="0.8"/></svg>
          <span className="font-sans text-[28px] font-black tracking-tighter text-slate-700 dark:text-neutral-200">Cohere</span>
        </div>
      )
    },
    {
      name: "Glean",
      logo: (
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L22 12L12 22L2 12L12 2Z"/></svg>
          <span className="font-sans text-[26px] font-bold text-slate-700 dark:text-neutral-200">Glean</span>
        </div>
      )
    },
  ];

  // Duplicate arrays to allow seamless continuous loop tracking
  const duplicatedStartups = [...startups, ...startups, ...startups, ...startups];

  return (
    <section className="py-20 sm:py-28 overflow-hidden bg-white dark:bg-black relative transition-colors duration-300">
      {/* Top subtle border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-neutral-800 to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 sm:mb-20 flex flex-col items-center justify-center relative"
      >
        <div className="absolute w-[300px] h-10 bg-blue-500/20 blur-[40px] -z-10 rounded-full"></div>
        
        <div className="relative inline-block pb-3 px-8">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-900 to-slate-400 dark:from-neutral-600 dark:via-white dark:to-neutral-600 text-sm sm:text-base font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase transition-colors">
            Trusted By Innovative Teams Worldwide
          </p>
          {/* Glowing underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400 dark:via-neutral-500/50 to-transparent"></div>
        </div>
      </motion.div>

      {/* Wrapping Container for CSS Masking logic (Fade on edges) */}
      <div 
        className="relative w-full overflow-hidden flex flex-col gap-10 sm:gap-14"
        style={{ 
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", 
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" 
        }}
      >
        {/* Row 1: Scroll Left */}
        <div className="relative flex w-max">
          <motion.div
            className="flex gap-14 sm:gap-24 pr-14 sm:pr-24 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            }}
          >
            {duplicatedStartups.map((startup, index) => (
              <div
                key={index}
                className="opacity-60 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 cursor-pointer grayscale hover:grayscale-0"
              >
                {startup.logo}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Scroll Right (Extraordinary dual direction effect) */}
        <div className="relative flex w-max">
          <motion.div
            className="flex gap-14 sm:gap-24 pr-14 sm:pr-24 items-center"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 45, // slightly slower for staggered feeling
              repeat: Infinity,
            }}
          >
            {/* Reverse array for visual variation */}
            {[...duplicatedStartups].reverse().map((startup, index) => (
              <div
                key={index}
                className="opacity-60 hover:opacity-100 hover:scale-[1.02] transition-all duration-300 cursor-pointer grayscale hover:grayscale-0"
              >
                {startup.logo}
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}