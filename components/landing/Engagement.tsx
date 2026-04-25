"use client";
import { motion } from "framer-motion";

export default function Engagement() {
  return (
    <section className="relative py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[60px] bg-white/5 backdrop-blur-3xl border border-white/10 p-24 overflow-hidden shadow-2xl">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-white text-sm font-bold uppercase tracking-[0.3em] mb-8">Structural Hiring</h2>
              <h3 className="text-6xl font-bold text-white mb-10 leading-tight tracking-tighter">
                Scale with <br />
                architectural <br />
                <span className="text-white/40">integrity.</span>
              </h3>
              <p className="text-white/60 text-xl leading-relaxed mb-12">
                We bridge the gap between human ambition and organizational growth through 
                high-fidelity data mapping and structural intelligence.
              </p>
              
              <div className="flex gap-12">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">500+</div>
                  <div className="text-white/40 text-xs uppercase tracking-widest font-bold">Companies</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">2M+</div>
                  <div className="text-white/40 text-xs uppercase tracking-widest font-bold">Candidates</div>
                </div>
              </div>
            </div>

            {/* Overlapping Preview Card */}
            <div className="relative">
              <motion.div 
                initial={{ rotate: -5, y: 40 }}
                whileInView={{ rotate: 0, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 bg-[#0A0A0F] rounded-[48px] border border-white/10 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-white/40 tracking-widest uppercase">Dashboard</div>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/3 bg-white/20 rounded-full" />
                        <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                      </div>
                      <div className="w-16 h-8 bg-indigo-500/20 rounded-lg" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Decorative Glow behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}