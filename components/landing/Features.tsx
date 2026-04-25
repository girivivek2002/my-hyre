"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Sparkles, Zap, Shield, Globe, Brain, Workflow } from "lucide-react";
import { MouseEvent, useRef } from "react";

const features = [
  {
    title: "Neural Matching",
    desc: "Our proprietary AI doesn't just scan keywords — it understands talent intent, culture fit, and career trajectory through deep semantic analysis.",
    icon: Brain,
    gradient: "from-indigo-500 to-violet-600",
    glow: "bg-indigo-500/20",
    span: "md:col-span-2 md:row-span-2",
    large: true,
  },
  {
    title: "Hyper-Speed Parsing",
    desc: "Parse thousands of resumes in seconds with sub-millisecond latency vectors.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    glow: "bg-amber-500/20",
    span: "",
    large: false,
  },
  {
    title: "Enterprise Security",
    desc: "Bank-grade encryption for all candidate and company data flows.",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600",
    glow: "bg-emerald-500/20",
    span: "",
    large: false,
  },
  {
    title: "Global Scale",
    desc: "Access talent pools across 190+ countries with localized compliance.",
    icon: Globe,
    gradient: "from-cyan-500 to-sky-600",
    glow: "bg-cyan-500/20",
    span: "",
    large: false,
  },
  {
    title: "Smart Workflows",
    desc: "Automated pipeline stages from sourcing to offer letter generation.",
    icon: Workflow,
    gradient: "from-violet-500 to-fuchsia-600",
    glow: "bg-violet-500/20",
    span: "",
    large: false,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const Icon = feature.icon;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-[32px] ${
        feature.large ? "p-14" : "p-10"
      } hover:border-white/[0.12] transition-all duration-500 ${feature.span}`}
    >
      {/* Mouse-tracking spotlight */}
      <motion.div
        className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlight }}
      />
      {/* Accent glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 ${feature.glow} blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon with gradient bg */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-lg`}
        >
          <Icon size={feature.large ? 28 : 24} strokeWidth={1.5} />
        </motion.div>

        <h4
          className={`font-bold text-white mb-4 ${
            feature.large ? "text-3xl md:text-4xl" : "text-xl"
          }`}
        >
          {feature.title}
        </h4>
        <p
          className={`text-white/35 leading-relaxed ${
            feature.large ? "text-lg max-w-lg" : "text-base"
          }`}
        >
          {feature.desc}
        </p>

        <div className="mt-auto pt-8">
          <button className="flex items-center gap-3 text-white/50 group-hover:text-white font-semibold text-sm uppercase tracking-[0.15em] transition-colors duration-500">
            Explore
            <div className="w-6 h-[1px] bg-current group-hover:w-10 transition-all duration-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="relative py-32 lg:py-44 px-6 bg-[#0A0A0F] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-500/[0.03] blur-[200px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-12">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-6 flex items-center gap-4"
            >
              <span className="w-10 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
              Core Capabilities
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
            >
              A workspace designed{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/15">
                for the future.
              </span>
            </motion.h3>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/30 text-lg max-w-sm"
          >
            Scaling your team with architectural precision through our neural-driven workspace.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}