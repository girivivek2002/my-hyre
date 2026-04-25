"use client";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const pricingPlans = [
  {
    name: "STARTER",
    price: "$0",
    period: "Forever",
    desc: "For small teams starting their AI hiring journey.",
    features: ["1 Active Job Post", "Basic AI Candidate Matching", "Email Support", "Standard Pipeline"],
    notIncluded: ["Custom Branding", "API Access", "Dedicated Success Manager"],
    buttonStyle: "border-portfolio-navy text-portfolio-navy hover:bg-portfolio-navy hover:text-white"
  },
  {
    name: "PRO",
    price: "$299",
    period: "per month",
    desc: "For growing companies scaling their recruitment.",
    features: ["10 Active Job Posts", "Advanced Neural Matching", "Priority 24/7 Support", "Automated Scheduling", "Custom Branding"],
    notIncluded: ["API Access", "Dedicated Success Manager"],
    isPopular: true,
    buttonStyle: "bg-portfolio-accent text-white border-portfolio-accent hover:bg-portfolio-accent/90"
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "annually",
    desc: "For large organizations with complex structural needs.",
    features: ["Unlimited Job Posts", "Full AI Suite Access", "Dedicated Success Manager", "Custom API Integrations", "Advanced Analytics", "White-label Platform"],
    notIncluded: [],
    buttonStyle: "bg-portfolio-navy text-white border-portfolio-navy hover:bg-portfolio-navy/90"
  }
];

function PricingCard({ plan, index }: { plan: typeof pricingPlans[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative flex flex-col p-10 lg:p-14 bg-portfolio-light border-r border-b lg:border-b-0 border-slate-200 transition-colors hover:bg-white`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-10 bg-portfolio-accent text-white text-[10px] font-bold tracking-[0.2em] px-4 py-2 uppercase transform -translate-y-1/2">
          Recommended
        </div>
      )}

      <div className="mb-10">
        <h3 className="font-sans text-[11px] font-bold tracking-[0.3em] text-portfolio-blue mb-6">{plan.name}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-5xl md:text-6xl text-portfolio-navy">{plan.price}</span>
          {plan.period && <span className="text-xs font-bold tracking-widest text-portfolio-navy/50 uppercase">{plan.period}</span>}
        </div>
        <p className="text-sm font-medium text-portfolio-navy/60 leading-relaxed">{plan.desc}</p>
      </div>

      <div className="flex-1">
        <ul className="space-y-5 mb-10">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-4">
              <Check size={16} strokeWidth={2} className="text-portfolio-red shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-portfolio-navy">{feature}</span>
            </li>
          ))}
          {plan.notIncluded.map((feature, i) => (
            <li key={i} className="flex items-start gap-4 opacity-50">
              <X size={16} strokeWidth={2} className="text-portfolio-navy shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-portfolio-navy line-through">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className={`w-full py-4 border text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${plan.buttonStyle}`}>
        Select Plan
      </button>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section className="relative w-full overflow-hidden bg-portfolio-light border-b border-slate-200">
      
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #E0E6ED 1px, transparent 1px), linear-gradient(to bottom, #E0E6ED 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      />

      <div className="w-full max-w-[1920px] mx-auto relative z-10">
        
        {/* Header Area */}
        <div className="w-full flex flex-col items-center text-center py-24 md:py-32 px-6 border-b border-slate-200 bg-portfolio-light/80 backdrop-blur-sm">
           <div className="inline-flex items-center gap-4 text-portfolio-red text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              <span className="w-8 h-[1px] bg-portfolio-red" />
              TRANSPARENT PRICING
              <span className="w-8 h-[1px] bg-portfolio-red" />
           </div>
           
           <h2 className="font-serif text-5xl md:text-6xl text-portfolio-navy leading-[1.1] mb-6">
             Invest in <span className="italic text-portfolio-accent">Talent</span>
           </h2>
           <p className="text-portfolio-navy/60 text-base max-w-xl">
             Simple, predictable pricing structured for high-growth technical organizations.
           </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}