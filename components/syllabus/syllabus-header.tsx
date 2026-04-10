import { SubjectDetailType } from "@/schemaValidations/subject.schema";
import { SyllabusContentType } from "@/schemaValidations/syllabus.schema";
import { Award, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  syllabus: SyllabusContentType | null;
  subjectDetail: SubjectDetailType | null;
};

export default function SyllabusHeader({ syllabus, subjectDetail }: Props) {
  const router = useRouter();

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
              {subjectDetail?.subjectCode || "N/A"}
            </h1>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">
                {syllabus?.syllabusName || "N/A"}
              </p>
            </div>
            {/* <p className="text-sm text-gray-500 font-medium">
              {subjectDetail?.subjectCode || "N/A"}
            </p> */}
          </div>
          <span className="shrink-0 px-4 py-1.5 rounded-full bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold border border-[#4caf50]/30">
            {subjectDetail?.credits || "N/A"} Credits
          </span>
        </div>
      </div>
    </div>
  );
}
