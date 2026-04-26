"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings,
  Menu, X, Bell, ChevronDown, User, LogOut, CalendarDays, MessageSquare
} from "lucide-react";

export default function DashboardLayout({ children, role }: { children: ReactNode, role: "recruiter" | "candidate" | "admin" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState("Initializing...");
  const [userLogo, setUserLogo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem("userName");
    const logo = localStorage.getItem("userLogo");
    if (name) setUserName(name);
    if (logo) setUserLogo(logo);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userLogo");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const recruiterLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/recruiter/dashboard" },
    { icon: <Users size={20} />, label: "Candidates", path: "/recruiter/candidates" },
    { icon: <Briefcase size={20} />, label: "Jobs", path: "/recruiter/post-job" },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/recruiter/analytics" },
    { icon: <CalendarDays size={20} />, label: "Schedule", path: "/recruiter/schedule" },
    { icon: <MessageSquare size={20} />, label: "Messages", path: "/recruiter/messages" },
  ];

  const candidateLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/candidate/dashboard" },
    { icon: <Briefcase size={20} />, label: "Shortlisted Roles", path: "/candidate/jobs" },
    { icon: <CalendarDays size={20} />, label: "Interviews", path: "/candidate/interviews" },
    { icon: <BarChart3 size={20} />, label: "Talent Profile", path: "/candidate/profile" },
    { icon: <MessageSquare size={20} />, label: "Messages", path: "/candidate/messages" },
  ];

  const adminLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Platform Overview", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "User Control", path: "/admin/dashboard?tab=users" },
    { icon: <Briefcase size={20} />, label: "Job Operations", path: "/admin/dashboard?tab=jobs" },
    { icon: <BarChart3 size={20} />, label: "Resume Vault", path: "/admin/dashboard?tab=resumes" },
  ];

  const links = role === "admin" ? adminLinks : (role === "recruiter" ? recruiterLinks : candidateLinks);
  const settingsPath = role === "admin" ? "/admin/settings" : (role === "recruiter" ? "/recruiter/settings" : "/candidate/settings");
  const portalName = role === "admin" ? "Platform Control" : (role === "recruiter" ? "Recruiter Hub" : "Candidate Hub");
  const accentColor = role === "recruiter" ? "indigo" : role === "candidate" ? "violet" : "cyan";

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0F] text-slate-900 dark:text-white flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30 font-sans transition-colors duration-300">
      
      {/* Ambient orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[120%] pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-indigo-500/[0.04] blur-[120px] rounded-full animate-orb-drift" />
        <div className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] bg-violet-500/[0.03] blur-[100px] rounded-full animate-orb-drift-reverse" />
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`absolute md:relative w-72 h-full bg-white/95 dark:bg-[#0A0A0F]/95 backdrop-blur-2xl border-r border-slate-200 dark:border-white/[0.04] p-6 flex flex-col z-[100] md:z-10 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-glow-indigo" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-primary">Mr. Hyre</h1>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${accentColor === 'indigo' ? 'text-indigo-500' : accentColor === 'violet' ? 'text-violet-500' : 'text-cyan-500'}`}>{portalName}</p>
            </div>
          </div>
          <button className="md:hidden text-slate-500" onClick={() => setIsMobileMenuOpen(false)}>
             <X size={24} />
          </button>
        </div>

        <div className="space-y-1.5 text-slate-600 dark:text-slate-400 flex-1">
          {links.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <motion.div
                key={i}
                onClick={() => handleNavigation(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-semibold group relative ${isActive 
                  ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400 border border-${accentColor}-500/20` 
                  : 'hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-${accentColor}-500`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </motion.div>
            );
          })}

          <div className="mt-8 mb-2 px-4 text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-600 uppercase">Configuration</div>
          <motion.div 
            whileHover={{ x: 4 }}
            onClick={() => handleNavigation(settingsPath)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium relative ${pathname === settingsPath ? `bg-${accentColor}-500/10 text-${accentColor}-600 dark:text-${accentColor}-400 border border-${accentColor}-500/20` : 'hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen w-full relative z-30">
        
        {/* Topbar */}
        <div className="h-20 border-b border-slate-200 dark:border-white/[0.04] bg-white/50 dark:bg-[#0A0A0F]/50 backdrop-blur-xl px-6 sm:px-10 flex justify-between items-center shrink-0 relative z-50">
          <div className="flex items-center gap-4">
             <button className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={22} />
             </button>
             <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-medium">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               System Online
             </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="relative text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              >
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 border-2 border-white dark:border-[#0A0A0F] rounded-full animate-pulse" />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#111118] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl shadow-premium dark:shadow-premium-dark z-[110] overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-white/[0.04]">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-30" />
                      You&apos;re fully caught up!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-white/[0.06]" />

            {/* Profile */}
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg uppercase overflow-hidden border border-slate-200 dark:border-white/[0.06] ${!userLogo ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-white dark:bg-[#111118]'}`}>
                  {userLogo ? (
                    <img src={userLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    userName.slice(0,2)
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{userName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium tracking-tight capitalize">{role}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 mt-4 w-56 bg-white dark:bg-[#111118] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl shadow-premium dark:shadow-premium-dark z-[110] overflow-hidden flex flex-col py-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.04] mb-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                    </div>
                    
                    <button onClick={() => { setShowProfileMenu(false); router.push(`/${role}/profile`); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 flex items-center gap-3 transition-colors">
                      <User size={16} /> My Profile
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); router.push(settingsPath); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 flex items-center gap-3 transition-colors">
                      <Settings size={16} /> Settings
                    </button>
                    
                    <div className="h-px bg-slate-100 dark:bg-white/[0.04] my-2" />
                    
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/5 flex items-center gap-3 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Children Pane */}
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 relative z-10 custom-scrollbar">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
             <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/50 dark:border-white/[0.06] rounded-2xl shadow-premium dark:shadow-premium-dark flex justify-between items-center px-2 py-2">
                {links.slice(0, 4).map((item, i) => {
                  const isActive = pathname === item.path;
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleNavigation(item.path)}
                      className="flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer group"
                    >
                      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? `bg-${accentColor}-500 text-white shadow-glow-${accentColor} scale-110` : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                        {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                      </div>
                      <span className={`text-[10px] font-bold tracking-tight transition-colors ${isActive ? `text-${accentColor}-500` : 'text-slate-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
