"use client";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Neural Matching",
      desc: "Our proprietary AI doesn't just scan keywords; it understands talent intent.",
      icon: Sparkles,
      color: "bg-indigo-500",
      className: "lg:col-span-2 lg:row-span-2"
    },
    {
      title: "Hyper-Speed",
      desc: "Parse thousands of resumes in seconds with sub-millisecond latency.",
      icon: Zap,
      color: "bg-amber-500",
      className: "lg:col-span-1 lg:row-span-1"
    },
    {
      title: "Enterprise Security",
      desc: "Bank-grade encryption for all candidate and company data flows.",
      icon: Shield,
      color: "bg-rose-500",
      className: "lg:col-span-1 lg:row-span-1"
    }
  ];

  return (
    <section className="relative py-40 px-6 bg-[#0A0A0F] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.02] blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-white text-sm font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-white/20" />
              Core Capabilities
            </h2>
            <h3 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              A workspace designed <br />
              <span className="text-white/30">for the future.</span>
            </h3>
          </div>
          <p className="text-white/40 text-lg max-w-sm mb-2">
            Scaling your team with architectural precision through our neural-driven workspace.
          </p>
        </div>

        {/* Feature Grid with Overlapping Asymmetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i }}
                className={`group relative overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 hover:bg-white/10 transition-all ${f.className}`}
              >
                {/* Accent Glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 ${f.color} opacity-10 blur-[60px] group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-16 h-16 rounded-2xl ${f.color}/20 flex items-center justify-center text-white mb-10`}>
                    <Icon size={32} />
                  </div>
                  
                  <h4 className="text-3xl font-bold text-white mb-6">{f.title}</h4>
                  <p className="text-white/40 text-lg leading-relaxed">{f.desc}</p>
                  
                  <div className="mt-auto pt-10">
                    <button className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest group/btn">
                      Explore
                      <div className="w-8 h-[1px] bg-white/40 group-hover/btn:w-12 transition-all" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}