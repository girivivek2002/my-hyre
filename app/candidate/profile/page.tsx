"use client";

import React, { ReactNode, MouseEvent, useState, useEffect, ReactElement } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User, Mail, Phone, Link as LinkIcon, Globe,
  Briefcase, Sparkles, Upload, Plus,
  X, ChevronRight, CheckCircle2, CloudUpload, Clock
} from "lucide-react";
import Link from "next/link";

// Brand Icons (Custom SVGs since lucide-react version is ancient)
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// Premium Interactive Glass Card
function GlassCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-slate-200 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(59,130,246,0.15)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.2), transparent 80%)`,
        }}
      />
      <div className="absolute inset-0 bg-slate-50/40 dark:bg-neutral-950/40 -z-10" />
      <div className="relative z-10 w-full h-full p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

// Reusable Input Component for premium feel
interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  label: string;
}

function PremiumInput({ icon, label, ...props }: PremiumInputProps) {
  return (
    <div className="group space-y-2">
      <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-neutral-500 uppercase ml-1 group-focus-within:text-blue-500 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input
          {...props}
          className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white/50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}

export default function CandidateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    desiredRole: "",
    experience: "",
    workType: "",
    salary: "",
    location: "",
    noticePeriod: ""
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResume, setExistingResume] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [userRes, profileRes] = await Promise.all([
          fetch("/api/user/me", { headers }),
          fetch("/api/candidate/profile", { headers })
        ]);

        if (userRes.ok) {
          const uData = await userRes.json();
          setFormData(prev => ({ ...prev, name: uData.user.name, email: uData.user.email }));
          if (uData.user.resumes?.length > 0) {
            setExistingResume(uData.user.resumes[0].name);
          }
        } else if (userRes.status === 401) {
          // If middleware somehow let it through but API rejected, go to login
          router.push("/login");
          return;
        }

        if (profileRes.ok) {
          const pData = await profileRes.json();
          if (pData.profile) {
            setFormData(p => ({
              ...p,
              phone: pData.profile.phone || "",
              linkedin: pData.profile.linkedin || "",
              github: pData.profile.github || "",
              website: pData.profile.website || "",
              desiredRole: pData.profile.role || "",
              experience: pData.profile.experience || "",
              salary: pData.profile.salaryExpectation || "",
              location: pData.profile.location || "",
              workType: pData.profile.workPreference || "Full-Time",
              noticePeriod: pData.profile.noticePeriod || "",
            }));
            if (pData.profile.skills) {
              setSkills(pData.profile.skills);
            }
          }
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() !== "" && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          skills: skills.join(", "),
        })
      });

      if (res.ok) {
        // If there's a resume file, upload it separately
        if (resumeFile) {
          const resumeFormData = new FormData();
          resumeFormData.append("file", resumeFile);
          await fetch("/api/candidate/resume", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: resumeFormData
          });
        }

        // Redirect to candidate dashboard on success
        router.push("/candidate/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to save profile: ${errorData.error || 'Please try again.'}`);
      }
    } catch (err) {
      console.error("Profile Save Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 } }
  };

  if (!mounted) return null;

  return (
    <main className="flex-1 overflow-y-auto max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16 pb-32 custom-scrollbar">



      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-inner">
          <Sparkles size={14} /> Profile Architecture
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          Create your <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-400">AI-Powered</span> profile.
        </h1>
        <p className="text-slate-500 dark:text-neutral-400 text-lg max-w-2xl font-medium">
          Let our proprietary matching engine analyze your skills and curate your path to companies that elite-match your profile.
        </p>
      </motion.div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Section 1: Identity */}
        <SectionWrapper
          title="Personal Identity"
          description="The foundation of your professional presence."
          icon={<User className="text-blue-500" size={24} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput icon={<User size={18} />} label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Sterling Archer" />
            <PremiumInput icon={<Mail size={18} />} label="Email Address" name="email" value={formData.email} onChange={handleInputChange} placeholder="archer@agency.com" disabled />
            <PremiumInput icon={<Phone size={18} />} label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" />
            <PremiumInput icon={<LinkedinIcon />} label="LinkedIn Profile" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/username" />
            <PremiumInput icon={<GithubIcon />} label="GitHub Profile" name="github" value={formData.github} onChange={handleInputChange} placeholder="github.com/username" />
            <PremiumInput icon={<Globe size={18} />} label="Portfolio Website" name="website" value={formData.website} onChange={handleInputChange} placeholder="sterling-archer.com" />
          </div>
        </SectionWrapper>

        {/* Section 2: Role & Experience */}
        <SectionWrapper
          title="Role & Mastery"
          description="Defining your targeting and seniority."
          icon={<Briefcase className="text-indigo-500" size={24} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput icon={<Briefcase size={18} />} label="Desired Role" name="desiredRole" value={formData.desiredRole} onChange={handleInputChange} placeholder="Ex: Lead Software Engineer" />
            <PremiumInput icon={<Clock size={18} />} label="Years of Experience" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Ex: 8+" />
          </div>
        </SectionWrapper>

        {/* Section 3: Resume Architecture */}
        <SectionWrapper
          title="Experience Architecture"
          description="Upload your high-fidelity resume for AI parsing."
          icon={<Upload className="text-emerald-500" size={24} />}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx"
          />
          <motion.div
            whileHover={{ scale: 1.005 }}
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[28px] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative aspect-[3/1] rounded-[24px] border-2 border-dashed border-slate-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 flex flex-col items-center justify-center transition-all group-hover:border-blue-500/50 group-hover:bg-blue-500/5 shadow-inner p-8 text-center">
              {resumeFile || existingResume ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 size={40} className="text-emerald-500 mb-2" />
                  <p className="text-slate-900 dark:text-white font-bold text-lg truncate max-w-full">
                    {resumeFile ? resumeFile.name : existingResume}
                  </p>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                    {resumeFile ? 'Ready for Intelligence Injection' : 'Active Intelligence Node Linked'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-md">
                    <CloudUpload size={28} />
                  </div>
                  <p className="text-slate-600 dark:text-neutral-300 font-bold text-lg mb-1">Drag and drop your resume</p>
                  <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium">PDF, DOCX (Max 10MB)</p>
                </>
              )}

              <div className="mt-6">
                <span className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-lg group-hover:shadow-blue-500/20 transition-all">
                  {resumeFile || existingResume ? 'Change File' : 'Select File'}
                </span>
              </div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Section 4: Skills Matrix */}
        <SectionWrapper
          title="Skills Matrix"
          description="AI uses these tags to map you to top-floor vacancies."
          icon={<Sparkles className="text-amber-500" size={24} />}
        >
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2.5">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -2 }}
                    className="group flex items-center gap-2 bg-blue-500 text-white dark:bg-blue-500/10 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-bold border border-blue-500/20 shadow-md dark:shadow-inner transition-all hover:bg-blue-600 dark:hover:bg-blue-500/20"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Plus size={18} />
                </div>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-white/50 dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                  placeholder="E.g. PyTorch, Figma, AWS"
                />
              </div>
              <button
                onClick={addSkill}
                className="bg-slate-900 dark:bg-neutral-800 hover:bg-slate-800 dark:hover:bg-neutral-700 text-white px-8 rounded-2xl font-bold border border-slate-800 dark:border-neutral-700 transition-all flex items-center gap-2 group"
              >
                Add
              </button>
            </div>
          </div>
        </SectionWrapper>

        {/* Section 5: Preferences */}
        <SectionWrapper
          title="Career Trajectory"
          description="Work environment and compensation targets."
          icon={<Globe className="text-purple-500" size={24} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-neutral-500 uppercase ml-1">Work Type</label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleInputChange}
                className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-inner"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract (Long term)">Contract (Long term)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <PremiumInput icon={<Sparkles size={18} />} label="Expected Salary ($)" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="Ex: 150k - 180k" />
            <PremiumInput icon={<Globe size={18} />} label="Preferred Location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Ex: New York, NY / Remote" />
            <PremiumInput icon={<Clock size={18} />} label="Notice Period" name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} placeholder="Ex: 2 weeks" />
          </div>
        </SectionWrapper>

        {/* Extraordinary CTA */}
        <motion.div
          variants={itemVars}
          className="pt-12 flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleApply}
            disabled={isSubmitting}
            className="group relative px-12 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-lg shadow-[0_20px_40px_rgba(30,41,59,0.3)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_60px_rgba(30,41,59,0.4)] dark:hover:shadow-[0_30px_60px_rgba(255,255,255,0.25)] transition-all flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-100 dark:from-blue-500 dark:to-indigo-400 transition-opacity duration-500"></div>
            {isSubmitting ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles size={22} />
                </motion.div>
                Processing Engine...
              </>
            ) : (
              <>
                Submit Profile Intelligence
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
          <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500" /> AI Review Time: 45 Seconds
          </p>
        </motion.div>

      </motion.div>
    </main>
  );
}

// Extraordinary Section Wrapper
function SectionWrapper({ title, description, icon, children }: { title: string, description: string, icon: ReactElement, children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      <div className="lg:col-span-4 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-slate-500 dark:text-neutral-500 font-medium text-sm leading-relaxed">{description}</p>
      </div>

      <div className="lg:col-span-8">
        <GlassCard>
          {children}
        </GlassCard>
      </div>
    </motion.div>
  );
}
