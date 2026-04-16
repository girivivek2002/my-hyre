"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Users, Briefcase, FileText, MessageSquare, 
  Trash2, Search, ArrowUpRight, BarChart3, 
  Shield, Settings, LogOut, ChevronRight,
  UserCheck, Timer, Zap, Sparkles, Filter, 
  MoreHorizontal, Loader2, RefreshCw
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
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (statsRes.ok) setStats(statsData.stats);
      if (usersRes.ok) setUsers(usersData.users);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? All associated data will be removed.")) return;
    
    setIsDeleting(id);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
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
    { id: "platform", label: "Platform Metrics", icon: Zap },
    { id: "settings", label: "Core Settings", icon: Settings },
  ];

  if (isLoading && !stats) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw size={40} className="text-blue-500" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden font-sans">
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col z-20 shrink-0"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Shield size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">System Admin</h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Authority Node</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} className={activeTab === item.id ? "text-blue-400" : "group-hover:text-white"} />
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-semibold text-sm"
          >
            <LogOut size={20} />
            Logout Session
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10 p-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Intelligence</span>
            </h2>
            <p className="text-zinc-500 font-medium">Monitoring platform-wide operational metrics and authority nodes.</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-xs font-bold tracking-widest uppercase">Live Connection</span>
          </motion.div>
        </header>

        {activeTab === "overview" && (
          <motion.div 
            initial="hidden"
            animate="visible"
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
                    <motion.div 
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
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
                    </motion.div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  placeholder="Search user profiles by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10">
                  <Filter size={18} /> Filters
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Identified User</th>
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role Node</th>
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Registration Date</th>
                    <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-xs font-bold uppercase transition-all group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            {user.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${user.role === 'recruiter' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6 text-sm text-zinc-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button 
                            disabled={isDeleting === user.id}
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            {isDeleting === user.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                          <button className="p-2.5 rounded-xl bg-white/10 text-zinc-400 border border-white/10 hover:text-white transition-all">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </main>

      {/* Decorative Sidebar Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-1 h-${i === 0 ? '6' : '1'} rounded-full bg-blue-500/20 transition-all`} />
        ))}
      </div>

    </div>
  );
}
