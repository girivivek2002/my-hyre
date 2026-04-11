"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, Briefcase, BarChart3, Settings,
    Search, Bell, ChevronDown, Sparkles, MapPin, DollarSign,
    Target, Globe, Type, ListChecks, CheckCircle2, Building, Eye,
    CalendarDays, Send, Bot, Plus, X, Edit3, RotateCcw, Loader2,
    MessageSquare, Zap, ChevronRight, Lightbulb, TrendingUp, Check
} from "lucide-react";

interface ParsedJobData {
    job_title: string;
    skills: string[];
    experience: string;
    location: string;
    salary: { min: number; max: number } | null;
    workplace_type: string;
    description: string;
}

interface ChatMessage {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
}

const mockAIParse = async (input: string): Promise<ParsedJobData> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const inputLower = input.toLowerCase();
    
    let jobTitle = "Software Engineer";
    if (inputLower.includes("frontend") || inputLower.includes("front-end")) jobTitle = "Frontend Developer";
    if (inputLower.includes("backend") || inputLower.includes("back-end")) jobTitle = "Backend Developer";
    if (inputLower.includes("fullstack") || inputLower.includes("full stack")) jobTitle = "Full Stack Developer";
    if (inputLower.includes("data")) jobTitle = "Data Scientist";
    if (inputLower.includes("devops")) jobTitle = "DevOps Engineer";
    if (inputLower.includes("product")) jobTitle = "Product Manager";
    
    const skills: string[] = [];
    const techSkills = ["react", "node", "node.js", "python", "java", "javascript", "typescript", "go", "rust", "sql", "mongodb", "postgresql", "aws", "docker", "kubernetes", "graphql", "next.js", "angular", "vue"];
    techSkills.forEach(skill => {
        if (inputLower.includes(skill)) {
            if (skill === "node.js") skills.push("Node.js");
            else if (skill === "next.js") skills.push("Next.js");
            else skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
    });
    if (skills.length === 0) skills.push("JavaScript", "React");
    
    let experience = "2-3 years";
    const expMatch = input.match(/(\d+)\s*(year|yr|years|y)/i);
    if (expMatch) {
        experience = `${expMatch[1]}-${parseInt(expMatch[1]) + 1} years`;
    }
    
    let location = "Bangalore";
    const cities = ["bangalore", "bengaluru", "delhi", "mumbai", "hyderabad", "pune", "chennai", "remote", "work from home"];
    cities.forEach(city => {
        if (inputLower.includes(city)) {
            location = city.charAt(0).toUpperCase() + city.slice(1);
        }
    });
    
    let salary = null;
    const salaryMatch = input.match(/\$?(\d{1,3})(?:k|K)?\s*-\s*\$?(\d{1,3})(?:k|K)?/i);
    if (salaryMatch) {
        salary = {
            min: parseInt(salaryMatch[1]) * 1000,
            max: parseInt(salaryMatch[2]) * 1000
        };
    }
    
    let workplaceType = "hybrid";
    if (inputLower.includes("remote") || inputLower.includes("work from home")) workplaceType = "remote";
    if (inputLower.includes("onsite") || inputLower.includes("on-site") || inputLower.includes("office")) workplaceType = "onsite";
    
    return {
        job_title: jobTitle,
        skills,
        experience,
        location,
        salary,
        workplace_type: workplaceType,
        description: ""
    };
};

const generateFollowUpQuestions = (data: Partial<ParsedJobData>): string[] => {
    const questions: string[] = [];
    if (!data.salary) questions.push("What's the salary range you'd like to offer?");
    if (data.workplace_type === "hybrid") questions.push("How many days per week would you prefer in office?");
    if (!data.description) questions.push("Would you like to add a job description or key responsibilities?");
    if (data.experience) questions.push("What's the minimum experience level you're looking for?");
    return questions;
};

const suggestedPrompts = [
    "I need a frontend developer with React, 3 years experience, remote",
    "Looking for a backend engineer Node.js Python, Bangalore hybrid",
    "Hiring a full stack developer with AWS and Docker, salary 80k-120k",
    "Need a product manager with 5 years exp, remote first company"
];

