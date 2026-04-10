"use client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Target, Zap, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: <Target className="text-blue-500" />, title: "Precision Matching", desc: "Our neural algorithms understand human potential, not just keywords." },
    { icon: <Zap className="text-amber-500" />, title: "Instant Velocity", desc: "Reduce time-to-hire by 60% with semantic sourcing automation." },
    { icon: <Shield className="text-emerald-500" />, title: "Trusted Intelligence", desc: "Data-driven decisions backed by high-fidelity talent metrics." },
    { icon: <Users className="text-purple-500" />, title: "Human Centric", desc: "The perfect bridge between recruiter intuition and AI efficiency." }
  ];

  return (
    <main className="bg-slate-50 dark:bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
            We are the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Talent Acquisition.</span>
          </h1>
          <p className="text-slate-600 dark:text-neutral-400 text-xl leading-relaxed">
            Mr. Hyre was founded on a simple premise: recruiting shouldn't be a numbers game. 
            It should be an intelligence game. We've built the world's most sophisticated 
            AI suite to ensure every match is not just a hire, but a legacy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center mb-6 border border-slate-100 dark:border-neutral-700 transition-colors group-hover:bg-blue-500/10">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{v.title}</h3>
              <p className="text-slate-500 dark:text-neutral-500 leading-relaxed text-sm">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
