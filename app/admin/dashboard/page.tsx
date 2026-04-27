"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, Briefcase, BarChart3, Shield, Search, Filter, 
    MoreHorizontal, Trash2, CheckCircle, XCircle, Zap,
    TrendingUp, Database, Activity, Globe, Loader2, Sparkles,
    FileText, UserCheck, UserPlus, Mail, ExternalLink, RefreshCw
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// --- Components ---

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white/70 dark:bg-[#111118]/70 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-3xl p-6 shadow-premium dark:shadow-premium-dark relative overflow-hidden group ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function AdminDashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "overview";

    const [stats, setStats] = useState({
        totalUsers: 1284,
        totalJobs: 452,
        totalResumes: 890,
        activeSyncs: 124,
        growth: "+14.2%",
        systemHealth: "99.9%"
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const containerVars = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    Initializing Platform Core...
                </div>
            </div>
        );
    }

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
                    <motion.div variants={itemVars} className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Shield size={10} fill="currentColor" /> Admin Authority Active
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Platform <span className="text-gradient-primary">Intelligence</span></h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Global control node for Mr. Hyre ecosystem.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all">
                                <RefreshCw size={14} /> Refresh Data
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-glow-indigo hover:scale-105 active:scale-95 transition-all">
                                <Zap size={14} fill="white" /> Generate Report
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
                            </GlassCard>
                        ))}
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Interactive Tables Section */}
                        <motion.div variants={itemVars} className="lg:col-span-2 space-y-8">
                            <GlassCard className="p-0 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        {activeTab === 'users' ? 'User Ecosystem' : activeTab === 'jobs' ? 'Job Clusters' : 'Platform Operations'}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                            <input 
                                                type="text" 
                                                placeholder="Global query..." 
                                                className="bg-slate-100 dark:bg-white/[0.03] border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-64"
                                            />
                                        </div>
                                        <button className="p-2 bg-slate-100 dark:bg-white/[0.03] rounded-xl text-slate-500 hover:text-indigo-500 transition-colors">
                                            <Filter size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-white/[0.01] text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                                <th className="px-6 py-4">Identity</th>
                                                <th className="px-6 py-4">Role/Cluster</th>
                                                <th className="px-6 py-4">Security Level</th>
                                                <th className="px-6 py-4 text-right">Authority</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {activeTab === 'users' ? (
                                                [
                                                    { name: "Ayush Rajput", email: "ayush@mrhyre.com", role: "Super Admin", level: "L10", status: "Active" },
                                                    { name: "John Doe", email: "john@google.com", role: "Recruiter", level: "L4", status: "Verified" },
                                                    { name: "Sarah Smith", email: "sarah@talentsys.io", role: "Candidate", level: "L1", status: "Active" },
                                                    { name: "Dev Node 1", email: "api@hyre.io", role: "System Bot", level: "L8", status: "Secure" },
                                                ].map((u, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                                    {u.name.slice(0, 2).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</p>
                                                                    <p className="text-[10px] text-slate-500">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-500">{u.role}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${u.level.startsWith('L10') ? 'bg-fuchsia-500' : 'bg-emerald-500'}`} />
                                                                <span className="text-xs font-bold">{u.level}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 transition-all">
                                                                <MoreHorizontal size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                [
                                                    { title: "Senior AI Engineer", company: "NeuroTech", apps: 124, status: "Open" },
                                                    { title: "Frontend Architect", company: "Vercel", apps: 89, status: "Urgent" },
                                                    { title: "Data Scientist", company: "OpenAI", apps: 256, status: "Closed" },
                                                    { title: "Product Designer", company: "Figma", apps: 42, status: "Open" },
                                                ].map((j, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-900 dark:text-white">{j.title}</p>
                                                                <p className="text-[10px] text-slate-500">{j.company}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Users size={12} className="text-slate-400" />
                                                                <span className="text-xs font-bold">{j.apps} synced</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${j.status === 'Urgent' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{j.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 transition-all">
                                                                <ExternalLink size={16} />
                                                            </button>
                                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                                                <XCircle size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/[0.04] text-center">
                                    <button className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:underline">View Expanded Registry →</button>
                                </div>
                            </GlassCard>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <GlassCard>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                            <Sparkles size={18} />
                                        </div>
                                        <h3 className="font-bold">Intelligence Activity</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                                                <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0 shadow-glow-indigo" />
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">System generated new match cluster for "Senior Backend Node".</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">2 minutes ago • Intelligence Sync</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
                                            <Globe size={18} />
                                        </div>
                                        <h3 className="font-bold">Global Presence</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">North America</span>
                                            <span className="text-xs font-bold">42.8%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[42.8%]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">Europe / APAC</span>
                                            <span className="text-xs font-bold">38.2%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-500 w-[38.2%]" />
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>

                        {/* Sidebar Control Panel */}
                        <motion.div variants={itemVars} className="space-y-8">
                            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 rounded-[40px] text-white shadow-glow-indigo relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all duration-700">
                                    <Shield size={120} />
                                </div>
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <Zap size={24} fill="white" /> Core Authority
                                </h2>
                                <p className="text-indigo-100 text-sm mb-8 font-medium leading-relaxed">
                                    You have full read/write permissions to the platform database. System protocols are under your direct control.
                                </p>
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-white/20">
                                        Platform Settings
                                    </button>
                                    <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
                                        Emergency Lockdown
                                    </button>
                                </div>
                            </div>

                            <GlassCard>
                                <h3 className="font-bold mb-6 flex items-center gap-2"><Activity size={18} className="text-emerald-500" /> Server Architecture</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-slate-500">CPU LOAD</span>
                                                <span className="text-xs font-bold">12%</span>
                                            </div>
                                            <div className="w-full h-1 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[12%]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-slate-500">MEMORY UTILIZATION</span>
                                                <span className="text-xs font-bold">2.4 GB</span>
                                            </div>
                                            <div className="w-full h-1 bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[45%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            <GlassCard className="bg-slate-900 dark:bg-black text-white border-none shadow-2xl">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400"><TrendingUp size={18} /> Revenue Flow</h3>
                                <p className="text-3xl font-black mb-1">$42,800.00</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Net Monthly Processing</p>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                                    <span className="text-xs font-medium">Conversion Rate</span>
                                    <span className="text-xs font-bold text-emerald-400">+12%</span>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>

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
