"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { MouseEvent } from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "For small projects and solo talent",
    features: ["1 active job post", "Basic AI Matching", "Basic Analytics"],
    button: "Start Free",
    accent: "emerald",
    glowColor: "rgba(16, 185, 129, 0.1)",
    borderGlow: "rgba(16, 185, 129, 0.5)",
    checkColor: "text-emerald-500",
    hoverBorder: "hover:border-emerald-500/40",
  },
  {
    name: "Basic",
    price: "₹1,999",
    desc: "For rapidly growing teams",
    features: ["5 active job posts", "Advanced AI Matching", "Candidate Export"],
    button: "Select Plan",
    accent: "indigo",
    glowColor: "rgba(99, 102, 241, 0.1)",
    borderGlow: "rgba(99, 102, 241, 0.5)",
    checkColor: "text-indigo-500",
    hoverBorder: "hover:border-indigo-500/40",
  },
  {
    name: "Pro",
    price: "₹4,999",
    desc: "For enterprise hiring pros",
    features: ["Unlimited job posts", "Neural ranking logic", "Custom Workflows", "Full Analytics SDK"],
    button: "Get Started",
    highlight: true,
    accent: "violet",
    glowColor: "rgba(139, 92, 246, 0.12)",
    borderGlow: "rgba(139, 92, 246, 0.5)",
    checkColor: "text-violet-400",
    hoverBorder: "",
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For massive corporations",
    features: ["Unlimited seats", "Direct API Access", "Dedicated Account Manager"],
    button: "Contact Sales",
    accent: "amber",
    glowColor: "rgba(245, 158, 11, 0.1)",
    borderGlow: "rgba(245, 158, 11, 0.5)",
    checkColor: "text-amber-500",
    hoverBorder: "hover:border-amber-500/40",
  },
];

function PricingCard({ plan, index }: { plan: any, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const isHighlighted = plan.highlight;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 180, damping: 20 } },
      }}
      onMouseMove={handleMouseMove}
      className={`group relative flex w-full flex-col p-8 sm:p-10 rounded-3xl border transition-all duration-500 overflow-hidden ${
        isHighlighted
          ? "border-violet-500/40 bg-gradient-to-b from-[#16161D] to-[#0A0A0F] dark:from-[#16161D] dark:to-[#0A0A0F] shadow-glow-violet"
          : `border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111118] ${plan.hoverBorder} shadow-premium dark:shadow-premium-dark`
      }`}
    >
      {/* Radial follow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${plan.glowColor}, transparent 80%)`,
        }}
      />
      {!isHighlighted && (
        <>
          <motion.div
            className="pointer-events-none absolute -inset-[2px] rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
            style={{
              background: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, ${plan.borderGlow}, transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 rounded-3xl bg-white/90 dark:bg-[#111118]/90 -z-10 backdrop-blur-3xl" />
        </>
      )}

      {/* Badge */}
      {isHighlighted && (
        <div className="absolute -top-1 right-8 md:right-auto md:left-1/2 md:-translate-x-1/2 z-20">
          <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-b-xl shadow-lg border border-t-0 border-violet-400/50 tracking-widest overflow-hidden">
            BEST VALUE
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <h3 className={`text-xl sm:text-2xl font-bold mb-2 transition-colors ${isHighlighted ? "text-white" : "text-slate-800 dark:text-slate-200"}`}>{plan.name}</h3>
        <p className="text-slate-500 dark:text-slate-500 text-sm mb-8">{plan.desc}</p>
        <div className={`text-4xl sm:text-5xl font-black mb-8 tracking-tighter ${isHighlighted ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {plan.price}
          <span className="text-slate-400 dark:text-slate-600 text-base font-medium tracking-normal"> /mo</span>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
          {plan.features.map((f: string, i: number) => (
            <li key={i} className={`flex items-start gap-3 ${isHighlighted ? "text-slate-300" : "text-slate-600 dark:text-slate-400"} transition-colors text-sm sm:text-base`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.checkColor}`} />
              {f}
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-xl font-bold relative overflow-hidden transition-all duration-300 ${
            isHighlighted
              ? "bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              : "bg-slate-900 dark:bg-white/[0.05] border border-slate-700 dark:border-white/[0.1] text-white hover:bg-slate-800 dark:hover:bg-white/10 hover:border-slate-500 dark:hover:border-white/20"
          }`}
        >
          {plan.button}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-20 relative bg-white dark:bg-[#0A0A0F] overflow-hidden max-w-[1920px] mx-auto z-0 transition-colors duration-300">

      <div className="absolute w-[500px] h-[500px] bg-violet-500/8 blur-[150px] rounded-full left-1/2 -translate-x-1/2 top-0 pointer-events-none -z-10 animate-orb-drift" />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16 lg:mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          <Sparkles size={12} />
          Pricing
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
          Simple, Transparent Plans
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto transition-colors">
          Scale effortlessly. Pay only for the power you need to transform your entire recruitment pipeline.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10 max-w-7xl mx-auto"
      >
        {plans.map((plan, index) => (
          <PricingCard key={index} plan={plan} index={index} />
        ))}
      </motion.div>
    </section>
  );
}