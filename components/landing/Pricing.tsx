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
    gradient: "from-slate-50 to-slate-100",
    accent: "text-slate-600",
    checkBg: "bg-slate-100",
    btnClass: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    desc: "For growing organizations scaling fast.",
    features: ["Unlimited Jobs", "Neural Ranking", "Priority Support", "Custom Branding", "API Access", "Analytics Dashboard"],
    highlight: true,
    gradient: "from-indigo-50 to-white",
    accent: "text-indigo-600",
    checkBg: "bg-indigo-100",
    btnClass: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_4px_14px_rgba(99,102,241,0.3)]",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large global corporations at scale.",
    features: ["Everything in Pro", "Dedicated Manager", "Full API Suite", "Global SLA", "Custom Integrations"],
    gradient: "from-slate-50 to-slate-100",
    accent: "text-slate-600",
    checkBg: "bg-slate-100",
    btnClass: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
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

  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.03), transparent 70%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative bg-white border ${
        plan.highlight ? "border-indigo-200" : "border-slate-100"
      } rounded-[32px] p-8 flex flex-col overflow-hidden hover:border-indigo-300 transition-all duration-500 ${
        plan.highlight ? "lg:-translate-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" : "shadow-sm"
      }`}
    >
      {/* Mouse spotlight */}
      <motion.div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: spotlight }} />
      {/* Accent gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} pointer-events-none rounded-[32px] opacity-50`} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Badge */}
        {plan.highlight && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-full w-max mb-6 text-indigo-600 text-[9px] font-bold uppercase tracking-widest">
            <Sparkles size={10} />
            Most Popular
          </div>
        )}

        <h4 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${plan.accent}`}>{plan.name}</h4>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{plan.price}</span>
          {plan.period && <span className="text-slate-400 text-xs font-medium">{plan.period}</span>}
        </div>
        <p className="text-slate-500 text-sm mb-8">{plan.desc}</p>

        <ul className="space-y-3 mb-10 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-slate-600 text-sm">
              <div className={`w-4 h-4 rounded-full ${plan.checkBg} flex items-center justify-center shrink-0`}>
                <Check size={10} className={plan.accent} />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${plan.btnClass}`}>
          {plan.highlight ? "Get Started" : plan.price === "Custom" ? "Contact Sales" : "Select Plan"}
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 px-6 bg-[#FAFBFD] overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-indigo-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          >
            Pricing Plans
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight"
          >
            Investment in{" "}
            <span className="text-slate-400">excellence.</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((p, i) => (
            <PricingCard key={p.name} plan={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}