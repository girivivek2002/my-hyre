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

  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.05), transparent 60%)`;

  return (
    <section className="relative py-24 lg:py-32 px-6 bg-[#FAFBFD] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          onMouseMove={handleMouseMove}
          className="relative rounded-[40px] bg-white border border-slate-100 p-10 md:p-16 lg:p-20 overflow-hidden flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] group"
        >
          {/* Mouse spotlight */}
          <motion.div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: spotlight }} />
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 via-transparent to-violet-50/30 pointer-events-none rounded-[40px]" />
          
          {/* Animated floating orbs */}
          <motion.div
            className="absolute top-[10%] left-[10%] w-[250px] h-[250px] bg-indigo-200/40 blur-[100px] rounded-full"
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[10%] w-[200px] h-[200px] bg-violet-200/40 blur-[80px] rounded-full"
            animate={{ scale: [1, 0.9, 1], x: [0, -15, 0], y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm"
            >
              <Sparkles size={10} />
              Start Your Journey
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight"
            >
              Build your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                dream team.
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-base max-w-lg mx-auto mb-10"
            >
              Join thousands of companies using Mr. Hyre&apos;s neural workspace to discover and hire extraordinary talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <Link
                href="/login"
                className="group px-10 py-4 bg-indigo-600 text-white rounded-full text-base font-bold hover:scale-105 hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2.5 shadow-[0_4px_14px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)]"
              >
                Get Started Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300">
                Contact Sales
              </button>
            </motion.div>
          </motion.div>

          {/* Footer Integration */}
          <div className="w-full pt-12 border-t border-slate-100 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />
                </div>
                <span className="text-slate-900 font-bold text-base tracking-tight">Mr. Hyre</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                The neural workspace for high-fidelity talent discovery. Architectural precision in every hire.
              </p>
            </div>

            {[
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Product", links: ["Platform", "Security", "Pricing"] },
              { title: "Support", links: ["Help Center", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-slate-900 font-bold uppercase text-[9px] tracking-[0.2em] mb-5">{col.title}</h4>
                <div className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <Link
                      key={l}
                      href="#"
                      className="text-slate-500 hover:text-indigo-600 transition-colors duration-300 text-xs font-medium"
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full mt-12 flex flex-col md:flex-row justify-between items-center gap-5 relative z-10 border-t border-slate-100 pt-8">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 Mr. Hyre. All Rights Reserved.</p>
            <div className="flex gap-4">
              {[Globe, AtSign, Share2].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 hover:border-slate-200 transition-all duration-300 cursor-pointer text-slate-400 hover:text-indigo-600">
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}