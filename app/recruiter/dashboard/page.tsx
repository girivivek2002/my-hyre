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
      <div className="relative z-10 w-full h-full p-4 sm:p-6">
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

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [userRes, statsRes] = await Promise.all([
          fetch(`/api/user/me?t=${Date.now()}`, { headers, cache: 'no-store' }),
          fetch(`/api/recruiter/stats?t=${Date.now()}`, { headers, cache: 'no-store' })
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          setUserData(data.user || data);
        } else if (userRes.status === 401) {
          router.push("/login");
          return;
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

  if (!mounted) return null;

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-20 custom-scrollbar">
      <div className="max-w-7xl mx-auto">

            {/* Welcome */}
            <motion.div variants={itemVars} className="mb-8">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white leading-tight">
                  Authority Center, <span className="text-blue-500">{userData?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 dark:text-neutral-400 text-sm sm:text-lg flex items-start sm:items-center gap-2 font-medium">
                  <Sparkles size={18} className="text-blue-500 shrink-0 mt-1 sm:mt-0" />
                  <span>Your talent ecosystem is active and synchronizing.</span>
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
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
                  <p className="text-slate-500 dark:text-neutral-400 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase mb-1">{card.title}</p>
                  <div className="flex items-end gap-2 sm:gap-3">
                    <h2 className="text-3xl sm:text-4xl font-black pb-0.5">{card.value}</h2>
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
      </div>
    );
  }