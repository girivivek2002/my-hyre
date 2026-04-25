"use client";
import { motion, Variants } from "framer-motion";

export default function Engagement() {
  const recruiters = [
    { title: "Define Requirements", desc: "Input your ideal candidate persona using natural language processing." },
    { title: "AI Deep Search", desc: "Our AI scans millions of data points to find passive and active talent." },
    { title: "Smart Shortlist", desc: "Review a curated list of top candidates ranked by culture and skill fit." },
  ];

  const candidates = [
    { title: "Build Smart Profile", desc: "Import LinkedIn and let AI craft your professional story automatically." },
    { title: "Direct Matches", desc: "Skip the line and get matched directly with roles that fit your life." },
    { title: "Get Hired", desc: "Manage interviews and offers from a single unified workspace." },
  ];

  const headerVars: Variants = {
    hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7 } }
  };

  const columnVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemLeftVars: Variants = {
    hidden: { opacity: 0, x: -40, scale: 0.95, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 22 } }
  };

  const itemRightVars: Variants = {
    hidden: { opacity: 0, x: 40, scale: 0.95, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 22 } }
  };

  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-20 relative bg-white dark:bg-[#0A0A0F] overflow-hidden max-w-[1920px] mx-auto transition-colors duration-300">

      {/* Multi-color orbs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full top-20 left-[30%] pointer-events-none animate-orb-drift" />
      <div className="absolute w-[400px] h-[400px] bg-violet-500/6 blur-[120px] rounded-full bottom-20 right-[25%] pointer-events-none animate-orb-drift-reverse" />

      {/* Title */}
      <motion.div
        variants={headerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16 lg:mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          Unified Experience
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          The Future of <span className="text-gradient-primary">Engagement</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 max-w-6xl mx-auto">

        {/* Desktop divider */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent origin-top"
        />

        {/* Recruiters Column — Indigo accent */}
        <motion.div variants={columnVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-white/[0.06]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-glow-indigo">R</div>
            <h3 className="text-2xl font-bold text-gradient-primary">For Recruiters</h3>
          </div>

          <div className="space-y-5">
            {recruiters.map((item, index) => (
              <motion.div
                key={index}
                variants={itemLeftVars}
                whileHover={{ scale: 1.02, x: 6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className="group relative bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-6 hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-bold text-lg group-hover:shadow-glow-indigo transition-all duration-300">
                  0{index + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Candidates Column — Violet accent */}
        <motion.div variants={columnVars} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-white/[0.06]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-glow-violet">C</div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">For Candidates</h3>
          </div>

          <div className="space-y-5">
            {candidates.map((item, index) => (
              <motion.div
                key={index}
                variants={itemRightVars}
                whileHover={{ scale: 1.02, x: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className="group relative bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-6 hover:border-violet-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-violet-500/0 via-violet-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 font-bold text-lg group-hover:shadow-glow-violet transition-all duration-300">
                  0{index + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}