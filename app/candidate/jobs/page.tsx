"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Clock, MapPin, 
  TrendingUp, CalendarDays, ArrowUpRight, Search, 
  CheckCircle2, Filter, DollarSign, Globe, Building2
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

// ─── Job Data ────────────────────────────────────────────────────────────────
const JOBS = [
  {
    id: 1,
    company: "Linear",
    role: "Senior Product Designer",
    location: "San Francisco / Remote",
    salary: "$180k - $240k",
    match: 98,
    type: "Full-time",
    experience: "5+ years",
    tags: ["Design Systems", "Framer Motion", "Product Strategy"],
    description: "Linear is looking for a Senior Product Designer to help us build the future of software development tracking tools.",
    logo: "L"
  },
  {
    id: 2,
    company: "Vercel",
    role: "Design Systems Lead",
    location: "Remote",
    salary: "$190k - $260k",
    match: 92,
    type: "Full-time",
    experience: "8+ years",
    tags: ["React", "Turborepo", "Architecture"],
    description: "Lead the design system efforts for the world's most popular frontend deployment platform.",
    logo: "V"
  },
  {
    id: 3,
    company: "OpenAI",
    role: "AI Experience Designer",
    location: "San Francisco",
    salary: "$210k - $300k",
    match: 89,
    type: "Full-time",
    experience: "6+ years",
    tags: ["AI/ML UX", "Prototyping", "R&D"],
    description: "Design the interfaces that will define how humanity interacts with AGI.",
    logo: "O"
  },
  {
    id: 4,
    company: "Stripe",
    role: "Principal Experience Designer",
    location: "Remote",
    salary: "$200k - $280k",
    match: 87,
    type: "Full-time",
    experience: "10+ years",
    tags: ["Fintech", "Accessibility", "Leadership"],
    description: "Architect the next generation of global payments infrastructure interfaces.",
    logo: "S"
  },
  {
    id: 5,
    company: "Apple",
    role: "Interactive Motion Designer",
    location: "Cupertino",
    salary: "$170k - $230k",
    match: 84,
    type: "Full-time",
    experience: "4+ years",
    tags: ["SwiftUI", "Motion Assets", "Core UX"],
    description: "Craft the fluid animations and micro-interactions that make Apple products feel magical.",
    logo: "A"
  },
  {
    id: 6,
    company: "Airbnb",
    role: "Global Design Lead",
    location: "Hybrid (SF)",
    salary: "$220k - $290k",
    match: 81,
    type: "Full-time",
    experience: "12+ years",
    tags: ["Consumer UX", "Branding", "Team Growth"],
    description: "Shape the future of travel and belonging at a global scale.",
    logo: "B"
  }
];

export default function CandidateJobsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  const filteredJobs = JOBS.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(search.toLowerCase()) || 
                          job.role.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === "All" || job.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = ["All", ...Array.from(new Set(JOBS.flatMap(j => j.tags)))];

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
            { icon: <Briefcase size={20} />, label: "Shortlisted Roles", active: true },
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company or role..."
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
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                SA
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Sterling Archer</p>
                <p className="text-[10px] text-slate-500 dark:text-neutral-500 font-medium tracking-tight uppercase">Premium Candidate</p>
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
          <div className="max-w-7xl mx-auto">

            {/* Hero Section */}
            <motion.div variants={itemVars} className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Explore Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Recruiter Selections</span>
              </h1>
              <p className="text-slate-500 dark:text-neutral-400 font-medium max-w-2xl">
                Our AI engine has analyzed your architecture and found {JOBS.length} companies that have specifically shortlisted you for these elite roles.
              </p>
            </motion.div>

            {/* Filter Pills */}
            <motion.div variants={itemVars} className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
              {allTags.map((tag, i) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedTag === tag 
                    ? 'bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                    : 'bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:border-blue-500/50 hover:text-blue-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job, i) => (
                  <GlassCard key={job.id} delay={i * 0.05} className="flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-800 flex items-center justify-center text-xl font-extrabold text-blue-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {job.logo}
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 font-bold text-[10px] tracking-widest flex items-center gap-1.5 mb-1.5">
                          <Zap size={10} fill="currentColor" /> {job.match}% MATCH
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">{job.type}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-blue-500 transition-colors">{job.role}</h3>
                      <p className="text-sm font-semibold text-slate-700 dark:text-neutral-300 mb-4">{job.company}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
                          <MapPin size={14} className="text-slate-400" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
                          <DollarSign size={14} className="text-slate-400" /> {job.salary}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
                          <Clock size={14} className="text-slate-400" /> {job.experience} exp
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed mb-6 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {job.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-neutral-800/80 rounded-lg text-[9px] font-bold text-slate-600 dark:text-neutral-400 border border-transparent group-hover:border-blue-500/10 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-xs font-extrabold shadow-lg hover:opacity-90 active:scale-95 transition-all">
                        Accept Selection
                      </button>
                      <button className="w-12 h-12 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500/50 transition-all active:scale-95">
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-neutral-900 flex items-center justify-center mb-6 text-slate-300 dark:text-neutral-700">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">No matches found</h3>
                <p className="text-sm text-slate-500 dark:text-neutral-500 max-w-xs">
                  Try adjusting your search or filters to find more opportunities.
                </p>
                <button 
                  onClick={() => { setSearch(""); setSelectedTag("All"); }}
                  className="mt-6 text-sm font-bold text-blue-500 hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}

            {/* Footer Information */}
            <motion.div variants={itemVars} className="mt-20 p-8 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                  <Sparkles size={180} />
               </div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold mb-4">Want specialized matches?</h2>
                  <p className="text-blue-100 text-sm max-w-lg mb-8">
                    Our AI becomes more accurate as you provide more data. Sync your latest project portfolio to unlock high-security matching.
                  </p>
                  <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform active:scale-95">
                    Upgrade to Intelligence Pro
                  </button>
               </div>
            </motion.div>

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
