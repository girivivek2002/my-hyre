"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings,
  Plus, Search, Bell, ChevronDown, Sparkles, Clock, MapPin, TrendingUp, CalendarDays
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

export default function RecruiterDashboard() {
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
      if (!data.user || data.user.role !== "recruiter") {
        router.push(data.user?.role === "candidate" ? "/candidate/dashboard" : "/login");
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

  if (!mounted || isLoading) return <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center text-slate-500">Loading Pipeline...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">

      {/* Ambient Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-neutral-950 dark:to-[#050505] pointer-events-none -z-10 blur-[100px]"></div>

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
            <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Intelligence</p>
          </div>
        </div>

        <div className="space-y-2 text-slate-600 dark:text-neutral-400 flex-1">
          {[
            { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
            { icon: <Users size={20} />, label: "Candidates", path: "/recruiter/candidates" },
            { icon: <Briefcase size={20} />, label: "Jobs", path: "/recruiter/post-job" },
            { icon: <BarChart3 size={20} />, label: "Analytics", path: "/recruiter/analytics" },
            { icon: <CalendarDays size={20} />, label: "Schedule", path: "/recruiter/schedule" },
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

          <div className="mt-8 mb-2 px-4 text-xs font-semibold tracking-widest text-slate-400 dark:text-neutral-600 uppercase">Configuration</div>
          <div onClick={() => router.push("/recruiter/settings")} className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>

        {/* Post Job Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/recruiter/post-job")}
          className="w-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white px-4 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          Post New Job
        </motion.button>
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
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
            <input
              placeholder="Search algorithms or candidates..."
              className="bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 px-4 py-2.5 pl-12 rounded-full w-[400px] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-neutral-700 dark:to-neutral-900 border border-slate-300 dark:border-neutral-700 overflow-hidden flex items-center justify-center relative shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <span className="font-bold text-slate-500 dark:text-neutral-300">{userData?.name?.slice(0,1)}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userData?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-neutral-500 font-medium">Company Account</p>
              </div>
              <ChevronDown size={16} className="text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-1" />
            </div>
          </div>
        </motion.div>

        {/* Scrollable Dashboard Area */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-20 custom-scrollbar"
        >
          <div className="max-w-7xl mx-auto">

            {/* Welcome */}
            <motion.div variants={itemVars} className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{userData?.name}</span>
                </h1>
                <p className="text-slate-500 dark:text-neutral-400 text-lg flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500 dark:text-blue-400" />
                  Your robust AI talent pipeline is seeing a <strong className="text-slate-900 dark:text-white">14% increase</strong> in high-match candidates.
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "Active Jobs", value: stats?.activeJobs || "0", icon: <Briefcase size={22} className="text-blue-400" />, trend: stats?.activeJobs ? "+2 this week" : "Post a job", positive: true },
                { title: "Total Candidates", value: stats?.candidates || "0", icon: <Users size={22} className="text-purple-400" />, trend: stats?.candidates ? "+124 new" : "No applicants yet", positive: true },
                { title: "Interviews", value: stats?.interviews || "0", icon: <Clock size={22} className="text-amber-400" />, trend: stats?.interviews ? "4 today" : "No schedule", positive: true },
                { title: "Hiring Rate", value: `${stats?.hiringRate || 0}%`, icon: <TrendingUp size={22} className="text-emerald-400" />, trend: stats?.hiringRate ? "+4% from prev" : "Not calculated", positive: true },
              ].map((card, i) => (
                <GlassCard key={i}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-100/50 dark:bg-neutral-800/50 rounded-xl border border-slate-200 dark:border-neutral-700/50 shadow-inner">
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-neutral-400 font-medium text-sm mb-1">{card.title}</p>
                  <div className="flex items-end gap-3">
                    <h2 className="text-3xl font-extrabold pb-0.5">{card.value}</h2>
                    <span className={`text-xs font-semibold pb-1.5 ${card.positive ? 'text-emerald-400' : 'text-neutral-500'}`}>{card.trend}</span>
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            {/* Activity + Interviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Recent Candidates */}
              <motion.div variants={itemVars} className="col-span-1 lg:col-span-2">
                <GlassCard className="h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-tight">Recent AI Matches</h2>
                    <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">View All →</button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 dark:text-neutral-500">
                      <Search size={40} className="mb-3 opacity-20" />
                      <p className="font-semibold text-slate-600 dark:text-neutral-400">No AI Matches Yet</p>
                      <p className="text-xs mt-1">Post a job to start receiving AI-curated talent recommendations.</p>
                      <button onClick={() => router.push("/recruiter/post-job")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">Start Hiring</button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Right Side Stack */}
              <div className="space-y-6 lg:col-span-1">

                {/* AI Insight */}
                <motion.div variants={itemVars}>
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl border border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)] relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-50 transform rotate-12 scale-150 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-700">
                      <Sparkles size={100} strokeWidth={1} className="text-white" />
                    </div>
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2 relative z-10 text-white shadow-sm">
                      <Sparkles size={20} /> Proprietary AI Insight
                    </h2>
                    <p className="text-sm text-blue-50 leading-relaxed relative z-10 font-medium">
                      Your workspace is securely initialized. Once you post your first job and candidates apply, our AI will provide predictive behavioral insights here to help you identify top talent faster.
                    </p>
                  </div>
                </motion.div>

                {/* Upcoming Interviews */}
                <motion.div variants={itemVars}>
                  <GlassCard>
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2 tracking-tight">
                      <Clock size={18} className="text-slate-400 dark:text-neutral-400" /> Upcoming Scrums
                    </h2>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500 dark:text-neutral-600">
                        <Clock size={30} className="mb-2 opacity-20" />
                        <p className="text-xs font-semibold">No scrums scheduled.</p>
                      </div>
                    </div>
                    <button className="w-full mt-6 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-900 dark:text-white font-semibold py-2.5 rounded-lg text-sm transition-colors border border-slate-200 dark:border-neutral-700/50">
                      Open Full Calendar
                    </button>
                  </GlassCard>
                </motion.div>

              </div>
            </div>

            {/* Footer */}
            <motion.div variants={itemVars} className="mt-12 text-center text-xs font-semibold tracking-widest text-slate-400 dark:text-neutral-600 uppercase border-t border-slate-200 dark:border-neutral-800/50 pt-8">
              © {new Date().getFullYear()} MR. HYRE TECHNOLOGIES. ALL RIGHTS RESERVED.
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}