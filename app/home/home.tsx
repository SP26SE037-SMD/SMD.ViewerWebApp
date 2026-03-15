"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, Map, Milestone, GraduationCap, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTarget, setSearchTarget] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const items = [
    {
      id: 1,
      title: "View Syllabus",
      desc: "Explore the structured learning path for your major.",
      icon: BookOpen,
      color: "bg-[#3D6B2C]",
      span: "col-span-2 row-span-2",
      path: "/syllabus",
    },
    {
      id: 2,
      title: "View Curriculum",
      desc: "Detailed step-by-step guide.",
      icon: Milestone,
      color: "bg-[#2D4A22]",
      span: "col-span-2 row-span-1",
      path: "/curriculum",
    },
    {
      id: 3,
      title: "Learning Path",
      desc: "Download course outlines.",
      icon: Map,
      color: "bg-[#4A7D37]",
      span: "col-span-1 row-span-1",
      path: "/learning-path",
    },
    {
      id: 4,
      title: "Pre-requisite",
      desc: "Check required subjects.",
      icon: GraduationCap,
      color: "bg-[#1A2E12]",
      span: "col-span-1 row-span-1",
      path: "/pre-requisite",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-[#f0f7ed] flex items-center justify-center p-6 lg:p-12">
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#f0f7ed] flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D6B2C]"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchTarget !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchTarget(null)}
            className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-full shadow-2xl p-3 flex items-center gap-3"
            >
              <div className="text-[#3D6B2C] ml-4">
                <Search size={24} />
              </div>
              <input
                autoFocus
                type="text"
                placeholder="Type to search..."
                className="flex-1 text-lg outline-none text-[#5A6B52] bg-transparent ml-2 font-[Lexend]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                    const query = e.currentTarget.value.trim().toLowerCase();
                    router.push(`${searchTarget}?search=${encodeURIComponent(query)}`);
                    setSearchTarget(null);
                  }
                }}
              />
              <button
                onClick={() => setSearchTarget(null)}
                className="p-3 bg-[#E8F5E0] rounded-full hover:bg-[#D4ECC8] text-[#3D6B2C] transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[auto] md:h-[600px]">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`relative p-8 rounded-[32px] overflow-hidden flex flex-col justify-between text-white border border-white/10 shadow-[8px_8px_0px_0px_rgba(26,46,18,0.1)] ${item.span} ${item.color}`}
          >
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] opacity-10">
              <item.icon size={150} />
            </div>

            <div className="z-10">
              <div className="p-3 bg-white/10 w-fit rounded-2xl mb-4 backdrop-blur-md">
                <item.icon size={28} />
              </div>
              <h2 className="text-2xl font-bold font-[Lexend] leading-tight mb-2">
                {item.title}
              </h2>
              <p className="text-white/70 text-sm font-light max-w-[200px]">
                {item.desc}
              </p>
            </div>

            <button
              onClick={() => setSearchTarget(item.path)}
              className="z-10 mt-4 w-fit px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-all border border-white/20"
            >
              Search →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
