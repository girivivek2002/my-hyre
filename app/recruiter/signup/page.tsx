"use client";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, Building2, Globe, Mail, Briefcase, Users, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CompanySignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorObj, setErrorObj] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [industry, setIndustry] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const containerVars: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { 
                staggerChildren: 0.08, 
                delayChildren: 0.1, 
                opacity: { duration: 0.5, ease: "easeOut" },
                scale: { duration: 0.5, ease: "easeOut" }
            }
        }
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorObj(null);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: "recruiter",
                    name,
                    email,
                    password,
                    website,
                    industry,
                    teamSize
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorObj(data.error || "Failed to create company account.");
                setIsLoading(false);
                return;
            }

            // Successfully created! Cache token and login.
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", data.user.role);
            localStorage.setItem("userName", data.user.name);

            router.push("/recruiter/profile");
        } catch (err) {
            console.error(err);
            setErrorObj("Network error: Could not reach the authentication server.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] relative overflow-hidden flex flex-col select-none transition-colors duration-300">

            {/* Background Animated Glow */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-blue-600/20 blur-[120px] sm:blur-[180px] rounded-full top-20 left-1/2 -translate-x-1/2 pointer-events-none"
            ></motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 lg:px-20 py-6 relative z-20 gap-4"
            >
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Mr. Hyre Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
                    <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">Mr. Hyre</span>
                </div>

                <Link href="/signup" className="text-slate-500 dark:text-neutral-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-lg leading-none">←</span> Back to selection
                </Link>
            </motion.div>

            {/* Main Content */}
            <div className="flex flex-1 items-center justify-center px-4 py-8 relative z-10">
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-[540px] bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-slate-200 dark:border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden text-slate-900 dark:text-white"
                >
                    {/* Inner glossy highlight bounding box */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>

                    {/* Title */}
                    <motion.h1 variants={itemVars} className="text-3xl sm:text-4xl font-extrabold text-center mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-neutral-400">
                        Scale your team.
                    </motion.h1>

                    <motion.p variants={itemVars} className="text-slate-500 dark:text-neutral-400 text-sm sm:text-base text-center mb-10">
                        Create your company account to start hiring with semantic AI.
                    </motion.p>

                    {/* Error Banner */}
                    {errorObj && (
                        <motion.div variants={itemVars} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                            {errorObj}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>

                        {/* Company Name */}
                        <motion.div variants={itemVars} className="group">
                            <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                                COMPANY NAME
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Building2 size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Sterling Cooper"
                                    className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Company Website */}
                        <motion.div variants={itemVars} className="group">
                            <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                                COMPANY WEBSITE
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Globe size={18} />
                                </div>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://company.com"
                                    className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Industry + Team Size Grid */}
                        <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="group">
                                <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                                    INDUSTRY
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                        <Briefcase size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="e.g. Technology"
                                        className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                                    TEAM SIZE
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                        <Users size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={teamSize}
                                        onChange={(e) => setTeamSize(e.target.value)}
                                        placeholder="e.g. 50-200"
                                        className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Work Email */}
                        <motion.div variants={itemVars} className="group">
                            <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                                WORK EMAIL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVars} className="group">
                            <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                                SECURE PASSWORD
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Globe size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 pl-11 pr-12 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </motion.div>
                                             {/* Submit Button */}
                        <motion.div variants={itemVars} className="pt-2">
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Create Company Account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>

                        {/* Divider */}
                        <motion.div variants={itemVars} className="relative py-4 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800"></div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800"></div>
                        </motion.div>

                        {/* OAuth Buttons */}
                        <motion.div variants={itemVars} className="grid grid-cols-1 gap-4">
                            <button
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/login?oauth=1" })}
                                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </motion.div>

                        <div className="mt-8 text-center relative z-10">
                            <p className="text-slate-500 dark:text-neutral-500 text-sm">
                                Already have a workspace?{" "}
                                <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Responsive Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="border-t border-neutral-900/50 py-6 px-6 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm text-neutral-500 gap-4 relative z-10"
            >
                <div className="font-semibold text-neutral-400 tracking-widest uppercase">© {new Date().getFullYear()} Mr. Hyre AI.</div>
                <div className="flex gap-4 sm:gap-8 font-medium">
                    <span className="hover:text-neutral-300 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-neutral-300 cursor-pointer transition-colors">Terms of Service</span>
                </div>
            </motion.div>

        </div>
    );
}