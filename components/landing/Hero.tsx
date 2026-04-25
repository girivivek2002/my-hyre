"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative w-full h-[100vh] sm:h-[95vh] overflow-hidden bg-portfolio-navy flex flex-col justify-center">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-portfolio-blue/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Side Rails */}
      {/* Left Rail */}
      <div className="hidden lg:flex absolute left-12 top-0 bottom-0 flex-col justify-center items-center pointer-events-none z-20">
        <div className="h-1/3 w-[1px] bg-white/10" />
        <div className="py-8 flex flex-col items-center gap-4 text-white">
          <span className="text-xs font-bold tracking-[0.2em] -rotate-90 origin-center whitespace-nowrap mb-6 text-white/50">INTRODUCTION</span>
          <span className="text-xs font-bold tracking-widest text-portfolio-gold">01</span>
        </div>
        <div className="h-1/3 w-[1px] bg-white/10" />
      </div>

      {/* Right Rail */}
      <div className="hidden lg:flex absolute right-12 top-0 bottom-0 flex-col justify-center items-center pointer-events-none z-20">
        <div className="h-1/3 w-[1px] bg-white/10" />
        <div className="py-8 flex flex-col items-center gap-6">
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
           <motion.div 
             animate={{ rotate: 360 }} 
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="w-10 h-10 rounded-full border border-white/20 border-t-portfolio-accent flex items-center justify-center"
           >
             <div className="w-1.5 h-1.5 rounded-full bg-portfolio-accent" />
           </motion.div>
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        <div className="h-1/3 w-[1px] bg-white/10" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-24 flex flex-col items-center justify-center relative z-10">
        
        {/* Central 3D Element Placeholder / Gradient Orb */}
        <motion.div 
          style={{ y: yBg }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
        >
          {/* Abstract 3D Torus Illusion */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border-[40px] border-transparent"
            style={{
              background: "linear-gradient(#0A1A2F, #0A1A2F) padding-box, linear-gradient(135deg, #FF8A00, #FF007A, #8000FF) border-box"
            }}
          >
             <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(255,0,122,0.5)]" />
          </motion.div>
          {/* Inner glowing sphere */}
          <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-portfolio-accent/30 rounded-full blur-[40px]"
          />
        </motion.div>

        {/* Typography Overlap */}
        <motion.div style={{ opacity: opacityText }} className="text-center mt-20 md:mt-32 w-full flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[60px] sm:text-[100px] md:text-[130px] lg:text-[180px] font-medium text-white leading-[0.85] tracking-tight mix-blend-difference"
          >
            MR<span className="italic font-light">.</span><br/>HYRE
          </motion.h1>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
             className="mt-12 flex flex-col md:flex-row items-center gap-8 md:gap-24 uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold text-white/70"
          >
             <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-portfolio-red" />
                NEURAL MATCHING
             </div>
             <div className="flex items-center gap-4">
                INTELLIGENT PIPELINES
                <span className="w-8 h-[1px] bg-portfolio-red" />
             </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/50"
      >
        <span className="text-[10px] tracking-[0.2em] font-bold">SCROLL TO DISCOVER</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="p-2 border border-white/20 rounded-full">
           <ArrowDownRight size={16} />
        </motion.div>
      </motion.div>

    </section>
  );
}