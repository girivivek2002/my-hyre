"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, MapPin, Mail, Phone,
    Award, CheckCircle2, TrendingUp, Zap, CalendarDays, Loader2, Plus,
    X, FileText, Globe, Video, Clock, ExternalLink, MessageSquare
} from "lucide-react";
import { resume } from "react-dom/server";

// --- Components ---

const statusColors: Record<string, string> = {
    "Verified": "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
    "Final Round": "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
    "Technical Screen": "bg-indigo-500/15 text-indigo-500 border-indigo-500/25",
    "Culture Fit": "bg-violet-500/15 text-violet-500 border-violet-500/25",
    "Screening": "bg-amber-500/15 text-amber-500 border-amber-500/25",
    "New Match": "bg-cyan-500/15 text-cyan-500 border-cyan-500/25",
    "Interview Scheduled": "bg-indigo-500/15 text-indigo-500 border-indigo-500/25",
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
        <div onMouseMove={handleMouseMove} className={`group relative bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-3xl overflow-hidden shadow-premium dark:shadow-premium-dark ${className}`}>
            <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08), transparent 80%)` }} />
            <div className="absolute inset-0 bg-white/80 dark:bg-[#0A0A0F]/80 -z-10" />
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
    
    // Modals state
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedulingInProgress, setSchedulingInProgress] = useState(false);
    const [scheduleData, setScheduleData] = useState({
        date: "",
        time: "",
        platform: "Google Meet"
    });
    const [isMobileDetailView, setIsMobileDetailView] = useState(false);

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

    const handleScheduleConfirm = async () => {
        if (!selectedCandidateId || !selectedJobId || !scheduleData.date || !scheduleData.time) {
            alert("Please fill in all scheduling details.");
            return;
        }

        setSchedulingInProgress(true);
        const token = localStorage.getItem("authToken");
        try {
            const targetJobId = selectedJobId === "talent-pool" ? jobs[0]?.id : selectedJobId;
            
            if (!targetJobId) {
                throw new Error("You must have at least one active job posting to schedule an interview. Please create a job first.");
            }

            // 1. Ensure Shortlist exists and update status
            const slRes = await fetch("/api/recruiter/candidates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    candidateId: selectedCandidateId, 
                    jobId: targetJobId,
                    status: "INTERVIEW_SCHEDULED" 
                }),
            });

            if (!slRes.ok) throw new Error("Failed to update shortlist status");
            const slData = await slRes.json();

            // 2. Create Interview
            const intRes = await fetch("/api/recruiter/interviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    shortlistId: slData.shortlist.id,
                    date: scheduleData.date,
                    time: scheduleData.time,
                    platform: scheduleData.platform
                })
            });

            if (intRes.ok) {
                alert("Interview Scheduled successfully!");
                setIsScheduleModalOpen(false);
                router.push("/recruiter/schedule");
            } else {
                const errorData = await intRes.json();
                console.error("Interview API Error:", errorData);
                throw new Error(errorData.error || "Failed to schedule interview");
            }
        } catch (err: any) {
            console.error("Scheduling workflow error:", err);
            alert(`Error: ${err.message || "Failed to schedule interview. Please check if you have active job roles."}`);
        } finally {
            setSchedulingInProgress(false);
        }
    };

    const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
    const selectedJob = selectedJobId === "talent-pool" ? { title: "Talent Pool", id: "talent-pool" } : (jobs || []).find(j => j.id === selectedJobId);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Synchronizing Intelligence...</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            {/* Sidebar: Level 1 (Jobs) or Level 2 (Candidates) */}
            <div className={`w-full md:w-[420px] shrink-0 border-r border-slate-200 dark:border-white/[0.04] flex flex-col bg-slate-50/50 dark:bg-[#0A0A0F]/50 transition-all duration-300 ${isMobileDetailView ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 pb-4 border-b border-slate-200 dark:border-white/[0.04]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold tracking-tight tracking-tighter">
                            {selectedJobId ? "Citizen Nodes" : "Intelligence Hub"}
                        </h2>
                        <div className="flex gap-2">
                            {!selectedJobId && (
                                <button 
                                    onClick={() => router.push("/recruiter/post-job")}
                                    className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
                                    title="Post New Job Role"
                                >
                                    <Plus size={18} />
                                </button>
                            )}
                            {selectedJobId && (
                                <button 
                                    onClick={() => { setSelectedJobId(null); setSelectedCandidateId(null); }}
                                    className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
                                >
                                    <ChevronDown size={14} className="rotate-90" /> All Sectors
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {selectedJobId && (
                        <div className="mb-4 bg-indigo-500/10 border border-indigo-500/25 p-3 rounded-xl">
                            <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">{selectedJobId === 'talent-pool' ? 'Global Stream' : 'Active Sector'}</p>
                            <p className="text-sm font-bold truncate">{selectedJob?.title}</p>
                        </div>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={selectedJobId ? "Search candidates..." : "Search jobs or talent..."}
                            className="w-full bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] px-3 py-2 pl-10 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
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
                                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border border-transparent hover:bg-white dark:hover:bg-white/[0.02] group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center border border-slate-200 dark:border-white/[0.06]">
                                        <Briefcase size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{j.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{j.applicants} shortlisted nodes</p>
                                    </div>
                                    <ChevronDown size={16} className="-rotate-90 text-slate-300" />
                                </div>
                            ))}

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
                                    onClick={() => {
                                        setSelectedCandidateId(c.id);
                                        setIsMobileDetailView(true);
                                    }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${selectedCandidateId === c.id ? 'bg-indigo-500/10 border-indigo-500/25' : 'border-transparent hover:bg-white dark:hover:bg-white/[0.02]'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${c.shortlistStatus ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-200 dark:bg-neutral-800'}`}>
                                        {c.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{c.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{c.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-extrabold ${Number(c.match) >= 80 ? 'text-emerald-500' : Number(c.match) >= 50 ? 'text-amber-500' : 'text-rose-400'}`}>{c.match}%</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 px-6">
                                <Users size={40} className="mx-auto text-slate-300 dark:text-neutral-800 mb-4" />
                                <p className="text-slate-500 font-medium mb-4">No candidates in this pipeline yet.</p>
                                <button 
                                    onClick={() => router.push("/recruiter/post-job")}
                                    className="px-6 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                                >
                                    Create New Job Sector
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Level 3: Candidate Details */}
            <div className={`flex-1 overflow-y-auto px-4 sm:px-8 py-8 custom-scrollbar transition-all duration-300 ${isMobileDetailView ? 'flex' : 'hidden md:flex'}`}>
                {/* Mobile Back Button */}
                <div className="md:hidden mb-6">
                    <button 
                        onClick={() => setIsMobileDetailView(false)}
                        className="flex items-center gap-2 text-indigo-500 font-bold text-sm"
                    >
                        <ChevronDown size={18} className="rotate-90" /> Back to List
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {selectedCandidate ? (
                        <motion.div key={selectedCandidate.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
                            <GlassCard>
                                <div className="flex gap-6 items-start">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-glow-indigo">{selectedCandidate.initials}</div>
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
                                    className="btn-primary rounded-2xl p-4 flex items-center justify-center gap-2 text-sm bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100"
                                    onClick={() => router.push(`/recruiter/messages?candidateId=${selectedCandidateId}`)}
                                >
                                    <MessageSquare size={18} />
                                    Message
                                </button>
                                <button 
                                    className="btn-primary rounded-2xl p-4 flex items-center justify-center gap-2 text-sm"
                                    onClick={() => setIsScheduleModalOpen(true)}
                                >
                                    <CalendarDays size={18} />
                                    Schedule Interview
                                </button>
                            </div>

                            <GlassCard>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Sparkles size={18} className="text-indigo-400" /> Intelligence Match Analysis
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
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
                                            <span key={i} className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-xs px-3 py-1.5 rounded-lg font-medium">{s}</span>
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
                                                onClick={() => {
                                                    if (selectedCandidate.resume) {
                                                        window.open(selectedCandidate.fileUrl, '_blank');
                                                        
                                                    } else {
                                                        setIsResumeModalOpen(true);
                                                    }
                                                }}
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

                            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 rounded-3xl border border-indigo-500/30 shadow-glow-indigo">
                                <h2 className="text-lg font-bold text-white mb-3">AI Alignment</h2>
                                <p className="text-sm text-indigo-100">
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

                {/* Modals */}
                <AnimatePresence>
                    {isResumeModalOpen && selectedCandidate && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsResumeModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
                                <div className="bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/[0.1] rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl">
                                    <div className="p-8 border-b border-slate-100 dark:border-white/[0.05] flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">{selectedCandidate.initials}</div>
                                            <div>
                                                <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedCandidate.role}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsResumeModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                        <section>
                                            <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">Professional Biography</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{selectedCandidate.summary}</p>
                                        </section>
                                        <div className="grid grid-cols-2 gap-8">
                                            <section>
                                                <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">Core Intelligence</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedCandidate.skills.map((s: string, i: number) => (
                                                        <span key={i} className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[10px] px-3 py-1.5 rounded-lg font-bold">{s}</span>
                                                    ))}
                                                </div>
                                            </section>
                                            <section>
                                                <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">Metadata</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-xs text-slate-500"><MapPin size={14} /> {selectedCandidate.location}</div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500"><Clock size={14} /> {selectedCandidate.experience} Experience</div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500"><Mail size={14} /> {selectedCandidate.email}</div>
                                                </div>
                                            </section>
                                        </div>
                                        <section className="bg-slate-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/[0.05]">
                                            <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Sparkles size={14} /> AI Recommendation
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                "{selectedCandidate.matchAnalysis?.summary}"
                                            </p>
                                        </section>
                                    </div>
                                    <div className="p-6 border-t border-slate-100 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
                                        <button onClick={() => setIsResumeModalOpen(false)} className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm shadow-xl transition-all hover:scale-[1.01]">
                                            Close Intelligence Profile
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {isScheduleModalOpen && selectedCandidate && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsScheduleModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg">
                                <div className="bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/[0.1] rounded-[32px] p-8 shadow-2xl space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold flex items-center gap-3">
                                            <CalendarDays size={24} className="text-indigo-500" /> Schedule Sync
                                        </h2>
                                        <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">{selectedCandidate.initials}</div>
                                            <div>
                                                <p className="text-sm font-bold">{selectedCandidate.name}</p>
                                                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{selectedCandidate.role}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                                                <input type="date" value={scheduleData.date} onChange={e => setScheduleData(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] p-3.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Time</label>
                                                <input type="time" value={scheduleData.time} onChange={e => setScheduleData(prev => ({ ...prev, time: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] p-3.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Platform</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Google Meet", "Zoom", "MS Teams", "In-Person"].map(p => (
                                                    <button key={p} onClick={() => setScheduleData(prev => ({ ...prev, platform: p }))} className={`py-3 rounded-xl border text-xs font-bold transition-all ${scheduleData.platform === p ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-transparent border-slate-200 dark:border-white/[0.08] text-slate-500 hover:border-indigo-500/50'}`}>
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => setIsScheduleModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleScheduleConfirm} 
                                            disabled={schedulingInProgress}
                                            className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                        >
                                            {schedulingInProgress ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Confirm Sync"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}