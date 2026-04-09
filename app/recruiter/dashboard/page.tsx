"use client";
import React, { ReactNode, MouseEvent } from "react";
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-neutral-700 dark:to-neutral-900 border border-slate-300 dark:border-neutral-700 overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <Image src="/logo.png" alt="Profile" fill className="object-cover opacity-80" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Sterling & Co.</p>
                <p className="text-[11px] text-slate-500 dark:text-neutral-500 font-medium">Enterprise Admin</p>
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
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Sterling & Co.</span>
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
                { title: "Active Jobs", value: "12", icon: <Briefcase size={22} className="text-blue-400" />, trend: "+2 this week", positive: true },
                { title: "Total Candidates", value: "2,840", icon: <Users size={22} className="text-purple-400" />, trend: "+124 new", positive: true },
                { title: "Interviews", value: "18", icon: <Clock size={22} className="text-amber-400" />, trend: "4 today", positive: true },
                { title: "Hiring Rate", value: "92%", icon: <TrendingUp size={22} className="text-emerald-400" />, trend: "+4% from prev", positive: true },
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
                    {[
                      { name: "Sarah Jenkins", role: "Principal Product Designer", location: "San Francisco, CA", match: 98, img: "SJ" },
                      { name: "Michael Chen", role: "Senior Fullstack Engineer", location: "Remote", match: 92, img: "MC" },
                      { name: "Elena Rodriguez", role: "Director of Marketing", location: "New York, NY", match: 89, img: "ER" },
                      { name: "David Kim", role: "DevOps Architect", location: "Austin, TX", match: 86, img: "DK" },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="group flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/80 p-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-sm gap-4 sm:gap-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 dark:from-neutral-800 dark:to-neutral-900 border border-slate-300 dark:border-neutral-700/50 rounded-full font-bold text-sm text-slate-500 dark:text-neutral-300 shadow-inner group-hover:from-blue-100/80 group-hover:to-blue-100/40 group-hover:text-blue-600 dark:group-hover:from-blue-900/40 dark:group-hover:to-blue-900/20 dark:group-hover:text-blue-200 group-hover:border-blue-400/30 dark:group-hover:border-blue-500/30 transition-all">
                            {c.img}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{c.name}</p>
                            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                              <span className="flex items-center gap-1"><Briefcase size={12} /> {c.role}</span>
                              <span className="w-1 h-1 bg-slate-300 dark:bg-neutral-600 rounded-full"></span>
                              <span className="flex items-center gap-1"><MapPin size={12} /> {c.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 border-slate-200 dark:border-neutral-800 pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-xl font-bold text-blue-400">{c.match}%</p>
                            <p className="text-[10px] uppercase tracking-widest text-blue-500/70 font-bold">AI Match</p>
                          </div>
                          <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors">
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
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
                      Based on behavioral analysis and historic hire paths, we strongly recommend moving <strong className="text-white underline decoration-blue-400 underline-offset-2">Sarah Jenkins</strong> to the final managerial round by Thursday to avoid talent poaching.
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
                      {[
                        { time: "10:00 AM", name: "Sarah Jenkins", label: "Final round", color: "bg-emerald-500" },
                        { time: "2:30 PM", name: "Jordan Smith", label: "Tech screen", color: "bg-blue-500" },
                        { time: "Tomorrow", name: "Amara Okafor", label: "Culture sync", color: "bg-purple-500" },
                      ].map((iv, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center pt-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${iv.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}></div>
                            {i !== 2 && <div className="w-px h-10 bg-slate-200 dark:bg-neutral-800 mt-2"></div>}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-neutral-500 mb-0.5">{iv.time}</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{iv.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-neutral-400">{iv.label}</p>
                          </div>
                        </div>
                      ))}
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