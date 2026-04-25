"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

export default function Engagement() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.03), transparent 70%)`;

  return (
    <section className="relative py-24 lg:py-32 px-6 bg-[#FAFBFD] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          onMouseMove={handleMouseMove}
          className="relative rounded-[40px] bg-white border border-slate-100 p-10 md:p-16 lg:p-20 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-shadow duration-500 group"
        >
          {/* Mouse-tracking Spotlight */}
          <motion.div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: spotlight }} />
          {/* Background subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 via-transparent to-emerald-50/50 pointer-events-none rounded-[40px]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-indigo-600 text-xs font-semibold uppercase tracking-[0.2em] mb-6 flex items-center gap-3"
              >
                <span className="w-8 h-[1px] bg-indigo-400" />
                Structural Hiring
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight"
              >
                Scale with <br />
                architectural <br />
                <span className="text-slate-400">integrity.</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-base leading-relaxed mb-12 max-w-sm"
              >
                We bridge the gap between human ambition and organizational growth through
                high-fidelity data mapping and structural intelligence.
              </motion.p>

              <div className="flex gap-12">
                {[
                  { value: "500+", label: "Companies" },
                  { value: "2M+", label: "Candidates" },
                  { value: "99.7%", label: "Uptime" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + 0.1 * i }}
                  >
                    <div className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-[0.1em] font-semibold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overlapping Preview Card */}
            <div className="relative">
              <motion.div
                initial={{ rotate: -2, y: 30, opacity: 0 }}
                whileInView={{ rotate: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
                className="relative z-10 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              >
                {/* Window Chrome */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-semibold text-slate-400 tracking-wider uppercase border border-slate-100">Dashboard</div>
                </div>
                {/* Mock Content */}
                <div className="space-y-4">
                  {[
                    { name: "Sarah Chen", role: "Senior Engineer", match: "98%" },
                    { name: "Raj Patel", role: "Product Lead", match: "94%" },
                    { name: "Emma Wilson", role: "UX Designer", match: "91%" },
                  ].map((candidate, i) => (
                    <motion.div
                      key={candidate.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + 0.1 * i }}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 hover:border-slate-200 transition-all duration-300"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                        i === 0 ? "from-indigo-100 to-violet-100 text-indigo-600" :
                        i === 1 ? "from-amber-100 to-orange-100 text-amber-600" :
                        "from-emerald-100 to-teal-100 text-emerald-600"
                      } flex items-center justify-center text-sm font-bold shadow-sm`}>
                        {candidate.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-800 text-sm font-semibold">{candidate.name}</div>
                        <div className="text-slate-400 text-xs">{candidate.role}</div>
                      </div>
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        i === 0 ? "bg-indigo-100 text-indigo-600" :
                        i === 1 ? "bg-amber-100 text-amber-600" :
                        "bg-emerald-100 text-emerald-600"
                      }`}>
                        {candidate.match}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Decorative Glow behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-200/40 blur-[80px] rounded-full -z-10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}