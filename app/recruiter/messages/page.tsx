"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Send, ShieldCheck, User, 
    MoreHorizontal, Phone, Video, Info,
    CheckCheck, ChevronLeft, Loader2, Sparkles, MessageSquare
} from "lucide-react";
import Link from "next/link";

interface Conversation {
    id: string;
    candidate: {
        id: string;
        name: string;
        role: string;
    };
    content: string;
    createdAt: string;
}

interface Message {
    id: string;
    content: string;
    senderType: "RECRUITER" | "CANDIDATE";
    createdAt: string;
}

function MessagesContent() {
    const searchParams = useSearchParams();
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(searchParams.get("candidateId"));
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedCandidateId) {
            fetchMessages(selectedCandidateId);
        }
    }, [selectedCandidateId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/messages", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
            }
        } catch (err) {
            console.error("Fetch Conversations Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (candidateId: string) => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`/api/messages?targetId=${candidateId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (err) {
            console.error("Fetch Messages Error:", err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedCandidateId) return;

        setIsSending(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: newMessage,
                    targetId: selectedCandidateId
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.message]);
                setNewMessage("");
                // Refresh conversations to update the last message
                fetchConversations();
            }
        } catch (err) {
            console.error("Send Message Error:", err);
        } finally {
            setIsSending(false);
        }
    };

    const selectedConversation = conversations.find(c => c.candidate.id === selectedCandidateId);
    const filteredConversations = conversations.filter(c => 
        c.candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-1 h-full md:h-[calc(100vh-100px)] bg-[#FAFBFD] md:rounded-[40px] overflow-hidden border-b md:border border-slate-200/60 shadow-xl md:m-4">

            {/* Sidebar */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200/60 flex flex-col bg-white/50 backdrop-blur-md ${selectedCandidateId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Intelligence Chat</h1>
                        <div className="bg-blue-500/10 text-blue-600 p-2 rounded-xl">
                            <Sparkles size={18} />
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 space-y-4">
                            <Loader2 className="animate-spin text-blue-500" size={24} />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Nodes...</p>
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        <div className="space-y-1">
                            {filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedCandidateId(conv.candidate.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all duration-300 ${selectedCandidateId === conv.candidate.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1' : 'hover:bg-slate-100 text-slate-600'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${selectedCandidateId === conv.candidate.id ? 'bg-white/20' : 'bg-blue-500/10 text-blue-600'}`}>
                                        {conv.candidate.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className="font-bold truncate text-sm">{conv.candidate.name}</p>
                                            <p className={`text-[10px] ${selectedCandidateId === conv.candidate.id ? 'text-white/60' : 'text-slate-400'}`}>
                                                {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <p className={`text-xs truncate ${selectedCandidateId === conv.candidate.id ? 'text-white/80' : 'text-slate-500'}`}>
                                            {conv.content}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-60 text-center px-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-slate-900 font-bold mb-1">No active streams</p>
                            <p className="text-slate-500 text-xs leading-relaxed">Select a candidate from your pipeline to initialize communication.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedCandidateId ? 'hidden md:flex' : 'flex'}`}>
                {selectedCandidateId ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-slate-200/60 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSelectedCandidateId(null)}
                                    className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {selectedConversation?.candidate.name.charAt(0) || "C"}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">{selectedConversation?.candidate.name || "Candidate"}</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Intelligence</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                    <ShieldCheck size={12} />
                                    End-to-End Encrypted
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <Phone size={20} />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <Video size={20} />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                                    <Info size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFBFD]/50 custom-scrollbar">
                            <div className="flex justify-center mb-8">
                                <div className="bg-slate-100 text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-200/60">
                                    Today
                                </div>
                            </div>

                            {messages.map((msg, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg.id}
                                    className={`flex ${msg.senderType === "RECRUITER" ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] space-y-1`}>
                                        <div className={`p-4 rounded-[24px] text-sm shadow-sm transition-all hover:shadow-md ${msg.senderType === "RECRUITER" ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200/60 text-slate-700 rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-1 ${msg.senderType === "RECRUITER" ? 'justify-end' : 'justify-start'}`}>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {msg.senderType === "RECRUITER" && <CheckCheck size={12} className="text-blue-500" />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-200/60">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-100/50 p-2 rounded-[28px] border border-transparent transition-all duration-300">
                                <button type="button" className="p-3 text-slate-400 hover:text-blue-500 transition-colors">
                                    <Plus size={24} />
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="Type your intelligence sync..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-400 text-sm"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || isSending}
                                    className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-2">
                                <ShieldCheck size={10} className="text-emerald-500" /> Secure Protocol v4.2 Active
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#FAFBFD]/50">
                        <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-blue-500 mb-8 border border-slate-200/60">
                            <MessageSquare size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Intelligence Messaging</h2>
                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                            Initialize end-to-end encrypted communication with your candidate pool. Select a conversation to start the sync.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Plus({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}

export default function RecruiterMessages() {
    return (
        <Suspense fallback={
            <div className="flex h-[calc(100vh-100px)] bg-[#FAFBFD] rounded-[40px] items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        }>
            <MessagesContent />
        </Suspense>
    );
}
