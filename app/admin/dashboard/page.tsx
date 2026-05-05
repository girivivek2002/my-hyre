"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
    Users, Briefcase, BarChart3, Shield, Search, Filter, 
    MoreHorizontal, Trash2, CheckCircle, XCircle, Zap,
    TrendingUp, Database, Activity, Globe, Loader2, Sparkles,
    FileText, UserCheck, UserPlus, Mail, ExternalLink, RefreshCw, LayoutDashboard, CalendarDays, Download
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// --- Components ---
function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-3xl p-6 shadow-premium dark:shadow-premium-dark relative overflow-hidden group ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function AdminDashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "overview";

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalResumes: 0,
        activeSyncs: 0,
        growth: "Live",
        systemHealth: "100%"
    });

    const [users, setUsers] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [resumes, setResumes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, usersRes, jobsRes, resumesRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/users?limit=50"),
                fetch("/api/admin/jobs?limit=50"),
                fetch("/api/admin/resumes?limit=50")
            ]);
            
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats({
                    totalUsers: data.stats.totalUsers || 0,
                    totalJobs: data.stats.totalJobs || 0,
                    totalResumes: data.stats.totalResumes || 0,
                    activeSyncs: data.stats.totalMessages || 0,
                    growth: "+Live",
                    systemHealth: "Optimal"
                });
            }

            if (usersRes.ok) setUsers((await usersRes.json()).users || []);
            if (jobsRes.ok) setJobs((await jobsRes.json()).jobs || []);
            if (resumesRes.ok) setResumes((await resumesRes.json()).resumes || []);

        } catch (error) {
            console.error("Failed to load admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id: string) => {
        if (!confirm("CRITICAL WARNING: Are you sure you want to permanently delete this user and all associated data?")) return;
        try {
            const res = await fetch("/api/admin/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchData();
            else alert("Failed to delete user.");
        } catch (err) { console.error(err); }
    };

    const handleDeleteJob = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this job?")) return;
        try {
            const res = await fetch("/api/admin/jobs", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchData();
            else alert("Failed to delete job.");
        } catch (err) { console.error(err); }
    };

    const handleDeleteResume = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this resume?")) return;
        try {
            const res = await fetch("/api/admin/resumes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchData();
            else alert("Failed to delete resume.");
        } catch (err) { console.error(err); }
    };

    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    // Filter Logic
    const filteredUsers = useMemo(() => users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())), [users, searchQuery]);
    const filteredJobs = useMemo(() => jobs.filter(j => j.title?.toLowerCase().includes(searchQuery.toLowerCase()) || j.company?.toLowerCase().includes(searchQuery.toLowerCase())), [jobs, searchQuery]);
    const filteredResumes = useMemo(() => resumes.filter(r => r.name?.toLowerCase().includes(searchQuery.toLowerCase())), [resumes, searchQuery]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    Initializing Platform Core...
                </div>
            </div>
        );
    }

    const renderTabs = () => (
        <div className="flex space-x-2 mb-8 bg-white/50 dark:bg-white/[0.02] p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.04] w-max overflow-x-auto">
            {[
                { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
                { id: "users", label: "Users", icon: <Users size={16} /> },
                { id: "jobs", label: "Jobs", icon: <Briefcase size={16} /> },
                { id: "resumes", label: "Resumes", icon: <FileText size={16} /> }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => router.push(`/admin/dashboard?tab=${tab.id}`)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all ${
                        activeTab === tab.id 
                        ? 'bg-white dark:bg-white/[0.08] shadow-md dark:shadow-none text-indigo-600 dark:text-white' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>
    );

    const renderOverview = () => (
        <div className="space-y-8">
            <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Network Users", value: stats.totalUsers, icon: <Users size={20} />, trend: stats.growth, color: "blue" },
                    { label: "Active Job Clusters", value: stats.totalJobs, icon: <Briefcase size={20} />, trend: "+8.4%", color: "indigo" },
                    { label: "Intelligence Vault", value: stats.totalResumes, icon: <Database size={20} />, trend: "Syncing", color: "violet" },
                    { label: "Core Availability", value: stats.systemHealth, icon: <Activity size={20} />, trend: "Stable", color: "emerald" }
                ].map((s, i) => (
                    <GlassCard key={i} className="group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${s.color}-500/10 text-${s.color}-500 border border-${s.color}-500/20 shadow-inner`}>
                                {s.icon}
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500`}>{s.trend}</span>
                        </div>
                        <h3 className="text-3xl font-black mb-1">{s.value}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                    </GlassCard>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVars} className="lg:col-span-2 space-y-8">
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-white/[0.04] flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-3">Recent Platform Activity</h2>
                            <button onClick={() => router.push('/admin/dashboard?tab=users')} className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">View All Users →</button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {users.slice(0, 5).map((u, i) => (
                                    <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-glow-indigo">
                                                {u.name?.slice(0, 2) || "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 capitalize">{u.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVars} className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 rounded-[40px] text-white shadow-glow-indigo relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                            <Shield size={120} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-3 relative z-10">
                            <Zap size={24} fill="white" /> Core Authority
                        </h2>
                        <p className="text-indigo-100 text-sm mb-8 font-medium leading-relaxed relative z-10">
                            You have full read/write permissions to the platform database. System protocols are under your direct control.
                        </p>
                        <div className="space-y-3 relative z-10">
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-white/20">Platform Settings</button>
                            <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">Emergency Lockdown</button>
                        </div>
                    </div>
                    <GlassCard>
                        <h3 className="font-bold mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-500" /> Server Architecture</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500">CPU LOAD</span>
                                    <span className="text-xs font-bold">12%</span>
                                </div>
                                <div className="w-full h-1 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[12%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500">MEMORY UTILIZATION</span>
                                    <span className="text-xs font-bold">2.4 GB</span>
                                </div>
                                <div className="w-full h-1 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[45%]" />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );

    const renderTableLayout = (title: string, columns: string[], rows: any[]) => (
        <motion.div variants={itemVars}>
            <GlassCard className="p-0 overflow-hidden min-h-[60vh]">
                <div className="p-6 border-b border-slate-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
                    <h2 className="text-xl font-bold flex items-center gap-3">{title}</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-64"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/50 dark:bg-white/[0.02] text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                {columns.map((col, i) => (
                                    <th key={i} className={`px-6 py-4 ${i === columns.length - 1 ? 'text-right' : ''}`}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">No records found.</td>
                                </tr>
                            ) : rows}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </motion.div>
    );

    const renderUsers = () => renderTableLayout(
        "User Ecosystem Control",
        ["Identity", "Assigned Role", "Creation Date", "Actions"],
        filteredUsers.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                            {u.name?.slice(0, 2) || "U"}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-500 capitalize">{u.role}</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all bg-red-500/10 rounded-lg" title="Delete User">
                        <Trash2 size={16} />
                    </button>
                </td>
            </tr>
        ))
    );

    const renderJobs = () => renderTableLayout(
        "Job Pipeline Operations",
        ["Position", "Shortlists Synced", "Status", "Actions"],
        filteredJobs.map((j) => (
            <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                    <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{j.title}</p>
                        <p className="text-[10px] text-slate-500">{j.company || j.recruiter?.companyName || "Unknown"}</p>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Users size={12} className="text-slate-400" />
                        <span className="text-xs font-bold">{j.apps || j.shortlists?.length || 0} Synced</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-[10px] font-black px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteJob(j.id)} className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all bg-red-500/10 rounded-lg" title="Delete Job">
                        <Trash2 size={16} />
                    </button>
                </td>
            </tr>
        ))
    );

    const renderResumes = () => renderTableLayout(
        "Intelligence Vault (Resumes)",
        ["Document Name", "Experience Level", "Upload Date", "Actions"],
        filteredResumes.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</p>
                            <p className="text-[10px] text-slate-500">{r.user?.name || "Unknown Owner"}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{r.experience} Years</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 text-right">
                    <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 transition-all bg-indigo-500/10 rounded-lg mr-2" title="Download">
                        <Download size={16} />
                    </button>
                    <button onClick={() => handleDeleteResume(r.id)} className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all bg-red-500/10 rounded-lg" title="Delete Resume">
                        <Trash2 size={16} />
                    </button>
                </td>
            </tr>
        ))
    );

    return (
        <DashboardLayout role="admin">
            <motion.div 
                variants={containerVars}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto px-4 sm:px-10 py-8 custom-scrollbar"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div variants={itemVars} className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Shield size={10} fill="currentColor" /> Admin Authority Active
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Platform <span className="text-gradient-primary">Intelligence</span></h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Global control node for Mr. Hyre ecosystem.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all">
                                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Sync Data
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-glow-indigo hover:scale-105 active:scale-95 transition-all">
                                <Zap size={14} fill="white" /> Generate Report
                            </button>
                        </div>
                    </motion.div>

                    {/* Dynamic Tab Navigation */}
                    <motion.div variants={itemVars}>
                        {renderTabs()}
                    </motion.div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'overview' && renderOverview()}
                            {activeTab === 'users' && renderUsers()}
                            {activeTab === 'jobs' && renderJobs()}
                            {activeTab === 'resumes' && renderResumes()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="mt-20 border-t border-slate-200 dark:border-white/[0.04] pt-8 text-center pb-12">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest flex items-center justify-center gap-3">
                            © {new Date().getFullYear()} Mr. Hyre Intelligence • Authority Version 8.4.2 (Stable)
                        </p>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex h-screen bg-[#FAFBFD] dark:bg-[#0A0A0F] items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
