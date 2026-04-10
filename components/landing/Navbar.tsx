"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants: Variants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-slate-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-8 h-8 md:w-9 md:h-9">
              <Image src="/logo.png" alt="Mr. Hyre" fill sizes="36px" className="object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-neutral-400">
              Mr. Hyre
            </span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <motion.div variants={itemVariants} className="hidden md:flex items-center gap-2 relative">
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className="relative px-4 py-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                href={item.href}
                className={`relative z-10 text-sm font-medium transition-colors duration-300 ${hoveredIndex === index ? "text-blue-600 dark:text-white" : "text-slate-600 dark:text-neutral-400"
                  }`}
              >
                {item.name}
              </Link>
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-hover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute inset-0 bg-slate-100 dark:bg-white/10 rounded-full z-0 pointer-events-none"
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
              whileHover={{ scale: 1.05, color: "#3182ce" }}
              whileTap={{ scale: 0.95 }}
              className="text-slate-600 dark:text-neutral-400 text-sm font-medium px-4 py-2 transition-colors"
            >
              Login
            </motion.button>
          </Link>

          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-medium text-sm overflow-hidden group shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-shadow duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign Up
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  →
                </motion.span>
              </span>

              {/* Animated Inner Shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2.5,
                  ease: "linear",
                  repeatDelay: 0.5
                }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Mobile Hamburger Toggle */}
        <motion.div variants={itemVariants} className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-white transition-colors p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </motion.div>

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden flex flex-col bg-white/95 dark:bg-black/95 px-6 pt-4 pb-8 gap-4 overflow-hidden border-t border-slate-100 dark:border-white/5 shadow-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-slate-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white transition-colors py-2 border-b border-slate-100 dark:border-white/5"
              >
                <motion.span
                  whileHover={{ x: 10 }}
                  className="block w-full"
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}

            <motion.div variants={mobileItemVariants} className="flex flex-col gap-4 mt-4">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center text-slate-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white py-3 border border-slate-200 dark:border-white/10 rounded-xl transition-colors font-medium">
                  Login
                </button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="relative w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Sign Up
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Bottom Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        className="h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-full origin-center"
      />
    </motion.nav>
  );
}