"use client";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { joinWaitlist } from "@/lib/actions";

export default function CTA() {
  const containerVars: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15, when: "beforeChildren" } 
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 250, damping: 22 } }
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
    <section className="relative py-20 md:py-32 px-6 md:px-12 lg:px-24 w-full overflow-hidden bg-[#0A0A0F]">
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative bg-gradient-to-br from-[#111118] via-[#0A0A0F] to-[#111118] border border-white/[0.04] rounded-[32px] p-16 md:p-24 lg:p-32 text-center max-w-7xl mx-auto shadow-premium-dark"
      >
        {/* Animated multi-color orbs */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/15 blur-[120px] rounded-full left-[30%] top-[20%] pointer-events-none animate-orb-drift" />
        <div className="absolute w-[350px] h-[350px] bg-violet-500/12 blur-[100px] rounded-full right-[25%] bottom-[15%] pointer-events-none animate-orb-drift-reverse" />
        <div className="absolute w-[200px] h-[200px] bg-fuchsia-500/8 blur-[80px] rounded-full left-[15%] bottom-[25%] pointer-events-none animate-orb-drift" />

        {/* Sparkle decoration */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 opacity-10 pointer-events-none"
        >
          <Sparkles size={120} />
        </motion.div>

        <motion.h2 
          variants={itemVars}
          className="relative text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 tracking-[-0.04em] text-white"
        >
          START HIRING <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">SMARTER</span>
        </motion.h2>

        <motion.p 
          variants={itemVars}
          className="relative text-slate-400 text-base sm:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join over 5,000+ companies who are building the future with
          Mr. Hyre&apos;s intelligent workspace. Drop the busywork and let AI do the matching.
        </motion.p>

        <motion.div variants={itemVars} className="relative max-w-xl mx-auto">
          <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3 p-2 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl relative">
            <input 
              type="email" 
              name="email"
              placeholder="Enter your work email" 
              required
              disabled={isPending}
              className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-slate-500 outline-none focus:ring-0 transition-all font-medium disabled:opacity-50"
            />
              <button
              disabled={isPending}
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
            >
              {isPending ? "Joining..." : "Get Early Access"}
              {!isPending && <ArrowRight size={20} />}
            </button>
          </form>

          {status.type && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {status.message}
            </motion.p>
          )}

          <p className="mt-4 text-slate-500 text-sm font-medium">
            Join 500+ recruiters already on the list. No spam, ever.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}