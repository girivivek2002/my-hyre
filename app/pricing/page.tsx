"use client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Pricing from "@/components/landing/Pricing";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <main className="bg-slate-50 dark:bg-black min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 px-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Plans that scale with your <span className="text-blue-600 dark:text-blue-500">ambition.</span>
          </h1>
          <p className="text-slate-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            Choose the perfect intelligence tier for your team's hiring needs.
          </p>
        </motion.div>
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
