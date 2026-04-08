"use client";

import { AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import CurriculumHeader from "./components/curriculum-header";
import GeneralTab from "./components/tabs/general-tab";
import PlosTab from "./components/tabs/plos-tab";
import SubjectsTab from "./components/tabs/subjects-tab";
import { useCurriculumDetail } from "./hooks/use-curriculum-detail";
import { BookMarked, GitMerge } from "lucide-react";

export default function CurriculumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    curriculum,
    loading,
    activeTab,
    setActiveTab,
    descExpanded,
    setDescExpanded,
  } = useCurriculumDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 font-[Lexend]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4caf50]" />
        <p className="text-sm text-gray-400 font-medium">
          Loading curriculum...
        </p>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 font-[Lexend]">
        <BookMarked size={48} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Curriculum not found</p>
        <button
          onClick={() => router.push("/curriculum")}
          className="text-[#4caf50] font-semibold text-sm hover:underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <CurriculumHeader
        curriculum={curriculum}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => router.back()}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "general" && (
            <GeneralTab
              curriculum={curriculum}
              descExpanded={descExpanded}
              onToggleDescription={() => setDescExpanded(!descExpanded)}
            />
          )}

          {activeTab === "plos" && (
            <PlosTab curriculumId={curriculum.curriculumId} />
          )}

          {activeTab === "subjects" && (
            <SubjectsTab
              curriculumId={curriculum.curriculumId}
              onNavigateSyllabus={(subjectCode) =>
                router.push(`/syllabus/${subjectCode}`)
              }
              onNavigateCombo={(subjectCode) =>
                router.push(`/curriculum/${id}/combo/${subjectCode}`)
              }
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Button: Xem sơ đồ môn học ── */}
      <div className="bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white to-transparent z-40 h-24 flex items-end">
        <div className="max-w-6xl mx-auto w-full">
          <button
            onClick={() => router.push(`/curriculum/${id}/graph`)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-base font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <GitMerge size={20} />
            View subject graph
          </button>
        </div>
      </div>
    </div>
  );
}
