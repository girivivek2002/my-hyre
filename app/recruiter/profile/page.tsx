"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, CalendarDays, Globe, 
    Mail, MapPin, Building2, ExternalLink, Camera, 
    Plus, Sparkles, Zap, TrendingUp, Check
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

// ─── Brand Item ───────────────────────────────────────────────────────────────
function BrandItem({ label, value, icon }: { label: string, value: string, icon: ReactNode }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/80">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    );
}

export default function CompanyProfile() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (!mounted) return null;

    return (
    <motion.div variants={containerVars} initial="hidden" animate="visible"
        className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-32 custom-scrollbar">
        <div className="max-w-6xl mx-auto">

                        {/* Banner & Profile Header */}
                        <motion.div variants={itemVars} className="relative mb-20">
                            {/* Cover Image */}
                            <div className="h-64 sm:h-80 w-full rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-neutral-900 dark:to-neutral-950 border border-slate-200 dark:border-neutral-800 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-black/20" />
                                <button className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20 transition-all flex items-center gap-2">
                                    <Camera size={14} /> Update Cover
                                </button>
                            </div>

                            {/* Logo Overflow */}
                            <div className="absolute -bottom-16 left-12 flex items-end gap-8">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] bg-white dark:bg-neutral-950 p-2 border-4 border-slate-50 dark:border-[#050505] shadow-2xl relative group">
                                    <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-extrabold text-white shadow-inner relative overflow-hidden">
                                        SC
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                            <Camera size={24} />
                                            <span className="text-[10px] font-bold mt-2 uppercase tracking-widest">Update Logo</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Sterling & Co.</h1>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest">
                                            <Globe size={14} /> Technology / SaaS
                                        </div>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-neutral-700" />
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                                            <MapPin size={14} /> London, UK
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            
                            {/* Left Column: Details */}
                            <div className="lg:col-span-2 space-y-8">
                                <GlassCard>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold tracking-tight">Organization Architecture</h2>
                                        <button className="text-xs font-bold text-blue-500 hover:underline">Edit Bio</button>
                                    </div>
                                    <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-8">
                                        Sterling & Co. is a leading enterprise SaaS provider specializing in workforce intelligence and AI-driven design systems. We're on a mission to bridge the gap between human creativity and autonomous execution. Our team of 250+ engineers, designers, and researchers are distributed across 14 countries.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <BrandItem label="Company Website" value="sterlingco.com" icon={<Globe size={18} />} />
                                        <BrandItem label="Contact Email" value="hiring@sterlingco.com" icon={<Mail size={18} />} />
                                        <BrandItem label="Corporate Office" value="102 Vector Dr, London" icon={<Building2 size={18} />} />
                                        <BrandItem label="Market Status" value="Series C+" icon={<TrendingUp size={18} />} />
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold tracking-tight">Intelligence Highlights</h2>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                                            <Sparkles size={10} fill="currentColor" /> AI Verified
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { title: "Design Parity Architecture", desc: "Our teams maintain a 1:1 parity between Figma assets and production React components.", match: "Top 1%" },
                                            { title: "Rapid Iteration Cycle", desc: "We deploy on average 14 times per day with full automated visual regression testing.", match: "High Velocity" },
                                            { title: "Inclusive Talent Culture", desc: "Our workforce represents 42 distinct cultural architectures with a 4.8/5 Glassdoor rating.", match: "Elite Culture" },
                                        ].map((item, i) => (
                                            <div key={i} className="group/item">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover/item:text-blue-500 transition-colors">{item.title}</h4>
                                                    <span className="text-[10px] font-bold text-blue-500 uppercase">{item.match}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Right Column: Stats & Actions */}
                            <div className="space-y-8">
                                
                                {/* Quick Stats */}
                                <motion.div variants={itemVars}>
                                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                                         <Zap size={150} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                                         <h3 className="text-xl font-bold mb-6">Pipeline Health</h3>
                                         <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                               <div>
                                                  <p className="text-4xl font-extrabold">24</p>
                                                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Active Roles</p>
                                               </div>
                                               <div className="text-right">
                                                  <p className="text-2xl font-extrabold">8.4%</p>
                                                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Acceptance Rate</p>
                                               </div>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                               <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.5 }} className="h-full bg-white shadow-[0_0_15px_white]" />
                                            </div>
                                         </div>
                                         <button className="w-full mt-8 py-3 bg-white text-blue-600 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                                            Boost Brand Visibility
                                         </button>
                                    </div>
                                </motion.div>

                                {/* External Links */}
                                <motion.div variants={itemVars}>
                                    <GlassCard>
                                        <h4 className="text-sm font-bold mb-5 flex items-center gap-2">
                                            <ExternalLink size={16} className="text-slate-400" /> Brand Presence
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: "LinkedIn Company Page", value: "Verified", icon: <Check size={12} /> },
                                                { label: "Twitter / X Profile", value: "Connected", icon: <Check size={12} /> },
                                                { label: "Crunchbase Profile", value: "Pending", icon: <Plus size={12} /> },
                                                { label: "Glassdoor Branding", value: "Verified", icon: <Check size={12} /> },
                                            ].map((link, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/80">
                                                    <span className="text-xs font-medium text-slate-600 dark:text-neutral-400">{link.label}</span>
                                                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-tight flex items-center gap-1 ${link.value === 'Verified' ? 'bg-blue-500/10 text-blue-500' : link.value === 'Connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-neutral-800 text-slate-400'}`}>
                                                        {link.icon} {link.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                </motion.div>

                            </div>

                        </div>

                        {/* Footer */}
                        <div className="mt-20 border-t border-slate-200 dark:border-neutral-900/50 pt-8 text-center">
                           <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                             © {new Date().getFullYear()} Mr. Hyre Technologies • Intelligence Version 4.0.2
                           </p>
                        </div>
                    </div>
                </motion.div>
    );
  }