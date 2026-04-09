"use client";
import { motion, Variants } from "framer-motion";

export default function Engagement() {
  const recruiters = [
    {
      title: "Define Requirements",
      desc: "Input your ideal candidate persona using natural language processing.",
    },
    {
      title: "AI Deep Search",
      desc: "Our AI scans millions of data points to find passive and active talent.",
    },
    {
      title: "Smart Shortlist",
      desc: "Review a curated list of top candidates ranked by culture and skill fit.",
    },
  ];

  const candidates = [
    {
      title: "Build Smart Profile",
      desc: "Import LinkedIn and let AI craft your professional story automatically.",
    },
    {
      title: "Direct Matches",
      desc: "Skip the line and get matched directly with roles that fit your life.",
    },
    {
      title: "Get Hired",
      desc: "Manage interviews and offers from a single unified workspace.",
    },
  ];

  // Animation variants
  const headerVars: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const columnVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemLeftVars: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
  };

  const itemRightVars: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
  };

  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-20 relative bg-white dark:bg-black overflow-hidden max-w-[1920px] mx-auto transition-colors duration-300">

      {/* Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] bg-blue-500/10 blur-[100px] lg:blur-[150px] rounded-full top-20 left-1/2 -translate-x-1/2 pointer-events-none"
      />

      {/* Title */}
      <motion.div
        variants={headerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16 lg:mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          Unified Experience
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
          The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Engagement</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 max-w-6xl mx-auto">

        {/* Desktop Divider */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-200 dark:via-neutral-700 to-transparent origin-top"
          />

        {/* Recruiters Column */}
        <motion.div
          variants={columnVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">R</div>
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-neutral-400">
              For Recruiters
            </h3>
          </div>

          <div className="space-y-6">
            {recruiters.map((item, index) => (
              <motion.div
                key={index}
                variants={itemLeftVars}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-6 hover:border-blue-500/50 transition-all duration-300"
              >
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Number */}
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                  0{index + 1}
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-100 transition-colors">{item.title}</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Candidates Column */}
        <motion.div
          variants={columnVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]">C</div>
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-neutral-400">
              For Candidates
            </h3>
          </div>

          <div className="space-y-6">
            {candidates.map((item, index) => (
              <motion.div
                key={index}
                variants={itemRightVars}
                whileHover={{ scale: 1.02, x: -5 }}
                className="group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-slate-200 dark:border-neutral-800/80 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-6 hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Number */}
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-purple-600 dark:text-purple-400 font-bold text-lg group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300">
                  0{index + 1}
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-neutral-200 group-hover:text-purple-600 dark:group-hover:text-purple-100 transition-colors">{item.title}</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}