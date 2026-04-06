import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface ActionCardProps {
  id: string | number;
  title: string;
  subtitle: string;
  desc: string;
  icon: LucideIcon;
  bg: string;
  iconBg: string;
  path: string;
  index: number;
  onSearchClick: (path: string) => void;
}

export function ActionCard({
  title,
  subtitle,
  desc,
  icon: Icon,
  bg,
  iconBg,
  path,
  index,
  onSearchClick,
}: ActionCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08 }}
      className={`group relative rounded-3xl ${bg} p-6 flex flex-col gap-4 cursor-default transition-all duration-300 border-2 border-[#f6f9f6] hover:shadow-[0_8px_30px_rgb(76,175,80,0.15)] hover:-translate-y-1`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-sm`}
      >
        <Icon size={24} className="text-white" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          {subtitle}
        </p>
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {desc}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => router.push(path)}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-[#4caf50] text-gray-800 hover:text-white text-sm font-semibold py-2.5 rounded-2xl border border-gray-100 hover:border-[#4caf50] shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          View Now
          <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}
