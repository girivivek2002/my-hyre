"use client";
import React, { ReactNode, MouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, MapPin, Mail, Phone,
    GraduationCap, Clock, ExternalLink,
    Award, CheckCircle2, TrendingUp, Zap, CalendarDays
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const candidates = [
    {
        id: 1, initials: "SJ", name: "Sarah Jenkins", role: "Principal Product Designer",
        location: "San Francisco, CA", match: 98, experience: "12 years",
        email: "sarah.jenkins@mail.com", phone: "+1 (415) 232-8819",
        education: "MFA, Stanford University",
        skills: ["Figma", "Design Systems", "User Research", "Prototyping", "A/B Testing"],
        summary: "Award-winning designer with deep expertise in enterprise SaaS products. Led design at two unicorn startups, scaling design teams from 3 to 25. Passionate about accessibility and inclusive design.",
        strengths: ["Leadership", "Strategic Thinking", "Cross-functional Communication"],
        status: "Final Round",
        github: "github.com/sjenkins", linkedin: "linkedin.com/in/sarahjenkins"
    },
    {
        id: 2, initials: "MC", name: "Michael Chen", role: "Senior Fullstack Engineer",
        location: "Remote", match: 94, experience: "8 years",
        email: "m.chen@devmail.io", phone: "+1 (650) 919-3041",
        education: "BS Computer Science, MIT",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "GraphQL"],
        summary: "Performance-obsessed engineer specialising in scalable web architectures. Core contributor to two major open-source projects with 5k+ GitHub stars combined.",
        strengths: ["System Design", "Performance Optimization", "Open Source"],
        status: "Technical Screen",
        github: "github.com/mchen", linkedin: "linkedin.com/in/michaelchen"
    },
    {
        id: 3, initials: "ER", name: "Elena Rodriguez", role: "Director of Marketing",
        location: "New York, NY", match: 91, experience: "10 years",
        email: "elena.r@corpmail.com", phone: "+1 (212) 555-7702",
        education: "MBA, Columbia University",
        skills: ["Growth Strategy", "SEO/SEM", "Brand Marketing", "Analytics", "Content Strategy"],
        summary: "Data-driven marketing leader who has driven 300% revenue growth at Series B and C stage companies. Expert in building and scaling demand generation engines.",
        strengths: ["Revenue Growth", "Team Building", "Data Analytics"],
        status: "Culture Fit",
        github: "", linkedin: "linkedin.com/in/elenarodriguez"
    },
    {
        id: 4, initials: "DK", name: "David Kim", role: "DevOps Architect",
        location: "Austin, TX", match: 89, experience: "9 years",
        email: "d.kim@infra.dev", phone: "+1 (512) 334-9901",
        education: "BS Systems Engineering, Georgia Tech",
        skills: ["Kubernetes", "Terraform", "CI/CD", "Docker", "GCP", "Monitoring"],
        summary: "Infrastructure specialist who has built zero-downtime deployment pipelines processing 50M+ requests/day. Certified in AWS, GCP, and Azure.",
        strengths: ["Reliability Engineering", "Cost Optimization", "Security"],
        status: "Screening",
        github: "github.com/dkim", linkedin: "linkedin.com/in/davidkim"
    },
    {
        id: 5, initials: "AO", name: "Amara Okafor", role: "Machine Learning Engineer",
        location: "London, UK", match: 87, experience: "6 years",
        email: "amara.o@ailab.io", phone: "+44 20 7946 0123",
        education: "PhD Computer Science, Oxford",
        skills: ["PyTorch", "TensorFlow", "NLP", "Computer Vision", "MLOps", "Python"],
        summary: "Published researcher in NLP with 12 peer-reviewed papers. Built production ML pipelines serving real-time predictions to 10M+ users.",
        strengths: ["Research", "Model Optimization", "Technical Writing"],
        status: "New Match",
        github: "github.com/aokafor", linkedin: "linkedin.com/in/amaraokafor"
    },
    {
        id: 6, initials: "JS", name: "Jordan Smith", role: "Staff Backend Engineer",
        location: "Seattle, WA", match: 85, experience: "11 years",
        email: "j.smith@eng.co", phone: "+1 (206) 555-2288",
        education: "MS Computer Science, University of Washington",
        skills: ["Go", "Rust", "Microservices", "Kafka", "Redis", "System Design"],
        summary: "Distributed systems expert who has architected payment processing platforms handling $2B+ in annual transactions. Strong mentor and technical leader.",
        strengths: ["Architecture", "Mentorship", "Distributed Systems"],
        status: "Interview Scheduled",
        github: "github.com/jsmith", linkedin: "linkedin.com/in/jordansmith"
    },
];

