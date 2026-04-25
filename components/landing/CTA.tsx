"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, AtSign, Share2, Sparkles } from "lucide-react";
import { MouseEvent } from "react";

export default function CTA() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.08), transparent 60%)`;

  return (
    <section className="relative py-32 lg:py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          onMouseMove={handleMouseMove}
          className="relative rounded-[48px] bg-white/[0.03] backdrop-blur-3xl border border-white/[0.06] p-12 md:p-16 lg:p-24 overflow-hidden flex flex-col items-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.4)] group"
        >
          {/* Mouse spotlight */}
          <motion.div className="absolute inset-0 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: spotlight }} />
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.08] via-transparent to-violet-500/[0.06] pointer-events-none rounded-[48px]" />
          {/* Top shimmer */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-[border-glow_4s_ease-in-out_infinite]" />

          {/* Animated floating orbs */}
          <motion.div
            className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full"
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] bg-violet-500/10 blur-[100px] rounded-full"
            animate={{ scale: [1, 0.9, 1], x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/10 border border-indigo-500/15 rounded-full text-indigo-400 text-[11px] font-bold uppercase tracking-widest mb-10"
            >
              <Sparkles size={12} />
              Start Your Journey
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tight"
            >
              Build your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 via-indigo-300/50 to-white/20 animate-[gradient-shift_6s_ease_infinite] bg-[length:200%_200%]">
                dream team.
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/30 text-lg max-w-xl mx-auto mb-14"
            >
              Join thousands of companies using Mr. Hyre&apos;s neural workspace to discover and hire extraordinary talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
            >
              <Link
                href="/login"
                className="group px-12 py-5 bg-white text-black rounded-full text-lg font-black hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.15)]"
              >
                Get Started Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-10 py-5 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-full text-white text-base font-bold hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300">
                Contact Sales
              </button>
            </motion.div>
          </motion.div>

          {/* Footer Integration */}
          <div className="w-full pt-16 border-t border-white/[0.06] relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-black rounded-sm" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Mr. Hyre</span>
              </div>
              <p className="text-white/25 text-sm leading-relaxed">
                The neural workspace for high-fidelity talent discovery. Architectural precision in every hire.
              </p>
            </div>

            {[
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Product", links: ["Platform", "Security", "Pricing"] },
              { title: "Support", links: ["Help Center", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white/50 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">{col.title}</h4>
                <div className="flex flex-col gap-4">
                  {col.links.map((l) => (
                    <Link
                      key={l}
                      href="#"
                      className="text-white/30 hover:text-white/70 transition-colors duration-300 text-sm"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full mt-16 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 border-t border-white/[0.04] pt-10">
            <p className="text-white/15 text-[11px] font-bold uppercase tracking-widest">© 2026 Mr. Hyre. All Rights Reserved.</p>
            <div className="flex gap-5">
              {[Globe, AtSign, Share2].map((Icon, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 cursor-pointer">
                  <Icon size={15} className="text-white/40 hover:text-white/70 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Final bottom padding */}
      <div className="h-8" />
    </section>
  );
}