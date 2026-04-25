"use client";
import { motion } from "framer-motion";
import { Sparkles, FileSearch, LayoutDashboard, MessageSquareLock, CalendarRange, TrendingUp, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    title: "AI Matching Parity",
    desc: "Connect candidates with perfect opportunities using intelligent matching algorithms.",
    Icon: Sparkles,
  },
  {
    title: "Resume Parsing",
    desc: "Extract skills, experience, and education automatically from resumes with high fidelity.",
    Icon: FileSearch,
  },
  {
    title: "Recruiter Hub",
    desc: "Manage jobs, candidates, and hiring workflow from one unified intelligent platform.",
    Icon: LayoutDashboard,
  },
  {
    title: "Secure Comm Links",
    desc: "Communicate directly with candidates and recruiters through encrypted channels.",
    Icon: MessageSquareLock,
  },
  {
    title: "Automated Scheduling",
    desc: "Schedule interviews and meetings with integrated automated calendar tools.",
    Icon: CalendarRange,
  },
  {
    title: "Pipeline Analytics",
    desc: "Track hiring performance, candidate pipeline, and recruitment metrics in real-time.",
    Icon: TrendingUp,
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const { Icon, title, desc } = feature;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 } },
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative flex w-full flex-col items-start rounded-[32px] bg-white/5 dark:bg-[#111118]/60 backdrop-blur-3xl border border-slate-200/50 dark:border-white/[0.06] p-8 lg:p-10 hover:bg-white/10 dark:hover:bg-[#111118]/80 hover:border-indigo-500/30 transition-all duration-500 shadow-premium"
    >
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 w-full">
        <div className="flex justify-between items-start mb-8 w-full">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-glow-indigo group-hover:scale-110 transition-transform duration-500">
            <Icon strokeWidth={1.5} size={28} />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="relative w-full px-4 pb-4 sm:pb-6 overflow-hidden bg-slate-50 dark:bg-[#0A0A0F]">
      <div className="relative w-full rounded-[32px] sm:rounded-[48px] overflow-hidden bg-[#111118] py-32 lg:py-48 px-6 md:px-12 lg:px-24">

      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-bold mb-8 tracking-[0.2em] uppercase">
              <Sparkles size={14} />
              Core Capabilities
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-[-0.04em] leading-[1.1]">
              INTELLIGENT <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">WORKSPACE</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed"
          >
            Everything you need to streamline the hiring lifecycle, powered completely by our native AI engines and high-fidelity parsing architecture.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  );
}