const statusColors: Record<string, string> = {
    "Final Round": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Technical Screen": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Culture Fit": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Screening": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "New Match": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Interview Scheduled": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "" }: { children: ReactNode, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    return (
        <div onMouseMove={handleMouseMove} className={`group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-slate-200 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${className}`}>
            <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)` }} />
            <div className="absolute inset-0 bg-slate-50/80 dark:bg-neutral-950/80 -z-10" />
            <div className="relative z-10 w-full h-full p-6">{children}</div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CandidatesPage() {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<number>(candidates[0].id);
    const [searchQuery, setSearchQuery] = useState("");

    const selected = candidates.find(c => c.id === selectedId)!;
    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">

            {/* Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-neutral-950 dark:to-[#050505] pointer-events-none -z-10 blur-[100px]" />

            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-72 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-2xl border-r border-slate-200 dark:border-neutral-800/60 p-6 flex flex-col z-20 shrink-0 shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-10 pl-2 cursor-pointer" onClick={() => router.push("/recruiter/dashboard")}>
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Mr. Hyre</h1>
                        <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Intelligence</p>
                    </div>
                </div>

                <div className="space-y-2 text-slate-600 dark:text-neutral-400 flex-1">
                    {[
                        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/recruiter/dashboard" },
                        { icon: <Briefcase size={20} />, label: "Active Jobs", path: "/recruiter/post-job" },
                        { icon: <Users size={20} />, label: "Candidates", active: true },
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
            </motion.div>

            {/* ── Main Area ──────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Topbar */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    className="h-20 border-b border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md px-10 flex justify-between items-center z-10 shrink-0"
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            placeholder="Search algorithms or candidates..."
                            className="bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 px-4 py-2.5 pl-12 rounded-full w-[400px] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full" />
                        </button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800" />
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

                {/* ── Content: Candidate List + Detail ─────────────────── */}
                <div className="flex-1 flex overflow-hidden">

                    {/* ── Left: Candidate List ──────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="w-[420px] shrink-0 border-r border-slate-200 dark:border-neutral-800/60 flex flex-col bg-slate-100/50 dark:bg-neutral-950/20"
                    >
                        {/* List Header */}
                        <div className="p-6 pb-4 border-b border-slate-200 dark:border-neutral-800/50">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Zap size={20} className="text-blue-500 dark:text-blue-400" /> AI Matches
                                </h2>
                                <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold">{candidates.length} found</span>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={16} />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Filter candidates..."
                                    className="w-full bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 px-3 py-2.5 pl-10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner dark:shadow-none"
                                />
                            </div>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {filtered.map((c, i) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i, type: "spring", stiffness: 300, damping: 24 }}
                                    onClick={() => setSelectedId(c.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedId === c.id
                                        ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                        : 'bg-transparent border-transparent hover:bg-white dark:hover:bg-neutral-900/50 hover:border-slate-200 dark:hover:border-neutral-800'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border transition-all ${selectedId === c.id
                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-500/40'
                                        : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border-slate-300 dark:border-neutral-700/50'
                                        }`}>
                                        {c.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm truncate transition-colors ${selectedId === c.id ? 'text-blue-600 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>{c.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-neutral-500 truncate">{c.role}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusColors[c.status]}`}>{c.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-extrabold text-blue-400">{c.match}%</p>
                                        <p className="text-[9px] uppercase tracking-widest text-blue-500/60 font-bold">Match</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Right: Candidate Detail ───────────────────────── */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="flex-1 overflow-y-auto px-8 py-8 pb-20 custom-scrollbar"
                        >
                            <div className="max-w-3xl mx-auto space-y-8">

                                {/* ── Header Card ──────────────────────── */}
                                <GlassCard>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] shrink-0">
                                            {selected.initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between flex-wrap gap-3">
                                                <div>
                                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{selected.name}</h1>
                                                    <p className="text-slate-500 dark:text-neutral-400 text-base mt-1 flex items-center gap-2">
                                                        <Briefcase size={14} /> {selected.role}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                                        <Sparkles size={16} />
                                                        <span className="text-xl font-extrabold">{selected.match}%</span>
                                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Match</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500 dark:text-neutral-400">
                                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {selected.location}</span>
                                                <span className="w-1 h-1 bg-slate-300 dark:bg-neutral-600 rounded-full" />
                                                <span className="flex items-center gap-1.5"><Clock size={14} /> {selected.experience} experience</span>
                                                <span className="w-1 h-1 bg-slate-300 dark:bg-neutral-600 rounded-full" />
                                                <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {selected.education}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mt-5">
                                                <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColors[selected.status]}`}>{selected.status}</span>
                                                {selected.github && (
                                                    <a href="#" className="text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors">
                                                        <ExternalLink size={14} /> {selected.github}
                                                    </a>
                                                )}
                                                {selected.linkedin && (
                                                    <a href="#" className="text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors">
                                                        <ExternalLink size={14} /> {selected.linkedin}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* ── Contact + Actions Bar ────────────── */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/70 rounded-2xl p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/20"><Mail size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-neutral-500 font-bold">Email</p>
                                            <p className="text-sm text-slate-900 dark:text-white truncate font-medium">{selected.email}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/70 rounded-2xl p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><Phone size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-neutral-500 font-bold">Phone</p>
                                            <p className="text-sm text-slate-900 dark:text-white truncate font-medium">{selected.phone}</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-4 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow"
                                    >
                                        <CheckCircle2 size={18} /> Schedule Interview
                                    </motion.button>
                                </div>

                                {/* ── About ─────────────────────────────── */}
                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 tracking-tight">
                                        <Sparkles size={18} className="text-blue-500 dark:text-blue-400" /> AI Summary
                                    </h2>
                                    <p className="text-slate-700 dark:text-neutral-300 leading-relaxed text-sm">{selected.summary}</p>
                                </GlassCard>

                                {/* ── Skills + Strengths ────────────────── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <GlassCard>
                                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 tracking-tight">
                                            <Award size={18} className="text-purple-500 dark:text-purple-400" /> Technical Skills
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {selected.skills.map((skill, i) => (
                                                <span key={i} className="bg-slate-100 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700/50 text-slate-700 dark:text-neutral-200 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all cursor-default">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <GlassCard>
                                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 tracking-tight">
                                            <TrendingUp size={18} className="text-emerald-500 dark:text-emerald-400" /> Key Strengths
                                        </h2>
                                        <div className="space-y-3">
                                            {selected.strengths.map((s, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-sm text-slate-900 dark:text-neutral-200 font-medium">{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                </div>

                                {/* ── AI Insight ────────────────────────── */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl border border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-40 transform rotate-12 scale-150 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                        <Sparkles size={100} strokeWidth={1} className="text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2 relative z-10 text-white">
                                        <Sparkles size={20} /> Proprietary AI Insight
                                    </h2>
                                    <p className="text-sm text-blue-50 leading-relaxed relative z-10 font-medium">
                                        {selected.name}&apos;s profile shows a <strong className="text-white">97.3% behavioral alignment</strong> with your company culture profile.
                                        Based on historic hire success patterns, candidates with similar profiles have a <strong className="text-white">89% retention rate</strong> at the 2-year mark.
                                        We recommend fast-tracking this candidate to avoid competitor poaching.
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}