"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, FileSearch, LayoutDashboard, MessageSquareLock, CalendarRange, TrendingUp, ArrowRight } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    title: "AI MATCHING PARITY",
    desc: "Connect candidates with perfect opportunities using our proprietary neural matching architecture. Scales instantly across massive talent datasets.",
    Icon: Sparkles,
  },
  {
    title: "RESUME PARSING",
    desc: "Extract skills, deep experience vectors, and educational formatting automatically from complex PDFs with extreme fidelity.",
    Icon: FileSearch,
  },
  {
    title: "RECRUITER HUB",
    desc: "Manage high-volume reqs, track candidates, and orchestrate complex hiring workflows from one unified central dashboard.",
    Icon: LayoutDashboard,
  },
  {
    title: "ENCRYPTED CHANNELS",
    desc: "Communicate directly with candidates and internal recruiters through secured, low-latency messaging bridges.",
    Icon: MessageSquareLock,
  },
  {
    title: "AUTO-SCHEDULING",
    desc: "Deploy native calendar sync to drop back-and-forth overhead and schedule high-velocity interviews instantly.",
    Icon: CalendarRange,
  },
  {
    title: "PIPELINE ANALYTICS",
    desc: "Visualize structural hiring performance, pipeline health, and core recruitment metrics in real-time generative layouts.",
    Icon: TrendingUp,
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const { Icon, title, desc } = feature;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 } },
      }}
      className="group relative flex w-full flex-col items-start border-b border-r border-slate-200 p-10 hover:bg-white transition-colors duration-500"
    >
      {/* Decorative Blueprint Hatching */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #2B4CD3 0, #2B4CD3 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
      />

      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="flex justify-between items-start mb-16 w-full">
          <div className="text-portfolio-navy group-hover:text-portfolio-accent transition-colors duration-300">
            <Icon strokeWidth={1} size={36} />
          </div>
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-portfolio-accent group-hover:text-portfolio-accent transition-all duration-300 -rotate-45 group-hover:rotate-0">
            <ArrowRight size={14} />
          </div>
        </div>

        <h3 className="font-sans text-[11px] tracking-[0.2em] font-bold mb-4 text-portfolio-blue group-hover:text-portfolio-navy transition-colors duration-300">
          {title}
        </h3>
        <p className="text-portfolio-navy/60 text-sm leading-relaxed font-medium mt-auto">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-portfolio-light">
      
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #E0E6ED 1px, transparent 1px), linear-gradient(to bottom, #E0E6ED 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      />

      <div className="w-full max-w-[1920px] mx-auto relative z-10 flex flex-col lg:flex-row border-b border-slate-200">
        
        {/* Left Intro Panel */}
        <div className="w-full lg:w-1/3 border-r border-slate-200 p-12 md:p-24 flex flex-col relative bg-portfolio-light">
           
           {/* Animated Arc */}
           <svg className="absolute top-0 right-0 w-[200px] h-[200px] pointer-events-none" viewBox="0 0 200 200" fill="none">
              <motion.path 
                 d="M200 0 C 89.543 0 0 89.543 0 200" 
                 stroke="#E53935" 
                 strokeWidth="1" 
                 style={{ pathLength }} 
              />
           </svg>

           <div className="inline-flex items-center gap-4 text-portfolio-red text-[10px] font-bold tracking-[0.3em] uppercase mb-16">
              <span className="w-8 h-[1px] bg-portfolio-red" />
              CORE CAPABILITIES
           </div>
           
           <h2 className="font-serif text-5xl md:text-6xl text-portfolio-navy leading-[1.1] mb-8">
             Intelligent<br/>Workspace
           </h2>
           
           <p className="text-portfolio-navy/60 text-base leading-relaxed max-w-sm">
             Everything you need to streamline the structural hiring lifecycle, powered completely by our native AI engines and high-fidelity parsing architecture.
           </p>

           <div className="mt-auto pt-24">
             <div className="w-16 h-16 border border-slate-200 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold tracking-widest text-portfolio-blue">02</span>
             </div>
           </div>
        </div>

        {/* Right Grid Panel */}
        <div className="w-full lg:w-2/3">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full h-full"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}