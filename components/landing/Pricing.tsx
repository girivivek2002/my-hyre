"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { MouseEvent } from "react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    desc: "For small teams and solo talent scouts.",
    features: ["1 Active Job", "Basic Matching", "Standard Support", "Community Access"],
    gradient: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-400",
    checkBg: "bg-emerald-500/20",
    btnClass: "bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/20",
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    desc: "For growing organizations scaling fast.",
    features: ["Unlimited Jobs", "Neural Ranking", "Priority Support", "Custom Branding", "API Access", "Analytics Dashboard"],
    highlight: true,
    gradient: "from-indigo-500/20 via-violet-500/15 to-purple-500/10",
    accent: "text-indigo-400",
    checkBg: "bg-indigo-500/20",
    btnClass: "bg-white text-black hover:shadow-[0_10px_40px_rgba(99,102,241,0.2)]",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large global corporations at scale.",
    features: ["Everything in Pro", "Dedicated Manager", "Full API Suite", "Global SLA", "Custom Integrations"],
    gradient: "from-amber-500/20 to-amber-500/5",
    accent: "text-amber-400",
    checkBg: "bg-amber-500/20",
    btnClass: "bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/20",
  },
];

function PricingCard({ plan, index }: { plan: (typeof plans)[number]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.05), transparent 70%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.12 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative bg-white/[0.03] backdrop-blur-xl border ${
        plan.highlight ? "border-white/[0.15]" : "border-white/[0.06]"
      } rounded-[36px] p-10 flex flex-col overflow-hidden hover:border-white/[0.15] transition-all duration-500 ${
        plan.highlight ? "lg:-translate-y-4 shadow-[0_40px_80px_rgba(0,0,0,0.4)]" : ""
      }`}
    >
      {/* Mouse spotlight */}
      <motion.div className="absolute inset-0 rounded-[36px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: spotlight }} />
      {/* Accent gradient */}
      {plan.highlight && <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} pointer-events-none rounded-[36px]`} />}
      {/* Top shimmer line */}
      {plan.highlight && (
        <div className="absolute top-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Badge */}
        {plan.highlight && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/15 border border-indigo-500/20 rounded-full w-max mb-8 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={11} />
            Most Popular
          </div>
        )}

        <h4 className={`text-sm font-bold uppercase tracking-[0.2em] mb-6 ${plan.accent}`}>{plan.name}</h4>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
          {plan.period && <span className="text-white/25 text-sm font-medium">{plan.period}</span>}
        </div>
        <p className="text-white/30 text-sm mb-10">{plan.desc}</p>

        <ul className="space-y-4 mb-12 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
              <div className={`w-5 h-5 rounded-full ${plan.checkBg} flex items-center justify-center shrink-0`}>
                <Check size={12} className={plan.accent} />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <button className={`w-full py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${plan.btnClass}`}>
          {plan.highlight ? "Get Started" : plan.price === "Custom" ? "Contact Sales" : "Select Plan"}
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section className="relative py-32 lg:py-44 px-6 bg-[#0A0A0F] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-violet-500/[0.03] blur-[200px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-6"
          >
            Pricing Plans
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          >
            Investment in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/15">excellence.</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((p, i) => (
            <PricingCard key={p.name} plan={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}