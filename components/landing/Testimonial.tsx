"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { MouseEvent } from "react";

const reviews = [
  {
    name: "Sarah Chen",
    role: "Director of Talent, Anthropic",
    text: "Mr. Hyre didn't just find us better candidates — it redefined how we understand technical talent structurally. Game changer.",
    avatar: "SC",
    gradient: "from-indigo-100 to-violet-100",
    textCol: "text-indigo-600",
    stars: 5,
  },
  {
    name: "Michael Ross",
    role: "VP Engineering, Vercel",
    text: "The architectural precision of the neural matching is terrifyingly accurate. Indispensable for scaling engineering teams fast.",
    avatar: "MR",
    gradient: "from-violet-100 to-fuchsia-100",
    textCol: "text-violet-600",
    stars: 5,
  },
];

export default function Testimonial() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.03), transparent 70%)`;

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 px-6 bg-[#FAFBFD] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          onMouseMove={handleMouseMove}
          className="relative rounded-[40px] bg-white border border-slate-100 p-10 md:p-14 lg:p-20 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] group"
        >
          {/* Mouse spotlight */}
          <motion.div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: spotlight }} />
          {/* Decorative Quote */}
          <div className="absolute top-6 right-8 lg:top-10 lg:right-12 opacity-[0.03]">
            <Quote size={140} fill="#0f172a" />
          </div>

          <div className="relative z-10">
            {/* Section Label */}
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-indigo-600 text-xs font-semibold uppercase tracking-[0.2em] mb-12 text-center"
            >
              What Our Customers Say
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} size={14} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-slate-700 text-xl md:text-2xl font-medium leading-[1.5] tracking-tight mb-8">
                    &ldquo;{r.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center ${r.textCol} font-bold text-sm shadow-sm`}>
                      {r.avatar}
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold text-base">{r.name}</h4>
                      <p className="text-slate-500 text-xs font-medium">{r.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}