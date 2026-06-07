import { SubjectDetailType } from "@/schemaValidations/subject.schema";
import { SyllabusContentType } from "@/schemaValidations/syllabus.schema";
import { ArrowLeft, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StudentCompareModal from "./student-compare-modal";

type Props = {
  syllabus: SyllabusContentType | null;
  subjectDetail: SubjectDetailType | null;
};

export default function SyllabusHeader({
  syllabus,
  subjectDetail,
}: Props) {
  const router = useRouter();
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 font-[Bricolage_Grotesque] truncate">
              {subjectDetail?.subjectCode || "N/A"} - {subjectDetail?.subjectName || "N/A"}
            </h1>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">
                {syllabus?.syllabusName || "N/A"}
              </p>
            </div>
          </div>
          {syllabus?.syllabusId && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              type="button"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50"
              aria-label="Compare with previous version"
              title="Compare with previous version"
            >
              <History size={16} />
              Compare with previous version
            </button>
          )}
        </div>
      </div>
      
      {syllabus?.syllabusId && (
        <StudentCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          syllabusId={syllabus.syllabusId}
        />
      )}
    </div>
  );
}
