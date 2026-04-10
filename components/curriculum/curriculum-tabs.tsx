import { TabCurriculum } from "@/lib/constants";
import { CurriculumTab } from "@/lib/type";
import { motion } from "framer-motion";

type Props = {
  activeTab: CurriculumTab;
  onChangeTab: (tab: CurriculumTab) => void;
};

export default function CurriculumTabs({ activeTab, onChangeTab }: Props) {
  return (
    <>
      <div className="hidden md:flex items-center gap-2 pb-3">
        {TabCurriculum.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "text-[#4caf50]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <TabIcon
                size={18}
                className={isActive ? "text-[#4caf50]" : "opacity-50"}
              />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="curriculumTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#4caf50] rounded-t-full"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="md:hidden bg-white border-b border-gray-100 sticky top-34.5 z-40 mb-6 shadow-sm shadow-[#4caf50]/5">
        <div className="flex overflow-x-auto no-scrollbar px-2 py-2 snap-x">
          {TabCurriculum.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onChangeTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap snap-start ${
                  isActive
                    ? "bg-[#4caf50]/10 text-[#4caf50]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <TabIcon
                  size={16}
                  className={isActive ? "text-[#4caf50]" : "opacity-70"}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
