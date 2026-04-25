"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      desc: "For small teams and startups.",
      features: ["1 Active Job", "Basic Matching", "Standard Support"]
    },
    {
      name: "Pro",
      price: "$299",
      desc: "For growing organizations.",
      features: ["Unlimited Jobs", "Neural Ranking", "Priority Support", "Custom Branding"],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large global corporations.",
      features: ["Unlimited Jobs", "Dedicated Manager", "Full API Access", "Global Support"]
    }
  ];

  return (
    <section className="relative py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-white text-sm font-bold uppercase tracking-[0.3em] mb-6">Pricing Plans</h2>
          <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
            Investment in <br />
            <span className="text-white/40">excellence.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className={`relative bg-white/5 backdrop-blur-3xl border ${p.highlight ? "border-white/30" : "border-white/10"} rounded-[48px] p-12 flex flex-col items-center text-center shadow-2xl overflow-hidden`}
            >
              {p.highlight && <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />}
              
              <h4 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-10">{p.name}</h4>
              <div className="text-6xl font-bold text-white mb-6 tracking-tighter">{p.price}</div>
              <p className="text-white/60 mb-12 h-12">{p.desc}</p>
              
              <ul className="w-full space-y-6 mb-16 text-left">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-4 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                       <Check size={14} className="text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-5 rounded-full font-bold text-lg transition-transform hover:scale-105 ${p.highlight ? "bg-white text-black" : "bg-white/10 text-white border border-white/20"}`}>
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}