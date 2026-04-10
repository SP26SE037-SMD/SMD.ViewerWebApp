"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, X, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/provider/store";
import { ActionCard } from "@/components/ui/action-card";
import { homeItems } from "@/lib/data";

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
            <span className="text-sm font-semibold text-[#6AB04C]">
              {greeting()},
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-[Bricolage_Grotesque]">
            {displayName}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            What do you want to explore today?
          </p>
        </motion.div>

        {/* Cards Section */}
        <div>
          <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
            <ChevronRight size={18} className="text-[#6AB04C]" />
            Quick access
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {homeItems.map((item, index) => (
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
              Use the quick search bar above to look up subjects by name or
              course code.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
