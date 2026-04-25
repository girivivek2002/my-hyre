"use client";
import { motion } from "framer-motion";
import { Target, Search, CalendarClock, ArrowRight } from "lucide-react";

export default function Recruiter() {
  const capabilities = [
    {
      icon: Target,
      title: "AI Matching",
      desc: "Neural network-driven ranking based precisely on your unique team culture.",
      gradient: "from-indigo-500 to-violet-600",
      bg: "bg-indigo-50"
    },
    {
      icon: Search,
      title: "Candidate Search",
      desc: "Semantic deep-search that scales across massive hidden talent pools.",
      gradient: "from-violet-500 to-fuchsia-600",
      bg: "bg-violet-50"
    },
    {
      icon: CalendarClock,
      title: "Interview Scheduling",
      desc: "Automated calendar sync for zero-friction scheduling workflows.",
      gradient: "from-cyan-500 to-blue-600",
      bg: "bg-cyan-50"
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 px-6 bg-[#FAFBFD] overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-indigo-200/30 blur-[150px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Visual Card Stack */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main Image Card */}
            <div className="relative z-10 rounded-[32px] overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] group bg-white">
              <img
                src="/hero-light.png"
                alt="Recruiter Dashboard"
                className="w-full h-[360px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              {/* Floating Label */}
              <div className="absolute bottom-5 left-5 px-3 py-1.5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full text-slate-500 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Recruiter Portal
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="absolute -bottom-5 -right-4 lg:-right-6 z-20 bg-white backdrop-blur-2xl border border-slate-100 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:border-indigo-200 transition-all duration-300"
            >
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 mb-0.5">60%</div>
              <div className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Faster Hiring</div>
            </motion.div>
          </motion.div>

          {/* Right: Text Content */}
          <div className="flex flex-col">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-indigo-600 text-xs font-semibold uppercase tracking-[0.2em] mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-[1px] bg-indigo-400" />
              For Recruiters
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-slate-900 leading-[1.1] mb-10 tracking-tight"
            >
              Scale your team with{" "}
              <span className="text-slate-400">precision.</span>
            </motion.h3>

            <div className="space-y-4 mb-12">
              {capabilities.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="group flex gap-4 items-start p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-slate-100"
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold text-base mb-1">{c.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group w-max px-8 py-3.5 bg-indigo-600 text-white rounded-full font-semibold text-sm flex items-center gap-2.5 shadow-[0_4px_14px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] transition-all duration-300"
            >
              Post a Job
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}