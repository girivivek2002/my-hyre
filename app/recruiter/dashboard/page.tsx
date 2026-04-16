"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings,
  Plus, Search, Bell, ChevronDown, Sparkles, Clock, MapPin, TrendingUp, CalendarDays, Zap,
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

export default function RecruiterDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  // Close menus when clicking outside could be implemented, but simple toggle suffices for now
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          fetch("/api/user/me", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("/api/recruiter/stats", { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          setUserData(data.user || data);
        }
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error("Dashboard synchronization failure:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted || isLoading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 font-bold tracking-widest uppercase animate-pulse">
      Syncing Intelligence Pipeline...
    </div>
  );

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
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="relative text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors p-2"
              >
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-neutral-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-neutral-400">
                    You're all caught up!
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800"></div>

            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  {userData?.name?.slice(0,2).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userData?.name || "Initializing..."}</p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-500 font-medium tracking-tight uppercase">Corporate Node</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 dark:text-neutral-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col py-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-neutral-800 mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userData?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">{userData?.email}</p>
                  </div>
                  
                  <button onClick={() => router.push("/recruiter/profile")} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors">
                    <User size={16} /> My Profile
                  </button>
                  <button onClick={() => router.push("/recruiter/settings")} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors">
                    <Settings size={16} /> Settings
                  </button>
                  
                  <div className="h-px bg-slate-100 dark:bg-neutral-800 my-2"></div>
                  
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
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
            <motion.div variants={itemVars} className="mb-10">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white leading-none">
                  Authority Center, <span className="text-blue-500">{userData?.name}</span>
                </h1>
                <p className="text-slate-500 dark:text-neutral-400 text-lg flex items-center gap-2 font-medium">
                  <Sparkles size={18} className="text-blue-500" />
                  Your talent ecosystem is active and synchronizing in real-time.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { title: "Active Jobs", value: stats?.activeJobs || "0", icon: <Briefcase size={22} className="text-blue-400" />, trend: "+12.5%", positive: true },
                { title: "Talent Pipeline", value: stats?.candidates || "0", icon: <Users size={22} className="text-purple-400" />, trend: "+48 new", positive: true },
                { title: "Scheduled Interviews", value: stats?.interviews || "0", icon: <Clock size={22} className="text-amber-400" />, trend: "2 today", positive: true },
                { title: "Hiring Velocity", value: "94%", icon: <TrendingUp size={22} className="text-emerald-400" />, trend: "Optimal", positive: true },
              ].map((card, i) => (
                <GlassCard key={i}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-100/50 dark:bg-neutral-800/50 rounded-xl border border-slate-200 dark:border-neutral-700/50 shadow-inner">
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-neutral-400 font-bold text-[10px] tracking-widest uppercase mb-1">{card.title}</p>
                  <div className="flex items-end gap-3">
                    <h2 className="text-4xl font-black pb-0.5">{card.value}</h2>
                    <span className={`text-[10px] font-bold pb-2 ${card.positive ? 'text-emerald-500' : 'text-neutral-500'}`}>{card.trend}</span>
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            {/* Placeholder for real data visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVars} className="lg:col-span-2">
                   <GlassCard className="h-[400px] flex items-center justify-center border-dashed">
                      <div className="text-center">
                         <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                            <TrendingUp size={30} className="text-blue-500" />
                         </div>
                         <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Intelligence Stream Active</h3>
                         <p className="text-neutral-500 text-sm max-w-sm">Post job descriptions to generate semantic matching clusters and visualize your candidate pipeline.</p>
                      </div>
                   </GlassCard>
                </motion.div>

                <div className="space-y-6">
                   <motion.div variants={itemVars}>
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={120} />
                         </div>
                         <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <Zap size={24} fill="white" /> Pro AI
                         </h2>
                         <p className="text-blue-100 text-sm mb-6 font-medium leading-relaxed">
                            Upgrade to Pro to unlock automated interview scheduling and behavioral scoring for every candidate.
                         </p>
                         <button className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                            Unlock Performance
                         </button>
                      </div>
                   </motion.div>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}