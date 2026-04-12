"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, Building2, Globe, Mail, Briefcase, Users, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompanySignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorObj, setErrorObj] = useState(null);

    // Form states
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [industry, setIndustry] = useState("");
    const [teamSize, setTeamSize] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const containerVars = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1, ease: "easeOut", duration: 0.5 }
        }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorObj(null);

        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
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

            router.push("/recruiter/dashboard");
        } catch (err) {
            console.error(err);
            setErrorObj("Network error: Could not reach the authentication server.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex flex-col select-none">

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
                    <span className="font-bold text-white tracking-tight text-lg">Mr. Hyre</span>
                </div>

                <Link href="/signup" className="text-neutral-400 text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-lg leading-none">←</span> Back to selection
                </Link>
            </motion.div>

            {/* Main Content */}
            <div className="flex flex-1 items-center justify-center px-4 py-8 relative z-10">
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-[540px] bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    {/* Inner glossy highlight bounding box */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>

                    {/* Title */}
                    <motion.h1 variants={itemVars} className="text-3xl sm:text-4xl font-extrabold text-center mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                        Scale your team.
                    </motion.h1>

                    <motion.p variants={itemVars} className="text-neutral-400 text-sm sm:text-base text-center mb-10">
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
                            <label className="text-xs font-semibold tracking-wider text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">
                                COMPANY NAME
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Building2 size={18} />
                                </div>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Acme Corp"
                                    className="w-full px-4 py-3.5 pl-11 rounded-xl bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                />
                            </div>
                        </motion.div>

                        {/* Company Website */}
                        <motion.div variants={itemVars} className="group">
                            <label className="text-xs font-semibold tracking-wider text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">
                                COMPANY WEBSITE
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Globe size={18} />
                                </div>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://company.com"
                                    className="w-full px-4 py-3.5 pl-11 rounded-xl bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                />
                            </div>
                        </motion.div>

                        {/* Industry + Team Size Grid */}
                        <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="group">
                                <label className="text-xs font-semibold tracking-wider text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">
                                    INDUSTRY
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                        <Briefcase size={18} />
                                    </div>
                                    <select required value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-4 py-3.5 pl-11 appearance-none rounded-xl bg-neutral-950/50 border border-neutral-800 text-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner cursor-pointer">
                                        <option value="" disabled className="text-neutral-600">Select industry</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="E-commerce">E-commerce</option>
                                    </select>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-xs font-semibold tracking-wider text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">
                                    TEAM SIZE
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                        <Users size={18} />
                                    </div>
                                    <select required value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="w-full px-4 py-3.5 pl-11 appearance-none rounded-xl bg-neutral-950/50 border border-neutral-800 text-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner cursor-pointer">
                                        <option value="" disabled className="text-neutral-600">Company size</option>
                                        <option value="1-10">1-10</option>
                                        <option value="10-50">10-50</option>
                                        <option value="50-200">50-200</option>
                                        <option value="200+">200+</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Work Email */}
                        <motion.div variants={itemVars} className="group">
                            <label className="text-xs font-semibold tracking-wider text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">
                                WORK EMAIL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full px-4 py-3.5 pl-11 rounded-xl bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVars} className="group mb-8">
                            <label className="text-xs font-semibold tracking-wider text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-400 transition-colors">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 pl-4 pr-12 rounded-xl bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-blue-400 transition-colors"
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
                                className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-shadow group/btn disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin text-black" />
                                ) : (
                                    <>
                                        Create Company Account
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>

                        <motion.p variants={itemVars} className="text-neutral-400 text-sm sm:text-base text-center mt-6 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                Log in
                            </Link>
                        </motion.p>
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