"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Clock, MapPin, 
  TrendingUp, CalendarDays, ArrowUpRight, Search, 
  CheckCircle2, Video, User, FileText, ExternalLink,
  ChevronRight, Calendar
} from "lucide-react";

// ─── Glass Card ───────────────────────────────────────────────────────────────
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
      className={`group relative bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-3xl overflow-hidden shadow-premium dark:shadow-premium-dark ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.08), transparent 80%)`,
        }}
      />
      <div className="absolute inset-0 bg-white/80 dark:bg-[#0A0A0F]/80 -z-10" />
      <div className="relative z-10 w-full h-full p-6">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Interview Data ────────────────────────────────────────────────────────────
export default function InterviewsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: any = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/candidate/interviews", { headers });
      if (res.ok) {
        const data = await res.json();
        setInterviews(data.interviews);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch Interviews Error:", err);
      setIsLoading(false);
    }
  };

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-32 custom-scrollbar"
    >
          <div className="max-w-6xl mx-auto">

            {/* Hero Section */}
            <motion.div variants={itemVars} className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <CheckCircle2 size={10} fill="currentColor" /> Preparation Optimized
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Your Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">Roadmap</span>
              </h1>
              <p className="text-slate-500 dark:text-neutral-400 font-medium">
                We've synthesized preparation notes and interviewer architecture to give you a 92% statistical advantage.
              </p>
            </motion.div>

            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-4">
                     <Sparkles size={32} className="text-violet-500" />
                  </motion.div>
                  <p className="text-xs font-bold uppercase tracking-widest">Synchronizing Roadmap...</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Timeline List */}
                <div className="lg:col-span-2 space-y-8 relative">
                  {interviews.length > 0 && (
                    <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-slate-200 dark:bg-neutral-800/60 -z-10" />
                  )}

                  {interviews.length > 0 ? interviews.map((interview, i) => (
                    <motion.div key={interview.id} variants={itemVars} className="flex gap-8 group">
                      {/* Circle Indicator */}
                      <div className="relative shrink-0">
                         <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-[#111118] border-2 ${interview.status === 'SCHEDULED' ? 'border-violet-500 shadow-glow-violet' : 'border-slate-200 dark:border-white/[0.06]'} flex items-center justify-center font-bold text-violet-500 group-hover:scale-110 transition-transform duration-500 z-10 relative`}>
                            {interview.company[0]}
                         </div>
                      </div>

                      <div className="flex-1">
                         <GlassCard className="!p-0 overflow-visible">
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-6">
                                 <div>
                                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-1">{interview.date} • {interview.time}</p>
                                    <h3 className="text-xl font-bold">{interview.company}</h3>
                                    <p className="text-sm font-semibold text-slate-500 dark:text-neutral-500">{interview.role}</p>
                                 </div>
                                 <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${interview.status === 'SCHEDULED' ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-slate-600 border border-transparent'}`}>
                                    {interview.status}
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                 <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/50">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                       {interview.platform.toLowerCase().includes('person') ? <MapPin size={18} /> : <Video size={18} />}
                                    </div>
                                    <div>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Location</p>
                                       <p className="text-xs font-bold">{interview.platform}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/50">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                       <User size={18} />
                                    </div>
                                    <div>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Interviewer</p>
                                       <p className="text-xs font-bold">{interview.interviewer}</p>
                                    </div>
                                 </div>
                              </div>

                              {interview.prep && interview.prep.length > 0 && (
                                <div className="border-t border-slate-100 dark:border-neutral-800/50 pt-6">
                                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
                                      <Sparkles size={14} className="text-violet-500" /> Pre-Interview Intelligence
                                  </h4>
                                  <ul className="space-y-3">
                                      {interview.prep.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-neutral-400 leading-relaxed group/item">
                                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500/40 group-hover/item:bg-violet-500 transition-colors" />
                                          {item}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="p-4 bg-slate-50/50 dark:bg-neutral-950/20 border-t border-slate-100 dark:border-neutral-800/50 flex justify-between items-center rounded-b-3xl">
                               <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors">
                                  <FileText size={14} /> View Case Study
                               </button>
                               <button className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                  Prepare for Session <ChevronRight size={14} />
                                </button>
                            </div>
                         </GlassCard>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                       <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-slate-400 mb-6">
                          <Calendar size={32} />
                       </div>
                       <h3 className="text-lg font-bold mb-2">No interviews scheduled yet</h3>
                       <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-xs">Once a recruiter shortlists you for a role, your interview roadmap will appear here.</p>
                       <button onClick={() => router.push("/candidate/jobs")} className="mt-8 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl text-xs font-bold shadow-glow-violet hover:scale-105 transition-all">Explore Opportunities</button>
                    </div>
                  )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                  
                  {/* Preparation Hero */}
                  <motion.div variants={itemVars}>
                     <div className="bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-600 p-8 rounded-[40px] border border-violet-500/20 shadow-glow-violet relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                           <BarChart3 size={150} />
                        </div>
                        <div className="relative z-10 text-white">
                           <h2 className="text-xl font-bold mb-4">Prep Confidence</h2>
                           <div className="flex items-end gap-3 mb-6">
                              <span className="text-5xl font-extrabold">92%</span>
                              <span className="text-xs font-bold text-blue-200 pb-2">+12% vs last week</span>
                           </div>
                           <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center text-[10px] font-bold text-blue-100 uppercase tracking-widest">
                                 <span>Design Systems</span>
                                 <span>98%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 1.5 }} className="h-full bg-white shadow-[0_0_15px_white]" />
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-blue-100 uppercase tracking-widest">
                                 <span>Product Rationale</span>
                                 <span>84%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-white/60 shadow-[0_0_10px_white/30]" />
                              </div>
                           </div>
                           <button className="w-full py-3 bg-white text-blue-600 rounded-2xl text-[10px] font-extrabold shadow-xl hover:bg-blue-50 transition-colors uppercase tracking-widest">
                              Run AI Mock Interview
                           </button>
                        </div>
                     </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div variants={itemVars}>
                     <GlassCard>
                        <h4 className="text-sm font-bold mb-5">Quick Architecture</h4>
                        <div className="space-y-3">
                           {[
                             { label: "Request Reschedule", icon: <Clock size={14} />, color: "slate" },
                             { label: "Update Portfolio", icon: <ArrowUpRight size={14} />, color: "blue" },
                             { label: "Contact Coordinator", icon: <User size={14} />, color: "slate" },
                             { label: "Withdraw Application", icon: <Zap size={14} />, color: "red" },
                           ].map((action, idx) => (
                             <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-900 border border-transparent hover:border-slate-100 dark:hover:border-neutral-800 transition-all group">
                                <span className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white">
                                   {action.icon} {action.label}
                                </span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                             </button>
                           ))}
                        </div>
                     </GlassCard>
                  </motion.div>

                </div>

              </div>
            )}

            {/* Footer */}
            <div className="mt-20 border-t border-slate-200 dark:border-neutral-900/50 pt-8 text-center">
               <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                 © {new Date().getFullYear()} Mr. Hyre Technologies • Intelligence Version 4.0.2
               </p>
            </div>

          </div>
        </motion.div>
  );
}
