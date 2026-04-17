"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Clock, MapPin, 
  TrendingUp, CalendarDays, ArrowUpRight, Search, 
  CheckCircle2, AlertCircle, FileText, ArrowRight,
  User, LogOut
} from "lucide-react";

// Interactive Glass Card Component
function GlassCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
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
    </div>
  );
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        const headers = { "Authorization": `Bearer ${token}` };
        
        const [userRes, statsRes, jobsRes, interviewsRes] = await Promise.all([
          fetch("/api/user/me", { headers }),
          fetch("/api/candidate/stats", { headers }),
          fetch("/api/candidate/jobs", { headers }),
          fetch("/api/candidate/interviews", { headers })
        ]);

        const userData = await userRes.json();
        if (!userRes.ok || userData.user.role !== "candidate") {
          router.push(userData.user?.role === "recruiter" ? "/recruiter/dashboard" : "/login");
          return;
        }
        setUserData(userData.user);

        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats(sData.stats);
        }

        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setRecentJobs(jData.jobs || []);
        }

        if (interviewsRes.ok) {
          const iData = await interviewsRes.json();
          setRecentInterviews(iData.interviews || []);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    };

    fetchAllData();
  }, [router]);

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
          className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-20 custom-scrollbar"
        >
          <div className="max-w-7xl mx-auto">

            {/* Welcome */}
            <motion.div variants={itemVars} className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Zap size={10} fill="currentColor" /> Intelligence Sync Complete
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">{userData?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 dark:text-neutral-400 font-medium">
                  Your AI profile is currently optimized for <strong className="text-slate-900 dark:text-white">Professional Growth</strong>.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "Citizens Stream", value: stats?.totalCitizens || 0, icon: <LayoutDashboard size={20} className="text-blue-500" />, trend: "Global pool size", color: "blue" },
                { title: "Active Selections", value: stats?.activeJobs || 0, icon: <Briefcase size={20} className="text-purple-500" />, trend: "Recruiter shortlists", color: "purple" },
                { title: "Resume Nodes", value: stats?.resumeNodes || 0, icon: <FileText size={20} className="text-amber-500" />, trend: "High-fidelity files", color: "amber" },
                { title: "Waitlist Ingress", value: stats?.waitlistCount || 0, icon: <Clock size={20} className="text-emerald-500" />, trend: "Queue position", color: "emerald" },
              ].map((stat, i) => (
                <GlassCard key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                      {stat.icon}
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300 dark:text-neutral-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-neutral-500 uppercase tracking-wider mb-1">{stat.title}</p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-2xl font-bold">{stat.value}</h2>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 pb-1">{stat.trend}</span>
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Application Timeline */}
              <motion.div variants={itemVars} className="lg:col-span-2">
                <GlassCard className="h-full">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold tracking-tight">Intelligence Selection Roadmap</h2>
                    <button onClick={() => router.push("/candidate/jobs")} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">See All Selections →</button>
                  </div>

                  <div className="space-y-6">
                    {recentJobs.length > 0 ? (
                      recentJobs.slice(0, 3).map((job, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 group hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-950 flex items-center justify-center font-bold text-blue-500 border border-slate-200 dark:border-neutral-800">
                              {job.logo}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{job.role}</p>
                              <p className="text-xs text-slate-500">{job.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest">{job.status}</span>
                             <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 dark:text-neutral-500">
                        <Briefcase size={40} className="mb-3 opacity-20" />
                        <p className="font-semibold text-slate-600 dark:text-neutral-400">No Applications Yet</p>
                        <p className="text-xs mt-1">Recruiters haven't shortlisted you yet. Build your profile.</p>
                        <button onClick={() => router.push("/candidate/profile")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">Build Profile</button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Sidebar Cards */}
              <div className="space-y-6">
                
                {/* AI Intelligence Hero */}
                <motion.div variants={itemVars}>
                  <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-6 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Zap size={100} />
                    </div>
                    <div className="relative z-10 text-white">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={18} className="text-blue-200" />
                        <h2 className="text-lg font-bold">Matching Intelligence</h2>
                      </div>
                      <p className="text-sm text-blue-100 leading-relaxed mb-6">
                        Sync your latest achievement architecture to increase visibility to elite recruitment nodes.
                      </p>
                      <button onClick={() => router.push("/candidate/profile")} className="w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold border border-white/20 transition-all">
                        Update Architecture
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Upcoming */}
                <motion.div variants={itemVars}>
                  <GlassCard>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                       <Clock size={18} className="text-slate-400" /> Interview Queue
                    </h2>
                    <div className="space-y-4">
                      {recentInterviews.length > 0 ? (
                        recentInterviews.slice(0, 2).map((interview, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                             <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] font-bold text-blue-500 uppercase">{interview.date}</p>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-tighter">Confirmed</span>
                             </div>
                             <p className="text-xs font-bold text-slate-800 dark:text-neutral-200">{interview.company}</p>
                             <p className="text-[9px] text-slate-500">{interview.role}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-slate-500 dark:text-neutral-600">
                          <Clock size={30} className="mb-2 opacity-20" />
                          <p className="text-xs font-semibold">No interviews queued.</p>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>

              </div>
            </div>

            {/* Recruiter Selections Grid */}
            <motion.div variants={itemVars} className="mt-10">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recruiter Selections</h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Premium opportunities specifically curated for your profile.</p>
                 </div>
                 <button onClick={() => router.push("/candidate/jobs")} className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">See All →</button>
              </div>

              {recentJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {recentJobs.slice(0, 3).map((job, idx) => (
                     <GlassCard key={idx} className="hover:border-blue-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-950 flex items-center justify-center font-bold text-blue-500 shadow-sm mb-4">
                          {job.logo}
                        </div>
                        <h3 className="text-sm font-bold mb-1">{job.role}</h3>
                        <p className="text-xs text-slate-500 mb-4">{job.company}</p>
                        <div className="flex gap-2">
                           <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-[9px] font-bold text-slate-600 dark:text-neutral-400">{job.location}</span>
                           <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[9px] font-bold text-blue-500">{job.salary}</span>
                        </div>
                     </GlassCard>
                   ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white/40 dark:bg-neutral-900/40 rounded-3xl border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 shadow-inner">
                  <Search size={48} className="mb-4 opacity-20" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-neutral-300">No Selections Available</h3>
                  <p className="text-sm text-center max-w-md mt-2">Recruiters haven't shortlisted your profile manually yet. Sync your latest architecture.</p>
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <div className="mt-20 border-t border-slate-200 dark:border-neutral-900/50 pt-8 text-center pb-12">
               <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                 © {new Date().getFullYear()} Mr. Hyre Technologies • Intelligence Version 4.0.2
               </p>
            </div>

          </div>
        </motion.div>
    );
}
