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
    gradient: "from-indigo-500 to-violet-600",
    stars: 5,
  },
  {
    name: "Michael Ross",
    role: "VP Engineering, Vercel",
    text: "The architectural precision of the neural matching is terrifyingly accurate. Indispensable for scaling engineering teams fast.",
    avatar: "MR",
    gradient: "from-violet-500 to-fuchsia-600",
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

  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(139,92,246,0.05), transparent 70%)`;

  return (
    <section className="relative py-32 lg:py-44 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          onMouseMove={handleMouseMove}
          className="relative rounded-[48px] bg-white/[0.03] backdrop-blur-3xl border border-white/[0.06] p-12 md:p-16 lg:p-24 overflow-hidden group"
        >
          {/* Mouse spotlight */}
          <motion.div className="absolute inset-0 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: spotlight }} />
          {/* Decorative Quote */}
          <div className="absolute top-8 right-8 lg:top-12 lg:right-16 opacity-[0.04]">
            <Quote size={180} fill="white" />
          </div>
          {/* Top accent line */}
          <div className="absolute top-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />

          <div className="relative z-10">
            {/* Section Label */}
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-16 text-center"
            >
              What Our Customers Say
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} size={16} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-white/75 text-2xl md:text-3xl font-medium leading-[1.4] tracking-tight mb-10">
                    &ldquo;{r.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {r.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{r.name}</h4>
                      <p className="text-white/30 text-sm font-medium">{r.role}</p>
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