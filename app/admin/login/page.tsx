"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    Shield, Lock, Mail, ChevronRight, Loader2, Sparkles, 
    Terminal, Zap, Fingerprint, Eye, EyeOff, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate admin authentication
        setTimeout(() => {
            if (email === "admin@mrhyre.com" && password === "Mr.hyre#2026@") {
                // Set authority cookie for middleware recognition
                document.cookie = "authToken=admin-session-authority; path=/; max-age=3600; SameSite=Lax";
                
                localStorage.setItem("authToken", "admin-session-authority");
                localStorage.setItem("userRole", "admin");
                localStorage.setItem("userName", "Super Admin");
                router.push("/admin/dashboard");
            } else {
                setError("Authorization Failed: Invalid admin credentials.");
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            
            {/* Background Architecture */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/5 blur-[100px] rounded-full animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                {/* Brand Node */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-glow-indigo mb-6 relative group">
                        <Shield size={32} className="text-white group-hover:scale-110 transition-transform" />
                        <div className="absolute -inset-1 bg-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Admin <span className="text-indigo-500">Access</span></h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Secure Protocol v8.4</span>
                    </div>
                </div>

                {/* Login Terminal */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Terminal size={120} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold leading-relaxed"
                            >
                                <ShieldAlert size={18} className="shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Identifier (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@mrhyre.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="hidden" />
                                <div className="w-4 h-4 border border-white/20 rounded bg-white/5 flex items-center justify-center group-hover:border-indigo-500/50 transition-all">
                                    <div className="w-2 h-2 rounded-sm bg-indigo-500 opacity-0 group-focus-within:opacity-100" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Keep Sync Active</span>
                            </label>
                            <Link href="#" className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-400">Request Access</Link>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow-indigo transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Authorizing...
                                </>
                            ) : (
                                <>
                                    <Fingerprint size={20} />
                                    Initiate Authority
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Security */}
                <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-indigo-500" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Turbopack Optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Fingerprint size={14} className="text-indigo-500" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Biometric Encrypted</span>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                        Internal Use Only • Mr. Hyre Infrastructure
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
