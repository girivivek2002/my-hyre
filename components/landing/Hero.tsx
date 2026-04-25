"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Crosshair } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] sm:h-[95vh] px-4 pt-28 pb-4 sm:p-6 overflow-hidden bg-slate-50 dark:bg-[#0A0A0F]">
      <motion.div 
        className="relative w-full h-full rounded-[32px] sm:rounded-[48px] overflow-hidden bg-[#111118]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background Image with Parallax */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="AI Core" 
            fill 
            className="object-cover scale-110" 
            priority
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>

        {/* Hotspot Dots */}
        <div className="absolute top-[30%] left-[25%] z-20 hidden md:block">
           <div className="relative group cursor-pointer">
              <div className="w-3 h-3 bg-white rounded-full animate-ping absolute inset-0 opacity-75" />
              <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap">
                Neural Sync
              </div>
           </div>
        </div>

        <div className="absolute top-[60%] right-[30%] z-20 hidden md:block">
           <div className="relative group cursor-pointer">
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping absolute inset-0 opacity-75 duration-1000" />
              <div className="relative w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,1)]" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap">
                Match Parity
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full max-w-[1920px] mx-auto flex flex-col justify-end p-8 md:p-16 lg:p-24">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
            
            <div className="max-w-4xl text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-6"
              >
                <Sparkles size={14} className="text-indigo-400" />
                Intelligent Hiring Evolution
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="text-5xl sm:text-7xl lg:text-[100px] leading-[0.95] font-extrabold tracking-[-0.04em] text-white mb-8"
              >
                THE FUTURE OF <br className="hidden md:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-violet-300">INTELLIGENT HIRING</span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/login?role=recruiter">
                  <button className="px-8 py-4 bg-white text-[#0A0A0F] rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform flex items-center gap-3">
                    Start Hiring <ArrowRight size={16} />
                  </button>
                </Link>
                <Link href="/login?role=candidate">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full font-bold text-sm tracking-wide hover:bg-white/20 transition-all">
                    Find Opportunities
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Overlapping Glass Cards */}
            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.8, duration: 1, type: "spring", stiffness: 100 }}
               className="flex flex-col gap-4 self-end w-full lg:w-auto"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl w-full lg:w-72 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Time to Hire</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <Crosshair size={14} />
                    </div>
                 </div>
                 <p className="text-4xl font-extrabold text-white">-45%</p>
                 <p className="text-xs text-white/50 mt-1">Accelerated by AI matching algorithms.</p>
              </div>

              <div className="bg-indigo-500/20 backdrop-blur-xl border border-indigo-400/30 p-5 rounded-3xl w-full lg:w-72 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">Global Parity</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                       <Sparkles size={14} />
                    </div>
                 </div>
                 <p className="text-4xl font-extrabold text-white">98.4%</p>
                 <p className="text-xs text-indigo-200/70 mt-1">Success rate in candidate placements.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}