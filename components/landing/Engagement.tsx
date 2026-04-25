"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Building2, Briefcase } from "lucide-react";
import { useRef } from "react";

export default function Engagement() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const stats = [
    { label: "CANDIDATES", value: "2M+", icon: Users },
    { label: "COMPANIES", value: "500+", icon: Building2 },
    { label: "HIRES", value: "50k+", icon: Briefcase },
  ];

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-portfolio-light border-b border-slate-200">
      
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #E0E6ED 1px, transparent 1px), linear-gradient(to bottom, #E0E6ED 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      />

      <div className="w-full max-w-[1920px] mx-auto relative z-10 flex flex-col lg:flex-row">
        
        {/* Left Stats/Text Panel */}
        <div className="w-full lg:w-1/2 border-r border-slate-200 p-12 md:p-24 flex flex-col justify-center bg-portfolio-light/80 backdrop-blur-sm">
           
           <div className="inline-flex items-center gap-4 text-portfolio-blue text-[10px] font-bold tracking-[0.3em] uppercase mb-12">
              <span className="w-8 h-[1px] bg-portfolio-blue" />
              GLOBAL SCALE
           </div>
           
           <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="font-serif text-4xl md:text-5xl lg:text-6xl text-portfolio-navy leading-[1.1] mb-16 max-w-xl"
           >
             Connecting the World's Best Talent with Industry Leaders
           </motion.h2>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 border-t border-slate-200 pt-16">
             {stats.map((stat, i) => {
               const Icon = stat.icon;
               return (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 + 0.4 }}
                   className="flex flex-col gap-4"
                 >
                   <Icon size={24} strokeWidth={1} className="text-portfolio-red" />
                   <div className="font-serif text-4xl text-portfolio-navy">{stat.value}</div>
                   <div className="text-[10px] font-bold tracking-[0.2em] text-portfolio-navy/50">{stat.label}</div>
                 </motion.div>
               );
             })}
           </div>

        </div>

        {/* Right Image/Visual Panel */}
        <div className="w-full lg:w-1/2 relative h-[500px] lg:h-auto overflow-hidden bg-slate-100">
           {/* Technical grid overlay on image */}
           <div className="absolute inset-0 z-10 mix-blend-overlay opacity-30" 
                style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
           />
           
           {/* Center Crosshair Overlay */}
           <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-[1px] bg-white mix-blend-difference" />
              <div className="absolute w-[1px] h-12 bg-white mix-blend-difference" />
           </div>

           <motion.div style={{ y: yImage }} className="absolute -inset-10 z-0">
             <img 
               src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80" 
               alt="Modern Office Structure"
               className="w-full h-full object-cover grayscale opacity-80"
             />
           </motion.div>
        </div>

      </div>
    </section>
  );
}