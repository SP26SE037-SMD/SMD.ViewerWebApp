"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import SyllabusHeader from "@/app/syllabus/[id]/components/syllabus-header";
import SyllabusTabs from "@/components/syllabus/syllabus-tabs";
import GeneralTab from "@/app/syllabus/[id]/components/tabs/general-tab";
import SourcesTab from "@/app/syllabus/[id]/components/tabs/sources-tab";
import LosTab from "@/app/syllabus/[id]/components/tabs/los-tab";
import SessionsTab from "@/app/syllabus/[id]/components/tabs/sessions-tab";
import ChapterMaterialsTab from "@/app/syllabus/[id]/components/tabs/chapter-materials-tab";
import QuestionsTab from "@/app/syllabus/[id]/components/tabs/questions-tab";
import AssessmentsTab from "@/app/syllabus/[id]/components/tabs/assessments-tab";
import { TabId } from "@/app/syllabus/[id]/types";
import { useSyllabusDetail } from "@/app/syllabus/[id]/hooks/use-syllabus-detail";

export default function SyllabusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const subjectId = decodeURIComponent(resolvedParams.id);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const { loading, syllabus, subjectDetail } = useSyllabusDetail(subjectId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4caf50]" />
        <p className="text-sm text-gray-400">Loading syllabus information...</p>
      </div>
    );
  }

  if (!syllabus && !subjectDetail) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
          <AlertCircle size={40} className="text-red-400" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 font-medium text-center">
          Syllabus information not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend] pb-24">
      <SyllabusHeader syllabus={syllabus} subjectDetail={subjectDetail} />
      <div className="max-w-6xl mx-auto px-4">
        <SyllabusTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "general" && (
              <GeneralTab subjectDetail={subjectDetail} />
            )}
            {activeTab === "sources" && <SourcesTab subjectId={subjectId} />}
            {activeTab === "los" && <LosTab subjectId={subjectId} />}
            {activeTab === "sessions" && syllabus && (
              <SessionsTab syllabus={syllabus} />
            )}
            {activeTab === "chapterMaterials" && syllabus && (
              <ChapterMaterialsTab syllabus={syllabus} subjectId={subjectId} />
            )}
            {activeTab === "questions" && syllabus && (
              <QuestionsTab syllabus={syllabus} />
            )}
            {activeTab === "assessments" && syllabus && (
              <AssessmentsTab syllabus={syllabus} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
