"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Engagement() {
  const items = [
    { 
      title: "Define Ideal Node", 
      desc: "Input your target persona using semantic NLP. We translate intent into pure parity matching.",
      type: "recruiter"
    },
    { 
      title: "Deep Synchronization", 
      desc: "Our neural algorithms scan unstructured global data to index passive and active talent simultaneously.",
      type: "recruiter"
    },
    { 
      title: "Smart Shortlisting", 
      desc: "Instantly deploy curated, scored lists of verified candidates directly into your workflow.",
      type: "recruiter"
    },
    { 
      title: "Automated Profiling", 
      desc: "Connect your history and let the AI instantly map your skills to the perfect hiring nodes.",
      type: "candidate"
    },
    { 
      title: "Direct Ingress", 
      desc: "Bypass traditional noise and get routed directly to active high-end hiring managers.",
      type: "candidate"
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 px-6 md:px-12 lg:px-24 w-full overflow-hidden bg-[#0A0A0F]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Sticky Header Column */}
        <div className="w-full lg:w-1/3 flex flex-col justify-start">
           <div className="sticky top-40">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 px-4 py-2 rounded-full text-xs font-bold mb-6 tracking-widest uppercase backdrop-blur-md">
                Dual Operations
              </div>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-[-0.04em] leading-[1.05] mb-6">
                Unified <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-500">
                   Experience
                </span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                A frictionless architecture designed simultaneously for elite talent and enterprise recruiters. One engine, two flawless experiences.
              </p>
           </div>
        </div>

        {/* Scrolling Cards Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
           {items.map((item, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
               className="group relative bg-white/5 dark:bg-[#111118]/60 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.04] p-8 lg:p-10 rounded-[32px] hover:bg-white/10 dark:hover:bg-[#111118]/80 hover:border-indigo-500/30 transition-all duration-500 shadow-premium"
             >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                   <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="text-2xl font-black text-indigo-500/30 group-hover:text-indigo-500 transition-colors duration-500">
                           0{index + 1}
                         </div>
                         <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-slate-400 text-base leading-relaxed pl-10">
                         {item.desc}
                      </p>
                   </div>
                   <div className="w-12 h-12 shrink-0 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 mt-2 sm:mt-0">
                      <ArrowUpRight size={20} />
                   </div>
                </div>
                
                {/* Accent Tag */}
                <div className="absolute bottom-6 right-8">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${item.type === 'recruiter' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-violet-500/10 text-violet-500'}`}>
                      {item.type}
                   </span>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}