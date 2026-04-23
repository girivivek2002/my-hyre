"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Building2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function CompleteProfile() {
  const { data: session, update } = useSession();
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (!role) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        // Update session to reflect new role and completed status
        await update({
          ...session,
          userRole: role,
          isProfileComplete: true,
        });
        
        router.push(role === "candidate" ? "/candidate/profile" : "/recruiter/profile");
      }
    } catch (error) {
      console.error("Profile completion error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
          One last step.
        </h1>
        <p className="text-neutral-400 mb-10 text-lg">
          How do you intend to use Mr. Hyre?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Candidate Option */}
          <button
            onClick={() => setRole("candidate")}
            className={`relative p-8 rounded-3xl border-2 transition-all group ${
              role === "candidate" 
              ? "border-blue-500 bg-blue-500/10" 
              : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
            }`}
          >
            <div className={`mb-4 w-12 h-12 mx-auto flex items-center justify-center rounded-xl ${role === "candidate" ? "bg-blue-500 text-white" : "bg-neutral-800 text-neutral-400"}`}>
              <User size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">Candidate</h3>
            <p className="text-neutral-500 text-sm mt-2">Looking for high-end AI roles</p>
            {role === "candidate" && (
              <div className="absolute top-3 right-3 text-blue-500">
                <CheckCircle2 size={20} />
              </div>
            )}
          </button>

          {/* Recruiter Option */}
          <button
            onClick={() => setRole("recruiter")}
            className={`relative p-8 rounded-3xl border-2 transition-all group ${
              role === "recruiter" 
              ? "border-blue-500 bg-blue-500/10" 
              : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
            }`}
          >
            <div className={`mb-4 w-12 h-12 mx-auto flex items-center justify-center rounded-xl ${role === "recruiter" ? "bg-blue-500 text-white" : "bg-neutral-800 text-neutral-400"}`}>
              <Building2 size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">Recruiter</h3>
            <p className="text-neutral-500 text-sm mt-2">Sourcing elite AI talent</p>
            {role === "recruiter" && (
              <div className="absolute top-3 right-3 text-blue-500">
                <CheckCircle2 size={20} />
              </div>
            )}
          </button>
        </div>

        <button
          disabled={!role || isSubmitting}
          onClick={handleComplete}
          className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Continue
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
