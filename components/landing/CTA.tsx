"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, AtSign, Share2 } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[60px] bg-white/5 backdrop-blur-3xl border border-white/10 p-24 overflow-hidden flex flex-col items-center text-center shadow-2xl">
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl"
          >
            <h2 className="text-white text-sm font-bold uppercase tracking-[0.4em] mb-10">Start Your Journey</h2>
            <h3 className="text-7xl md:text-8xl font-black text-white leading-tight mb-12 tracking-tighter">
              Build your <br />
              <span className="text-white/40">dream team.</span>
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-24">
              <button className="px-12 py-6 bg-white text-black rounded-full text-xl font-black hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl">
                Get Started Now
                <ArrowRight size={24} />
              </button>
              <button className="px-10 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-lg font-bold hover:bg-white/20 transition-colors">
                Contact Sales
              </button>
            </div>
          </motion.div>

          {/* Footer Integration */}
          <div className="w-full pt-24 border-t border-white/10 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-white rounded-full" />
                <span className="text-white font-bold text-lg">Mr. Hyre</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                The neural workspace for high-fidelity talent discovery. Architectural precision in every hire.
              </p>
            </div>

            {[
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Product", links: ["Platform", "Security", "Pricing"] },
              { title: "Support", links: ["Help Center", "Privacy", "Terms"] }
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">{col.title}</h4>
                <div className="flex flex-col gap-4">
                  {col.links.map((l) => (
                    <Link key={l} href="#" className="text-white/40 hover:text-white transition-colors text-sm">{l}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full mt-24 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 border-t border-white/5 pt-12">
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">© 2026 Mr. Hyre. All Rights Reserved.</p>
            <div className="flex gap-6">
              {[Globe, AtSign, Share2].map((Icon, i) => (
                <Icon key={i} size={20} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}