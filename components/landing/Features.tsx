"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Brain, Zap, Shield, Globe, Workflow } from "lucide-react";
import { MouseEvent } from "react";

const features = [
  {
    title: "Neural Matching",
    desc: "Our proprietary AI understands talent intent, culture fit, and career trajectory through deep semantic analysis.",
    icon: Brain,
    gradient: "from-indigo-500 to-violet-600",
    lightBg: "bg-indigo-50",
    span: "md:col-span-2 md:row-span-2",
    large: true,
  },
  {
    title: "Hyper-Speed Parsing",
    desc: "Parse thousands of resumes in seconds with sub-millisecond latency.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    span: "",
    large: false,
  },
  {
    title: "Enterprise Security",
    desc: "Bank-grade encryption for all candidate and company data flows.",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    span: "",
    large: false,
  },
  {
    title: "Global Scale",
    desc: "Access talent pools across 190+ countries with localized compliance.",
    icon: Globe,
    gradient: "from-cyan-500 to-blue-600",
    lightBg: "bg-cyan-50",
    span: "",
    large: false,
  },
  {
    title: "Smart Workflows",
    desc: "Automated pipeline stages from sourcing to offer letter generation.",
    icon: Workflow,
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    span: "",
    large: false,
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const Icon = feature.icon;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.04), transparent 70%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.08 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden bg-white border border-slate-100 rounded-2xl ${
        feature.large ? "p-10 md:p-12" : "p-8"
      } hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-500 ${feature.span}`}
    >
      <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: spotlight }} />

      <div className="relative z-10 flex flex-col h-full">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-sm`}
        >
          <Icon size={feature.large ? 24 : 20} strokeWidth={1.5} />
        </motion.div>

        <h4 className={`font-bold text-slate-900 mb-3 ${feature.large ? "text-2xl md:text-3xl" : "text-lg"}`}>
          {feature.title}
        </h4>
        <p className={`text-slate-400 leading-relaxed ${feature.large ? "text-base max-w-md" : "text-sm"}`}>
          {feature.desc}
        </p>

        <div className="mt-auto pt-6">
          <button className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 font-medium text-sm transition-colors duration-300">
            Learn more
            <div className="w-5 h-[1px] bg-current group-hover:w-8 transition-all duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 px-6 bg-[#FAFBFD] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-10">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-indigo-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4 flex items-center gap-3"
            >
              <span className="w-8 h-[1px] bg-indigo-400" />
              Core Capabilities
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            >
              A workspace designed{" "}
              <span className="text-slate-300">for the future.</span>
            </motion.h3>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base max-w-sm"
          >
            Scaling your team with architectural precision through our neural-driven workspace.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}