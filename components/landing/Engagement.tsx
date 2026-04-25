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

  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.06), transparent 70%)`;

  return (
    <section className="relative py-32 lg:py-44 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          onMouseMove={handleMouseMove}
          className="relative rounded-[48px] bg-white/[0.03] backdrop-blur-3xl border border-white/[0.06] p-12 md:p-20 lg:p-24 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] group"
        >
          {/* Mouse-tracking Spotlight */}
          <motion.div className="absolute inset-0 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: spotlight }} />
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.08] via-transparent to-emerald-500/[0.06] pointer-events-none rounded-[48px]" />
          {/* Animated border glow */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-[border-glow_3s_ease-in-out_infinite]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
              >
                <span className="w-10 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
                Structural Hiring
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 leading-[1.05] tracking-tight"
              >
                Scale with <br />
                architectural <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/35 to-white/10">integrity.</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/40 text-lg leading-relaxed mb-14 max-w-md"
              >
                We bridge the gap between human ambition and organizational growth through
                high-fidelity data mapping and structural intelligence.
              </motion.p>

              <div className="flex gap-16">
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
                    <div className="text-3xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overlapping Preview Card */}
            <div className="relative">
              <motion.div
                initial={{ rotate: -3, y: 40, opacity: 0 }}
                whileInView={{ rotate: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
                className="relative z-10 bg-[#0e0e16] rounded-[36px] border border-white/[0.08] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
              >
                {/* Window Chrome */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1.5 bg-white/[0.04] rounded-full text-[10px] font-bold text-white/30 tracking-widest uppercase">Dashboard</div>
                </div>
                {/* Mock Content */}
                <div className="space-y-5">
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
                      className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                        i === 0 ? "from-indigo-500/30 to-violet-500/30" :
                        i === 1 ? "from-amber-500/30 to-orange-500/30" :
                        "from-emerald-500/30 to-teal-500/30"
                      } flex items-center justify-center text-white/60 text-sm font-bold`}>
                        {candidate.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-white/80 text-sm font-semibold">{candidate.name}</div>
                        <div className="text-white/25 text-xs">{candidate.role}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        i === 0 ? "bg-indigo-500/20 text-indigo-400" :
                        i === 1 ? "bg-amber-500/20 text-amber-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {candidate.match}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Decorative Glow behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/[0.08] blur-[120px] rounded-full -z-10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}