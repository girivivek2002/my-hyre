"use client";
import React, { ReactNode, MouseEvent, useState, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users, Briefcase, Sparkles, Clock, TrendingUp, Zap, Loader2
} from "lucide-react";

// Animated Counter
function AnimatedStat({ value, suffix = "" }: { value: string | number; suffix?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const num = typeof value === "string" ? parseInt(value) || 0 : value;
    if (num === 0) { setDisplay("0"); return; }
    let current = 0;
    const step = Math.max(1, Math.ceil(num / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { setDisplay(String(num)); clearInterval(timer); }
      else setDisplay(String(current));
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <h2 ref={ref} className="text-3xl sm:text-4xl font-black pb-0.5">{display}{suffix}</h2>;
}

function GlassCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div onMouseMove={handleMouseMove} className={`group relative bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-3xl overflow-hidden shadow-premium dark:shadow-premium-dark ${className}`}>
      <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08), transparent 80%)` }} />
      <div className="absolute inset-0 bg-white/80 dark:bg-[#0A0A0F]/80 -z-10" />
      <div className="relative z-10 w-full h-full p-4 sm:p-6">{children}</div>
    </div>
  );
}

const statCards = [
  { title: "Active Jobs", key: "activeJobs", icon: <Briefcase size={22} />, trend: "+12.5%", color: "indigo", iconBg: "bg-indigo-500/10 border-indigo-500/20", iconColor: "text-indigo-500" },
  { title: "Talent Pipeline", key: "candidates", icon: <Users size={22} />, trend: "+48 new", color: "violet", iconBg: "bg-violet-500/10 border-violet-500/20", iconColor: "text-violet-500" },
  { title: "Scheduled Interviews", key: "interviews", icon: <Clock size={22} />, trend: "2 today", color: "amber", iconBg: "bg-amber-500/10 border-amber-500/20", iconColor: "text-amber-500" },
  { title: "Hiring Velocity", key: "velocity", icon: <TrendingUp size={22} />, trend: "Optimal", color: "emerald", iconBg: "bg-emerald-500/10 border-emerald-500/20", iconColor: "text-emerald-500" },
];

export default function RecruiterDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        } else if (userRes.status === 401) { router.push("/login"); return; }
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) { console.error("Dashboard sync failure:", err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [router]);

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 250, damping: 22 } }
  };

  if (!mounted) return null;

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Synchronizing...</p>
      </motion.div>
    </div>
  );

  return (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 sm:py-8 pb-24 sm:pb-20 custom-scrollbar">
      <div className="max-w-7xl mx-auto">

        {/* Welcome */}
        <motion.div variants={itemVars} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3 text-slate-900 dark:text-white leading-tight">
            Welcome back, <span className="text-gradient-primary">{userData?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-lg flex items-start sm:items-center gap-2 font-medium">
            <Sparkles size={16} className="text-indigo-500 shrink-0 mt-0.5 sm:mt-0" />
            <span>Your talent ecosystem is active and synchronizing.</span>
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVars} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
          {statCards.map((card, i) => (
            <GlassCard key={i}>
              <div className="flex justify-between items-start mb-2 sm:mb-4">
                <div className={`p-1.5 sm:p-3 ${card.iconBg} border rounded-xl ${card.iconColor}`}>
                  {React.cloneElement(card.icon as React.ReactElement, { size: 18 })}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-[8px] sm:text-[10px] tracking-widest uppercase mb-0.5 sm:mb-1">{card.title}</p>
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
                <AnimatedStat value={card.key === "velocity" ? "94" : (stats?.[card.key] || "0")} suffix={card.key === "velocity" ? "%" : ""} />
                <span className="text-[9px] sm:text-[10px] font-bold pb-0.5 sm:pb-2 text-emerald-500">{card.trend}</span>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVars} className="lg:col-span-2">
            <GlassCard className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20"
                >
                  <TrendingUp size={30} className="text-indigo-500" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Intelligence Stream Active</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Post job descriptions to generate semantic matching clusters and visualize your candidate pipeline.</p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push("/recruiter/post-job")}
                  className="mt-6 px-6 py-2.5 btn-primary rounded-xl text-sm"
                >
                  Post a Job
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={itemVars}>
              <div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-8 rounded-[32px] text-white shadow-glow-violet relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                  <Sparkles size={120} />
                </div>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <Zap size={24} fill="white" /> Pro AI
                </h2>
                <p className="text-violet-100 text-sm mb-6 font-medium leading-relaxed">
                  Upgrade to Pro to unlock automated interview scheduling and behavioral scoring for every candidate.
                </p>
                <button className="w-full py-3 bg-white text-violet-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-transform active:scale-95 shadow-xl">
                  Unlock Performance
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}