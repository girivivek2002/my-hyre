"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Globe, AtSign, Share2 } from "lucide-react";

const socialIcons = [
  { icon: <Globe size={20} />, hoverColor: "hover:text-indigo-500 hover:bg-indigo-500/10 hover:border-indigo-500/20" },
  { icon: <AtSign size={20} />, hoverColor: "hover:text-violet-500 hover:bg-violet-500/10 hover:border-violet-500/20" },
  { icon: <Share2 size={20} />, hoverColor: "hover:text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500/20" },
];

export default function Footer() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
  };

  return (
    <footer className="relative w-full px-4 pb-4 sm:pb-6 overflow-hidden bg-slate-50 dark:bg-[#0A0A0F]">
      <div className="relative w-full rounded-[32px] sm:rounded-[48px] overflow-hidden bg-[#111118] px-6 md:px-12 lg:px-24 pt-16 lg:pt-24 pb-8 max-w-[1920px] mx-auto z-10 transition-colors duration-300">

      {/* Gradient top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent origin-center"
      />

      {/* Content */}
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
            <div className="text-2xl font-bold tracking-tight text-gradient-primary">Mr. Hyre</div>
          </div>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm lg:pr-8">
            The Intelligent Workspace for modern recruitment.
            Building bridges between top talent and innovative companies safely and securely.
          </p>
        </motion.div>

        <FooterColumn itemVars={itemVars} title="COMPANY" links={["About Us", "Careers", "Blog", "Contact"]} />
        <FooterColumn itemVars={itemVars} title="PRODUCT" links={["For Recruiters", "For Candidates", "Pricing", "Roadmap"]} />
        <FooterColumn itemVars={itemVars} title="SUPPORT" links={["Help Center", "Privacy Policy", "Terms of Service", "Security"]} />
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="border-t border-slate-100 dark:border-white/[0.04] pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6"
      >
        <div className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm text-center md:text-left transition-colors hover:text-slate-600 dark:hover:text-slate-400">
          © {new Date().getFullYear()} Mr. Hyre. The Intelligent Workspace. All rights reserved.
        </div>

        <div className="flex gap-4">
          {socialIcons.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.15, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`cursor-pointer text-slate-400 transition-all p-2.5 bg-white/[0.04] rounded-full border border-white/[0.06] ${item.hoverColor}`}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, itemVars }: { title: string; links: string[], itemVars: any }) {
  return (
    <motion.div variants={itemVars}>
      <h4 className="text-white font-semibold text-xs sm:text-sm mb-6 tracking-widest uppercase">
        {title}
      </h4>
      <div className="space-y-4 text-slate-400 text-sm md:text-base">
        {links.map((link: string, i: number) => (
          <motion.div
            key={i}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="cursor-pointer hover:text-indigo-400 transition-colors w-max"
          >
            {link}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}