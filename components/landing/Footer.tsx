"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Globe, AtSign, Share2 } from "lucide-react";

export default function Footer() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
  };

  return (
    <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-900 px-6 md:px-12 lg:px-24 pt-16 lg:pt-24 pb-8 overflow-hidden relative max-w-[1920px] mx-auto z-10 transition-colors duration-300">

      {/* Top Gradient Line Animated Reveal */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent origin-center"
      ></motion.div>

      {/* Top Grid */}
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16 lg:mb-20"
      >
        {/* Logo + Description */}
        <motion.div variants={itemVars}>
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logo.png" alt="Mr Hyre Logo" width={40} height={40} className="rounded-xl" />
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Mr. Hyre</div>
          </div>

          <p className="text-slate-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed max-w-sm lg:pr-8 transition-colors">
            The Intelligent Workspace for modern recruitment.
            Building bridges between top talent and innovative companies safely and securely.
          </p>
        </motion.div>

        {/* Company */}
        <FooterColumn
          itemVars={itemVars}
          title="COMPANY"
          links={["About Us", "Careers", "Blog", "Contact"]}
        />

        {/* Product */}
        <FooterColumn
          itemVars={itemVars}
          title="PRODUCT"
          links={["For Recruiters", "For Candidates", "Pricing", "Roadmap"]}
        />

        {/* Support */}
        <FooterColumn
          itemVars={itemVars}
          title="SUPPORT"
          links={["Help Center", "Privacy Policy", "Terms of Service", "Security"]}
        />
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="border-t border-slate-100 dark:border-neutral-900/50 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6"
      >
        <div className="text-slate-400 dark:text-neutral-500 text-xs sm:text-sm text-center md:text-left transition-colors hover:text-slate-600 dark:hover:text-neutral-400">
          © {new Date().getFullYear()} Mr. Hyre. The Intelligent Workspace. All rights reserved.
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 text-slate-400 dark:text-neutral-500 transition-colors">
          <Icon icon={<Globe size={20} />} />
          <Icon icon={<AtSign size={20} />} />
          <Icon icon={<Share2 size={20} />} />
        </div>
      </motion.div>
    </footer>
  );
}

/* Footer Column */
function FooterColumn({ title, links, itemVars }: { title: string; links: string[], itemVars: any }) {
  return (
    <motion.div variants={itemVars}>
      <h4 className="text-slate-900 dark:text-neutral-300 font-semibold text-xs sm:text-sm mb-6 tracking-widest uppercase transition-colors">
        {title}
      </h4>

      <div className="space-y-4 text-slate-500 dark:text-neutral-400 text-sm md:text-base">
        {links.map((link: string, i: number) => (
          <motion.div
            key={i}
            whileHover={{ x: 6, color: "#3182ce" }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-max"
          >
            {link}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* Social Icon */
function Icon({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.2, y: -4, color: "#3182ce" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="cursor-pointer hover:text-blue-600 dark:hover:text-white transition-all p-2 bg-slate-100 dark:bg-neutral-900/50 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800"
    >
      {icon}
    </motion.div>
  );
}