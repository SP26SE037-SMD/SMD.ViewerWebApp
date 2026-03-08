"use client";

import React, { useState } from "react";
import { Search, BookOpen, GitMerge, Layers, ChevronRight, Bell, User, LogOut, Menu, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type TabType = "curriculum" | "syllabus" | "prerequisite";

interface SearchResult {
    id: string;
    title: string;
    code: string;
    description: string;
    credits?: number;
    semester?: string;
    department?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DATA: Record<TabType, SearchResult[]> = {
    curriculum: [
        { id: "1", title: "Software Engineering", code: "SE", description: "A 4-year program covering software development lifecycle, system design, and engineering practices.", credits: 145, semester: "2024.1", department: "FPT University" },
        { id: "2", title: "Artificial Intelligence", code: "AI", description: "Covers machine learning, deep learning, computer vision, and NLP fundamentals.", credits: 140, semester: "2024.1", department: "FPT University" },
        { id: "3", title: "Information Assurance", code: "IA", description: "Focus on cybersecurity, data protection, and network security principles.", credits: 138, semester: "2024.1", department: "FPT University" },
        { id: "4", title: "Digital Art & Design", code: "GD", description: "Creative program covering UI/UX, graphic design, and multimedia production.", credits: 135, semester: "2024.1", department: "FPT University" },
    ],
    syllabus: [
        { id: "1", title: "Software Architecture and Design", code: "SAD301", description: "Study of architectural patterns, design principles, and scalable system design.", credits: 3, semester: "Fall 2025", department: "School of Computing" },
        { id: "2", title: "Mobile Application Development", code: "MAD301", description: "Developing mobile applications for iOS and Android platforms using React Native.", credits: 3, semester: "Fall 2025", department: "School of Computing" },
        { id: "3", title: "Database Systems", code: "DBS301", description: "Relational and non-relational database design, SQL, query optimization, and transactions.", credits: 3, semester: "Spring 2025", department: "School of Computing" },
        { id: "4", title: "Machine Learning", code: "ML301", description: "Supervised, unsupervised learning algorithms and their practical applications.", credits: 3, semester: "Spring 2025", department: "School of Computing" },
        { id: "5", title: "Operating Systems", code: "OS201", description: "Process management, memory management, file systems, and concurrency.", credits: 3, semester: "Fall 2024", department: "School of Computing" },
    ],
    prerequisite: [
        { id: "1", title: "MAD301 → WDP301", code: "MAD301", description: "Mobile App Development is required before taking Web Development with React & Node.", department: "School of Computing" },
        { id: "2", title: "DBS201 → DBS301", code: "DBS201", description: "Introduction to Databases must be completed before Database Systems.", department: "School of Computing" },
        { id: "3", title: "ML201 → ML301", code: "ML201", description: "Foundations of Machine Learning is prerequisite for Advanced Machine Learning.", department: "School of Computing" },
        { id: "4", title: "OS201 → CN201", code: "OS201", description: "Operating Systems is required before taking Computer Networks.", department: "School of Computing" },
    ],
};

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { key: TabType; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
    { key: "curriculum", label: "Curriculum", Icon: Layers },
    { key: "syllabus", label: "Syllabus", Icon: BookOpen },
    { key: "prerequisite", label: "Pre-requisite", Icon: GitMerge },
];

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ item, tab }: { item: SearchResult; tab: TabType }) {
    const accent =
        tab === "curriculum" ? "#EA6227" : tab === "syllabus" ? "#233E8B" : "#062C23";

    return (
        <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex gap-4">
            {/* Color stripe */}
            <div
                className="w-1 rounded-full shrink-0 transition-all duration-200 group-hover:w-1.5"
                style={{ backgroundColor: accent }}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <span className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded-md mb-1"
                            style={{ backgroundColor: `${accent}15`, color: accent }}>
                            {item.code}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-base leading-tight">{item.title}</h3>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" />
                </div>
                <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                    {item.credits && (
                        <span className="text-xs text-gray-400">{item.credits} credits</span>
                    )}
                    {item.semester && (
                        <span className="text-xs text-gray-400">· {item.semester}</span>
                    )}
                    {item.department && (
                        <span className="text-xs text-gray-400">· {item.department}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
    const [activeTab, setActiveTab] = useState<TabType>("syllabus");
    const [query, setQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const filtered = MOCK_DATA[activeTab].filter((item) => {
        const q = query.toLowerCase();
        return (
            item.title.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
    });

    const activeTabInfo = TABS.find((t) => t.key === activeTab)!;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ── Top Nav ── */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-16 flex items-center gap-4 shadow-sm">
                <button
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Brand */}
                <span className="font-mono font-bold text-lg tracking-tight text-[#062C23] whitespace-nowrap">
                    UniSyllabus
                </span>

                {/* Search bar - central */}
                <div className="flex-1 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTabInfo.label}…`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#062C23]/20 focus:border-[#062C23]/40 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 ml-auto">
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EA6227] rounded-full" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <User size={20} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* ── Sidebar ── */}
                <aside
                    className={`${sidebarOpen ? "w-60" : "w-0"} shrink-0 bg-white border-r border-gray-100 overflow-hidden transition-all duration-300 flex flex-col`}
                >
                    <div className="p-4 pt-6 flex-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                            Browse
                        </p>
                        <nav className="space-y-1">
                            {TABS.map(({ key, label, Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => { setActiveTab(key); setQuery(""); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === key
                                            ? "bg-[#062C23] text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Sidebar footer */}
                    <div className="p-4 border-t border-gray-100">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <activeTabInfo.Icon size={22} className="text-gray-500" />
                                {activeTabInfo.label}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {filtered.length} {filtered.length === 1 ? "result" : "results"}
                                {query && ` for "${query}"`}
                            </p>
                        </div>

                        {/* Tab pills */}
                        <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
                            {TABS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => { setActiveTab(key); setQuery(""); }}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${activeTab === key
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results */}
                    {filtered.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                            {filtered.map((item) => (
                                <ResultCard key={item.id} item={item} tab={activeTab} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search size={24} className="text-gray-300" />
                            </div>
                            <h3 className="text-gray-700 font-semibold text-lg">No results found</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Try a different keyword or clear the search.
                            </p>
                            <button
                                onClick={() => setQuery("")}
                                className="mt-4 text-sm text-[#062C23] underline hover:opacity-70"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
