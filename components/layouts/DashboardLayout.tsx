"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings,
  Menu, X, Bell, ChevronDown, User, LogOut, CalendarDays
} from "lucide-react";

export default function DashboardLayout({ children, role }: { children: ReactNode, role: "recruiter" | "candidate" }) {
  // Mobile responsive sidebar state
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
    router.push("/login");
  };

  const recruiterLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/recruiter/dashboard" },
    { icon: <Users size={20} />, label: "Candidates", path: "/recruiter/candidates" },
    { icon: <Briefcase size={20} />, label: "Jobs", path: "/recruiter/post-job" },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/recruiter/analytics" },
    { icon: <CalendarDays size={20} />, label: "Schedule", path: "/recruiter/schedule" },
  ];

  const candidateLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/candidate/dashboard" },
    { icon: <Briefcase size={20} />, label: "Shortlisted Roles", path: "/candidate/jobs" },
    { icon: <CalendarDays size={20} />, label: "Interviews", path: "/candidate/interviews" },
    { icon: <BarChart3 size={20} />, label: "Talent Profile", path: "/candidate/profile" },
  ];

  const links = role === "recruiter" ? recruiterLinks : candidateLinks;
  const settingsPath = role === "recruiter" ? "/recruiter/settings" : "/candidate/settings";
  const portalName = role === "recruiter" ? "Intelligence" : "Candidate Hub";

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">
      
      {/* Ambient Background Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-neutral-950 dark:to-[#050505] pointer-events-none -z-10 blur-[100px]"></div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Responsive Sidebar */}
      <div
        className={`absolute md:relative w-72 h-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-3xl border-r border-slate-200 dark:border-neutral-800/60 p-6 flex flex-col z-[100] md:z-10 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Mr. Hyre</h1>
              <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">{portalName}</p>
            </div>
          </div>
          <button className="md:hidden text-slate-500" onClick={() => setIsMobileMenuOpen(false)}>
             <X size={24} />
          </button>
        </div>

        <div className="space-y-2 text-slate-600 dark:text-neutral-400 flex-1">
          {links.map((item, i) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={i}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-bold group ${isActive 
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-[inset_0_2px_10px_rgba(59,130,246,0.1)]' 
                  : 'hover:bg-slate-50 dark:hover:bg-neutral-900/60 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
          })}

          <div className="mt-8 mb-2 px-4 text-xs font-semibold tracking-widest text-slate-400 dark:text-neutral-600 uppercase">Configuration</div>
          <div onClick={() => handleNavigation(settingsPath)} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium ${pathname === settingsPath ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}>
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen w-full relative z-30">
        
        {/* Topbar */}
        <div className="h-20 border-b border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md px-6 sm:px-10 flex justify-between items-center shrink-0 relative z-50">
          <div className="flex items-center gap-4">
             {/* Mobile Hamburger Button */}
             <button className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={22} />
             </button>
             <div className="hidden sm:block text-sm text-slate-400 font-medium">Platform Synchronized.</div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="relative text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors p-2"
              >
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[110] overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-neutral-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">System Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-neutral-400">
                    You're fully caught up!
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800"></div>

            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg uppercase overflow-hidden border border-slate-200 dark:border-neutral-800">
                  {userLogo ? (
                    <img src={userLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    userName.slice(0,2)
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-500 font-medium tracking-tight uppercase">{role === 'recruiter' ? 'Corporate Node' : 'Candidate Profile'}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 dark:text-neutral-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[110] overflow-hidden flex flex-col py-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-neutral-800 mb-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                  </div>
                  
                  <button onClick={() => { setShowProfileMenu(false); router.push(`/${role}/profile`); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors">
                    <User size={16} /> My Profile
                  </button>
                  <button onClick={() => { setShowProfileMenu(false); router.push(settingsPath); }} className="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors">
                    <Settings size={16} /> Settings
                  </button>
                  
                  <div className="h-px bg-slate-100 dark:bg-neutral-800 my-2"></div>
                  
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children Render Pane */}
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 relative z-10">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
             <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-2xl border border-slate-200/50 dark:border-neutral-800/50 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex justify-between items-center px-2 py-2">
                {links.slice(0, 4).map((item, i) => {
                  const isActive = pathname === item.path;
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleNavigation(item.path)}
                      className="flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer group"
                    >
                      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                        {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                      </div>
                      <span className={`text-[10px] font-bold tracking-tight transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
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
