"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Sparkles, FileSearch, LayoutDashboard, MessageSquareLock, CalendarRange, TrendingUp } from "lucide-react";
import { MouseEvent } from "react";

const features = [
  {
    title: "AI Matching",
    desc: "Connect candidates with perfect opportunities using intelligent matching algorithms.",
    Icon: Sparkles,
    color: "text-indigo-500",
    glowColor: "rgba(99, 102, 241, 0.12)",
    borderGlow: "rgba(99, 102, 241, 0.5)",
    bgAccent: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    title: "Resume Parsing",
    desc: "Extract skills, experience, and education automatically from resumes.",
    Icon: FileSearch,
    color: "text-violet-500",
    glowColor: "rgba(139, 92, 246, 0.12)",
    borderGlow: "rgba(139, 92, 246, 0.5)",
    bgAccent: "bg-violet-500/10 border-violet-500/20",
  },
  {
    title: "Recruiter Dashboard",
    desc: "Manage jobs, candidates, and hiring workflow from one unified platform.",
    Icon: LayoutDashboard,
    color: "text-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.12)",
    borderGlow: "rgba(6, 182, 212, 0.5)",
    bgAccent: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    title: "Secure Messaging",
    desc: "Communicate directly with candidates and recruiters securely.",
    Icon: MessageSquareLock,
    color: "text-pink-500",
    glowColor: "rgba(236, 72, 153, 0.12)",
    borderGlow: "rgba(236, 72, 153, 0.5)",
    bgAccent: "bg-pink-500/10 border-pink-500/20",
  },
  {
    title: "Interview Scheduling",
    desc: "Schedule interviews and meetings with integrated automated calendar tools.",
    Icon: CalendarRange,
    color: "text-amber-500",
    glowColor: "rgba(245, 158, 11, 0.12)",
    borderGlow: "rgba(245, 158, 11, 0.5)",
    bgAccent: "bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Analytics",
    desc: "Track hiring performance, candidate pipeline, and recruitment metrics.",
    Icon: TrendingUp,
    color: "text-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.12)",
    borderGlow: "rgba(16, 185, 129, 0.5)",
    bgAccent: "bg-emerald-500/10 border-emerald-500/20",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const { Icon, color, glowColor, borderGlow, bgAccent } = feature;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 22, delay: index * 0.05 } },
      }}
      onMouseMove={handleMouseMove}
      className="group relative flex w-full flex-col items-start rounded-2xl bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/[0.06] p-6 sm:p-8 hover:border-transparent transition-all duration-500"
    >
      {/* Radial spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`,
        }}
      />
      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-[2px] rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, ${borderGlow}, transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-[#111118] dark:to-[#0A0A0F] -z-10" />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.12, rotate: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`w-14 h-14 rounded-xl ${bgAccent} border flex items-center justify-center mb-6 shadow-sm dark:shadow-lg dark:shadow-black/30 transition-all duration-300`}
        >
          <Icon className={`w-6 h-6 ${color} transition-transform duration-300`} />
        </motion.div>

        <h3 className={`text-xl font-bold mb-3 text-slate-900 dark:text-slate-200 group-hover:${color.replace('text-', 'text-')} transition-colors duration-300`}>
          {feature.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
          {feature.desc}
        </p>
      </div>

      {/* Corner accent arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={color}><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden max-w-[1920px] mx-auto z-0">

      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/8 blur-[140px] rounded-full left-[20%] top-20 pointer-events-none -z-10 animate-orb-drift" />
      <div className="absolute w-[400px] h-[400px] bg-violet-500/8 blur-[120px] rounded-full right-[15%] bottom-20 pointer-events-none -z-10 animate-orb-drift-reverse" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-16 lg:mb-24 relative text-center max-w-3xl mx-auto z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          <Sparkles size={12} />
          Features
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">
          The Intelligent Workspace
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl transition-colors">
          Everything you need to streamline the hiring lifecycle, powered completely by our native AI engines.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10 max-w-7xl mx-auto"
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </motion.div>
    </section>
  );
}