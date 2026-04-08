import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { CurriculumDetail, TabKey } from "../types";
import { TABS } from "../constants";

type Props = {
  curriculum: CurriculumDetail;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onBack: () => void;
};

export default function CurriculumHeader({
  curriculum,
  activeTab,
  onTabChange,
  onBack,
}: Props) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 font-[Bricolage_Grotesque] truncate">
              {curriculum.curriculumCode}
            </h1>
            <p className="text-xs text-gray-400 truncate">
              {curriculum.curriculumName.split("(")[0].trim()}
            </p>
          </div>
          <span className="shrink-0 px-4 py-1.5 rounded-full bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold border border-[#4caf50]/30">
            {curriculum.totalCredits} Credits
          </span>
        </div>

        <div className="flex items-center gap-6 mt-4 relative">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[#4caf50]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#4caf50] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
