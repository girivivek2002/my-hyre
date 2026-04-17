"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Clock, MapPin, 
  TrendingUp, CalendarDays, ArrowUpRight, Search, 
  CheckCircle2, Filter, DollarSign, Globe, Building2, Loader2
} from "lucide-react";

// --- Components ---

function GlassCard({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      className={`group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-slate-200 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      />
      <div className="absolute inset-0 bg-slate-50/80 dark:bg-neutral-950/80 -z-10" />
      <div className="relative z-10 w-full h-full p-6">
        {children}
      </div>
    </motion.div>
  );
}

export default function CandidateJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("Candidate");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
    
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/candidate/jobs", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  const filteredJobs = jobs.filter(j => 
    j.role.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 font-bold tracking-widest uppercase animate-pulse">
      Initialising Intelligence Roadmap...
    </div>
  );

  return (
    return (

        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar"
        >
          <div className="max-w-6xl mx-auto space-y-10">
            <motion.div variants={itemVars}>
               <h1 className="text-4xl font-extrabold tracking-tight mb-2">Shortlisted <span className="text-blue-500">Intelligence Nodes</span></h1>
               <p className="text-neutral-400 font-medium">Companies currently synchronization with your architecture profile.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredJobs.map((job, i) => (
                  <GlassCard key={job.id} delay={i * 0.1}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white shadow-xl">{job.logo}</div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{job.status}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{job.role}</h3>
                    <p className="text-sm text-neutral-400 mb-4">{job.company}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                       <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-500 font-bold">{job.location}</span>
                       <span className="px-2 py-1 rounded bg-blue-500/10 text-[10px] text-blue-500 font-bold">{job.salary}</span>
                    </div>
                    <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-colors">Inspect Roadmap</button>
                  </GlassCard>
                ))}
              </AnimatePresence>

              {filteredJobs.length === 0 && (
                <div className="col-span-full py-20 bg-white/5 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-neutral-500 font-bold uppercase tracking-widest">
                   No selections detected in stream.
                </div>
              )}
            </div>
          </div>
        </motion.div>
    );
}
