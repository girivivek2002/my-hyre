"use client";
import React, { ReactNode, MouseEvent, useState, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Briefcase, BarChart3, Settings,
  Zap, Bell, ChevronDown, Sparkles, Search, 
  Send, Paperclip, MoreVertical, Phone, Video,
  SearchIcon, User, Archive, MessageSquare, Info, 
  ArrowLeft, CheckCheck, Smile
} from "lucide-react";

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div onMouseMove={handleMouseMove} className={`group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-slate-200 dark:border-neutral-800/60 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${className}`}>
      <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-[-1]" style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)` }} />
      <div className="absolute inset-0 bg-slate-50/80 dark:bg-neutral-950/80 -z-10" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

export default function MessagingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: any = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Get User Info
      const userRes = await fetch("/api/user/me", { headers });
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // 2. Get Conversations
      const chatsRes = await fetch("/api/messages", { headers });
      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        const formattedChats = chatsData.conversations.map((c: any) => ({
          id: userData.user.role === "recruiter" ? c.candidate.id : c.recruiter.id,
          name: userData.user.role === "recruiter" ? c.candidate.name : c.recruiter.name,
          company: userData.user.role === "recruiter" ? "Candidate" : (c.recruiter.companyName || "Recruiter"),
          lastMsg: c.content,
          time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: (userData.user.role === "recruiter" ? c.candidate.name : (c.recruiter.name || "R")).substring(0, 2).toUpperCase(),
          match: 95,
          online: true,
          profile: userData.user.role === "recruiter" ? c.candidate : c.recruiter
        }));
        setChats(formattedChats);
        if (formattedChats.length > 0) setActiveChat(formattedChats[0]);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Messaging Init Error:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      const interval = setInterval(() => fetchMessages(activeChat.id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  const fetchMessages = async (targetId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/messages?targetId=${targetId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }
    } catch (err) {
      console.error("Fetch Messages Error:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!msgInput.trim() || !activeChat) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: msgInput,
          targetId: activeChat.id
        })
      });

      if (res.ok) {
        setMsgInput("");
        fetchMessages(activeChat.id);
      }
    } catch (err) {
      console.error("Send Message Error:", err);
    }
  };

  if (!mounted || isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">
      
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent dark:to-transparent pointer-events-none -z-10 blur-[120px]" />

      {/* Sidebar */}
      <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-20 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-2xl border-r border-slate-200 dark:border-neutral-800/60 flex flex-col items-center py-8 z-20 shrink-0 shadow-2xl">
        <Image src="/logo.png" alt="Logo" width={32} height={32} className="mb-10 cursor-pointer" onClick={() => router.push(`/${user?.role}/dashboard`)} />
        <div className="space-y-4">
          {[
            { icon: <LayoutDashboard size={22} />, path: `/${user?.role}/dashboard` },
            { icon: <MessageSquare size={22} />, active: true },
            { icon: <Briefcase size={22} />, path: `/${user?.role === 'candidate' ? 'candidate/jobs' : 'recruiter/candidates'}` },
            { icon: <Settings size={22} />, path: `/${user?.role}/profile` },
          ].map((item, i) => (
            <div key={i} onClick={() => item.path && router.push(item.path)} className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${item.active ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-blue-500'}`}>
               {item.icon}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chat List */}
      <div className="w-80 sm:w-96 border-r border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md flex flex-col shrink-0">
         <div className="p-6 border-b border-slate-200 dark:border-neutral-800/60">
            <h1 className="text-xl font-bold mb-4 tracking-tight">Intelligence Inbox</h1>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input placeholder="Search conversations..." className="w-full bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {chats.length > 0 ? chats.map((chat) => (
              <div key={chat.id} onClick={() => setActiveChat(chat)} className={`p-4 rounded-2xl cursor-pointer transition-all flex gap-4 relative group ${activeChat?.id === chat.id ? 'bg-white dark:bg-neutral-900 shadow-xl' : 'hover:bg-slate-100/50 dark:hover:bg-neutral-900/40'}`}>
                 <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner mt-1">
                       {chat.avatar}
                    </div>
                    {chat.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-neutral-950 rounded-full" />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className="text-sm font-bold truncate">{chat.name}</h3>
                       <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 truncate mb-1">{chat.lastMsg}</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded font-bold uppercase tracking-tighter border border-blue-500/10">{chat.company}</span>
                       <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">{chat.match}% Match</span>
                    </div>
                 </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400 text-xs">No active threads. Start matching!</div>
            )}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/20 dark:bg-black/20 backdrop-blur-sm relative">
         {activeChat ? (
           <>
              <div className="h-20 border-b border-slate-200 dark:border-neutral-800/60 px-8 flex justify-between items-center bg-white/40 dark:bg-neutral-950/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                       {activeChat.avatar}
                    </div>
                    <div>
                       <h2 className="text-sm font-bold">{activeChat.name}</h2>
                       <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-blue-500 transition-colors"><Phone size={18} /></button>
                    <button className="hover:text-blue-500 transition-colors"><Video size={18} /></button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-2" />
                    <button className="hover:text-blue-500 transition-colors"><Info size={18} /></button>
                 </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 {messages.map((msg) => {
                   const isMe = (user.role === "recruiter" && msg.senderType === "RECRUITER") || 
                                (user.role === "candidate" && msg.senderType === "CANDIDATE");
                   return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] space-y-2 ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-tl-none'}`}>
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] text-slate-400 font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck size={12} className="text-blue-500" />}
                          </div>
                      </div>
                    </motion.div>
                   )
                 })}
                 
                 <div className="flex justify-center py-4">
                    <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                       <Sparkles size={12} fill="currentColor" /> Intelligence Insight: Match verified at 95% Parity
                    </div>
                 </div>
              </div>

              <div className="p-6 shrink-0">
                 <GlassCard className="!rounded-[32px] overflow-visible">
                    <div className="p-2 flex items-end gap-2">
                       <button className="p-3 text-slate-400 hover:text-blue-500 transition-colors"><Smile size={20} /></button>
                       <button className="p-3 text-slate-400 hover:text-blue-500 transition-colors"><Paperclip size={20} /></button>
                       <textarea 
                        value={msgInput} 
                        onChange={(e) => setMsgInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        placeholder="Craft your message..." 
                        rows={1} 
                        className="flex-1 bg-transparent py-3 px-2 text-sm focus:outline-none resize-none no-scrollbar font-medium" 
                       />
                       <button onClick={handleSendMessage} className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                          <Send size={20} />
                       </button>
                    </div>
                 </GlassCard>
                 <p className="text-[9px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">Encrypted via Intelligence Grade Security Architecture</p>
              </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">Select a thread to begin sync</p>
           </div>
         )}
      </div>

      {/* Right Intelligence Pane */}
      <div className="hidden xl:flex w-80 border-l border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md flex-col p-8 space-y-8 shrink-0 overflow-y-auto no-scrollbar">
         {activeChat && (
           <>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Context Hub</h2>
              <div className="space-y-6">
                <div className="text-center">
                   <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-2xl mx-auto mb-4 relative">
                      {activeChat.avatar}
                   </div>
                   <h3 className="text-lg font-bold">{activeChat.name}</h3>
                   <p className="text-xs font-semibold text-slate-500 dark:text-neutral-500">{activeChat.company}</p>
                </div>

                <div className="flex justify-center gap-3">
                   <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-bold text-blue-500">95% FIT</div>
                   <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[10px] font-bold text-purple-500">VERIFIED</div>
                </div>

                <GlassCard className="!p-5">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Proposed Fit</h4>
                   <p className="text-xs font-bold mb-1">{user?.role === 'recruiter' ? (activeChat.profile?.role || "Talent") : "Partner Strategy"}</p>
                   <p className="text-[10px] text-slate-500 dark:text-neutral-500 mb-4 ">{activeChat.profile?.location || "Remote"}</p>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                         <span>PARITY MATCH</span>
                         <span className="text-blue-500">95%</span>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[95%]" />
                      </div>
                   </div>
                </GlassCard>

                <div className="space-y-4 pt-4">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                   <div className="flex gap-3">
                      <div className="w-1 bg-blue-500/30 rounded-full" />
                      <div>
                         <p className="text-[11px] font-bold">Profile Viewed</p>
                         <p className="text-[9px] text-slate-400 mt-0.5">2 hours ago</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="mt-auto">
                <button className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-extrabold text-red-500 uppercase tracking-widest transition-all">
                   Archive Intelligence Thread
                </button>
              </div>
           </>
         )}
      </div>
    </div>
  );
}
