"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, MapPin, Mail, Phone,
    GraduationCap, Clock, ExternalLink,
    Award, CheckCircle2, TrendingUp, Zap, CalendarDays, Loader2, Plus
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
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [candidatesLoading, setCandidatesLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchJobs = async () => {
            try {
                const res = await fetch("/api/recruiter/jobs", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data.jobs || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [router]);

    useEffect(() => {
        if (!selectedJobId) {
            setCandidates([]);
            setSelectedCandidateId(null);
            return;
        }

        const fetchCandidates = async () => {
            setCandidatesLoading(true);
            const token = localStorage.getItem("authToken");
            try {
                const url = selectedJobId === "talent-pool" 
                    ? "/api/recruiter/candidates" 
                    : `/api/recruiter/candidates?jobId=${selectedJobId}`;
                    
                const res = await fetch(url, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCandidates(data.candidates || []);
                    if (data.candidates?.length > 0) {
                        setSelectedCandidateId(data.candidates[0].id);
                    } else {
                        setSelectedCandidateId(null);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setCandidatesLoading(false);
            }
        };

        fetchCandidates();
    }, [selectedJobId]);

    const handleShortlist = async (candidateId: string, jobId: string) => {
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch("/api/recruiter/candidates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ candidateId, jobId }),
            });
            if (res.ok) {
                alert("Candidate synchronized to job pipeline.");
                // Refresh candidates if viewing a specific job
                if (selectedJobId !== "talent-pool") {
                    const freshRes = await fetch(`/api/recruiter/candidates?jobId=${selectedJobId}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (freshRes.ok) {
                        const data = await freshRes.json();
                        setCandidates(data.candidates || []);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
    const selectedJob = selectedJobId === "talent-pool" ? { title: "Talent Pool", id: "talent-pool" } : jobs.find(j => j.id === selectedJobId);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">
            <Loader2 className="animate-spin mr-2" /> Synchronizing Intelligence...
        </div>
    );

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar: Level 1 (Jobs) or Level 2 (Candidates) */}
            <div className="w-[420px] shrink-0 border-r border-slate-200 dark:border-neutral-800/60 flex flex-col bg-slate-100/50 dark:bg-neutral-950/20">
                <div className="p-6 pb-4 border-b border-slate-200 dark:border-neutral-800/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold tracking-tight tracking-tighter">
                            {selectedJobId ? "Citizen Nodes" : "Intelligence Hub"}
                        </h2>
                        <div className="flex gap-2">
                            {!selectedJobId && (
                                <button 
                                    onClick={() => router.push("/recruiter/post-job")}
                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all border border-blue-500/20"
                                    title="Post New Job Role"
                                >
                                    <Plus size={18} />
                                </button>
                            )}
                            {selectedJobId && (
                                <button 
                                    onClick={() => { setSelectedJobId(null); setSelectedCandidateId(null); }}
                                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                                >
                                    <ChevronDown size={14} className="rotate-90" /> All Sectors
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {selectedJobId && (
                        <div className="mb-4 bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl">
                            <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">{selectedJobId === 'talent-pool' ? 'Global Stream' : 'Active Sector'}</p>
                            <p className="text-sm font-bold truncate">{selectedJob?.title}</p>
                        </div>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={selectedJobId ? "Search candidates..." : "Search jobs or talent..."}
                            className="w-full bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 px-3 py-2 pl-10 rounded-xl text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {!selectedJobId ? (
                        /* Level 1: Jobs List + Talent Pool */
                        <>
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Recruitment Sectors</div>
                            {jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase())).map((j) => (
                                <div
                                    key={j.id}
                                    onClick={() => setSelectedJobId(j.id)}
                                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border border-transparent hover:bg-white dark:hover:bg-neutral-900 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-neutral-800 flex items-center justify-center">
                                        <Briefcase size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{j.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{j.applicants} shortlisted nodes</p>
                                    </div>
                                    <ChevronDown size={16} className="-rotate-90 text-slate-300" />
                                </div>
                            ))}

                            <div className="mt-6 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Talent Stream</div>
                            <div
                                onClick={() => setSelectedJobId("talent-pool")}
                                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border border-transparent hover:bg-white dark:hover:bg-neutral-900 group bg-blue-500/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Users size={20} className="text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate text-blue-600 dark:text-blue-400">Talent Pool</p>
                                    <p className="text-xs text-slate-500 truncate">Explore all available nodes</p>
                                </div>
                                <Sparkles size={16} className="text-blue-400" />
                            </div>
                        </>
                    ) : (
                        /* Level 2: Candidates List */
                        candidatesLoading ? (
                            <div className="flex items-center justify-center h-40 text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                                Extracting Nodes...
                            </div>
                        ) : filteredCandidates.length > 0 ? (
                            filteredCandidates.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => setSelectedCandidateId(c.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${selectedCandidateId === c.id ? 'bg-blue-500/10 border-blue-500/30' : 'border-transparent hover:bg-white dark:hover:bg-neutral-900'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${c.shortlistStatus ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-200 dark:bg-neutral-800'}`}>
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
                            ))
                        ) : (
                            <div className="text-center py-10 px-6">
                                <Users size={40} className="mx-auto text-slate-300 dark:text-neutral-800 mb-4" />
                                <p className="text-slate-500 font-medium mb-4">No candidates in this pipeline yet.</p>
                                <button 
                                    onClick={() => { setSelectedJobId("talent-pool"); setSelectedCandidateId(null); }}
                                    className="px-6 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                                >
                                    Source from Talent Pool
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Level 3: Candidate Details */}
            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {selectedCandidate ? (
                        <motion.div key={selectedCandidate.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
                            <GlassCard>
                                <div className="flex gap-6 items-start">
                                    <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-extrabold text-white">{selectedCandidate.initials}</div>
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-extrabold tracking-tight">{selectedCandidate.name}</h1>
                                        <p className="text-slate-500 text-base">{selectedCandidate.role}</p>
                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-neutral-500">
                                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {selectedCandidate.location}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedCandidate.experience} exp</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-neutral-900 border border-white/5 rounded-2xl p-4">
                                    <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Email Node</p>
                                    <p className="text-sm font-medium truncate">{selectedCandidate.email}</p>
                                </div>
                                
                                {!selectedCandidate.shortlistStatus ? (
                                    <div className="bg-white dark:bg-neutral-900 border border-white/5 rounded-2xl p-4">
                                        <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Align with Sector</p>
                                        <select 
                                            value={selectedJobId !== "talent-pool" ? selectedJobId || "" : ""}
                                            onChange={(e) => {
                                                if (e.target.value) handleShortlist(selectedCandidate.id, e.target.value);
                                            }}
                                            className="bg-transparent text-sm font-bold text-blue-500 focus:outline-none w-full cursor-pointer"
                                        >
                                            <option value="">Select Job...</option>
                                            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-neutral-900 border border-white/5 rounded-2xl p-4">
                                        <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Current Status</p>
                                        <p className="text-sm font-bold text-emerald-500 flex items-center gap-1.5">
                                            <CheckCircle2 size={14} /> {selectedCandidate.shortlistStatus || "SHORTLISTED"}
                                        </p>
                                    </div>
                                )}

                                <button 
                                    className="bg-blue-600 rounded-2xl p-4 flex items-center justify-center gap-2 text-white font-bold text-sm"
                                    onClick={() => router.push(`/recruiter/schedule?candidate=${selectedCandidateId}&job=${selectedJobId}`)}
                                >
                                    <CalendarDays size={18} />
                                    Schedule Interview
                                </button>
                            </div>

                            <GlassCard>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Sparkles size={18} className="text-blue-400" /> Intelligence Match Analysis
                                </h2>
                                <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                                    {selectedCandidate.matchAnalysis?.summary || selectedCandidate.summary}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase font-bold text-emerald-500 flex items-center gap-1.5 tracking-widest">
                                            <CheckCircle2 size={12} /> Strategic Strengths
                                        </p>
                                        <ul className="space-y-2">
                                            {(selectedCandidate.matchAnalysis?.strengths || ["Semantic profile alignment"]).map((s: string, i: number) => (
                                                <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1.5 tracking-widest">
                                            <Zap size={12} /> Optimization Gaps
                                        </p>
                                        <ul className="space-y-2">
                                            {(selectedCandidate.matchAnalysis?.gaps || ["No critical gaps detected"]).map((g: string, i: number) => (
                                                <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                                    {g}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </GlassCard>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4">Mastery Profile</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCandidate.skills.map((s: string, i: number) => (
                                            <span key={i} className="bg-white/5 border border-white/10 text-xs px-3 py-1.5 rounded-lg">{s}</span>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <ExternalLink size={18} className="text-emerald-400" /> Resume Architecture
                                    </h2>
                                    {selectedCandidate.resume ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{selectedCandidate.resume}</p>
                                                    <p className="text-[10px] uppercase font-bold text-emerald-500">High-Fidelity PDF</p>
                                                </div>
                                            </div>
                                            <button 
                                                className="w-full py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-2"
                                                onClick={() => alert(`Opening ${selectedCandidate.resume}... (Simulated)`)}
                                            >
                                                <ExternalLink size={14} /> View Document
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-slate-400">
                                                <Clock size={20} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-500">No resume uploaded yet</p>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Pending synchronization</p>
                                        </div>
                                    )}
                                </GlassCard>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-3xl border border-blue-500/30">
                                <h2 className="text-lg font-bold text-white mb-3">AI Alignment</h2>
                                <p className="text-sm text-blue-100">
                                    {selectedJobId === 'talent-pool' 
                                        ? "Profile has high semantic overlap with your current recruitment needs. Align to a sector for detailed scoring."
                                        : `Profile matches job requirements by ${selectedCandidate.match}%. Recommendation: Immediate Interview.`}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 font-bold uppercase tracking-widest text-center">
                            <Zap size={40} className="mb-4 text-zinc-800" />
                            {selectedJobId ? "Select a candidate node" : "Select an intelligence stream to view nodes"}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}