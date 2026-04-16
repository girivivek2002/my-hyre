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

// ─── Interview Data ────────────────────────────────────────────────────────────
const INTERVIEWS = [
  {
    id: "1",
    date: "Apr 18, 2026",
    time: "10:00 AM",
    company: "Nexus Technologies",
    role: "Senior Frontend Engineer",
    status: "Upcoming",
    platform: "Google Meet",
    interviewer: "Sarah Chen — VP Engineering",
    prep: [
      "Review system design fundamentals — focus on scalable UI architectures.",
      "Prepare examples of complex state management solutions you've built.",
      "Research Nexus's recent product launches and their tech stack.",
    ],
  },
  {
    id: "2",
    date: "Apr 21, 2026",
    time: "2:30 PM",
    company: "Orbital Labs",
    role: "Full Stack Developer",
    status: "Upcoming",
    platform: "Zoom",
    interviewer: "James Wright — Lead Architect",
    prep: [
      "Brush up on Node.js event loop and concurrency patterns.",
      "Prepare a walkthrough of your most complex API project.",
      "Review Orbital's open-source contributions on GitHub.",
    ],
  },
  {
    id: "3",
    date: "Apr 14, 2026",
    time: "11:00 AM",
    company: "Sterling & Co.",
    role: "Product Designer",
    status: "Completed",
    platform: "In-person — London HQ",
    interviewer: "Alex Sterling — Founder",
    prep: [
      "Portfolio presentation went well — positive feedback received.",
      "Follow up on the design systems case study they requested.",
      "Awaiting final decision from the hiring committee.",
    ],
  },
];

export default function InterviewsPage() {
  const router = useRouter();

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">

      {/* Ambient Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent dark:to-transparent pointer-events-none -z-10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/30 via-transparent to-transparent dark:from-indigo-900/10 dark:via-transparent dark:to-transparent pointer-events-none -z-10 blur-[100px]"></div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-72 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-2xl border-r border-slate-200 dark:border-neutral-800/60 p-6 flex flex-col z-20 shrink-0 shadow-2xl relative"
      >
        <div className="flex items-center gap-3 mb-10 pl-2 cursor-pointer" onClick={() => router.push("/candidate/dashboard")}>
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Mr. Hyre</h1>
            <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Candidate Hub</p>
          </div>
        </div>

        <div className="space-y-2 text-slate-600 dark:text-neutral-400 flex-1">
          {[
            { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/candidate/dashboard" },
            { icon: <Briefcase size={20} />, label: "Shortlisted Roles", path: "/candidate/jobs" },
            { icon: <CalendarDays size={20} />, label: "Interviews", active: true },
            { icon: <BarChart3 size={20} />, label: "Talent Profile", path: "/candidate/profile" },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => item.path && router.push(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium ${item.active ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}

          <div className="mt-8 mb-2 px-4 text-xs font-semibold tracking-widest text-slate-400 dark:text-neutral-600 uppercase">System</div>
          <div onClick={() => router.push("/candidate/settings")} className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <motion.div
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
           className="h-20 border-b border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md px-10 flex justify-between items-center z-10 shrink-0"
        >
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-neutral-500">Interview Architecture</h2>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all">
               <Calendar size={14} /> Sync External Calendar
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                SA
              </div>
              <ChevronDown size={14} className="text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Scrollable Content */}
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
                Your Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Roadmap</span>
              </h1>
              <p className="text-slate-500 dark:text-neutral-400 font-medium">
                We've synthesized preparation notes and interviewer architecture to give you a 92% statistical advantage.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Timeline List */}
              <div className="lg:col-span-2 space-y-8 relative">
                {/* Timeline Connector */}
                <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-slate-200 dark:bg-neutral-800/60 -z-10" />

                {INTERVIEWS.map((interview, i) => (
                  <motion.div key={interview.id} variants={itemVars} className="flex gap-8 group">
                    {/* Circle Indicator */}
                    <div className="relative shrink-0">
                       <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-neutral-950 border-2 ${interview.status === 'Upcoming' ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-200 dark:border-neutral-800'} flex items-center justify-center font-bold text-blue-500 group-hover:scale-110 transition-transform duration-500 z-10 relative bg-white dark:bg-neutral-900`}>
                          {interview.company[0]}
                       </div>
                    </div>

                    <div className="flex-1">
                       <GlassCard className="!p-0 overflow-visible">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                               <div>
                                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{interview.date} • {interview.time}</p>
                                  <h3 className="text-xl font-bold">{interview.company}</h3>
                                  <p className="text-sm font-semibold text-slate-500 dark:text-neutral-500">{interview.role}</p>
                               </div>
                               <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${interview.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600 border border-transparent'}`}>
                                  {interview.status}
                               </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                               <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/50">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                     {interview.platform.includes('person') ? <MapPin size={18} /> : <Video size={18} />}
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

                            <div className="border-t border-slate-100 dark:border-neutral-800/50 pt-6">
                               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
                                  <Sparkles size={14} className="text-blue-500" /> Pre-Interview Intelligence
                               </h4>
                               <ul className="space-y-3">
                                  {interview.prep.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-neutral-400 leading-relaxed group/item">
                                       <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/item:bg-blue-500 transition-colors" />
                                       {item}
                                    </li>
                                  ))}
                               </ul>
                            </div>
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
                ))}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                
                {/* Preparation Hero */}
                <motion.div variants={itemVars}>
                   <div className="bg-gradient-to-tr from-indigo-600 to-blue-700 p-8 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
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

            {/* Footer */}
            <div className="mt-20 border-t border-slate-200 dark:border-neutral-900/50 pt-8 text-center">
               <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                 © {new Date().getFullYear()} Mr. Hyre Technologies • Intelligence Version 4.0.2
               </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
