"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "For small projects and solo talent",
    features: ["1 active job post", "Basic AI Matching", "Basic Analytics"],
    button: "Start Free",
    highlight: false,
  },
  {
    name: "Basic",
    price: "₹1,999",
    desc: "For rapidly growing teams",
    features: ["5 active job posts", "Advanced AI Matching", "Candidate Export"],
    button: "Select Plan",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹4,999",
    desc: "For enterprise hiring pros",
    features: ["Unlimited job posts", "Neural ranking logic", "Custom Workflows", "Full Analytics SDK"],
    button: "Get Started",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For massive corporations",
    features: ["Unlimited seats", "Direct API Access", "Dedicated Account Manager"],
    button: "Contact Sales",
    highlight: false,
  },
];

function PricingCard({ plan, index }: { plan: any, index: number }) {
  const isHighlighted = plan.highlight;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 } },
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group relative flex w-full flex-col p-8 sm:p-10 rounded-[32px] transition-all duration-500 overflow-hidden shadow-premium ${
        isHighlighted
          ? "bg-white/10 dark:bg-indigo-500/10 backdrop-blur-3xl border border-white/20 dark:border-indigo-400/30"
          : "bg-white/5 dark:bg-[#111118]/60 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.06] hover:bg-white/10 dark:hover:bg-[#111118]/80 hover:border-indigo-500/30"
      }`}
    >
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {isHighlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
      )}

      {isHighlighted && (
        <div className="absolute -top-1 right-8 z-20">
          <div className="relative bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-b-xl shadow-lg border border-t-0 border-indigo-400/50 tracking-widest overflow-hidden">
            BEST VALUE
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <h3 className={`text-2xl font-bold mb-2 transition-colors text-slate-900 dark:text-white`}>{plan.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">{plan.desc}</p>
        
        <div className={`text-5xl font-extrabold mb-10 tracking-tighter text-slate-900 dark:text-white`}>
          {plan.price}
          <span className="text-slate-400 dark:text-slate-500 text-base font-medium tracking-normal"> /mo</span>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
          {plan.features.map((f: string, i: number) => (
            <li key={i} className={`flex items-start gap-3 text-slate-600 dark:text-slate-300 transition-colors text-sm sm:text-base`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isHighlighted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>
                 <CheckCircle2 size={12} strokeWidth={3} />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-xl font-bold relative overflow-hidden transition-all duration-300 ${
            isHighlighted
              ? "bg-white text-slate-900 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
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
    <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 relative bg-slate-50 dark:bg-[#0A0A0F] overflow-hidden max-w-[1920px] mx-auto z-0 transition-colors duration-300">

      <div className="absolute w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full left-1/2 -translate-x-1/2 top-0 pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-bold mb-8 tracking-[0.2em] uppercase">
          <Sparkles size={14} />
          Pricing Structure
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-[-0.04em] text-slate-900 dark:text-white">
          TRANSPARENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">SCALE</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Scale effortlessly. Pay only for the power you need to transform your entire recruitment pipeline.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
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