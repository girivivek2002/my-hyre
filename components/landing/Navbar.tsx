"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Recruiters", href: "#recruiters" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <div className="fixed top-5 left-0 right-0 z-[100] px-6">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-7xl w-full mx-auto rounded-full transition-all duration-500 flex items-center justify-between ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-slate-200/60 py-2.5 px-6"
            : "bg-white/40 backdrop-blur-xl border border-slate-200/40 py-3 px-8"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 relative group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Mr. Hyre Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-slate-900 font-bold tracking-tight text-lg">Mr. Hyre</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors px-4 py-2">
            Log in
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-20 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-2xl p-6 flex flex-col gap-4 md:hidden shadow-xl z-[101]"
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-slate-700 text-base font-medium py-2">
                {link.name}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-indigo-600 text-white text-center rounded-xl font-semibold mt-2">
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}