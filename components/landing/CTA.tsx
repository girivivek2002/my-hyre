"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    setStatus({ type: null, message: "" });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus({ type: "success", message: "Priority access granted. Welcome to the future." });
      setEmail("");
    } catch (error) {
      setStatus({ type: "error", message: "Transmission failed. Please try again." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-portfolio-navy py-32 md:py-48">
      
      {/* Blueprint Grid Background - Dark Mode */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      />

      <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-4 text-portfolio-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-12">
           <span className="w-8 h-[1px] bg-portfolio-gold" />
           JOIN THE WAITLIST
           <span className="w-8 h-[1px] bg-portfolio-gold" />
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-12"
        >
          START HIRING<br/>
          <span className="italic text-portfolio-accent">SMARTER</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16"
        >
          Join thousands of technical recruiters executing high-fidelity placements with zero friction.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit} 
          className="w-full max-w-xl mx-auto flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
              className="flex-1 bg-transparent border-b border-white/20 px-4 py-4 text-white placeholder:text-white/30 outline-none focus:border-portfolio-accent transition-all font-medium disabled:opacity-50 text-center sm:text-left"
            />
            <button
              disabled={isPending}
              className="px-8 py-4 bg-white text-portfolio-navy text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-portfolio-accent hover:text-white transition-all flex items-center justify-center gap-4 whitespace-nowrap disabled:opacity-70"
            >
              {isPending ? "JOINING..." : "GET ACCESS"}
              {!isPending && <ArrowRight size={16} />}
            </button>
          </div>

          {status.type && (
            <div className={`mt-4 text-sm font-bold tracking-wider ${status.type === "success" ? "text-portfolio-accent" : "text-portfolio-red"}`}>
              {status.message}
            </div>
          )}
        </motion.form>

      </div>
    </section>
  );
}