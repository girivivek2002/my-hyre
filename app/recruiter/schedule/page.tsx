"use client";
import React, { ReactNode, MouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
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
        <div onMouseMove={handleMouseMove} className={`group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-slate-200 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${className}`}>
            <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)` }} />
            <div className="absolute inset-0 bg-slate-50/80 dark:bg-neutral-950/80 -z-10" />
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
    { icon: <UserCheck size={16} />, text: "3 new candidates matched for DevOps Architect role", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
    { icon: <FileText size={16} />, text: "Quarterly hiring report is due next Monday", color: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20" },
];

const typeIcon = { video: <Video size={16} />, phone: <Phone size={16} />, chat: <MessageSquare size={16} /> };
const priorityColor = { high: "bg-red-500", medium: "bg-amber-500", low: "bg-blue-500" };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SchedulePage() {
    const router = useRouter();
    const [taskList, setTaskList] = useState(tasks);

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
                                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Schedule</span>
                                </h1>
                                <p className="text-slate-500 dark:text-neutral-400 text-lg flex items-center gap-2">
                                    <Calendar size={18} className="text-blue-500 dark:text-blue-400" />
                                    Wednesday, April 9, 2026 — {todayMeetings.length} meetings today
                                </p>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow">
                                <Plus size={18} strokeWidth={3} /> New Meeting
                            </motion.button>
                        </motion.div>

                        {/* ── Today's Timeline ─────────────────────── */}
                        <motion.div variants={itemVars} className="mb-10">
                            <GlassCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                                        <Clock size={20} className="text-blue-500 dark:text-blue-400" /> Today&apos;s Agenda
                                    </h2>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                                        {todayMeetings.filter(m => m.status === "confirmed").length} confirmed
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {todayMeetings.map((m, i) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i, type: "spring", stiffness: 300, damping: 24 }}
                                            className="group flex items-center gap-4 bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
                                        >
                                            {/* Priority Dot */}
                                            <div className="flex flex-col items-center gap-1 shrink-0">
                                                <div className={`w-2.5 h-2.5 rounded-full ${priorityColor[m.priority]} shadow-none dark:shadow-[0_0_8px_rgba(255,255,255,0.15)]`} />
                                                {i < todayMeetings.length - 1 && <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800" />}
                                            </div>

                                            {/* Time */}
                                            <div className="w-28 shrink-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{m.time}</p>
                                                <p className="text-[11px] text-slate-500 dark:text-neutral-500">{m.endTime}</p>
                                            </div>

                                            {/* Avatar */}
                                            {m.candidate ? (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                                    {m.candidate}
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-500 dark:text-neutral-400 shrink-0 border border-slate-200 dark:border-neutral-700/50">
                                                    <Users size={18} />
                                                </div>
                                            )}

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{m.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-neutral-500 truncate">{m.role}</p>
                                            </div>

                                            {/* Type + Status */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800/80 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-neutral-700/50">
                                                    {typeIcon[m.type]}
                                                    <span className="capitalize">{m.type}</span>
                                                </div>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${m.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"}`}>
                                                    {m.status === "confirmed" ? "Confirmed" : "Pending"}
                                                </span>
                                            </div>

                                            {/* Join button */}
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors shrink-0 flex items-center gap-1.5">
                                                <ExternalLink size={12} /> Join
                                            </motion.button>
                                        </motion.div>
                                    ))}
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
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl border border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)] relative overflow-hidden group">
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
