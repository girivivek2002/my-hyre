"use client";
import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { UserSearch, Building2, ArrowRight } from "lucide-react";
import { MouseEvent } from "react";

function SignupCard({ title, desc, icon, href }: { title: string; desc: string; icon: React.ReactNode; href: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link href={href} className="block w-full max-w-[360px] shrink-0">
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
                }}
                onMouseMove={handleMouseMove}
                className="group relative flex flex-col bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-slate-200 dark:border-neutral-800/80 rounded-3xl p-8 hover:border-transparent transition-all duration-300 overflow-hidden text-left shadow-lg dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] h-full"
            >
                {/* Magnetic Glow Border */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                300px circle at ${mouseX}px ${mouseY}px,
                                rgba(59, 130, 246, 0.4),
                                transparent 80%
                            )
                        `,
                    }}
                />
                <div className="absolute inset-0 rounded-3xl bg-white/90 dark:bg-neutral-950/90 -z-10" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/50 text-slate-900 dark:text-white shadow-inner group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-300">
                        {icon}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-100 transition-colors">
                        {title}
                    </h3>

                    <p className="text-slate-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-10 flex-grow">
                        {desc}
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-slate-900 text-white dark:bg-white dark:text-black py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all group/btn"
                    >
                        Select
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}

export default function SignupPage() {
    const containerVars: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1, ease: "easeOut" }
        }
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black relative overflow-hidden flex flex-col select-none transition-colors duration-300">

            {/* Background Animated Glow */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-blue-500/30 blur-[120px] sm:blur-[180px] rounded-full top-10 left-1/2 -translate-x-1/2 pointer-events-none"
            ></motion.div>

            {/* Center Content */}
            <div className="flex flex-1 items-center justify-center px-6 py-20 relative z-10 w-full max-w-5xl mx-auto">
                <motion.div
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className="text-center w-full"
                >

                    {/* Logo */}
                    <motion.div variants={itemVars} className="flex justify-center mb-10">
                        <Image src="/logo.png" alt="Mr. Hyre Logo" width={44} height={44} className="rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1 variants={itemVars} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 pb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-neutral-400">
                        The Intelligent Workspace.
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p variants={itemVars} className="text-slate-600 dark:text-neutral-400 text-lg md:text-xl mb-16 max-w-2xl mx-auto transition-colors">
                        Choose your path to begin your journey with the world's most sophisticated AI recruitment suite.
                    </motion.p>

                    {/* Cards Container */}
                    <motion.div variants={itemVars} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">

                        {/* Candidate Card */}
                        <SignupCard
                            title="Join as a Candidate"
                            desc="Unlock high-end career opportunities tailored instantly to your unique expertise and hidden strengths."
                            icon={<UserSearch size={26} strokeWidth={2.5} />}
                            href="/candidate/signup"
                        />

                        {/* Company Card */}
                        <SignupCard
                            title="Join as a Company"
                            desc="Architect your dream team with semantic AI-driven sourcing and editorial-grade selection algorithms."
                            icon={<Building2 size={26} strokeWidth={2.5} />}
                            href="/recruiter/signup"
                        />

                    </motion.div>

                    {/* Login Link */}
                    <motion.p variants={itemVars} className="text-slate-600 dark:text-neutral-400 text-sm sm:text-base mt-16 font-medium transition-colors">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                            Log in here
                        </Link>
                    </motion.p>

                </motion.div>
            </div>

            {/* Responsive Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="border-t border-slate-200 dark:border-neutral-900/50 py-6 px-6 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 dark:text-neutral-500 gap-4 relative z-10"
            >
                <div className="font-semibold text-slate-500 dark:text-neutral-400 tracking-widest uppercase transition-colors">© {new Date().getFullYear()} Mr. Hyre</div>
                <div className="flex gap-4 sm:gap-8 font-medium">
                    <span className="hover:text-slate-900 dark:hover:text-neutral-300 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-slate-900 dark:hover:text-neutral-300 cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-slate-900 dark:hover:text-neutral-300 cursor-pointer transition-colors">Contact</span>
                </div>
            </motion.div>

        </div>
    );
}