export default function PostJobPage() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
    const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editableData, setEditableData] = useState<ParsedJobData | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [saveDraftLoading, setSaveDraftLoading] = useState(false);
    const [deployLoading, setDeployLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleSubmit = async () => {
        if (!input.trim()) return;
        
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setShowPreview(true);
        
        try {
            const data = await mockAIParse(userMessage.content);
            setParsedData(data);
            setEditableData(data);
            
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Got it! Here's what I understood from your request:",
                timestamp: new Date()
            };
            
            setIsTyping(true);
            setTimeout(() => {
                setChatHistory(prev => [...prev, aiResponse]);
                setIsTyping(false);
                
                const questions = generateFollowUpQuestions(data);
                setFollowUpQuestions(questions);
            }, 800);
            
        } catch (error) {
            console.error("Error parsing job:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFollowUp = async (question: string, answer: string) => {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: answer,
            timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        
        if (editableData) {
            let updatedData = { ...editableData };
            
            if (question.toLowerCase().includes("salary")) {
                const salaryMatch = answer.match(/\$?(\d{1,3})(?:k|K)?/i);
                if (salaryMatch) {
                    const val = parseInt(salaryMatch[1]) * 1000;
                    updatedData.salary = { min: val * 0.8, max: val };
                }
            }
            
            if (question.toLowerCase().includes("description")) {
                updatedData.description = answer;
            }
            
            if (question.toLowerCase().includes("remote") || question.toLowerCase().includes("onsite") || question.toLowerCase().includes("hybrid")) {
                if (answer.toLowerCase().includes("remote")) updatedData.workplace_type = "remote";
                else if (answer.toLowerCase().includes("onsite") || answer.toLowerCase().includes("office")) updatedData.workplace_type = "onsite";
                else updatedData.workplace_type = "hybrid";
            }
            
            setEditableData(updatedData);
            setParsedData(updatedData);
            
            setFollowUpQuestions(prev => prev.filter(q => q !== question));
            
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Got it! I've updated the job details. Any other questions?",
                timestamp: new Date()
            };
            
            setIsTyping(true);
            setTimeout(() => {
                setChatHistory(prev => [...prev, aiResponse]);
                setIsTyping(false);
            }, 500);
        }
    };

    const handleRegenerate = async () => {
        if (input.trim()) {
            setIsLoading(true);
            try {
                const data = await mockAIParse(input);
                setParsedData(data);
                setEditableData(data);
                setFeedbackMessage(null);
            } catch (error) {
                setFeedbackMessage({ type: 'error', text: 'Failed to regenerate. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setFeedbackMessage({ type: 'error', text: 'Please enter a job description first.' });
        }
    };

    const handleSaveDraft = async () => {
        if (!editableData) return;
        
        setSaveDraftLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const jobData = {
            id: Date.now().toString(),
            title: editableData.job_title,
            location: editableData.location,
            salary: editableData.salary ? `$${editableData.salary.min.toLocaleString()}-$${editableData.salary.max.toLocaleString()}` : 'Not specified',
            type: editableData.workplace_type,
            experience: editableData.experience,
            skills: editableData.skills,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };
        
        const existingDrafts = JSON.parse(localStorage.getItem('jobDrafts') || '[]');
        existingDrafts.push(jobData);
        localStorage.setItem('jobDrafts', JSON.stringify(existingDrafts));
        
        setFeedbackMessage({ type: 'success', text: 'Draft saved successfully!' });
        setSaveDraftLoading(false);
    };

    const handleDeploy = async () => {
        if (!editableData) return;
        
        setDeployLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const jobData = {
            id: Date.now().toString(),
            title: editableData.job_title,
            location: editableData.location,
            salary: editableData.salary ? `$${editableData.salary.min.toLocaleString()}-$${editableData.salary.max.toLocaleString()}` : 'Not specified',
            type: editableData.workplace_type,
            experience: editableData.experience,
            skills: editableData.skills,
            createdAt: new Date().toISOString()
        };
        
        const existingJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        existingJobs.push(jobData);
        localStorage.setItem('postedJobs', JSON.stringify(existingJobs));
        
        setFeedbackMessage({ type: 'success', text: 'Job deployed successfully!' });
        setDeployLoading(false);
        setTimeout(() => {
            router.push("/recruiter/candidates");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden selection:bg-blue-500/30 font-sans transition-colors duration-300">
            <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-neutral-950 dark:to-[#050505] pointer-events-none -z-10 blur-[100px]"></div>

            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-72 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-2xl border-r border-slate-200 dark:border-neutral-800/60 p-6 flex flex-col z-20 shrink-0 shadow-2xl relative"
            >
                <div className="flex items-center gap-3 mb-10 pl-2 cursor-pointer" onClick={() => router.push("/recruiter/dashboard")}>
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Mr. Hyre</h1>
                        <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Intelligence</p>
                    </div>
                </div>

                <div className="space-y-2 text-slate-600 dark:text-neutral-400 flex-1">
                    {[
                        { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/recruiter/dashboard" },
                        { icon: <Briefcase size={20} />, label: "Active Jobs", active: true },
                        { icon: <Users size={20} />, label: "Candidates", path: "/recruiter/candidates" },
                        { icon: <BarChart3 size={20} />, label: "Analytics", path: "/recruiter/analytics" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            onClick={() => item.path && router.push(item.path)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium ${item.active ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-inner' : 'hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}

                    <div className="mt-8 mb-2 px-4 text-xs font-semibold tracking-widest text-slate-400 dark:text-neutral-600 uppercase">Configuration</div>
                    <div onClick={() => router.push("/recruiter/settings")} className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium">
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                </div>
            </motion.div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    className="h-20 border-b border-slate-200 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-950/30 backdrop-blur-md px-10 flex justify-between items-center z-10 shrink-0"
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            placeholder="Search candidates..."
                            className="bg-slate-100/50 dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 px-4 py-2.5 pl-12 rounded-full w-[400px] text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-900 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-neutral-950 rounded-full"></span>
                        </button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-neutral-800"></div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-neutral-700 dark:to-neutral-900 border border-slate-300 dark:border-neutral-700 overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                <Image src="/logo.png" alt="Profile" fill className="object-cover opacity-80" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Sterling & Co.</p>
                                <p className="text-[11px] text-slate-500 dark:text-neutral-500 font-medium">Enterprise Admin</p>
                            </div>
                            <ChevronDown size={16} className="text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-1" />
                        </div>
                    </div>
                </motion.div>

                <div className="flex-1 overflow-hidden flex">
                    <div className="flex-1 flex flex-col p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <h1 className="text-3xl font-bold mb-2">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400">AI Job Creator</span>
                            </h1>
                            <p className="text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                                <Bot size={18} className="text-blue-500 dark:text-blue-400" />
                                Describe your hiring needs naturally. Let AI handle the details.
                            </p>
                        </motion.div>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar pr-2">
                            <AnimatePresence>
                                {chatHistory.length === 0 && !showPreview && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center"
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mb-6">
                                            <Sparkles size={40} className="text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">How can I help you hire?</h2>
                                        <p className="text-slate-500 dark:text-neutral-400 mb-8 max-w-md">Tell me about the role you're looking for in natural language.</p>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                                            {suggestedPrompts.map((prompt, i) => (
                                                <motion.button
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * i }}
                                                    onClick={() => setInput(prompt)}
                                                    className="text-left p-4 rounded-xl bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:border-blue-500/30 transition-all text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 group"
                                                >
                                                    <span className="block text-xs text-slate-400 dark:text-neutral-500 mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400">Suggestion {i + 1}</span>
                                                    {prompt}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {chatHistory.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                                        {msg.role === "ai" && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <Bot size={14} className="text-white" />
                                                </div>
                                                <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">Mr. Hyre AI</span>
                                            </div>
                                        )}
                                        <div className={`px-4 py-3 rounded-2xl ${
                                            msg.role === "user" 
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                                                : "bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-slate-100"
                                        }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Bot size={14} className="text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800 px-4 py-3 rounded-2xl">
                                        <Loader2 size={18} className="text-blue-500 dark:text-blue-400 animate-spin" />
                                        <span className="text-sm text-slate-500 dark:text-neutral-400">Analyzing your requirements...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-lg opacity-50 dark:opacity-50" />
                            <div className="relative bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                    placeholder="Describe the role you're hiring for..."
                                    rows={3}
                                    className="w-full bg-transparent px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none resize-none min-h-[100px]"
                                />
                                <div className="flex items-center justify-between px-4 pb-4">
                                    <span className="text-xs text-slate-400 dark:text-neutral-500">Press Enter to send, Shift+Enter for new line</span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSubmit}
                                        disabled={!input.trim() || isLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                    >
                                        <Send size={16} />
                                        <span>Generate</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {showPreview && editableData && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="w-[400px] border-l border-slate-200 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xl overflow-y-auto p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                        <Sparkles size={18} className="text-blue-500 dark:text-blue-400" />
                                        Job Preview
                                    </h2>
                                    <button 
                                        onClick={() => setEditMode(!editMode)}
                                        className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <Edit3 size={14} />
                                        {editMode ? "Done" : "Edit"}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800">
                                        <label className="text-xs text-slate-500 dark:text-neutral-500 mb-1 block">Job Title</label>
                                        {editMode ? (
                                            <input 
                                                value={editableData.job_title}
                                                onChange={(e) => setEditableData({...editableData, job_title: e.target.value})}
                                                className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-slate-100"
                                            />
                                        ) : (
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{editableData.job_title}</p>
                                        )}
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800">
                                        <label className="text-xs text-slate-500 dark:text-neutral-500 mb-2 block">Skills</label>
                                        <div className="flex flex-wrap gap-2">
                                            {editableData.skills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-sm border border-blue-500/30">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800">
                                        <label className="text-xs text-slate-500 dark:text-neutral-500 mb-1 block">Experience</label>
                                        {editMode ? (
                                            <input 
                                                value={editableData.experience}
                                                onChange={(e) => setEditableData({...editableData, experience: e.target.value})}
                                                className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-slate-100"
                                            />
                                        ) : (
                                            <p className="text-slate-700 dark:text-slate-200">{editableData.experience}</p>
                                        )}
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800">
                                        <label className="text-xs text-slate-500 dark:text-neutral-500 mb-1 block">Location</label>
                                        {editMode ? (
                                            <input 
                                                value={editableData.location}
                                                onChange={(e) => setEditableData({...editableData, location: e.target.value})}
                                                className="w-full bg-white dark:bg-neutral-950/50 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-slate-800 dark:text-slate-100"
                                            />
                                        ) : (
                                            <p className="text-slate-700 dark:text-slate-200">{editableData.location}</p>
                                        )}
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800">
                                        <label className="text-xs text-slate-500 dark:text-neutral-500 mb-2 block">Workplace Type</label>
                                        <div className="flex gap-2">
                                            {["remote", "hybrid", "onsite"].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => editMode && setEditableData({...editableData, workplace_type: type})}
                                                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                                                        editableData.workplace_type === type
                                                            ? "bg-blue-500/30 text-blue-600 dark:text-blue-300 border border-blue-500/50"
                                                            : "bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700"
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800">
                                        <label className="text-xs text-slate-500 dark:text-neutral-500 mb-1 block">Salary Range</label>
                                        {editableData.salary ? (
                                            <p className="text-slate-700 dark:text-slate-200">${editableData.salary.min.toLocaleString()} - ${editableData.salary.max.toLocaleString()}</p>
                                        ) : (
                                            <p className="text-slate-400 dark:text-neutral-500 italic">Not specified</p>
                                        )}
                                    </div>
                                </div>

                                {followUpQuestions.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-neutral-800">
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-800 dark:text-white">
                                            <MessageSquare size={16} className="text-purple-500 dark:text-purple-400" />
                                            Quick Follow-ups
                                        </h3>
                                        <div className="space-y-3">
                                            {followUpQuestions.slice(0, 2).map((q, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 dark:border-purple-500/30">
                                                    <p className="text-xs text-slate-500 dark:text-neutral-400 mb-2">{q}</p>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            placeholder="Type your answer..."
                                                            className="flex-1 bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500/50 text-slate-800 dark:text-slate-100"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    handleFollowUp(q, (e.target as HTMLInputElement).value);
                                                                    (e.target as HTMLInputElement).value = "";
                                                                }
                                                            }}
                                                        />
                                                        <button 
                                                            onClick={(e) => {
                                                                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                                                if (input.value) {
                                                                    handleFollowUp(q, input.value);
                                                                    input.value = "";
                                                                }
                                                            }}
                                                            className="p-1.5 rounded-lg bg-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-500/50 transition-colors"
                                                        >
                                                            <Send size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-neutral-800 space-y-3">
                                    {feedbackMessage && (
                                        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                                            feedbackMessage.type === 'success' 
                                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                                        }`}>
                                            {feedbackMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                            {feedbackMessage.text}
                                        </div>
                                    )}
                                    <button 
                                        onClick={handleRegenerate}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors text-sm text-slate-700 dark:text-slate-200 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                                        Regenerate
                                    </button>
                                    <button 
                                        onClick={handleSaveDraft}
                                        disabled={saveDraftLoading || !editableData}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors text-sm text-slate-700 dark:text-slate-200 disabled:opacity-50"
                                    >
                                        {saveDraftLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                        Save Draft
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: deployLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: deployLoading ? 1 : 0.98 }}
                                        onClick={handleDeploy}
                                        disabled={deployLoading || !editableData}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-semibold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deployLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                        {deployLoading ? 'Deploying...' : 'Deploy Intelligence'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
