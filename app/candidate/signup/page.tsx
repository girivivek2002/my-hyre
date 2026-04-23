"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, User, Mail, Phone, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CandidateSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Stagger variants for smooth form entry
  const containerVars: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1, ease: "easeOut", duration: 0.5 } 
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
          role: "candidate",
          name,
          email,
          phone,
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorObj(data.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      // Automatically store token and login
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);
      
      router.push("/candidate/profile");
    } catch (err) {
      setErrorObj("Network error: Could not reach the authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#050505] relative overflow-hidden select-none transition-colors duration-300">

      {/* Animated Ambient Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-blue-600/20 blur-[120px] sm:blur-[160px] rounded-full top-0 left-1/2 -translate-x-1/2 pointer-events-none"
      ></motion.div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center px-6 sm:px-12 lg:px-20 py-6 relative z-20"
      >
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Mr. Hyre Logo" width={32} height={32} className="rounded-xl" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Mr. Hyre</span>
          <span className="text-[10px] font-bold bg-slate-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-neutral-400 tracking-wider">CANDIDATE</span>
        </div>

        <Link href="/signup" className="text-slate-500 dark:text-neutral-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to selection
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[480px] bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-slate-200 dark:border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Inner glossy highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>

          {/* Title Section */}
          <motion.div variants={itemVars} className="text-center mb-10">
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-neutral-400">
              Create your account.
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 text-sm">
              Start your AI-powered career journey today.
            </p>
          </motion.div>

          {/* Error Banner */}
          {errorObj && (
            <motion.div variants={itemVars} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {errorObj}
            </motion.div>
          )}

          {/* Form */}
          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <motion.div variants={itemVars} className="group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">FULL NAME</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVars} className="group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">EMAIL ADDRESS</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
              </div>
            </motion.div>

            {/* Mobile */}
            <motion.div variants={itemVars} className="group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">MOBILE NUMBER</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVars} className="group">
              <label className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-400 ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">PASSWORD</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 transition-colors">
                  <KeyRound size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-400 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVars} className="pt-4">
              <motion.button 
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-slate-900 border border-slate-800 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all group disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
            <motion.div variants={itemVars} className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl: "/login" })}
                className="flex items-center justify-center gap-3 bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-neutral-900 transition-all shadow-sm"
              >
                <Image src="/google.png" alt="Google" width={16} height={16} />
                Google
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("linkedin", { callbackUrl: "/login" })}
                className="flex items-center justify-center gap-3 bg-[#0077B5] text-white border border-[#00669c] py-3 rounded-xl font-bold text-xs hover:bg-[#00669c] transition-all shadow-sm"
              >
                <div className="bg-white rounded-[2px] p-[1px]">
                   <Image src="/linkedin.png" alt="LinkedIn" width={14} height={14} />
                </div>
                LinkedIn
              </motion.button>
            </motion.div>

            <motion.p variants={itemVars} className="text-slate-500 dark:text-neutral-400 text-sm text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Log in
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t border-slate-200 dark:border-neutral-900 py-6 px-6 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-neutral-500 gap-4 relative z-10"
      >
        <div className="font-bold tracking-widest uppercase opacity-50 text-slate-400">© {new Date().getFullYear()} Mr. Hyre AI</div>
        <div className="flex gap-6 font-medium uppercase tracking-widest">
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </motion.footer>

    </div>
  );
}