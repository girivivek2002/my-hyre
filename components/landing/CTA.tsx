"use client";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { joinWaitlist } from "@/lib/actions";

export default function CTA() {
  const containerVars: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2,
        when: "beforeChildren"
      } 
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus({ type: null, message: "" });
    
    const result = await joinWaitlist(formData);
    
    setIsPending(false);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else {
      setStatus({ type: 'success', message: result.success || result.message || "Welcome aboard!" });
    }
  }

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1920px] mx-auto">
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black dark:from-neutral-900 dark:via-black dark:to-neutral-950 border border-slate-700 dark:border-neutral-800/80 rounded-[2rem] p-8 md:p-16 lg:p-24 text-center overflow-hidden shadow-2xl"
      >
        {/* Animated Background Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/20 blur-[100px] sm:blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none"
        ></motion.div>

        {/* Dynamic Border Shine */}
        <div className="absolute inset-0 rounded-[2rem] pointer-events-none before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-blue-500/30 before:via-transparent before:to-purple-500/30 before:rounded-[2rem] before:-z-10 before:mask-composite-exclude"></div>

        <motion.h2 
          variants={itemVars}
          className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 dark:from-white dark:to-neutral-400"
        >
          Start Hiring Smarter <span className="text-blue-400 dark:text-blue-500 transition-colors">Today</span>
        </motion.h2>

        <motion.p 
          variants={itemVars}
          className="relative text-slate-300 dark:text-neutral-400 text-base sm:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed transition-colors"
        >
          Join over 5,000+ companies who are building the future with
          Mr. Hyre's intelligent workspace. Drop the busywork and let AI do the matching.
        </motion.p>

        <motion.div variants={itemVars} className="relative max-w-xl mx-auto">
          <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3 p-2 bg-white/5 dark:bg-neutral-900/50 backdrop-blur-xl border border-white/10 dark:border-neutral-800 rounded-2xl shadow-2xl relative">
            <input 
              type="email" 
              name="email"
              placeholder="Enter your work email" 
              required
              disabled={isPending}
              className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-slate-500 outline-none focus:ring-0 transition-all font-medium disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
            >
              {isPending ? "Joining..." : "Get Early Access"}
              {!isPending && <ArrowRight size={20} />}
            </motion.button>
          </form>

          {status.type && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 font-medium ${status.type === 'success' ? 'text-green-400' : 'text-rose-400'}`}
            >
              {status.message}
            </motion.p>
          )}

          <p className="mt-4 text-slate-500 dark:text-neutral-500 text-sm font-medium">
            Join 500+ recruiters already on the list. No spam, ever.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}