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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinksLeft = [
    { name: "ABOUT", href: "#" },
    { name: "RECRUITERS", href: "#" },
  ];

  const navLinksRight = [
    { name: "CANDIDATES", href: "#" },
    { name: "CONTACT", href: "#" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-portfolio-navy/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
          
          {/* Left Links (Desktop) */}
          <div className="hidden md:flex items-center gap-12 w-1/3">
            {navLinksLeft.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-bold tracking-[0.2em] text-white hover:text-portfolio-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-portfolio-gold transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </Link>
            ))}
          </div>

          {/* Center Logo */}
          <Link href="/" className="flex flex-col items-center justify-center w-1/3 shrink-0 group relative z-50">
            {/* Minimalist Logo abstract mark */}
            <div className="relative w-10 h-10 flex items-center justify-center mb-1">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-portfolio-accent transition-colors duration-500">
                <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5ZM20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0Z" fill="currentColor"/>
                <path d="M25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20C22.7614 20 25 22.2386 25 25C25 27.7614 22.7614 30 20 30C17.2386 30 15 27.7614 15 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-serif text-sm tracking-wide text-white group-hover:text-portfolio-accent transition-colors duration-500">MR. HYRE</span>
          </Link>

          {/* Right Links (Desktop) */}
          <div className="hidden md:flex items-center gap-12 w-1/3 justify-end">
            {navLinksRight.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-bold tracking-[0.2em] text-white hover:text-portfolio-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-portfolio-gold transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </Link>
            ))}
            
            <Link 
              href="/login" 
              className="px-6 py-2 border border-white/20 text-white text-[11px] font-bold tracking-[0.2em] hover:bg-white hover:text-portfolio-navy transition-all duration-300"
            >
              LOGIN
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white relative z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Fullscreen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-portfolio-navy flex flex-col items-center justify-center gap-8"
          >
            {[...navLinksLeft, ...navLinksRight].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold tracking-[0.3em] text-white hover:text-portfolio-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 px-10 py-3 border border-white/20 text-white font-bold tracking-[0.2em] hover:bg-white hover:text-portfolio-navy transition-colors"
            >
              LOGIN
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}