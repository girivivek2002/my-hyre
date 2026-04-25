"use client";
import { motion } from "framer-motion";

export default function Trusted() {
  const logos = [
    { name: "Anthropic", style: "font-serif text-xl tracking-tight font-medium" },
    { name: "Vercel", style: "font-sans text-xl font-bold tracking-tighter" },
    { name: "LINEAR", style: "font-sans text-lg tracking-[0.25em] font-bold" },
    { name: "supabase", style: "font-sans text-xl lowercase font-semibold tracking-tight" },
    { name: "perplexity", style: "font-mono text-lg lowercase font-bold" },
    { name: "Raycast", style: "font-sans text-xl font-bold tracking-tight" },
    { name: "Cohere", style: "font-sans text-xl font-black tracking-tighter" },
    { name: "Glean", style: "font-sans text-xl font-bold" },
  ];

  const duplicated = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="relative pt-36 lg:pt-44 pb-20 overflow-hidden bg-[#FAFBFD]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.3em]">
          Trusted by innovative teams worldwide
        </p>
      </motion.div>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max">
          <motion.div
            className="flex gap-16 pr-16 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {duplicated.map((logo, i) => (
              <div key={i} className="opacity-25 hover:opacity-60 transition-opacity duration-500 cursor-pointer whitespace-nowrap group">
                <span className={`text-slate-600 ${logo.style} group-hover:text-indigo-600 transition-colors duration-500`}>
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}