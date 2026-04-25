"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-white/80 dark:bg-[#0A0A0F]/80 border-b border-slate-200/50 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          : "backdrop-blur-md bg-white/50 dark:bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between max-w-[1920px] mx-auto">

        {/* Logo */}
        <Link href="/">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9">
              <Image src="/logo.png" alt="Mr. Hyre" fill sizes="36px" className="object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-gradient-primary">
              Mr. Hyre
            </span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <motion.div variants={itemVariants} className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className="relative px-4 py-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                href={item.href}
                className={`relative z-10 text-sm font-medium transition-colors duration-300 ${hoveredIndex === index ? "text-indigo-600 dark:text-white" : "text-slate-600 dark:text-slate-400"
                  }`}
              >
                {item.name}
              </Link>
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-full z-0 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Desktop Buttons */}
        <motion.div variants={itemVariants} className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Login
            </motion.button>
          </Link>

          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-full text-white font-semibold text-sm overflow-hidden group shadow-glow-indigo hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-shadow duration-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 3,
                  ease: "linear",
                  repeatDelay: 1
                }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Mobile Hamburger */}
        <motion.div variants={itemVariants} className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-2 focus:outline-none"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06, delayChildren: 0.08 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.25, ease: "easeIn" } }}
            className="md:hidden flex flex-col bg-white/95 dark:bg-[#0A0A0F]/95 backdrop-blur-2xl px-6 pt-4 pb-8 gap-2 overflow-hidden border-t border-slate-100 dark:border-white/[0.04] shadow-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors py-3 border-b border-slate-100 dark:border-white/[0.04]"
              >
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 8 }}
                  className="block w-full"
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white py-3 border border-slate-200 dark:border-white/[0.08] rounded-xl transition-colors font-medium">
                  Login
                </button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-xl text-white font-semibold overflow-hidden shadow-glow-indigo">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated bottom line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent w-full origin-center"
      />
    </motion.nav>
  );
}