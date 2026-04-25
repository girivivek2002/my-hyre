"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#" },
    { name: "Recruiters", href: "#" },
    { name: "Candidates", href: "#" },
    { name: "Support", href: "#" },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] px-6">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-7xl mx-auto rounded-full transition-all duration-500 border border-white/10 ${
          scrolled 
            ? "bg-black/40 backdrop-blur-3xl py-3 px-8 shadow-2xl" 
            : "bg-white/5 backdrop-blur-2xl py-4 px-10"
        } flex items-center justify-between`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
             <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">Mr. Hyre</span>
        </Link>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action (Desktop) */}
        <div className="hidden md:block">
          <Link 
            href="/login" 
            className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-20 left-6 right-6 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 flex flex-col gap-6 md:hidden z-[101]"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 text-lg font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 bg-white text-black text-center rounded-2xl font-bold"
            >
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}