"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, Clock, MapPin,
    Calendar, Video, Phone, MessageSquare, CheckCircle2,
    Circle, AlertCircle, ArrowRight, Plus, CalendarDays,
    UserCheck, FileText, Star, Timer, ExternalLink
} from "lucide-react";

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
        <div onMouseMove={handleMouseMove} className={`group relative bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-3xl overflow-hidden shadow-premium dark:shadow-premium-dark ${className}`}>
            <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08), transparent 80%)` }} />
            <div className="absolute inset-0 bg-white/80 dark:bg-[#0A0A0F]/80 -z-10" />
            <div className="relative z-10 w-full h-full p-6">{children}</div>
        </div>
    );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const todayMeetings = [
    { id: 1, time: "09:00 AM", endTime: "09:45 AM", title: "Sarah Jenkins — Final Panel", type: "video" as const, candidate: "SJ", role: "Principal Product Designer", status: "confirmed", priority: "high" as const },
    { id: 2, time: "10:30 AM", endTime: "11:00 AM", title: "Team Standup — Hiring Sprint", type: "video" as const, candidate: null, role: "Internal Sync", status: "confirmed", priority: "medium" as const },
    { id: 3, time: "01:00 PM", endTime: "01:45 PM", title: "Michael Chen — Technical Screen", type: "video" as const, candidate: "MC", role: "Senior Fullstack Engineer", status: "confirmed", priority: "high" as const },
    { id: 4, time: "02:30 PM", endTime: "03:00 PM", title: "Elena Rodriguez — Culture Fit", type: "phone" as const, candidate: "ER", role: "Director of Marketing", status: "pending", priority: "medium" as const },
    { id: 5, time: "04:00 PM", endTime: "04:30 PM", title: "David Kim — Offer Discussion", type: "video" as const, candidate: "DK", role: "DevOps Architect", status: "confirmed", priority: "high" as const },
];

const upcomingMeetings = [
    { date: "Tomorrow", title: "Amara Okafor — ML Deep Dive", time: "10:00 AM", type: "video" as const, candidate: "AO" },
    { date: "Tomorrow", title: "Jordan Smith — System Design", time: "02:00 PM", type: "video" as const, candidate: "JS" },
    { date: "Thu, Apr 11", title: "Hiring Committee Review", time: "11:00 AM", type: "video" as const, candidate: null },
    { date: "Thu, Apr 11", title: "Priya Sharma — Portfolio Review", time: "03:30 PM", type: "video" as const, candidate: "PS" },
    { date: "Fri, Apr 12", title: "Q2 Recruitment Strategy", time: "09:00 AM", type: "video" as const, candidate: null },
];

const tasks = [
    { id: 1, text: "Send offer letter to David Kim", done: false, priority: "high" as const, due: "Today" },
    { id: 2, text: "Review Sarah Jenkins' portfolio references", done: false, priority: "high" as const, due: "Today" },
    { id: 3, text: "Update Frontend Engineer job scorecard", done: true, priority: "medium" as const, due: "Yesterday" },
    { id: 4, text: "Prepare system design questions for Jordan Smith", done: false, priority: "medium" as const, due: "Tomorrow" },
    { id: 5, text: "Schedule debrief with hiring committee", done: false, priority: "low" as const, due: "Thu" },
    { id: 6, text: "Sync candidate pipeline with ATS", done: true, priority: "low" as const, due: "Yesterday" },
];

const reminders = [
    { icon: <AlertCircle size={16} />, text: "Sarah Jenkins' offer deadline expires in 2 days", color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
    { icon: <Star size={16} />, text: "Michael Chen received a competing offer from Google", color: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
    { icon: <UserCheck size={16} />, text: "3 new candidates matched for DevOps Architect role", color: "text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20" },
    { icon: <FileText size={16} />, text: "Quarterly hiring report is due next Monday", color: "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20" },
];

const typeIcon = { video: <Video size={16} />, phone: <Phone size={16} />, chat: <MessageSquare size={16} /> };
const priorityColor = { high: "bg-red-500", medium: "bg-amber-500", low: "bg-indigo-500" };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SchedulePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [taskList, setTaskList] = useState(tasks);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        candidateId: "",
        jobId: "",
        date: "",
        time: "",
        platform: "Google Meet"
    });

    useEffect(() => {
        setMounted(true);
        fetchInterviews();
        fetchMeta();
        
        // Handle Query Params
        const params = new URLSearchParams(window.location.search);
        const cId = params.get("candidate");
        const jId = params.get("job");
        if (cId && jId) {
            setFormData(prev => ({ ...prev, candidateId: cId, jobId: jId }));
            setIsModalOpen(true);
        }
    }, []);

    const fetchMeta = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const [cRes, jRes] = await Promise.all([
                fetch("/api/recruiter/candidates?jobId=talent-pool", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("/api/recruiter/jobs", { headers: { "Authorization": `Bearer ${token}` } })
            ]);
            if (cRes.ok) {
                const cData = await cRes.json();
                setCandidates(cData.candidates || []);
            }
            if (jRes.ok) {
                const jData = await jRes.json();
                setJobs(jData.jobs || []);
            }
        } catch (err) {
            console.error("Meta Fetch Error:", err);
        }
    };

    const fetchInterviews = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/recruiter/interviews", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setInterviews(data.interviews);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Fetch Interviews Error:", err);
            setIsLoading(false);
        }
    };

    const handleSchedule = async () => {
        try {
            const token = localStorage.getItem("authToken");
            
            // 1. Ensure Shortlist exists
            const slRes = await fetch("/api/recruiter/candidates", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    candidateId: formData.candidateId, 
                    jobId: formData.jobId,
                    status: "INTERVIEW_SCHEDULED"
                })
            });
            
            if (!slRes.ok) throw new Error("Failed to sync shortlist");
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
                    date: formData.date,
                    time: formData.time,
                    platform: formData.platform
                })
            });

            if (intRes.ok) {
                setIsModalOpen(false);
                fetchInterviews();
                alert("Interview Scheduled Successfully!");
            }
        } catch (err) {
            console.error("Schedule Error:", err);
            alert("Error scheduling interview.");
        }
    };

    const toggleTask = (id: number) => {
        setTaskList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
    <motion.div variants={containerVars} initial="hidden" animate="visible"
        className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-20 custom-scrollbar">
        <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <motion.div variants={itemVars} className="mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
                                    Your <span className="text-gradient-primary">Schedule</span>
                                </h1>
                                <p className="text-slate-500 dark:text-neutral-400 text-lg flex items-center gap-2">
                                    <Calendar size={18} className="text-indigo-500" />
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} — {interviews.length} meetings
                                </p>
                            </div>
                            <motion.button 
                                onClick={() => setIsModalOpen(true)}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 btn-primary px-5 py-3 rounded-xl text-sm font-bold shadow-glow-indigo hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-shadow text-white">
                                <Plus size={18} strokeWidth={3} /> New Meeting
                            </motion.button>
                        </motion.div>

                        {/* Modal UI */}
                        <AnimatePresence>
                            {isModalOpen && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsModalOpen(false)}
                                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    />
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                        className="relative w-full max-w-lg"
                                    >
                                        <GlassCard className="!p-8">
                                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                                <CalendarDays size={24} className="text-indigo-500" /> Schedule Interview
                                            </h2>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Select Candidate</label>
                                                    <select 
                                                        value={formData.candidateId}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, candidateId: e.target.value }))}
                                                        className="w-full bg-slate-50 dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                                    >
                                                        <option value="">Select Candidate...</option>
                                                        {candidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Job Role</label>
                                                    <select 
                                                        value={formData.jobId}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
                                                        className="w-full bg-slate-50 dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                                    >
                                                        <option value="">Select Job...</option>
                                                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Date</label>
                                                        <input 
                                                            type="date"
                                                            value={formData.date}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                                            className="w-full bg-slate-50 dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Time</label>
                                                        <input 
                                                            type="time"
                                                            value={formData.time}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                                            className="w-full bg-slate-50 dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block">Platform</label>
                                                    <select 
                                                        value={formData.platform}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                                                        className="w-full bg-slate-50 dark:bg-[#111118] border border-slate-200 dark:border-white/[0.08] p-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                                    >
                                                        <option value="Google Meet">Google Meet</option>
                                                        <option value="Zoom">Zoom</option>
                                                        <option value="Microsoft Teams">Microsoft Teams</option>
                                                        <option value="In-Person">In-Person</option>
                                                    </select>
                                                </div>

                                                <div className="pt-4 flex gap-3">
                                                    <button 
                                                        onClick={() => setIsModalOpen(false)}
                                                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={handleSchedule}
                                                        className="flex-1 py-3 rounded-xl btn-primary text-sm shadow-glow-indigo hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                    >
                                                        Confirm Sync
                                                    </button>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* ── Today's Timeline ─────────────────────── */}
                        <motion.div variants={itemVars} className="mb-10">
                            <GlassCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                                        <Clock size={20} className="text-indigo-500" /> Today&apos;s Agenda
                                    </h2>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                                        {todayMeetings.filter(m => m.status === "confirmed").length} confirmed
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {interviews.length > 0 ? interviews.map((m, i) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i, type: "spring", stiffness: 300, damping: 24 }}
                                            className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Priority Dot */}
                                                <div className="flex flex-col items-center gap-1 shrink-0">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${m.status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                                    {i < interviews.length - 1 && <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-neutral-800" />}
                                                </div>

                                                <div className="w-20 sm:w-28 shrink-0">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{m.time || "TBD"}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-neutral-500">{m.date ? new Date(m.date).toLocaleDateString() : "Pending"}</p>
                                                </div>

                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-glow-indigo">
                                                    {m.shortlist.candidate.name.substring(0, 2).toUpperCase()}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{m.shortlist.candidate.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-neutral-500 truncate">{m.shortlist.job.title}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-neutral-800/50 shrink-0">
                                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800/80 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-neutral-700/50">
                                                    <Video size={16} />
                                                    <span className="capitalize hidden sm:inline">{m.platform}</span>
                                                </div>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${m.status === "SCHEDULED" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"}`}>
                                                    {m.status}
                                                </span>
                                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                    className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-3 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shrink-0 flex items-center gap-1.5">
                                                    <ExternalLink size={12} /> Join
                                                </motion.button>
                                            </div>
                                        </motion.div>

                                    )) : (
                                        <div className="p-12 text-center text-slate-400">
                                            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No interviews scheduled yet</p>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* ── Row: Upcoming + Tasks + Reminders ──── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                            {/* Upcoming This Week */}
                            <motion.div variants={itemVars} className="lg:col-span-1">
                                <GlassCard className="h-full">
                                    <h2 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                                        <CalendarDays size={18} className="text-purple-500 dark:text-purple-400" /> Coming Up
                                    </h2>
                                    <div className="space-y-3">
                                        {upcomingMeetings.map((m, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer">
                                                {m.candidate ? (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                                                        {m.candidate}
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-slate-500 dark:text-neutral-400 shrink-0 mt-0.5 border border-slate-300 dark:border-neutral-700/50">
                                                        <Users size={14} />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{m.title}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-neutral-500">
                                                        <span className="flex items-center gap-1"><Calendar size={10} /> {m.date}</span>
                                                        <span className="w-1 h-1 bg-slate-300 dark:bg-neutral-600 rounded-full" />
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {m.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Tasks */}
                            <motion.div variants={itemVars} className="lg:col-span-1">
                                <GlassCard className="h-full">
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                                            <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" /> Tasks
                                        </h2>
                                        <span className="text-xs text-slate-500 dark:text-neutral-500 font-medium">{taskList.filter(t => !t.done).length} remaining</span>
                                    </div>
                                    <div className="space-y-2">
                                        {taskList.map((t, i) => (
                                            <div key={t.id} onClick={() => toggleTask(t.id)}
                                                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${t.done ? 'bg-slate-50/50 dark:bg-neutral-900/20 border-slate-200/50 dark:border-neutral-800/30 opacity-60 dark:opacity-50' : 'bg-white dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800/50 hover:bg-slate-50 dark:hover:bg-neutral-800/40'}`}>
                                                <div className="mt-0.5 shrink-0">
                                                    {t.done ? (
                                                        <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />
                                                    ) : (
                                                        <Circle size={18} className="text-slate-300 dark:text-neutral-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${t.done ? 'line-through text-slate-400 dark:text-neutral-500' : 'text-slate-900 dark:text-white'}`}>{t.text}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${priorityColor[t.priority]}`} />
                                                        <span className="text-[11px] text-slate-500 dark:text-neutral-500">{t.due}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Reminders & Alerts */}
                            <motion.div variants={itemVars} className="lg:col-span-1">
                                <GlassCard className="h-full">
                                    <h2 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
                                        <AlertCircle size={18} className="text-amber-500 dark:text-amber-400" /> Alerts & Reminders
                                    </h2>
                                    <div className="space-y-3">
                                        {reminders.map((r, i) => (
                                            <motion.div key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className={`flex items-start gap-3 p-4 rounded-xl border ${r.color} cursor-pointer hover:scale-[1.01] transition-transform`}>
                                                <div className="mt-0.5 shrink-0">{r.icon}</div>
                                                <p className="text-sm font-medium leading-relaxed">{r.text}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>

                        {/* ── AI Insight ────────────────────────────── */}
                        <motion.div variants={itemVars} className="mb-10">
                            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 rounded-3xl border border-indigo-500/30 shadow-glow-indigo relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-40 transform rotate-12 scale-150 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                    <Sparkles size={100} strokeWidth={1} className="text-white" />
                                </div>
                                <h2 className="text-lg font-bold mb-3 flex items-center gap-2 relative z-10 text-white">
                                    <Sparkles size={20} /> Schedule Intelligence
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Timer size={16} className="text-blue-200" />
                                            <p className="text-xs text-blue-200 font-bold uppercase tracking-widest">Optimization</p>
                                        </div>
                                        <p className="text-sm text-blue-50 leading-relaxed font-medium">
                                            Moving Sarah&apos;s final panel to 9 AM aligns with her peak energy hours, increasing offer acceptance probability by <strong className="text-white">18%</strong>.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin size={16} className="text-blue-200" />
                                            <p className="text-xs text-blue-200 font-bold uppercase tracking-widest">Conflict Alert</p>
                                        </div>
                                        <p className="text-sm text-blue-50 leading-relaxed font-medium">
                                            Elena Rodriguez is in EST. Her 2:30 PM slot aligns with <strong className="text-white">her lunch break</strong> — consider rescheduling to 3:30 PM.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ArrowRight size={16} className="text-blue-200" />
                                            <p className="text-xs text-blue-200 font-bold uppercase tracking-widest">Velocity</p>
                                        </div>
                                        <p className="text-sm text-blue-50 leading-relaxed font-medium">
                                            Your pipeline velocity is <strong className="text-white">23% faster</strong> than industry average. Maintain cadence to close 3 hires this week.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div variants={itemVars} className="mt-4 text-center text-xs font-semibold tracking-widest text-slate-400 dark:text-neutral-600 uppercase border-t border-slate-200 dark:border-neutral-800/50 pt-8">
                            © {new Date().getFullYear()} MR. HYRE TECHNOLOGIES. ALL RIGHTS RESERVED.
                        </motion.div>

                    </div>
                </motion.div>
    );
}
