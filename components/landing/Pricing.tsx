"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { MouseEvent } from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    desc: "For small projects and solo talent",
    features: ["1 active job post", "Basic AI Matching", "Basic Analytics"],
    button: "Start Free",
  },
  {
    name: "Basic",
    price: "₹1,999",
    desc: "For rapidly growing teams",
    features: ["5 active job posts", "Advanced AI Matching", "Candidate Export"],
    button: "Select Plan",
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
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
      }}
      onMouseMove={handleMouseMove}
      className={`group relative flex w-full flex-col p-8 sm:p-10 rounded-3xl border transition-all duration-500 overflow-hidden ${
        isHighlighted
          ? "border-blue-500/50 bg-slate-900 dark:bg-neutral-900 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          : "border-slate-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 hover:border-transparent shadow-sm dark:shadow-none"
      }`}
    >
      {/* Background Radial Follow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {/* Magnetic Outer Glow Border for Non-Highlighted Cards */}
      {!isHighlighted && (
        <motion.div
          className="pointer-events-none absolute -inset-[2px] rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                rgba(59, 130, 246, 0.6),
                transparent 50%
              )
            `,
          }}
        />
      )}
      
      {/* Extra internal boundary block to hide the external glowing bleed on non-highlight cards */}
      {!isHighlighted && <div className="absolute inset-0 rounded-3xl bg-white/90 dark:bg-neutral-950/90 -z-10 backdrop-blur-3xl" />}

      {/* Highlight Badge */}
      {isHighlighted && (
        <div className="absolute -top-1 right-8 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-b-xl shadow-lg border border-t-0 border-blue-400/50 tracking-widest z-20">
          BEST VALUE
        </div>
      )}

      {/* Card Body */}
      <div className="relative z-10 flex flex-col h-full">
        <h3 className={`text-xl sm:text-2xl font-bold mb-2 transition-colors ${isHighlighted ? "text-white" : "text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white"}`}>{plan.name}</h3>
        <p className="text-slate-500 dark:text-neutral-500 text-sm mb-8">{plan.desc}</p>
        <div className="text-4xl sm:text-5xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-neutral-400">
          {plan.price}
          <span className="text-slate-400 dark:text-neutral-600 text-base font-medium tracking-normal"> /mo</span>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
          {plan.features.map((f: string, i: number) => (
            <li key={i} className={`flex items-start gap-3 ${isHighlighted ? "text-slate-300 dark:text-neutral-300" : "text-slate-600 dark:text-neutral-400 group-hover:text-slate-800 dark:group-hover:text-neutral-300"} transition-colors text-sm sm:text-base`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isHighlighted ? "text-blue-400" : "text-slate-400 dark:text-neutral-600 group-hover:text-blue-500"}`} /> 
              {f}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-xl font-bold relative overflow-hidden transition-all duration-300 ${
            isHighlighted
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
              : "bg-slate-900 dark:bg-neutral-900 border border-slate-700 dark:border-neutral-700 text-white hover:bg-slate-800 dark:hover:bg-neutral-800 hover:border-slate-500 dark:hover:border-neutral-500"
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
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-20 relative bg-white dark:bg-black overflow-hidden max-w-[1920px] mx-auto z-0 transition-colors duration-300">

      {/* Background Animated Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] bg-blue-500/10 blur-[120px] lg:blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-0 pointer-events-none -z-10"
      ></motion.div>

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 lg:mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          Pricing
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
          Simple, Transparent Plans
        </h2>
        <p className="text-slate-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto transition-colors">
          Scale effortlessly. Pay only for the power you need to transform your entire recruitment pipeline.
        </p>
      </motion.div>

      {/* Grid Flow */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
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