"use client";
import React, { ReactNode, MouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, CalendarDays, User, Shield, BellRing,
    Puzzle, UsersRound, Palette, Globe, Lock, Mail, Eye, EyeOff,
    Smartphone, Key, ToggleLeft, ToggleRight, Check, Upload, Trash2, Loader2
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

// ─── Toggle Component ─────────────────────────────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean, onToggle: () => void }) {
    return (
        <button onClick={onToggle} className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-700'}`}>
            <motion.div animate={{ x: enabled ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-md" />
        </button>
    );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({ label, description, children }: { label: string, description?: string, children: ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-slate-200 dark:border-neutral-800/40 last:border-0">
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                {description && <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{description}</p>}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

// ─── Tab Config ───────────────────────────────────────────────────────────────
const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <BellRing size={18} /> },
    { id: "integrations", label: "Integrations", icon: <Puzzle size={18} /> },
    { id: "team", label: "Team", icon: <UsersRound size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

    const [profile, setProfile] = useState({
        companyName: "",
        industry: "",
        email: "",
        website: "",
        phone: "",
        bio: ""
    });

    const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, weekly: true, candidate: true, interview: true, offer: false });
    const [twoFA, setTwoFA] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState(true);

    React.useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const res = await fetch("/api/recruiter/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.profile) {
                setProfile({
                    companyName: data.profile.companyName || "",
                    industry: data.profile.industry || "",
                    email: data.profile.email || "",
                    website: data.profile.website || "",
                    phone: data.profile.phone || "",
                    bio: data.profile.bio || "Building the next generation of workforce intelligence tools."
                });
            }
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSaveStatus(null);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/recruiter/profile", {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(profile),
            });
            if (res.ok) {
                setSaveStatus("Profile updated successfully");
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (err) {
            setSaveStatus("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
    };
    const itemVars: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
    <motion.div variants={containerVars} initial="hidden" animate="visible"
        className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-20 custom-scrollbar">
        <div className="max-w-5xl mx-auto">

                        {/* Header */}
                        <motion.div variants={itemVars} className="mb-8">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Settings</span>
                            </h1>
                            <p className="text-slate-500 dark:text-neutral-400 text-lg">Manage your account, security, and workspace preferences.</p>
                        </motion.div>

                        {/* Tab Strip */}
                        <motion.div variants={itemVars} className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${activeTab === tab.id
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-inner'
                                        : 'bg-white dark:bg-neutral-900/30 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-800/50 hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </motion.div>

                        {/* ── Profile Tab ───────────────────────────── */}
                        {activeTab === "profile" && (
                            <motion.div variants={itemVars} className="space-y-6">
                                <GlassCard>
                                    <h2 className="text-base sm:text-lg font-bold mb-6 flex items-center gap-2"><User size={18} className="text-blue-400" /> Organization Architecture</h2>
                                    <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center sm:items-start text-center sm:text-left">
                                        <div className="shrink-0">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] relative group/avatar cursor-pointer overflow-hidden">
                                                {profile.companyName ? profile.companyName.slice(0, 2).toUpperCase() : "HY"}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload size={20} />
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-neutral-500 mt-2 font-bold uppercase tracking-widest">Update Logo</p>
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                                            <div>
                                                <label className="text-[9px] sm:text-xs text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest mb-1.5 block">Organization Name</label>
                                                <input 
                                                    value={profile.companyName} 
                                                    onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                                                    className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner dark:shadow-none" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] sm:text-xs text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest mb-1.5 block">Industry</label>
                                                <input 
                                                    value={profile.industry} 
                                                    onChange={(e) => setProfile({...profile, industry: e.target.value})}
                                                    className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner dark:shadow-none" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] sm:text-xs text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest mb-1.5 block">Identity Node (Email)</label>
                                                <input 
                                                    value={profile.email} 
                                                    readOnly
                                                    className="w-full bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-400 dark:text-neutral-500 focus:outline-none cursor-not-allowed shadow-inner dark:shadow-none" 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] sm:text-xs text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest mb-1.5 block">HQ Website</label>
                                                <input 
                                                    value={profile.website} 
                                                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                                                    className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner dark:shadow-none" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <label className="text-[9px] sm:text-xs text-slate-500 dark:text-neutral-500 font-bold uppercase tracking-widest mb-1.5 block">Organization Intelligence Bio</label>
                                        <textarea 
                                            value={profile.bio} 
                                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                            rows={3} 
                                            className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner dark:shadow-none" 
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex-1">
                                            {saveStatus && (
                                                <p className={`text-xs font-bold uppercase tracking-widest ${saveStatus.includes("successfully") ? "text-emerald-500" : "text-red-500"}`}>
                                                    {saveStatus}
                                                </p>
                                            )}
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }} 
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow flex items-center gap-2 disabled:opacity-50">
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </motion.button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* ── Security Tab ──────────────────────────── */}
                        {activeTab === "security" && (
                            <motion.div variants={itemVars} className="space-y-6">
                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={20} className="text-emerald-400" /> Authentication & Security</h2>
                                    <SettingRow label="Two-Factor Authentication" description="Add an extra layer of protection to your account">
                                        <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
                                    </SettingRow>
                                    <SettingRow label="Auto Session Timeout" description="Automatically sign out after 30 minutes of inactivity">
                                        <Toggle enabled={sessionTimeout} onToggle={() => setSessionTimeout(!sessionTimeout)} />
                                    </SettingRow>
                                    <SettingRow label="Change Password" description="Last changed 45 days ago">
                                        <button className="bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-neutral-700/50 transition-colors flex items-center gap-2">
                                            <Key size={14} /> Update
                                        </button>
                                    </SettingRow>
                                    <SettingRow label="Active Sessions" description="You are currently signed in on 2 devices">
                                        <button className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">Revoke All</button>
                                    </SettingRow>
                                </GlassCard>

                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Lock size={20} className="text-amber-400" /> API & Access Keys</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Production API Key</p>
                                                <p className="text-xs text-slate-500 dark:text-neutral-500 font-mono mt-1">sk-prod-••••••••••••••••4f8a</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Copy</button>
                                                <button className="text-xs text-slate-500 dark:text-neutral-500 font-semibold hover:text-red-500 dark:hover:text-red-400 transition-colors">Regenerate</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Staging API Key</p>
                                                <p className="text-xs text-slate-500 dark:text-neutral-500 font-mono mt-1">sk-stag-••••••••••••••••9c2b</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Copy</button>
                                                <button className="text-xs text-slate-500 dark:text-neutral-500 font-semibold hover:text-red-500 dark:hover:text-red-400 transition-colors">Regenerate</button>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* ── Notifications Tab ────────────────────── */}
                        {activeTab === "notifications" && (
                            <motion.div variants={itemVars} className="space-y-6">
                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BellRing size={20} className="text-purple-400" /> Delivery Channels</h2>
                                    <SettingRow label="Email Notifications" description="Receive updates via email">
                                        <Toggle enabled={notifs.email} onToggle={() => setNotifs(p => ({ ...p, email: !p.email }))} />
                                    </SettingRow>
                                    <SettingRow label="Push Notifications" description="Browser desktop alerts">
                                        <Toggle enabled={notifs.push} onToggle={() => setNotifs(p => ({ ...p, push: !p.push }))} />
                                    </SettingRow>
                                    <SettingRow label="SMS Notifications" description="Text messages for critical alerts">
                                        <Toggle enabled={notifs.sms} onToggle={() => setNotifs(p => ({ ...p, sms: !p.sms }))} />
                                    </SettingRow>
                                    <SettingRow label="Weekly Digest" description="Summary email every Monday at 9 AM">
                                        <Toggle enabled={notifs.weekly} onToggle={() => setNotifs(p => ({ ...p, weekly: !p.weekly }))} />
                                    </SettingRow>
                                </GlassCard>

                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Mail size={20} className="text-blue-400" /> Event Triggers</h2>
                                    <SettingRow label="New Candidate Match" description="When AI finds a high-match candidate">
                                        <Toggle enabled={notifs.candidate} onToggle={() => setNotifs(p => ({ ...p, candidate: !p.candidate }))} />
                                    </SettingRow>
                                    <SettingRow label="Interview Reminders" description="30 minutes before each scheduled interview">
                                        <Toggle enabled={notifs.interview} onToggle={() => setNotifs(p => ({ ...p, interview: !p.interview }))} />
                                    </SettingRow>
                                    <SettingRow label="Offer Status Changes" description="When a candidate accepts or declines an offer">
                                        <Toggle enabled={notifs.offer} onToggle={() => setNotifs(p => ({ ...p, offer: !p.offer }))} />
                                    </SettingRow>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* ── Integrations Tab ─────────────────────── */}
                        {activeTab === "integrations" && (
                            <motion.div variants={itemVars} className="space-y-6">
                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Puzzle size={20} className="text-indigo-500 dark:text-indigo-400" /> Connected Services</h2>
                                    <div className="space-y-3">
                                        {[
                                            { name: "Google Workspace", desc: "Calendar sync, Gmail integration", connected: true, color: "from-blue-500 to-red-500" },
                                            { name: "Slack", desc: "Channel notifications and alerts", connected: true, color: "from-purple-500 to-pink-500" },
                                            { name: "LinkedIn Recruiter", desc: "Candidate sourcing pipeline", connected: true, color: "from-blue-600 to-blue-400" },
                                            { name: "Greenhouse ATS", desc: "Applicant tracking sync", connected: false, color: "from-emerald-500 to-green-400" },
                                            { name: "Zoom", desc: "Video interview scheduling", connected: false, color: "from-blue-500 to-cyan-400" },
                                            { name: "DocuSign", desc: "Offer letter e-signatures", connected: false, color: "from-amber-500 to-yellow-400" },
                                        ].map((int, i) => (
                                            <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-neutral-800/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${int.color} flex items-center justify-center text-white text-xs font-extrabold shadow-inner`}>
                                                        {int.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{int.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-neutral-500">{int.desc}</p>
                                                    </div>
                                                </div>
                                                {int.connected ? (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-bold">Connected</span>
                                                        <button className="text-xs text-slate-500 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-semibold">Disconnect</button>
                                                    </div>
                                                ) : (
                                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                        className="bg-slate-200 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-neutral-700/50 transition-colors">
                                                        Connect
                                                    </motion.button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* ── Team Tab ──────────────────────────────── */}
                        {activeTab === "team" && (
                            <motion.div variants={itemVars} className="space-y-6">
                                <GlassCard>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white"><UsersRound size={20} className="text-cyan-500 dark:text-cyan-400" /> Team Members</h2>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center gap-1.5">
                                            <Mail size={14} /> Invite Member
                                        </motion.button>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { name: "Alex Sterling", email: "alex@sterlingco.com", role: "Owner", initials: "AS", status: "Active" },
                                            { name: "Maria Gonzales", email: "maria@sterlingco.com", role: "Admin", initials: "MG", status: "Active" },
                                            { name: "James Wright", email: "james@sterlingco.com", role: "Recruiter", initials: "JW", status: "Active" },
                                            { name: "Priya Sharma", email: "priya@sterlingco.com", role: "Recruiter", initials: "PS", status: "Active" },
                                            { name: "Tom Baker", email: "tom@sterlingco.com", role: "Viewer", initials: "TB", status: "Invited" },
                                        ].map((member, i) => (
                                            <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/60 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-neutral-800/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-neutral-300 border border-slate-300 dark:border-neutral-700/50">
                                                        {member.initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-neutral-500">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${member.status === "Active" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"}`}>
                                                        {member.status}
                                                    </span>
                                                    <select defaultValue={member.role} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500/50 cursor-pointer">
                                                        <option value="Owner">Owner</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Recruiter">Recruiter</option>
                                                        <option value="Viewer">Viewer</option>
                                                    </select>
                                                    {member.role !== "Owner" && (
                                                        <button className="text-slate-400 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* ── Appearance Tab ────────────────────────── */}
                        {activeTab === "appearance" && (
                            <motion.div variants={itemVars} className="space-y-6">
                                <GlassCard>
                                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Palette size={20} className="text-pink-500 dark:text-pink-400" /> Theme & Display</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        {[
                                            { id: "dark", theme: "Dark", desc: "Sleek & modern", colors: "from-neutral-900 to-neutral-950 border-blue-500/50" },
                                            { id: "light", theme: "Light", desc: "Clean & bright", colors: "from-slate-100 to-white border-neutral-300 dark:border-neutral-700" },
                                            { id: "system", theme: "System", desc: "Auto-detect", colors: "from-slate-300 to-slate-400 dark:from-neutral-700 dark:to-neutral-400 border-slate-400 dark:border-neutral-600" },
                                        ].map((t, i) => {
                                            const isActive = theme === t.id;
                                            return (
                                                <div key={i} onClick={() => setTheme(t.id)} className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${isActive ? 'border-blue-500 dark:border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-blue-50/50 dark:bg-transparent' : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-white dark:bg-transparent'}`}>
                                                    <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${t.colors.split(' border')[0]} mb-3 border ${t.colors.split(' border-')[1] ? 'border-' + t.colors.split(' border-')[1] : 'border-transparent'}`} />
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.theme}</p>
                                                    <p className="text-xs text-slate-500 dark:text-neutral-500">{t.desc}</p>
                                                    {isActive && <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <SettingRow label="Accent Color" description="Primary color used throughout the interface">
                                        <div className="flex items-center gap-2">
                                            {["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map((c, i) => (
                                                <button key={i} className={`w-7 h-7 rounded-full ${c} ${i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950' : 'hover:scale-110'} transition-transform`} />
                                            ))}
                                        </div>
                                    </SettingRow>
                                    <SettingRow label="Language" description="Interface display language">
                                        <select defaultValue="en" className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500/50 cursor-pointer">
                                            <option value="en">English (US)</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                            <option value="ja">日本語</option>
                                        </select>
                                    </SettingRow>
                                    <SettingRow label="Timezone" description="Used for interview scheduling">
                                        <select defaultValue="pst" className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm text-slate-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500/50 cursor-pointer">
                                            <option value="pst">Pacific Time (PST)</option>
                                            <option value="est">Eastern Time (EST)</option>
                                            <option value="utc">UTC</option>
                                            <option value="gmt">GMT</option>
                                            <option value="ist">India Standard Time (IST)</option>
                                        </select>
                                    </SettingRow>
                                </GlassCard>

                                {/* Danger Zone */}
                                <GlassCard className="border-red-500/20 dark:border-red-900/30">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500 dark:text-red-400"><Trash2 size={20} /> Danger Zone</h2>
                                    <SettingRow label="Delete Account" description="Permanently delete your organization and all data. This action cannot be undone.">
                                        <button className="bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                            Delete Organization
                                        </button>
                                    </SettingRow>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* Footer */}
                        <motion.div variants={itemVars} className="mt-12 text-center text-xs font-semibold tracking-widest text-neutral-600 uppercase border-t border-neutral-800/50 pt-8">
                            © {new Date().getFullYear()} MR. HYRE TECHNOLOGIES. ALL RIGHTS RESERVED.
                        </motion.div>

                    </div>
                </motion.div>
    );
}
