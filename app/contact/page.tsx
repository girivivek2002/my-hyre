"use client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-slate-50 dark:bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
              Let's build your <span className="text-blue-600 dark:text-blue-500">dream team.</span>
            </h1>
            <p className="text-slate-600 dark:text-neutral-400 text-lg mb-12 max-w-lg">
              Have questions about our AI matching engine or enterprise plans? 
              Our team of experts is ready to help you scale.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">EMAIL US</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">support@mrhyre.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">LIVE CHAT</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">HEADQUARTERS</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">Silicon Valley, CA</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-neutral-400">FIRST NAME</label>
                  <input className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-neutral-400">LAST NAME</label>
                  <input className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-neutral-400">WORK EMAIL</label>
                <input className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-neutral-400">MESSAGE</label>
                <textarea rows={4} className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Tell us about your hiring goals..." />
              </div>
              <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all">
                Send Message
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
