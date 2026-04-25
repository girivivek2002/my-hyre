"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[900px] flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg-v2.png" 
          alt="EcoDream Architectural Background" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0A0A0F]" />
      </div>

      {/* Main Floating Content Card */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 mt-20">
        <div className="flex flex-col items-center text-center">
          
          {/* Floating Tags */}
          <div className="flex items-center gap-3 mb-8">
            {["AI Matching", "Neural Search", "Global Scale"].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Massive Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl md:text-8xl lg:text-[140px] font-black text-white leading-[0.9] tracking-tighter mb-10"
          >
            SMART <br />
            <span className="text-white/40">HIRES.</span>
          </motion.h1>

          {/* Subheading & CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              Experience the next generation of recruitment with EcoDream's 
              AI-driven neural workspace. Built for high-fidelity talent discovery.
            </p>

            <div className="flex items-center gap-4">
              <button className="px-10 py-5 bg-white text-black rounded-full text-lg font-bold flex items-center gap-3 hover:scale-105 transition-transform">
                Get Started
                <ArrowRight size={24} />
              </button>
              <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Play size={24} fill="white" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Secondary Overlapping Cards */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-6xl hidden lg:flex gap-6">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 flex items-center gap-8 shadow-2xl"
          >
            <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
               <span className="text-4xl font-bold">98%</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">Neural Accuracy</h3>
              <p className="text-white/40 text-sm">Matching candidates with architectural precision across global pools.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 flex items-center gap-8 shadow-2xl"
          >
            <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
               <span className="text-4xl font-bold">2.4s</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">Instant Parsing</h3>
              <p className="text-white/40 text-sm">Real-time data extraction with high-fidelity vector mapping.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Atmospheric Blur Orbs */}
      <div className="absolute top-[20%] -left-40 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[10%] -right-40 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full" />
    </section>
  );
}