"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Sparkles, FileSearch, LayoutDashboard, MessageSquareLock, CalendarRange, TrendingUp } from "lucide-react";
import { MouseEvent } from "react";

const features = [
  {
    title: "AI Matching",
    desc: "Connect candidates with perfect opportunities using intelligent matching algorithms.",
    Icon: Sparkles,
    color: "text-blue-400"
  },
  {
    title: "Resume Parsing",
    desc: "Extract skills, experience, and education automatically from resumes.",
    Icon: FileSearch,
    color: "text-indigo-400"
  },
  {
    title: "Recruiter Dashboard",
    desc: "Manage jobs, candidates, and hiring workflow from one unified platform.",
    Icon: LayoutDashboard,
    color: "text-purple-400"
  },
  {
    title: "Secure Messaging",
    desc: "Communicate directly with candidates and recruiters securely.",
    Icon: MessageSquareLock,
    color: "text-pink-400"
  },
  {
    title: "Interview Scheduling",
    desc: "Schedule interviews and meetings with integrated automated calendar tools.",
    Icon: CalendarRange,
    color: "text-blue-500"
  },
  {
    title: "Analytics",
    desc: "Track hiring performance, candidate pipeline, and recruitment metrics.",
    Icon: TrendingUp,
    color: "text-teal-400"
  },
];

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const { Icon, color } = feature;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } },
      }}
      onMouseMove={handleMouseMove}
      className="group relative flex w-full flex-col items-start rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 hover:border-transparent transition-all duration-300"
    >
      {/* Magnetic Glossy Spotlight Background */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {/* Magnetic Outer Glow Border */}
      <motion.div
        className="pointer-events-none absolute -inset-[2px] rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(99, 102, 241, 0.6),
              transparent 50%
            )
          `,
        }}
      />

      {/* Internal Background Cover to restrict border glowing safely */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-neutral-900 dark:to-neutral-950 -z-10" />

      {/* Card Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 flex items-center justify-center mb-6 shadow-sm dark:shadow-lg dark:shadow-black group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-blue-500/50 transition-all duration-300">
          <Icon className={`w-6 h-6 ${color} transition-transform duration-300 group-hover:text-blue-600 dark:group-hover:text-white`} />
        </div>

        {/* Title & Desc */}
        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-slate-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed group-hover:text-slate-800 dark:group-hover:text-neutral-300 transition-colors duration-300">
          {feature.desc}
        </p>
      </div>

      {/* Accent Corner Line */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition duration-300 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden max-w-[1920px] mx-auto z-0">

      {/* Background Ambient Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-blue-500/10 blur-[120px] lg:blur-[180px] rounded-[100%] left-1/2 -translate-x-1/2 top-40 pointer-events-none -z-10"
      ></motion.div>

      {/* Header Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 lg:mb-24 relative text-center max-w-3xl mx-auto z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          Features
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
          The Intelligent Workspace
        </h2>
        <p className="text-slate-600 dark:text-neutral-400 text-lg md:text-xl transition-colors">
          Everything you need to streamline the hiring lifecycle, powered completely by our native AI engines.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 relative z-10 max-w-7xl mx-auto"
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </motion.div>
    </section>
  );
}