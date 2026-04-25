"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const avatarGradients = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-fuchsia-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
];

export default function Testimonials() {
  const testimonials = [
    { text: "The semantic search functionality saved our recruiting velocity. We used to spend weeks filtering profiles; now it takes roughly 15 minutes to generate an actionable shortlist of passive candidates.", name: "Sarah Mehta", role: "Head of Talent, ScaleX", rating: 5 },
    { text: "Moving off of legacy ATS platforms to Mr. Hyre felt like stepping into the future. It natively syncs our calendars and auto-engages matches without any manual overhead.", name: "Marcus Levine", role: "VP Engineering, DevCore", rating: 5 },
    { text: "I was initially skeptical about AI screening, but the deep search algorithms look past resume typos to recognize the underlying technical patterns and code quality of the candidates.", name: "Emily Chen", role: "Founder, TechStack", rating: 4.5 },
    { text: "Finally, a platform that doesn't just parse PDFs but actually understands the context of a candidate's GitHub repos and previous side-projects. Unbelievable precision.", name: "David Okoro", role: "Lead Recruiter", rating: 5 },
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex gap-1 mb-6">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {halfStar && (
          <div className="relative w-4 h-4">
            <Star className="absolute inset-0 w-full h-full text-slate-700" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-slate-700" />
        ))}
      </div>
    );
  };

  return (
    <section className="relative w-full px-4 pb-4 sm:pb-6 overflow-hidden bg-slate-50 dark:bg-[#0A0A0F]">
      <div className="relative w-full rounded-[32px] sm:rounded-[48px] overflow-hidden bg-[#111118] py-24 lg:py-40 mx-auto max-w-[1920px]">
      <div className="absolute w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full right-0 top-1/2 -translate-y-1/2 pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 lg:mb-24 px-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-bold mb-8 tracking-[0.2em] uppercase">
          <Star size={14} className="fill-current" />
          Verified Success
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-[-0.04em] text-white">
          ENGINEERED FOR <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">EXCELLENCE</span>
        </h2>
      </motion.div>

      <div 
        className="relative w-full overflow-hidden pb-10"
        style={{ 
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", 
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" 
        }}
      >
        <div className="relative flex w-max">
          <motion.div
            className="flex gap-6 pr-6 items-stretch"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {duplicatedTestimonials.map((t, index) => (
              <TestimonialCard key={index} t={t} renderStars={renderStars} gradientIndex={index % avatarGradients.length} />
            ))}
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, renderStars, gradientIndex }: { t: any, renderStars: (v: number) => React.ReactNode, gradientIndex: number }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative flex flex-col justify-between w-[380px] bg-white/5 dark:bg-[#111118]/60 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.06] rounded-[32px] p-8 sm:p-10 transition-all duration-500 hover:border-indigo-500/30 shrink-0 overflow-hidden shadow-premium hover:bg-white/10 dark:hover:bg-[#111118]/80"
    >
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div>
          <Quote size={32} className="text-indigo-500/20 mb-6 -ml-1" />
          {renderStars(t.rating)}
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            &ldquo;{t.text}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-4 mt-auto">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradients[gradientIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-white text-base">{t.name}</div>
            <div className="text-slate-400 text-sm font-medium">{t.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}