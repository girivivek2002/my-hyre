"use client";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { Target, Search, CalendarClock } from "lucide-react";

export default function Recruiter() {
  // Staggered variants for text elements
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  // 3D Parallax Tilt for the Image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  const handleTiltMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleTiltLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="py-24 lg:py-40 px-6 md:px-12 lg:px-24 relative overflow-hidden max-w-[1920px] mx-auto bg-[#0A0A0F] transition-colors duration-300">

      {/* Left Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] bg-blue-600/10 blur-[120px] lg:blur-[160px] rounded-full -left-40 top-20 pointer-events-none -z-10"
      ></motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 max-w-7xl mx-auto">

        {/* Left Image Card (3D Tilt) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -60 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative order-2 lg:order-1"
          style={{ perspective: 1200 }}
        >
          <motion.div
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
            className="group relative bg-[#111118] border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(59,130,246,0.2)]"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

            <img
              src="/recruiter.png"
              alt="Recruiter Dashboard"
              className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
            />
          </motion.div>
        </motion.div>

        {/* Right Text Content */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="order-1 lg:order-2"
        >
          {/* Tag */}
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
            Recruiter Suite
          </motion.div>

          {/* Heading */}
          <motion.h2 variants={itemVars} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-[1.1] tracking-tight text-white">
            Scale Your Team with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Precision</span>
          </motion.h2>

          {/* Bullet Points */}
          <div className="space-y-8 mb-12">
            
            <motion.div variants={itemVars} className="flex gap-4 sm:gap-5 items-start group">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <Target size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg sm:text-xl mb-1">AI Matching</h4>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed group-hover:text-neutral-300 transition-colors">
                  Neural network-driven ranking of candidates based precisely on your unique team culture requirements.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVars} className="flex gap-4 sm:gap-5 items-start group">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <Search size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg sm:text-xl mb-1">Candidate Search</h4>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed group-hover:text-neutral-300 transition-colors">
                  Semantic deep-search logic that scales instantly across massive hidden talent pools worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVars} className="flex gap-4 sm:gap-5 items-start group">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                <CalendarClock size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg sm:text-xl mb-1">Interview Scheduling</h4>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed group-hover:text-neutral-300 transition-colors">
                  Automated seamless calendar sync for high-speed hiring that drops the back-and-forth overhead natively.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Button */}
          <motion.div variants={itemVars}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-10 py-4 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
            >
              Post a Job
            </motion.button>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}