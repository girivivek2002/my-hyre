"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function CandidateSignup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">

      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-blue-500/20 blur-[160px] rounded-full top-20 left-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="flex justify-between items-center px-20 py-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={26} height={26} />
          <span className="font-semibold">Mr. Hyre</span>
          <span className="text-xs bg-neutral-800 px-2 py-1 rounded">HQ</span>
        </div>

        <Link href="/signup" className="text-neutral-400 text-sm">
          ← Back to selection
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[480px] bg-neutral-900/70 backdrop-blur border border-neutral-800 rounded-2xl p-8"
        >
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Create your account.
          </h1>

          <p className="text-neutral-400 text-center mb-8">
            Create your candidate account to start your AI-powered career journey.
          </p>

          {/* Form */}
          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-sm text-neutral-400">Full Name</label>
              <input
                placeholder="John Doe"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-neutral-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-neutral-400">Email Address</label>
              <input
                placeholder="john@example.com"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-neutral-800"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm text-neutral-400">Mobile Number</label>
              <input
                placeholder="+91 9876543210"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-neutral-800"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-neutral-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-neutral-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <Link href="/candidate/profile">
              <button className="w-full bg-white text-black py-3 rounded-full mt-4">
                Create Candidate Account
              </button>
            </Link>

            <p className="text-neutral-400 text-sm text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-white">
                Log in
              </Link>
            </p>

          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="flex justify-between px-20 py-6 text-xs text-neutral-500">
        <div>© 2024 MR. HYRE AI. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <span>PRIVACY POLICY</span>
          <span>TERMS OF SERVICE</span>
        </div>
      </div>

    </div>
  );
}