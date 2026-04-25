"use client";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, KeyRound, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("candidate");
  const router = useRouter();

  useEffect(() => {
    const syncOAuth = async () => {
      try {
        const session = await getSession();
        if (session && (session as any).customJwt) {
          localStorage.setItem("authToken", (session as any).customJwt);
          localStorage.setItem("userRole", (session as any).userRole || "candidate");
          localStorage.setItem("userName", (session as any).user?.name || "");
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      }
    };
    syncOAuth();
  }, []);

  const containerVars: Variants = {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    visible: { 
      opacity: 1, scale: 1, filter: "blur(0px)",
      transition: { staggerChildren: 0.08, delayChildren: 0.1, ease: "easeOut", duration: 0.6 } 
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error(`Invalid response format from server (Status: ${res.status})`);
      }

      if (!res.ok) {
        setErrorObj(data.error || data.message || "Authentication rejected.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);

      if (!data.isProfileComplete) {
        router.push(data.user.role === "candidate" ? "/candidate/profile" : "/recruiter/profile");
      } else {
        router.push(data.user.role === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard");
      }
    } catch (err: any) {
      console.error("Login submission error:", err);
      setErrorObj(err.message || "Network error: Could not reach the authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#0A0A0F] relative overflow-hidden select-none transition-colors duration-300">

      {/* Dual animated orbs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/15 blur-[140px] rounded-full top-[-10%] left-[30%] pointer-events-none animate-orb-drift" />
      <div className="absolute w-[400px] h-[400px] bg-violet-500/12 blur-[120px] rounded-full bottom-[10%] right-[20%] pointer-events-none animate-orb-drift-reverse" />

      {/* Login Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 relative z-10">

        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px] bg-white/70 dark:bg-[#111118]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.06] rounded-3xl p-6 sm:p-10 shadow-premium dark:shadow-premium-dark relative overflow-hidden text-slate-900 dark:text-white mx-4"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

          {/* Logo */}
          <motion.div variants={itemVars} className="flex items-center justify-center gap-3 mb-8">
            <Image src="/logo.png" alt="Mr. Hyre Logo" width={36} height={36} className="rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
            <span className="text-xl font-bold tracking-tight text-gradient-primary">Mr. Hyre</span>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVars} className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm px-2">
              Sign in to your intelligent hiring workspace
            </p>
          </motion.div>

          {/* Error */}
          {errorObj && (
            <motion.div variants={itemVars} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {errorObj}
            </motion.div>
          )}

          <form className="relative z-10" onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div variants={itemVars} className="mb-5 group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 ml-1 mb-2 block group-focus-within:text-indigo-500 transition-colors">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-white dark:bg-[#0A0A0F]/50 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVars} className="mb-8 group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  PASSWORD
                </label>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer transition-colors">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-white dark:bg-[#0A0A0F]/50 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </motion.div>

            {/* Sign In Button */}
            <motion.div variants={itemVars}>
              <motion.button 
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow-indigo hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-shadow group disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVars} className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.06]" />
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.06]" />
          </motion.div>

          {/* Role Selector */}
          <motion.div variants={itemVars} className="mb-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/[0.06]">
              <button 
                type="button"
                onClick={() => {
                  setSelectedRole("candidate");
                  document.cookie = `selectedRole=candidate; path=/; max-age=3600`;
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${selectedRole === "candidate" ? "bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                Candidate
              </button>
              <button 
                type="button"
                onClick={() => {
                  setSelectedRole("recruiter");
                  document.cookie = `selectedRole=recruiter; path=/; max-age=3600`;
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${selectedRole === "recruiter" ? "bg-white dark:bg-white/10 shadow-sm text-violet-600 dark:text-violet-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                Recruiter
              </button>
            </div>
          </motion.div>

          {/* Social Buttons */}
          <motion.div variants={itemVars} className="grid grid-cols-2 gap-3">
            <motion.button 
              onClick={() => signIn("google", { callbackUrl: `/${selectedRole}/dashboard` })}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] py-3 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </motion.button>

            <motion.button 
              onClick={() => signIn("linkedin", { callbackUrl: `/${selectedRole}/dashboard` })}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] py-3 rounded-xl hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/5 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </motion.button>
          </motion.div>

          {/* Signup Link */}
          <motion.p variants={itemVars} className="text-slate-500 dark:text-slate-400 text-sm text-center mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              Sign Up
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="border-t border-slate-200 dark:border-white/[0.04] py-6 px-6 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-500 gap-4 relative z-10"
      >
        <div className="font-semibold text-gradient-primary tracking-widest uppercase">Mr. Hyre</div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium">
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-300 cursor-pointer transition-colors">Help Center</span>
        </div>
        <div>© {new Date().getFullYear()} Mr. Hyre AI</div>
      </motion.div>
    </div>
  );
}