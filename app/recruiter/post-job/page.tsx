"use client";
import React, { ReactNode, MouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, MapPin, DollarSign,
    Target, Globe, Type, ListChecks, CheckCircle2, Building, Eye, CalendarDays
} from "lucide-react";

// Interactive Glass Card Component
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
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 200, damping: 20 }}
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
            <div className="relative z-10 w-full h-full p-6 sm:p-8">
                {children}
            </div>
        </motion.div>
    );
}

// Input Component with deep focus state
function GlassInput({ icon: Icon, placeholder, type = "text", as = "input", rows = 3 }: any) {
    return (
        <div className="relative group/input">
            <div className="absolute left-4 top-4 text-slate-400 dark:text-neutral-500 group-focus-within/input:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none">
                <Icon size={20} />
            </div>
            {as === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full bg-slate-100/50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl py-4 pt-12 px-4 shadow-inner text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none custom-scrollbar"
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-slate-100/50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl py-4 pl-12 pr-4 shadow-inner text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-1 focus:ring-blue-500/50 transition-all inline-flex items-center"
                />
            )}
        </div>
    );
}

export default function PostJobPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">

            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-neutral-950 dark:to-[#050505] pointer-events-none -z-10 blur-[100px]"></div>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-72 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-2xl border-r border-slate-200 dark:border-neutral-800/60 p-6 flex flex-col z-20 shrink-0 shadow-2xl relative"
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
                        { icon: <Briefcase size={20} />, label: "Active Jobs", active: true },
                        { icon: <Users size={20} />, label: "Candidates", path: "/recruiter/candidates" },
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Topbar */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
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
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
                        </button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800"></div>
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

                {/* Scrollable Dashboard Area */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-32 custom-scrollbar">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-end border-b border-slate-200 dark:border-neutral-800/50 pb-8"
                        >
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                                    Create a New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Opportunity</span>
                                </h1>
                                <p className="text-slate-500 dark:text-neutral-400 text-lg flex items-center gap-2">
                                    <Target size={18} className="text-blue-500 dark:text-blue-400" />
                                    Define the parameters. Let Mr. Hyre's AI handle the sourcing.
                                </p>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Form Scroll */}
                            <div className="col-span-1 lg:col-span-2 space-y-8">

                                {/* Section 1: Basic Info */}
                                <GlassCard delay={0.1}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600 dark:text-blue-400">
                                            <Building size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight">Core Logistics</h2>
                                            <p className="text-xs text-slate-500 dark:text-neutral-500">The fundamental structure of the role.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <GlassInput icon={Type} placeholder="Job Title (e.g. Senior Frontend Engineer)" />
                                        <GlassInput icon={Briefcase} placeholder="Department / Team" />
                                        <GlassInput icon={MapPin} placeholder="Primary Location" />
                                        <div className="relative group/input">
                                            <div className="absolute left-4 top-4 text-slate-400 dark:text-neutral-500 group-focus-within/input:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors pointer-events-none">
                                                <Globe size={20} />
                                            </div>
                                            <select defaultValue="" className="w-full bg-slate-100/50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl py-4 pl-12 pr-4 shadow-inner text-slate-900 dark:text-neutral-300 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer">
                                                <option value="" disabled>Workplace Type</option>
                                                <option value="remote">Fully Remote</option>
                                                <option value="hybrid">Hybrid</option>
                                                <option value="onsite">On-Site</option>
                                            </select>
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Section 2: Compensation */}
                                <GlassCard delay={0.2}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight">Compensation Band</h2>
                                            <p className="text-xs text-slate-500 dark:text-neutral-500">Provide an accurate estimate for AI matching.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-600 hidden sm:block font-bold">TO</div>
                                        <GlassInput icon={DollarSign} placeholder="Minimum Base (USD)" type="number" />
                                        <GlassInput icon={DollarSign} placeholder="Maximum Base (USD)" type="number" />
                                    </div>
                                </GlassCard>

                                {/* Section 3: Details */}
                                <GlassCard delay={0.3}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-600 dark:text-purple-400">
                                            <ListChecks size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight">Role Deep-Dive</h2>
                                            <p className="text-xs text-slate-500 dark:text-neutral-500">The specific responsibilities and cultural fit.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <GlassInput icon={Sparkles} placeholder="Required Technical Skills (Comma separated)..." />
                                        <GlassInput as="textarea" icon={LayoutDashboard} rows={6} placeholder="Write a compelling job description. Markdown is supported..." />
                                    </div>
                                </GlassCard>

                            </div>

                            {/* Right Sidebar */}
                            <div className="col-span-1 space-y-6">

                                {/* AI Recommendation Engine */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                                    className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1 rounded-3xl group cursor-pointer shadow-[0_20px_40px_rgba(59,130,246,0.3)] sticky top-0"
                                >
                                    <div className="bg-white/60 dark:bg-[#050505]/40 backdrop-blur-xl rounded-[22px] p-6 h-full border border-blue-400/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-50 transform rotate-12 scale-150 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                            <Sparkles size={100} strokeWidth={1} className="text-blue-300" />
                                        </div>

                                        <div className="flex items-center gap-3 mb-6 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                                                <Sparkles size={16} className="text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white shadow-sm">AI Copilot</h2>
                                        </div>

                                        <p className="text-sm text-slate-700 dark:text-blue-50 leading-relaxed relative z-10 font-medium mb-6">
                                            Based on market trends, adding <strong className="text-slate-900 dark:text-white bg-blue-500/10 dark:bg-blue-500/30 px-1 rounded">React Server Components</strong> and <strong className="text-slate-900 dark:text-white bg-blue-500/10 dark:bg-blue-500/30 px-1 rounded">GraphQL</strong> to the tech stack requirements will increase your high-quality applicant pool by 24%.
                                        </p>

                                        <div className="space-y-3 relative z-10">
                                            <div className="bg-slate-50 dark:bg-neutral-900/50 p-3 rounded-xl border border-slate-200 dark:border-neutral-700/50">
                                                <p className="text-xs text-slate-500 dark:text-neutral-400 mb-1">Median Market Salary</p>
                                                <p className="text-base font-bold text-slate-900 dark:text-white">$154,000</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Action Panel */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <GlassCard className="border-t-4 border-t-emerald-500">
                                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                            <Eye size={18} className="text-slate-400 dark:text-neutral-400" /> Ready to Launch?
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6">
                                            Once published, Mr. Hyre's AI will begin scraping and scoring candidates against your criteria immediately.
                                        </p>

                                        <div className="space-y-3">
                                            <button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-900 dark:text-white font-semibold py-3.5 rounded-xl text-sm transition-colors border border-slate-200 dark:border-neutral-700/50">
                                                Save as Draft
                                            </button>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => router.push("/recruiter/candidates")}
                                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex justify-center items-center gap-2"
                                            >
                                                <CheckCircle2 size={18} /> Deploy Intelligence
                                            </motion.button>
                                        </div>
                                    </GlassCard>
                                </motion.div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}