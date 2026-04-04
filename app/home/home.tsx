"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Map,
  Milestone,
  GraduationCap,
  Search,
  X,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/provider/store";
import { ActionCard } from "@/components/ui/action-card";

const items = [
  {
    id: 1,
    title: "View Syllabus",
    subtitle: "View Syllabus",
    desc: "Explore a clearly structured learning path for your major.",
    icon: BookOpen,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/syllabus",
  },
  {
    id: 2,
    title: "Curriculum",
    subtitle: "Curriculum",
    desc: "Detailed step-by-step guide in the training program.",
    icon: Milestone,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/curriculum",
  },
  {
    id: 3,
    title: "Learning Path",
    subtitle: "Learning Path",
    desc: "View the entire roadmap and key milestones by semester.",
    icon: Map,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/learning-path",
  },
  {
    id: 4,
    title: "Pre-requisite",
    subtitle: "Pre-requisite",
    desc: "Check mandatory subjects that must be completed first.",
    icon: GraduationCap,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/pre-requisite",
  },
];

export default function Home() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTarget, setSearchTarget] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.fullName ? user.fullName.split(" ").pop() : "you";

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6AB04C]" />
              <p className="text-sm text-gray-500 font-medium">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search Modal ── */}
      <AnimatePresence>
        {searchTarget !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSearchTarget(null); setSearchValue(""); }}
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                <div className="p-2.5 rounded-2xl bg-[#6AB04C]/10">
                  <Search size={22} className="text-[#6AB04C]" />
                </div>
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter search keyword..."
                  className="flex-1 text-lg outline-none text-gray-800 bg-transparent placeholder-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchValue.trim() !== "") {
                      router.push(`${searchTarget}?search=${encodeURIComponent(searchValue.trim().toLowerCase())}`);
                      setSearchTarget(null);
                      setSearchValue("");
                    }
                    if (e.key === "Escape") { setSearchTarget(null); setSearchValue(""); }
                  }}
                />
                <button
                  onClick={() => { setSearchTarget(null); setSearchValue(""); }}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {["Calculus", "Web programming", "Database", "Computer networks"].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => {
                        router.push(`${searchTarget}?search=${encodeURIComponent(hint.toLowerCase())}`);
                        setSearchTarget(null);
                        setSearchValue("");
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#EBF5E4] hover:text-[#3D6B2C] text-gray-600 text-sm rounded-xl transition-colors"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
                {searchValue && (
                  <button
                    onClick={() => {
                      router.push(`${searchTarget}?search=${encodeURIComponent(searchValue.trim().toLowerCase())}`);
                      setSearchTarget(null);
                      setSearchValue("");
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-[#6AB04C] text-white py-3 rounded-2xl font-semibold hover:bg-[#5a9940] transition-colors"
                  >
                    Search "{searchValue}"
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Layout ── */}
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-[#6AB04C]" />
            <span className="text-sm font-semibold text-[#6AB04C]">{greeting()},</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-[Bricolage_Grotesque]">
            {displayName}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            What do you want to explore in the curriculum today?
          </p>
        </motion.div>

      

        {/* Cards Section */}
        <div>
          <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
            <ChevronRight size={18} className="text-[#6AB04C]" />
            Quick access
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <ActionCard 
                key={item.id} 
                {...item} 
                index={index} 
                onSearchClick={setSearchTarget} 
              />
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center gap-4 bg-[#EBF5E4] border border-[#6AB04C]/20 rounded-3xl p-5"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#6AB04C] flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2D4A22]">Helpful Tips</p>
            <p className="text-xs text-[#4A7D37] mt-0.5">
              Use the quick search bar above to look up subjects by name or course code.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
