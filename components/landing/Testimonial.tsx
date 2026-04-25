"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { MouseEvent } from "react";

const avatarGradients = [
  "from-indigo-500 to-violet-600",
  "from-violet-500 to-fuchsia-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-pink-500 to-rose-600",
];

export default function Testimonials() {
  const testimonials = [
    { text: "The semantic search functionality saved our recruiting velocity. We used to spend weeks filtering profiles; now it takes roughly 15 minutes to generate an actionable shortlist of passive candidates.", name: "Sarah Mehta", role: "Head of Talent, ScaleX", rating: 5 },
    { text: "Moving off of legacy ATS platforms to Mr. Hyre felt like stepping into the future. It natively syncs our calendars and auto-engages matches without any manual overhead.", name: "Marcus Levine", role: "VP Engineering, DevCore", rating: 5 },
    { text: "I was initially skeptical about AI screening, but the deep search algorithms look past resume typos to recognize the underlying technical patterns and code quality of the candidates.", name: "Emily Chen", role: "Founder, TechStack", rating: 4.5 },
    { text: "Finally, a platform that doesn't just parse PDFs but actually understands the context of a candidate's GitHub repos and previous side-projects. Unbelievable precision.", name: "David Okoro", role: "Lead Recruiter", rating: 5 },
    { text: "We cut our cost-per-hire in half in 3 months. The direct matching skips the traditional job board noise entirely, delivering candidates who actually want to work here.", name: "Anita Patel", role: "HR Director", rating: 4.5 },
    { text: "The intelligent workspace consolidated 4 different tools we were paying for. Now our team manages sourcing, interviews, and offers from one dashboard.", name: "James Wilson", role: "Startup Founder", rating: 5 },
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex gap-1 mb-6">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
        ))}
        {halfStar && (
          <div className="relative w-4 h-4 sm:w-5 sm:h-5">
            <Star className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-700" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 dark:text-slate-700" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 lg:py-40 bg-white dark:bg-[#0A0A0F] relative max-w-[1920px] mx-auto overflow-hidden transition-colors duration-300">

      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/6 blur-[140px] rounded-full left-1/2 -translate-x-1/2 top-40 pointer-events-none -z-10 animate-orb-drift" />
      <div className="absolute w-[300px] h-[300px] bg-violet-500/6 blur-[100px] rounded-full left-[20%] bottom-20 pointer-events-none -z-10 animate-orb-drift-reverse" />

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16 lg:mb-24 px-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          <Star size={12} className="fill-current" />
          Success Stories
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">
          Loved by Hiring Teams
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto transition-colors">
          See what real recruiters and hyper-growth startups are saying about Mr. Hyre.
        </p>
      </motion.div>

      {/* Infinite scroll carousel */}
      <div 
        className="relative w-full overflow-hidden pb-10"
        style={{ 
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", 
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" 
        }}
      >
        <div className="relative flex w-max">
          <motion.div
            className="flex gap-6 sm:gap-8 pr-6 sm:pr-8 items-stretch"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 55, repeat: Infinity }}
          >
            {duplicatedTestimonials.map((t, index) => (
              <TestimonialCard key={index} t={t} renderStars={renderStars} gradientIndex={index % avatarGradients.length} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, renderStars, gradientIndex }: { t: any, renderStars: (v: number) => React.ReactNode, gradientIndex: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between w-[320px] sm:w-[420px] bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/[0.06] rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:border-transparent shrink-0 overflow-hidden"
    >
      {/* Radial follow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.06), transparent 80%)`,
        }}
      />
      {/* Outer glow */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.4), transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 rounded-3xl bg-white/90 dark:bg-[#111118]/90 -z-10" />

      <div className="relative z-10 flex flex-col h-full">
        <div>
          {/* Quote mark decorative */}
          <Quote size={28} className="text-indigo-500/20 dark:text-indigo-400/15 mb-4 -ml-1" />

          {renderStars(t.rating)}

          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            &ldquo;{t.text}&rdquo;
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 mt-auto">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[gradientIndex]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</div>
            <div className="text-slate-500 dark:text-slate-500 text-xs font-medium">{t.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}