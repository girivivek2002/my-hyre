"use client";
import { motion } from "framer-motion";
import { Target, Search, CalendarClock, ArrowRight } from "lucide-react";

export default function Recruiter() {
  const capabilities = [
    {
      icon: Target,
      title: "AI Matching",
      desc: "Neural network-driven ranking of candidates based precisely on your unique team culture requirements.",
      color: "bg-indigo-500",
    },
    {
      icon: Search,
      title: "Candidate Search",
      desc: "Semantic deep-search logic that scales instantly across massive hidden talent pools worldwide.",
      color: "bg-violet-500",
    },
    {
      icon: CalendarClock,
      title: "Interview Scheduling",
      desc: "Automated seamless calendar sync for high-speed hiring that drops back-and-forth overhead natively.",
      color: "bg-cyan-500",
    },
  ];

  return (
    <section className="relative py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Visual Card Stack */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Card */}
            <div className="relative z-10 rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/recruiter.png"
                alt="Recruiter Dashboard"
                className="w-full h-auto object-cover opacity-80"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
            </div>

            {/* Floating stat overlapping the image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-8 -right-4 lg:-right-8 z-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="text-3xl font-bold text-white mb-1">60%</div>
              <div className="text-white/40 text-xs uppercase tracking-widest font-bold">Faster Hiring</div>
            </motion.div>
          </motion.div>

          {/* Right: Text Content */}
          <div className="flex flex-col">
            <h2 className="text-white text-sm font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-white/20" />
              For Recruiters
            </h2>
            <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-12 tracking-tight">
              Scale your team with <span className="text-white/30">precision.</span>
            </h3>

            <div className="space-y-8 mb-16">
              {capabilities.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i }}
                    className="group flex gap-6 items-start"
                  >
                    <div className={`shrink-0 w-14 h-14 rounded-2xl ${c.color}/20 flex items-center justify-center text-white group-hover:${c.color} transition-colors`}>
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xl mb-2">{c.title}</h4>
                      <p className="text-white/40 text-base leading-relaxed">{c.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-max px-10 py-5 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 shadow-2xl hover:shadow-white/20 transition-shadow"
            >
              Post a Job
              <ArrowRight size={22} />
            </motion.button>
          </div>

        </div>
      </div>
    </section>
  );
}