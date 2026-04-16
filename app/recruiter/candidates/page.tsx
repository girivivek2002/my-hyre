"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, MapPin, Mail, Phone,
    GraduationCap, Clock, ExternalLink,
    Award, CheckCircle2, TrendingUp, Zap, CalendarDays, Loader2
} from "lucide-react";

// --- Components ---

const statusColors: Record<string, string> = {
    "Verified": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Final Round": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Technical Screen": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Culture Fit": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Screening": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "New Match": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Interview Scheduled": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

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

export default function CandidatesPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [shortlistLoading, setShortlistLoading] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${token}` };
                const [cRes, jRes] = await Promise.all([
                    fetch("/api/recruiter/candidates", { headers }),
                    fetch("/api/recruiter/jobs", { headers })
                ]);

                if (cRes.ok) {
                    const cData = await cRes.json();
                    setCandidates(cData.candidates || []);
                    if (cData.candidates?.length > 0) setSelectedId(cData.candidates[0].id);
                }
                if (jRes.ok) {
                    const jData = await jRes.json();
                    setJobs(jData.jobs || []);
                    if (jData.jobs?.length > 0) setSelectedJobId(jData.jobs[0].id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleShortlist = async () => {
        if (!selectedId || !selectedJobId) return;
        setShortlistLoading(true);
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch("/api/recruiter/candidates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ candidateId: selectedId, jobId: selectedJobId }),
            });
            if (res.ok) {
                alert("Candidate successfully shortlisted!");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setShortlistLoading(false);
        }
    };

    const selected = candidates.find(c => c.id === selectedId);
    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">
            Synchronizing Citizen Nodes...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">

            <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-neutral-950 dark:to-[#050505] pointer-events-none -z-10 blur-[100px]" />

            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
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
                </div>
            </motion.div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="h-20 border-b border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md px-10 flex justify-between items-center shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            placeholder="Search citizens..."
                            className="bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 px-4 py-2.5 pl-12 rounded-full w-[400px] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {candidates[0]?.initials || "R"}
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="w-[420px] shrink-0 border-r border-slate-200 dark:border-neutral-800/60 flex flex-col bg-slate-100/50 dark:bg-neutral-950/20">
                        <div className="p-6 pb-4 border-b border-slate-200 dark:border-neutral-800/50">
                            <h2 className="text-xl font-bold tracking-tight mb-4 tracking-tighter">Citizen Pipeline</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Filter by name or role..."
                                    className="w-full bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 px-3 py-2 pl-10 rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {filtered.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => setSelectedId(c.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${selectedId === c.id ? 'bg-blue-500/10 border-blue-500/30' : 'border-transparent hover:bg-white dark:hover:bg-neutral-900'}`}
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-slate-200 dark:bg-neutral-800">
                                        {c.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{c.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{c.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-extrabold text-blue-400">{c.match}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {selected ? (
                                <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
                                    <GlassCard>
                                        <div className="flex gap-6 items-start">
                                            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-extrabold text-white">{selected.initials}</div>
                                            <div className="flex-1">
                                                <h1 className="text-3xl font-extrabold tracking-tight">{selected.name}</h1>
                                                <p className="text-slate-500 text-base">{selected.role}</p>
                                                <div className="flex flex-wrap gap-4 mt-4 text-sm text-neutral-500">
                                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {selected.location}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {selected.experience} exp</span>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-white dark:bg-neutral-900 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Email Node</p>
                                            <p className="text-sm font-medium truncate">{selected.email}</p>
                                        </div>
                                        <div className="bg-white dark:bg-neutral-900 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Target Authority</p>
                                            <select 
                                                value={selectedJobId} 
                                                onChange={e => setSelectedJobId(e.target.value)}
                                                className="bg-transparent text-sm font-bold text-blue-500 focus:outline-none w-full"
                                            >
                                                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                                                {jobs.length === 0 && <option value="">No Active Jobs</option>}
                                            </select>
                                        </div>
                                        <button 
                                            onClick={handleShortlist}
                                            disabled={shortlistLoading || jobs.length === 0}
                                            className="bg-blue-600 rounded-2xl p-4 flex items-center justify-center gap-2 text-white font-bold text-sm disabled:opacity-50"
                                        >
                                            {shortlistLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                            Shortlist Node
                                        </button>
                                    </div>

                                    <GlassCard>
                                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Sparkles size={18} className="text-blue-400" /> AI Architecture Summary
                                        </h2>
                                        <p className="text-neutral-300 text-sm leading-relaxed">{selected.summary}</p>
                                    </GlassCard>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <GlassCard>
                                            <h2 className="text-lg font-bold mb-4">Mastery Profile</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {selected.skills.map((s: string, i: number) => (
                                                    <span key={i} className="bg-white/5 border border-white/10 text-xs px-3 py-1.5 rounded-lg">{s}</span>
                                                ))}
                                            </div>
                                        </GlassCard>
                                        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-3xl border border-blue-500/30">
                                            <h2 className="text-lg font-bold text-white mb-3">AI Alignment</h2>
                                            <p className="text-sm text-blue-100">Profile matches company ethos by 97.4%. Recommendation: Immediate Shortlist.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest">Select a candidate node</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}