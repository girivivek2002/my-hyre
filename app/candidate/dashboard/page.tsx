"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Clock, MapPin, 
  TrendingUp, CalendarDays, ArrowUpRight, Search, 
  CheckCircle2, AlertCircle
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/api/user/me", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => {
      if (!data.user || data.user.role !== "candidate") {
        router.push(data.user?.role === "recruiter" ? "/recruiter/dashboard" : "/login");
        return;
      }
      setUserData(data.user);
      setStats(data.stats);
      setIsLoading(false);
    })
    .catch(() => {
      localStorage.removeItem("authToken");
      router.push("/login");
    });

  }, [router]);

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted || isLoading) return <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center text-slate-500">Loading Intelligence...</div>;

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
        <div className="flex items-center gap-3 mb-10 pl-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Mr. Hyre</h1>
            <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Candidate Hub</p>
          </div>
        </div>

        <div className="space-y-2 text-slate-600 dark:text-neutral-400 flex-1">
          {[
            { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
            { icon: <Briefcase size={20} />, label: "Shortlisted Roles", path: "/candidate/jobs" },
            { icon: <CalendarDays size={20} />, label: "Interviews", path: "/candidate/interviews" },
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

        {/* Support Banner */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-800 shadow-xl overflow-hidden relative group">
           <Sparkles size={60} className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-125 transition-transform duration-700" />
           <p className="text-xs font-bold text-blue-400 mb-2">PRO TIP</p>
           <p className="text-[11px] text-neutral-300 leading-relaxed relative z-10">Complete your "Skills Matrix" to increase match accuracy by 24%.</p>
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
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              placeholder="Search companies or positions..."
              className="bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 px-4 py-2 pl-11 rounded-full w-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg uppercase">
                {userData?.name?.slice(0,2)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userData?.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-neutral-500 font-medium tracking-tight">Candidate Profile</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Scrollable Area */}
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
                  Your AI profile is currently optimized for <strong className="text-slate-900 dark:text-white">Principal Design Roles</strong>.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "Match Accuracy", value: `${stats?.matches || 0}%`, icon: <Zap size={20} className="text-blue-500" />, trend: stats?.matches > 0 ? "Top 2% of pool" : "Awaiting data", color: "blue" },
                { title: "Recruiter Shortlists", value: stats?.shortlists || "0", icon: <Briefcase size={20} className="text-purple-500" />, trend: stats?.shortlists > 0 ? "+1 this week" : "No shortlists yet", color: "purple" },
                { title: "Interview Invites", value: stats?.interviews || "0", icon: <CalendarDays size={20} className="text-amber-500" />, trend: stats?.interviews > 0 ? "Review pending" : "No invites yet", color: "amber" },
                { title: "Profile Strength", value: `${stats?.profileStrength || 0}%`, icon: <TrendingUp size={20} className="text-emerald-500" />, trend: stats?.profileStrength > 0 ? "Almost complete" : "Needs completion", color: "emerald" },
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
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Selection History →</button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 dark:text-neutral-500">
                      <Briefcase size={40} className="mb-3 opacity-20" />
                      <p className="font-semibold text-slate-600 dark:text-neutral-400">No Applications Yet</p>
                      <p className="text-xs mt-1">Upload your resume to start getting matched with top companies.</p>
                      <button onClick={() => router.push("/candidate/profile")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">Build Profile</button>
                    </div>
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
                        Complete your profile construction to let our semantic analysis engine evaluate your skills and surface competitive gaps.
                      </p>
                      <button onClick={() => router.push("/candidate/profile")} className="w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold border border-white/20 transition-all">
                        Complete Profile
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
                    <div className="space-y-4 flex flex-col items-center justify-center py-4 text-slate-500 dark:text-neutral-600">
                      <Clock size={30} className="mb-2 opacity-20" />
                      <p className="text-xs font-semibold">No interviews queued.</p>
                    </div>
                  </GlassCard>
                </motion.div>

              </div>
            </div>

            {/* Recommended for You Grid */}
            <motion.div variants={itemVars} className="mt-10">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recruiter Selections</h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Companies that have shortlisted you based on your unique profile architecture.</p>
                 </div>
                 <button className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">See All →</button>
              </div>

              <div className="flex flex-col items-center justify-center py-16 bg-white/40 dark:bg-neutral-900/40 rounded-3xl border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-500 shadow-inner">
                <Search size={48} className="mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-neutral-300">No Selections Available</h3>
                <p className="text-sm text-center max-w-md mt-2">Recruiters haven't shortlisted your profile manually yet. Make sure your resume is uploaded and skills are configured.</p>
              </div>
            </motion.div>

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
