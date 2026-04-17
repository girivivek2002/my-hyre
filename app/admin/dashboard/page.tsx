"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Users, Briefcase, FileText, MessageSquare, 
  Trash2, Search, ArrowUpRight, BarChart3, 
  Shield, Settings, LogOut, ChevronRight,
  UserCheck, Timer, Zap, Sparkles, Filter, 
  MoreHorizontal, Loader2, RefreshCw, Activity,
  Database, Globe, Server
} from "lucide-react";

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <GlassCard className="relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon size={80} className={`text-${color}-500`} />
    </div>
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
      <Icon size={24} className={`text-${color}-500`} />
    </div>
    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <span className="text-[10px] text-green-500 font-bold">{trend}</span>
    </div>
  </GlassCard>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, usersRes, jobsRes, resumesRes] = await Promise.all([
        fetch("/api/admin/stats", { headers }),
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/jobs", { headers }),
        fetch("/api/admin/resumes", { headers })
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (jobsRes.ok) {
        const jData = await jobsRes.json();
        setJobs(jData.jobs || []);
      }
      if (resumesRes.ok) {
        const rData = await resumesRes.json();
        setResumes(rData.resumes || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntity = async (id: string, type: "users" | "jobs" | "resumes") => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0,-1)}?`)) return;
    
    setIsDeleting(id);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`/api/admin/${type}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        if (type === "users") setUsers(users.filter(u => u.id !== id));
        if (type === "jobs") setJobs(jobs.filter(j => j.id !== id));
        if (type === "resumes") setResumes(resumes.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    router.push("/admin/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Control", icon: Users },
    { id: "jobs", label: "Job Operations", icon: Briefcase },
    { id: "resumes", label: "Resume Vault", icon: FileText },
    { id: "platform", label: "Platform Metrics", icon: Zap },
    { id: "settings", label: "Core Settings", icon: Settings },
  ];

  if (isLoading && !stats) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <RefreshCw size={40} className="text-blue-500" />
      </motion.div>
    </div>
  );

  return (
    return (
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-10">


        <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Citizens" value={stats?.totalUsers || 0} icon={Users} trend="+12% this month" color="blue" />
              <StatCard title="Active Jobs" value={stats?.totalJobs || 0} icon={Briefcase} trend="+8.4% growth" color="purple" />
              <StatCard title="Resume Nodes" value={stats?.totalResumes || 0} icon={FileText} trend="+24% uploaded" color="emerald" />
              <StatCard title="Waitlist Count" value={stats?.totalWaitlist || 0} icon={Timer} trend="Stable ingress" color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity Section */}
              <GlassCard className="lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Zap size={20} className="text-blue-400" /> Recent Ingress
                  </h3>
                  <button className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">View All Stream →</button>
                </div>
                <div className="space-y-4">
                  {(users || []).slice(0, 6).map((user, i) => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-[10px] font-bold group-hover:from-blue-600 group-hover:to-indigo-600 transition-all uppercase">
                          {user.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-[10px] text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {user.role}
                        </span>
                        <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-blue-400 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <div className="space-y-6">
                <GlassCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <Sparkles size={120} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={20} /> System AI
                  </h3>
                  <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
                    Our semantic analysis engine is currently processing <span className="font-bold text-white">428 profiles</span> per hour. No anomalies detected.
                  </p>
                  <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all">
                    Generate Analysis
                  </button>
                </GlassCard>

                <GlassCard>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Filter size={18} className="text-zinc-500" /> Control Links
                  </h3>
                  <div className="space-y-3">
                    {['Database Manager', 'Mail Server', 'AI Tuning', 'Log Explorer'].map((link) => (
                      <button key={link} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-sm text-zinc-400 hover:text-white transition-all">
                        {link}
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div 
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  placeholder="Search user profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">User Node</th>
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Created</th>
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02]">
                      <td className="p-6">
                         <p className="font-bold">{user.name}</p>
                         <p className="text-xs text-zinc-500">{user.email}</p>
                      </td>
                      <td className="p-6">
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${user.role === 'recruiter' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>{user.role}</span>
                      </td>
                      <td className="p-6 text-zinc-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-6">
                         <button onClick={() => handleDeleteEntity(user.id, "users")} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "jobs" && (
           <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="text-2xl font-bold">Job Operations Matrix</h3>
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                 <table className="w-full text-left">
                    <tbody className="divide-y divide-white/5">
                       {jobs.map(job => (
                          <tr key={job.id} className="hover:bg-white/[0.02]">
                             <td className="p-6">
                                <p className="font-bold">{job.title}</p>
                                <p className="text-xs text-zinc-500">{job.recruiter?.companyName || "System"}</p>
                             </td>
                             <td className="p-6 text-sm text-zinc-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                             <td className="p-6">
                                <button onClick={() => handleDeleteEntity(job.id, "jobs")} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                   <Trash2 size={16} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </motion.div>
        )}

        {activeTab === "resumes" && (
           <motion.div key="resumes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map(resume => (
                 <GlassCard key={resume.id}>
                    <div className="flex justify-between items-start mb-4">
                       <FileText size={32} className="text-blue-500" />
                       <button onClick={() => handleDeleteEntity(resume.id, "resumes")} className="text-zinc-700 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <p className="font-bold truncate">{resume.fileName}</p>
                    <p className="text-xs text-zinc-500">Linked: {resume.user?.name}</p>
                 </GlassCard>
              ))}
           </motion.div>
        )}

        {activeTab === "platform" && (
           <motion.div key="platform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <h3 className="text-2xl font-bold">Real-time Operational Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <GlassCard className="text-center">
                    <Database size={40} className="mx-auto mb-4 text-emerald-500" />
                    <h4 className="text-3xl font-bold mb-1">99.98%</h4>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Database Health</p>
                 </GlassCard>
                 <GlassCard className="text-center">
                    <Globe size={40} className="mx-auto mb-4 text-blue-500" />
                    <h4 className="text-3xl font-bold mb-1">24ms</h4>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Avg Intelligence Latency</p>
                 </GlassCard>
                 <GlassCard className="text-center">
                    <Server size={40} className="mx-auto mb-4 text-purple-500" />
                    <h4 className="text-3xl font-bold mb-1">12</h4>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Compute Nodes</p>
                 </GlassCard>
              </div>
              <GlassCard className="h-64 flex items-center justify-center border-dashed border-white/10">
                 <div className="text-center">
                    <Activity size={48} className="mx-auto mb-4 text-blue-500 animate-pulse" />
                    <p className="text-zinc-500 font-semibold tracking-wide uppercase text-xs">Waiting for high-resolution traffic data...</p>
                 </div>
              </GlassCard>
           </motion.div>
        )}
        </AnimatePresence>

      </main>
      </main>
    );
}
  );
}
