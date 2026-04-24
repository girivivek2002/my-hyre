"use client";
import React, { ReactNode, MouseEvent, useState, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Globe, Mail, MapPin, Building2, ExternalLink, Camera, 
    Plus, Sparkles, Zap, TrendingUp, Check, Edit2, Save, X, Phone
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                {icon}
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold truncate">{value || "Not Set"}</p>
            </div>
        </div>
    );
}

export default function CompanyProfile() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);

    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        companyName: "",
        companySize: "",
        industry: "",
        bio: "",
        website: "",
        location: "",
        marketStatus: "",
        phone: ""
    });

    useEffect(() => {
        setMounted(true);
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/recruiter/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(prev => ({ ...prev, ...data.profile }));
                
                // Enforce edit mode if no company data exists (First time setup)
                if (!data.profile.companyName && !data.profile.industry) {
                    setIsFirstTimeSetup(true);
                    setIsEditing(true);
                }
            }
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/recruiter/profile", {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                setIsEditing(false);
                router.push("/recruiter/dashboard");
            }
        } catch (error) {
            console.error("Error saving profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setLogoImage(url);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setCoverImage(url);
        }
    };

    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (!mounted) return null;

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    const companyInitials = profile.companyName 
        ? profile.companyName.substring(0, 2).toUpperCase() 
        : (profile.name ? profile.name.substring(0, 2).toUpperCase() : "CO");

    return (
    <motion.div variants={containerVars} initial="hidden" animate="visible"
        className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-32 custom-scrollbar">
        <div className="max-w-6xl mx-auto">

            {/* Banner & Profile Header */}
            <motion.div variants={itemVars} className="relative mb-20">
                {/* Hidden File Inputs */}
                <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoChange} className="hidden" />
                <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverChange} className="hidden" />

                {/* Cover Image */}
                <div className="h-64 sm:h-80 w-full rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-neutral-900 dark:to-neutral-950 border border-slate-200 dark:border-neutral-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('${coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"}')` }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <button onClick={() => coverInputRef.current?.click()} className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer z-10">
                        <Camera size={14} /> Update Cover
                    </button>
                </div>

                {/* Logo Overflow */}
                <div className="absolute -bottom-16 left-12 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 z-10">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] bg-white dark:bg-neutral-950 p-2 border-4 border-slate-50 dark:border-[#050505] shadow-2xl relative group">
                        <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-extrabold text-white shadow-inner relative overflow-hidden bg-cover bg-center" style={logoImage ? { backgroundImage: `url(${logoImage})` } : {}}>
                            {!logoImage && companyInitials}
                            <div onClick={() => logoInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-10">
                                <Camera size={24} />
                                <span className="text-[10px] font-bold mt-2 uppercase tracking-widest text-white">Update Logo</span>
                            </div>
                        </div>
                    </div>
                    <div className="pb-4 pt-4 sm:pt-0">
                        {isEditing ? (
                            <input 
                                type="text"
                                name="companyName"
                                value={profile.companyName}
                                onChange={handleChange}
                                placeholder="Company Name"
                                className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full placeholder:text-slate-300"
                            />
                        ) : (
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{profile.companyName || "Your Company Name"}</h1>
                        )}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-widest">
                                <Globe size={14} /> 
                                {isEditing ? (
                                    <input type="text" name="industry" value={profile.industry} onChange={handleChange} placeholder="Industry (e.g. Technology)" className="bg-transparent border-b border-blue-300 focus:outline-none placeholder:text-blue-300/50" />
                                ) : (profile.industry || "Industry Not Set")}
                            </div>
                            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-neutral-700" />
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                                <MapPin size={14} /> 
                                {isEditing ? (
                                    <input type="text" name="location" value={profile.location} onChange={handleChange} placeholder="Location (e.g. London, UK)" className="bg-transparent border-b border-slate-300 focus:outline-none placeholder:text-slate-300/50" />
                                ) : (profile.location || "Location Not Set")}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Edit Toggle Button */}
                <div className="absolute -bottom-6 right-6 sm:-bottom-12">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            {!isFirstTimeSetup && (
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2">
                                    <X size={14} /> Cancel
                                </button>
                            )}
                            <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                {isSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                                Save Profile
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg">
                            <Edit2 size={14} /> Edit Profile
                        </button>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16 sm:mt-0">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold tracking-tight">Organization Architecture</h2>
                        </div>
                        {isEditing ? (
                            <textarea 
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us about your organization's mission, culture, and architecture..."
                                rows={4}
                                className="w-full p-4 bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm leading-relaxed mb-8 custom-scrollbar resize-none"
                            />
                        ) : (
                            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed mb-8">
                                {profile.bio || "No biography provided. Click 'Edit Profile' to add your organization's details."}
                            </p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isEditing ? (
                                <>
                                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/80">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Globe size={12}/> Company Website</p>
                                        <input type="text" name="website" value={profile.website} onChange={handleChange} placeholder="e.g. sterlingco.com" className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"/>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/80">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Phone size={12}/> Contact Phone</p>
                                        <input type="text" name="phone" value={profile.phone} onChange={handleChange} placeholder="e.g. +1 555-0100" className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"/>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/80">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Building2 size={12}/> Company Size</p>
                                        <input type="text" name="companySize" value={profile.companySize} onChange={handleChange} placeholder="e.g. 50-200 employees" className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"/>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/80">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp size={12}/> Market Status</p>
                                        <input type="text" name="marketStatus" value={profile.marketStatus} onChange={handleChange} placeholder="e.g. Series C+" className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-semibold"/>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <BrandItem label="Company Website" value={profile.website} icon={<Globe size={18} />} />
                                    <BrandItem label="Contact Email" value={profile.email} icon={<Mail size={18} />} />
                                    <BrandItem label="Company Size" value={profile.companySize} icon={<Building2 size={18} />} />
                                    <BrandItem label="Market Status" value={profile.marketStatus} icon={<TrendingUp size={18} />} />
                                </>
                            )}
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
                            {/* Static for now, can be made dynamic later */}
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
                                      <p className="text-4xl font-extrabold">--</p>
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Active Roles</p>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-2xl font-extrabold">--%</p>
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Acceptance Rate</p>
                                   </div>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                   <motion.div initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1.5 }} className="h-full bg-white shadow-[0_0_15px_white]" />
                                </div>
                             </div>
                             <button className="w-full mt-8 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all">
                                Post a Job
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