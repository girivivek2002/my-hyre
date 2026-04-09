"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Star } from "lucide-react";
import { MouseEvent } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      text: "The semantic search functionality saved our recruiting velocity. We used to spend weeks filtering profiles; now it takes roughly 15 minutes to generate an actionable shortlist of passive candidates.",
      name: "Sarah Mehta",
      role: "Head of Talent, ScaleX",
      rating: 5,
    },
    {
      text: "Moving off of legacy ATS platforms to Mr. Hyre felt like stepping into the future. It natively syncs our calendars and auto-engages matches without any manual overhead.",
      name: "Marcus Levine",
      role: "VP Engineering, DevCore",
      rating: 5,
    },
    {
      text: "I was initially skeptical about AI screening, but the deep search algorithms look past resume typos to recognize the underlying technical patterns and code quality of the candidates.",
      name: "Emily Chen",
      role: "Founder, TechStack",
      rating: 4.5,
    },
    {
      text: "Finally, a platform that doesn't just parse PDFs but actually understands the context of a candidate's GitHub repos and previous side-projects. Unbelievable precision.",
      name: "David Okoro",
      role: "Lead Recruiter",
      rating: 5,
    },
    {
      text: "We cut our cost-per-hire in half in 3 months. The direct matching skips the traditional job board noise entirely, delivering candidates who actually want to work here.",
      name: "Anita Patel",
      role: "HR Director",
      rating: 4.5,
    },
    {
      text: "The intelligent workspace consolidated 4 different tools we were paying for. Now our team manages sourcing, interviews, and offers from one dashboard.",
      name: "James Wilson",
      role: "Startup Founder",
      rating: 5,
    },
  ];

  // Quadruple the list so the infinite scroll never runs out on wide screens
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex gap-1 mb-6 text-yellow-500">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500" />
        ))}
        {halfStar && (
          <div className="relative w-4 h-4 sm:w-5 sm:h-5">
            <Star className="absolute inset-0 w-full h-full text-slate-200 dark:text-neutral-600" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500 text-yellow-500" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 dark:text-neutral-600" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 lg:py-40 bg-white dark:bg-black relative max-w-[1920px] mx-auto overflow-hidden transition-colors duration-300">

      {/* Decorative Glow */}
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-blue-500/10 blur-[140px] rounded-[100%] left-1/2 -translate-x-1/2 top-40 pointer-events-none -z-10"
      ></motion.div>

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 lg:mb-24 px-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase">
          Success Stories
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">
          Loved by Hiring Teams
        </h2>
        <p className="text-slate-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto transition-colors">
          See what real recruiters and hyper-growth startups are saying about Mr. Hyre.
        </p>
      </motion.div>

      {/* Slider Container with Mask Fading */}
      <div 
        className="relative w-full overflow-hidden pb-10"
        style={{ 
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", 
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" 
        }}
      >
        <div className="relative flex w-max">
          <motion.div
            className="flex gap-6 sm:gap-10 pr-6 sm:pr-10 items-stretch"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 50, // Slow, comfortable reading speed
              repeat: Infinity,
            }}
          >
            {duplicatedTestimonials.map((t, index) => (
              <TestimonialCard key={index} t={t} renderStars={renderStars} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, renderStars }: { t: any, renderStars: (v: number) => React.ReactNode }) {
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
      className="group relative flex flex-col justify-between w-[320px] sm:w-[450px] bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 transition-all duration-500 hover:border-transparent shrink-0 overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Background radial follow layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.05),
              transparent 80%
            )
          `,
        }}
      />
      {/* Outer Glow Border layer */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.5),
              transparent 50%
            )
          `,
        }}
      />
      <div className="absolute inset-0 rounded-3xl bg-white/80 dark:bg-neutral-950/80 -z-10" />

      <div className="relative z-10 flex flex-col h-full">
        <div>
          {/* Authentic Stars Widget */}
          {renderStars(t.rating)}

          {/* Testimonial Text */}
          <p className="text-slate-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed mb-10 italic">
            "{t.text}"
          </p>
        </div>

        {/* Profiling Section */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white tracking-wide transition-colors">{t.name}</div>
            <div className="text-slate-500 dark:text-neutral-500 text-sm font-medium transition-colors">
              {t.role}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}