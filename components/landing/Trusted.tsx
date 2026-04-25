"use client";
import { motion } from "framer-motion";

export default function Trusted() {
  const logos = [
    { name: "Anthropic", style: "font-serif text-2xl tracking-tight font-medium" },
    { name: "Vercel", style: "font-sans text-2xl font-bold tracking-tighter" },
    { name: "LINEAR", style: "font-sans text-xl tracking-[0.25em] font-bold" },
    { name: "supabase", style: "font-sans text-2xl lowercase font-semibold tracking-tight text-emerald-400" },
    { name: "perplexity", style: "font-mono text-xl lowercase font-bold" },
    { name: "Raycast", style: "font-sans text-2xl font-bold tracking-tight" },
    { name: "Cohere", style: "font-sans text-2xl font-black tracking-tighter" },
    { name: "Glean", style: "font-sans text-2xl font-bold" },
  ];

  const duplicated = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="relative py-24 overflow-hidden bg-[#0A0A0F]">
      {/* Top / Bottom subtle dividers */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em]">
          Trusted By Innovative Teams Worldwide
        </p>
      </motion.div>

      {/* Scrolling Logos */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="flex w-max">
          <motion.div
            className="flex gap-24 pr-24 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {duplicated.map((logo, i) => (
              <div
                key={i}
                className="opacity-30 hover:opacity-80 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
              >
                <span className={`text-white ${logo.style}`}>{logo.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}