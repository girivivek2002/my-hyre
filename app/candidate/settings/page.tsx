"use client";
import React, { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Clock, MapPin, 
  TrendingUp, CalendarDays, ArrowUpRight, Search, 
  CheckCircle2, User, Shield, Lock, Eye, EyeOff,
  BellRing, Globe, Trash2, Check, Upload, Save
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
    <div
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
      <div className="relative z-10 w-full h-full p-6">
        {children}
      </div>
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean, onToggle: () => void }) {
  return (
    <button 
      onClick={onToggle} 
      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-700'}`}
    >
      <motion.div 
        animate={{ x: enabled ? 20 : 0 }} 
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full shadow-md" 
      />
    </button>
  );
}

// ─── Setting Row ─────────────────────────────────────────────────────────────
function SettingRow({ label, description, children, icon }: { label: string, description?: string, children: ReactNode, icon?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-slate-200 dark:border-neutral-800/40 last:border-0 grow">
      <div className="flex gap-4 items-start">
        {icon && <div className="mt-1 text-slate-400 dark:text-neutral-500">{icon}</div>}
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
          {description && <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5 max-w-md">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const tabs = [
  { id: "profile", label: "Profile Architecture", icon: <User size={18} /> },
  { id: "intelligence", label: "Matching Intelligence", icon: <Zap size={18} /> },
  { id: "security", label: "Security & Privacy", icon: <Shield size={18} /> },
  { id: "notifications", label: "Delivery Preferences", icon: <BellRing size={18} /> },
];

export default function CandidateSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [mounted, setMounted] = useState(false);

  // States
  const [stealthMode, setStealthMode] = useState(false);
  const [aiVisibility, setAiVisibility] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoApply, setAutoApply] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  return (
        <motion.div
           variants={containerVars}
           initial="hidden"
           animate="visible"
           className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-32 custom-scrollbar"
        >

          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <motion.div variants={itemVars} className="mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Architecture</span></h1>
              <p className="text-slate-500 dark:text-neutral-400 text-sm">Fine-tune your presence and intelligence parameters.</p>
            </motion.div>

            {/* Tab Strip */}
            <motion.div variants={itemVars} className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
               {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                     activeTab === tab.id 
                     ? 'bg-blue-500 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                     : 'bg-white dark:bg-neutral-900/30 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-800/50 hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:text-slate-900 dark:hover:text-white'
                   }`}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard>
                     <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group">
                           <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl relative overflow-hidden">
                              SA
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                 <Upload size={24} />
                                 <span className="text-[8px] font-bold mt-2 uppercase tracking-widest">Update</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Full Name</label>
                              <input defaultValue="Sterling Archer" className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500/50 transition-all" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Professional Title</label>
                              <input defaultValue="Principal Experience Designer" className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500/50 transition-all" />
                           </div>
                           <div className="space-y-2 sm:col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">AI-Augmented Bio</label>
                              <textarea rows={4} defaultValue="Expert in design system architecture and high-fidelity motion. Currently optimizing workflows for Series C+ enterprise teams." className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500/50 transition-all resize-none" />
                           </div>
                        </div>
                     </div>
                  </GlassCard>

                  <GlassCard>
                     <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-widest px-2">
                        <Globe size={14} /> Regional Architecture
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Primary Location</label>
                           <input defaultValue="San Francisco, CA" className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Workplace Preference</label>
                           <select className="w-full bg-slate-50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500/50 transition-all appearance-none">
                              <option>Remote Only</option>
                              <option>Hybrid Preferred</option>
                              <option>On-site Only</option>
                           </select>
                        </div>
                     </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Intelligence Tab */}
              {activeTab === "intelligence" && (
                <motion.div
                  key="intelligence"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard>
                     <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-blue-500 uppercase tracking-widest px-2">
                        <Zap size={14} fill="currentColor" /> Match Parameters
                     </h3>
                     <SettingRow 
                        label="AI Stealth Mode" 
                        description="Hide your active application status from current employers and third-party recruiters."
                        icon={<EyeOff size={18} />}
                      >
                        <Toggle enabled={stealthMode} onToggle={() => setStealthMode(!stealthMode)} />
                     </SettingRow>
                     <SettingRow 
                        label="Public AI Profile" 
                        description="Allow our AI to recommend you to high-match companies before you even apply."
                        icon={<Sparkles size={18} />}
                      >
                        <Toggle enabled={aiVisibility} onToggle={() => setAiVisibility(!aiVisibility)} />
                     </SettingRow>
                     <SettingRow 
                        label="Auto-Pilot Selection" 
                        description="Automatically accept roles with a 99% Hub Match score."
                        icon={<Zap size={18} />}
                      >
                        <Toggle enabled={autoApply} onToggle={() => setAutoApply(!autoApply)} />
                     </SettingRow>
                  </GlassCard>

                  <GlassCard>
                     <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-widest px-2">
                        Skill Matrix Sensitivity
                     </h3>
                     <div className="space-y-8 p-2">
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                              <span>Match Threshold</span>
                              <span className="text-blue-500">85% +</span>
                           </div>
                           <div className="h-2 bg-slate-100 dark:bg-neutral-950/50 rounded-full relative overflow-hidden border border-slate-200 dark:border-neutral-800">
                              <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                           </div>
                           <p className="text-[10px] text-slate-500 dark:text-neutral-500 leading-relaxed italic">
                              * Setting this higher will reduce the number of matches but increase quality.
                           </p>
                        </div>
                     </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard>
                     <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-amber-500 uppercase tracking-widest px-2">
                        <Lock size={14} /> Authentication
                     </h3>
                     <SettingRow label="Two-Factor Auth" description="Enable biometric or token-based 2FA for your account.">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">Configure</button>
                     </SettingRow>
                     <SettingRow label="Session Management" description="You are currently logged in on 3 devices.">
                        <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline">Revoke All</button>
                     </SettingRow>
                  </GlassCard>

                  <GlassCard className="border-red-500/20">
                     <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-red-500 uppercase tracking-widest px-2">
                        <Trash2 size={14} /> Danger Zone
                     </h3>
                     <SettingRow label="Deactivate Account" description="Temporarily hide your profile and all active applications.">
                        <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">Deactivate</button>
                     </SettingRow>
                     <SettingRow label="Permanent Purge" description="Permanently delete all data. This cannot be undone.">
                        <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-500/20 transition-colors">Request Deletion</button>
                     </SettingRow>
                  </GlassCard>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard>
                     <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-purple-500 uppercase tracking-widest px-2">
                        <BellRing size={14} /> Delivery Methods
                     </h3>
                     <SettingRow label="Email Infiltration" description="Receive high-match alerts and interview invites via email.">
                        <Toggle enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
                     </SettingRow>
                     <SettingRow label="Browser Intercepts" description="Enable desktop push notifications for real-time status updates.">
                        <button className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:bg-blue-500/20 transition-colors">Setup Push</button>
                     </SettingRow>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-20 border-t border-slate-200 dark:border-neutral-900/50 pt-8 text-center">
               <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                 © {new Date().getFullYear()} Mr. Hyre Technologies • Intelligence Version 4.0.2
               </p>
            </div>

          </div>
        </motion.div>
    );
}
