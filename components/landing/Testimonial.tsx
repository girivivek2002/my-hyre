"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Testimonial() {
  const reviews = [
    {
      name: "Sarah Chen",
      role: "Director of Talent, Anthropic",
      text: "EcoDream didn't just find us better candidates; it redefined how we understand technical talent structurally."
    },
    {
      name: "Michael Ross",
      role: "Head of Engineering, Vercel",
      text: "The architectural precision of the neural matching is terrifyingly accurate. Indispensable for scaling."
    }
  ];

  return (
    <section className="relative py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[60px] bg-white/5 backdrop-blur-3xl border border-white/10 p-24 overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Quote size={200} fill="white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-white/10" />
                  <div>
                    <h4 className="text-white font-bold text-xl">{r.name}</h4>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-widest">{r.role}</p>
                  </div>
                </div>
                <p className="text-white/80 text-3xl font-medium leading-[1.3] italic tracking-tight">
                  "{r.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}