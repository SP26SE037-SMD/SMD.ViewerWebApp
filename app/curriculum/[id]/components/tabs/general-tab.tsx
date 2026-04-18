import {
  Award,
  BookMarked,
  ChevronDown,
  ChevronUp,
  FileText,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionCard from "@/components/section-card";
import { CurriculumDetailType } from "@/schemaValidations/curriculum.schema";

type Props = {
  curriculum: CurriculumDetailType;
  descExpanded: boolean;
  onToggleDescription: () => void;
};

export default function GeneralTab({
  curriculum,
  descExpanded,
  onToggleDescription,
}: Props) {
  const descriptionPreview = curriculum.description?.slice(0, 300);

  return (
    <motion.div
      key="general"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className=""
    >
      <SectionCard className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#4caf50]/10">
              <BookMarked
                size={22}
                className="text-[#4caf50]"
                strokeWidth={1.7}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-semibold">
                Curriculum Code
              </p>
              <p className="text-sm font-bold text-gray-900 font-mono truncate">
                {curriculum.curriculumCode}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#4caf50]/10">
              <Hash size={22} className="text-[#4caf50]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">
                Total Subjects
              </p>
              <p className="text-xl font-bold text-gray-900">
                {curriculum.totalSubjects}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#4caf50]/10">
              <Award size={22} className="text-[#4caf50]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold">
                Total Credits
              </p>
              <p className="text-xl font-bold text-gray-900">
                {curriculum.totalCredits}
              </p>
            </div>
          </div>

          {curriculum.decisionNo && (
            <div className="rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-3">
              <div className="p-3 rounded-xl bg-[#4caf50]/10">
                <FileText size={22} className="text-[#4caf50]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-semibold">Decision</p>
                <p className="text-sm font-bold text-gray-900">
                  {curriculum.decisionNo}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6 border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Full Name
          </p>
          <h2 className="text-base font-bold text-gray-900 leading-relaxed mb-1">
            {curriculum.curriculumName}
          </h2>
          {curriculum.englishName && (
            <p className="text-sm text-gray-500 italic">
              {curriculum.englishName}
            </p>
          )}
        </div>

        {curriculum.description && (
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[#4caf50]" />
              <h3 className="text-sm font-bold text-gray-900">
                Curriculum Description
              </h3>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {descExpanded
                ? curriculum.description
                : descriptionPreview + "..."}
            </div>
            <button
              onClick={onToggleDescription}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-[#4caf50] hover:underline transition-colors"
            >
              {descExpanded ? (
                <>
                  Show less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  See more <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
