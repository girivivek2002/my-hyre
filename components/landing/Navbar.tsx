"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "For Recruiters", href: "/login?role=recruiter" },
    { name: "For Candidates", href: "/login?role=candidate" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-50 transition-all duration-500`}
    >
      <div className={`mx-auto max-w-[1920px] rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3 ${
        scrolled 
          ? "bg-white/80 dark:bg-[#0A0A0F]/80 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.06] shadow-lg" 
          : "bg-transparent border border-transparent"
      }`}>
        
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image src="/logo.png" alt="Mr. Hyre" fill sizes="40px" className={`object-contain transition-all duration-500 ${scrolled ? '' : 'brightness-0 invert'}`} />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-500 ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
              Mr. Hyre
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-indigo-400 ${
                scrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/80'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <button className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
              scrolled 
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white' 
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20'
            }`}>
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`transition-colors p-2 focus:outline-none ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[120%] left-0 right-0 bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-500 py-2 border-b border-slate-100 dark:border-white/[0.04]"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold">
                  Login
                </button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}