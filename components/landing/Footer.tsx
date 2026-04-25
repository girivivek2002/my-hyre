"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, AtSign, Share2 } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    { title: "COMPANY", links: ["About Us", "Careers", "Journal", "Contact"] },
    { title: "PRODUCT", links: ["For Recruiters", "For Candidates", "Pricing", "Architecture"] },
    { title: "LEGAL", links: ["Privacy Policy", "Terms of Service", "Security", "Cookies"] },
  ];

  return (
    <footer className="w-full bg-portfolio-navy border-t border-white/10 pt-24 pb-12 overflow-hidden relative">
      
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex flex-col items-start group relative mb-8">
              <div className="relative w-8 h-8 flex items-center justify-center mb-1">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-portfolio-accent transition-colors duration-500">
                  <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5ZM20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0Z" fill="currentColor"/>
                  <path d="M25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20C22.7614 20 25 22.2386 25 25C25 27.7614 22.7614 30 20 30C17.2386 30 15 27.7614 15 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-serif text-sm tracking-wide text-white group-hover:text-portfolio-accent transition-colors duration-500">MR. HYRE</span>
            </Link>
            <p className="text-white/50 text-sm max-w-sm leading-relaxed font-medium">
              The structural hiring platform for modern engineering teams. High fidelity matching, zero friction.
            </p>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            {footerLinks.map((col, idx) => (
              <div key={idx} className="flex flex-col">
                <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-8">{col.title}</h4>
                <div className="flex flex-col gap-4">
                  {col.links.map((link, lidx) => (
                    <Link key={lidx} href="#" className="text-sm font-medium text-white/70 hover:text-portfolio-accent transition-colors">
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/10">
           <div className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
             © {new Date().getFullYear()} MR. HYRE. ALL RIGHTS RESERVED.
           </div>
           
           <div className="flex items-center gap-6">
             <Link href="#" className="text-white/40 hover:text-white transition-colors">
               <Globe size={18} />
             </Link>
             <Link href="#" className="text-white/40 hover:text-white transition-colors">
               <AtSign size={18} />
             </Link>
             <Link href="#" className="text-white/40 hover:text-white transition-colors">
               <Share2 size={18} />
             </Link>
           </div>
        </div>

      </div>
    </footer>
  );
}