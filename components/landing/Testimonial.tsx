"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    quote: "The neural matching algorithm dropped our time-to-hire by 60%. It feels less like a platform and more like having an extra team of genius recruiters.",
    author: "Sarah Chen",
    role: "VP of Talent, Anthropic",
  },
  {
    quote: "Finally, a platform that understands structural hiring. The parsing engine mapped our exact candidate requirements with terrifying accuracy.",
    author: "Michael Ross",
    role: "Head of Engineering, Vercel",
  },
  {
    quote: "Mr. Hyre didn't just streamline our pipeline—it completely rewrote how we evaluate technical vectors. Absolutely indispensable.",
    author: "Elena Rodriguez",
    role: "Director of People, Linear",
  }
];

export default function Testimonial() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-portfolio-light border-b border-slate-200 py-32 md:py-48">
      
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #E0E6ED 1px, transparent 1px), linear-gradient(to bottom, #E0E6ED 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      />

      {/* Massive Background Typography */}
      <motion.div style={{ x: xLeft }} className="absolute top-10 left-0 whitespace-nowrap pointer-events-none opacity-5">
         <span className="font-serif text-[200px] leading-none text-portfolio-navy">EXCEPTIONAL TALENT</span>
      </motion.div>
      <motion.div style={{ x: xRight }} className="absolute bottom-10 right-0 whitespace-nowrap pointer-events-none opacity-5">
         <span className="font-serif text-[200px] leading-none text-portfolio-navy">EXCEPTIONAL OUTCOMES</span>
      </motion.div>

      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-24 relative z-10 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-4 text-portfolio-red text-[10px] font-bold tracking-[0.3em] uppercase mb-20">
           <span className="w-8 h-[1px] bg-portfolio-red" />
           INDUSTRY VALIDATION
           <span className="w-8 h-[1px] bg-portfolio-red" />
        </div>

        {/* Carousel / List */}
        <div className="w-full max-w-5xl flex flex-col gap-24 lg:gap-32">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col md:flex-row gap-8 md:gap-16 items-start"
            >
              <Quote className="text-portfolio-gold shrink-0 rotate-180 opacity-50" size={64} strokeWidth={1} />
              
              <div>
                <p className="font-serif text-3xl md:text-5xl text-portfolio-navy leading-[1.2] mb-8">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-6">
                   <div className="w-12 h-[1px] bg-portfolio-navy/20" />
                   <div>
                     <h4 className="font-sans text-[11px] font-bold tracking-[0.2em] text-portfolio-blue uppercase mb-1">{t.author}</h4>
                     <p className="font-sans text-xs font-medium text-portfolio-navy/50">{t.role}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}