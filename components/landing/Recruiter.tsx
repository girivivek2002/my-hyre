"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Target, Search, CalendarClock, ArrowRight } from "lucide-react";
import { MouseEvent } from "react";

export default function Recruiter() {
  const capabilities = [
    {
      icon: Target,
      title: "AI Matching",
      desc: "Neural network-driven ranking based precisely on your unique team culture.",
      gradient: "from-indigo-500 to-violet-600",
    },
    {
      icon: Search,
      title: "Candidate Search",
      desc: "Semantic deep-search that scales across massive hidden talent pools.",
      gradient: "from-violet-500 to-fuchsia-600",
    },
    {
      icon: CalendarClock,
      title: "Interview Scheduling",
      desc: "Automated calendar sync for zero-friction scheduling workflows.",
      gradient: "from-cyan-500 to-sky-600",
    },
  ];

  return (
    <section className="relative py-32 lg:py-44 px-6 bg-[#0A0A0F] overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-indigo-500/[0.04] blur-[180px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Visual Card Stack */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main Image Card */}
            <div className="relative z-10 rounded-[40px] overflow-hidden border border-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.5)] group">
              <img
                src="/hero-bg-v3.png"
                alt="Recruiter Dashboard"
                className="w-full h-[400px] object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 transition-transform"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />
              {/* Floating Label */}
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-full text-white/60 text-xs font-bold uppercase tracking-widest">
                Recruiter Portal
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="absolute -bottom-6 -right-4 lg:-right-8 z-20 bg-[#111118]/90 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-indigo-500/20 transition-all duration-500"
            >
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 mb-1">60%</div>
              <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Faster Hiring</div>
            </motion.div>
          </motion.div>

          {/* Right: Text Content */}
          <div className="flex flex-col">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
            >
              <span className="w-10 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
              For Recruiters
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-12 tracking-tight"
            >
              Scale your team with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/35 to-white/10">precision.</span>
            </motion.h3>

            <div className="space-y-6 mb-16">
              {capabilities.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i, duration: 0.5 }}
                    className="group flex gap-5 items-start p-5 rounded-2xl hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{c.title}</h4>
                      <p className="text-white/30 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group w-max px-10 py-5 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.15)] transition-all duration-500"
            >
              Post a Job
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}