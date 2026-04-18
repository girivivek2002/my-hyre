"use client";
import React, { ReactNode, MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, TrendingUp, TrendingDown,
    Clock, Target, Zap, Eye, UserCheck, ArrowUpRight, ArrowDownRight,
    Globe, Calendar, Filter, CalendarDays, Loader2, AlertCircle
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
            <div className="relative z-10 w-full h-full p-4 sm:p-6">{children}</div>
        </div>
    );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data, color }: { data: number[], color: string }) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end gap-1 h-16">
            {data.map((val, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / max) * 100}%` }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 15 }}
                    className={`flex-1 rounded-t-sm ${color} min-h-[4px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
                />
            ))}
        </div>
    );
}

// ─── Horizontal Progress Bar ──────────────────────────────────────────────────
function ProgressBar({ label, value, max, color, delay = 0 }: { label: string, value: number, max: number, color: string, delay?: number }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-700 dark:text-neutral-300 font-medium">{label}</span>
                <span className="text-slate-500 dark:text-neutral-500 font-bold">{pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-neutral-800/80 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay, duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );
}

// ─── Donut Segment (CSS only) ─────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string, value: number, color: string }[] }) {
    const total = segments.reduce((s, x) => s + x.value, 0);
    let cumulative = 0;
    const gradientParts = segments.map(seg => {
        const start = (cumulative / total) * 360;
        cumulative += seg.value;
        const end = (cumulative / total) * 360;
        return `${seg.color} ${start}deg ${end}deg`;
    });
    return (
        <div className="flex flex-col items-center gap-6">
            <div
                className="w-40 h-40 rounded-full relative shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}
            >
                <div className="absolute inset-4 rounded-full bg-slate-50 dark:bg-neutral-950 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{total}</p>
                        <p className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-bold">Total</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 px-2">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-[10px] sm:text-xs text-slate-600 dark:text-neutral-400 font-medium whitespace-nowrap">{seg.label} <span className="text-slate-900 dark:text-white font-bold">{seg.value}</span></span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const router = useRouter();
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchAnalytics = async () => {
            try {
                const res = await fetch("/api/recruiter/analytics", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to synchronize analytics nodes.");
                const result = await res.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [router]);

    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
    };
    const itemVars: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const weeklyApplicants = [42, 58, 35, 72, 65, 80, 91];
    const weeklyHires = [4, 6, 3, 8, 5, 7, 9];

    return (
        <motion.div
            variants={containerVars} initial="hidden" animate="visible"
            className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-20 custom-scrollbar"
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500 animate-pulse">
                    <Loader2 size={40} className="animate-spin text-blue-500" />
                    <p className="font-bold uppercase tracking-widest text-sm">Synchronizing Intelligence Stream...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-red-500">
                    <AlertCircle size={40} />
                    <p className="font-bold uppercase tracking-widest text-sm">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-slate-200 dark:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 dark:text-white mt-2">Retry Connection</button>
                </div>
            ) : data && (

                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <motion.div variants={itemVars} className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                            <div className="max-w-xl">
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white leading-tight">
                                    Recruitment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Analytics</span>
                                </h1>
                                <p className="text-slate-500 dark:text-neutral-400 text-sm sm:text-lg flex items-start sm:items-center gap-2">
                                    <Sparkles size={18} className="text-blue-500 dark:text-blue-400 shrink-0 mt-1 sm:mt-0" />
                                    <span>Real-time intelligence across your pipeline.</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scroll-hide">
                                <button className="whitespace-nowrap flex items-center gap-2 bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-neutral-400 transition-all">
                                    <Calendar size={14} /> Last 30 Days
                                </button>
                                <button className="whitespace-nowrap flex items-center gap-2 bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-neutral-400 transition-all">
                                    <Filter size={14} /> Filter
                                </button>
                            </div>
                        </motion.div>

                        {/* ── KPI Row ────────────────────────────────── */}
                        <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                            {[
                                { title: "Total Applications", value: data.kpis.totalApplications, trend: "+18%", positive: true, icon: <Users size={22} className="text-blue-400" />, sub: "vs last month" },
                                { title: "Avg. Time to Hire", value: data.kpis.avgTimeToHire, trend: "-3 days", positive: true, icon: <Clock size={22} className="text-emerald-400" />, sub: "from 17 days" },
                                { title: "Offer Acceptance", value: data.kpis.offerAcceptance, trend: "+5%", positive: true, icon: <UserCheck size={22} className="text-purple-400" />, sub: "industry avg 72%" },
                                { title: "Cost per Hire", value: data.kpis.costPerHire, trend: "-12%", positive: true, icon: <Target size={22} className="text-amber-400" />, sub: "from $2,432" },
                            ].map((kpi, i) => (
                                <GlassCard key={i}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-slate-100 dark:bg-neutral-800/50 rounded-xl border border-slate-200 dark:border-neutral-700/50 shadow-inner">
                                            {kpi.icon}
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${kpi.positive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                                            {kpi.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {kpi.trend}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-neutral-400 font-medium text-sm mb-1">{kpi.title}</p>
                                    <h2 className="text-3xl font-extrabold mb-1 text-slate-900 dark:text-white">{kpi.value}</h2>
                                    <p className="text-[11px] text-slate-400 dark:text-neutral-500">{kpi.sub}</p>
                                </GlassCard>
                            ))}
                        </motion.div>

                        {/* ── Charts Row ─────────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                            {/* Weekly Applicants */}
                            <motion.div variants={itemVars} className="lg:col-span-2">
                                <GlassCard>
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Weekly Application Volume</h2>
                                            <p className="text-xs text-slate-500 dark:text-neutral-500 mt-1">Applicants received per day this week</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-neutral-500">
                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Applicants</span>
                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hires</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-8">
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-3 font-semibold uppercase tracking-widest">Applicants</p>
                                            <MiniBarChart data={data.weeklyVolume.applicants} color="bg-blue-500" />
                                            <div className="flex justify-between mt-2 text-[10px] text-slate-400 dark:text-neutral-600 font-medium">
                                                {data.weeklyVolume.labels.map(d => <span key={d}>{d}</span>)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-3 font-semibold uppercase tracking-widest">Hires</p>
                                            <MiniBarChart data={data.weeklyVolume.hires} color="bg-emerald-500" />
                                            <div className="flex justify-between mt-2 text-[10px] text-slate-400 dark:text-neutral-600 font-medium">
                                                {data.weeklyVolume.labels.map(d => <span key={d}>{d}</span>)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-neutral-800/50">
                                        <div>
                                            <p className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-bold">Peak Day</p>
                                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{data.weeklyVolume.peakDay}</p>
                                            <p className="text-xs text-slate-500 dark:text-neutral-400">{Math.max(...data.weeklyVolume.applicants)} applicants</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-bold">Weekly Total</p>
                                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{data.weeklyVolume.total}</p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400">+22% from prev</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-widest font-bold">Conversion</p>
                                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{data.weeklyVolume.conversion}</p>
                                            <p className="text-xs text-slate-500 dark:text-neutral-400">applicant → hire</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Source Donut */}
                            <motion.div variants={itemVars}>
                                <GlassCard className="h-full flex flex-col">
                                    <h2 className="text-lg font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Source Breakdown</h2>
                                    <p className="text-xs text-slate-500 dark:text-neutral-500 mb-6">Where your candidates come from</p>
                                    <div className="flex-1 flex items-center justify-center">
                                        <DonutChart segments={data.sources} />
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>

                        {/* ── Funnel + Pipeline ──────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                            {/* Hiring Funnel */}
                            <motion.div variants={itemVars}>
                                <GlassCard>
                                    <h2 className="text-lg font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Hiring Funnel</h2>
                                    <p className="text-xs text-slate-500 dark:text-neutral-500 mb-6">Conversion rates across pipeline stages</p>
                                    <div className="space-y-5">
                                        {data.funnel.map((item: any, idx: number) => (
                                            <ProgressBar key={idx} label={item.label} value={item.value} max={data.funnel[0].value} color={["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-violet-500", "bg-amber-500", "bg-emerald-500"][idx] || "bg-blue-500"} delay={0.1 * (idx + 1)} />
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Top Performing Jobs */}
                            <motion.div variants={itemVars}>
                                <GlassCard>
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Top Performing Roles</h2>
                                            <p className="text-xs text-slate-500 dark:text-neutral-500 mt-1">Highest application-to-hire conversion</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {data.topRoles.map((job: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-500 dark:text-neutral-400 font-bold text-sm border border-slate-200 dark:border-neutral-700/50">
                                                        #{i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{job.role}</p>
                                                        <p className="text-xs text-slate-500 dark:text-neutral-500">{job.apps} applicants · {job.hires} hires</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{job.conversion}</p>
                                                    <p className={`text-[11px] font-semibold flex items-center gap-1 justify-end ${job.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {job.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                        {job.trend}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>

                        {/* ── AI Insight + Diversity ──────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                            {/* AI Insight */}
                            <motion.div variants={itemVars} className="lg:col-span-2">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl border border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-40 transform rotate-12 scale-150 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                        <Sparkles size={100} strokeWidth={1} className="text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10 text-white">
                                        <Sparkles size={20} /> AI-Powered Recommendations
                                    </h2>
                                    <div className="space-y-4 relative z-10">
                                        {data.insights.map((item: any, i: number) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                                <p className="text-sm text-blue-50 leading-relaxed font-medium mb-2">{item.insight}</p>
                                                <button className="text-xs text-white font-bold flex items-center gap-1 hover:underline underline-offset-2">
                                                    <Zap size={12} /> {item.action}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Geographic Distribution */}
                            <motion.div variants={itemVars}>
                                <GlassCard className="h-full">
                                    <h2 className="text-lg font-bold tracking-tight mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                                        <Globe size={18} className="text-slate-400 dark:text-neutral-400" /> Talent Geography
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-neutral-500 mb-6">Where your top applicants are located</p>
                                    <div className="space-y-4">
                                        {[
                                            { region: "San Francisco Bay Area", count: 892, pct: 21 },
                                            { region: "New York Metro", count: 634, pct: 15 },
                                            { region: "Remote (Global)", count: 1265, pct: 30 },
                                            { region: "London / EU", count: 507, pct: 12 },
                                            { region: "Austin / Denver", count: 423, pct: 10 },
                                            { region: "Other", count: 497, pct: 12 },
                                        ].map((loc, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" style={{ opacity: 0.4 + (loc.pct / 100) * 2 }} />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{loc.region}</p>
                                                        <p className="text-[11px] text-slate-500 dark:text-neutral-500">{loc.count.toLocaleString()} applicants</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-neutral-300 shrink-0 ml-3">{loc.pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <motion.div variants={itemVars} className="mt-4 text-center text-xs font-semibold tracking-widest text-neutral-600 uppercase border-t border-neutral-800/50 pt-8">
                            © {new Date().getFullYear()} MR. HYRE TECHNOLOGIES. ALL RIGHTS RESERVED.
                        </motion.div>

                    </div>
            )}
        </motion.div>
    );
}
