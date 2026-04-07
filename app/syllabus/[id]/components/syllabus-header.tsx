import { Award, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubjectDetailData, SyllabusDetail } from "../types";

type Props = {
  syllabus: SyllabusDetail | null;
  subjectDetail: SubjectDetailData | null;
};

export default function SyllabusHeader({ syllabus, subjectDetail }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-100 top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 -mt-1 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-800 shrink-0"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex px-2.5 py-1 rounded bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold uppercase tracking-widest shrink-0">
                {syllabus?.syllabusName || "N/A"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
              {subjectDetail?.subjectName || "N/A"}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {subjectDetail?.subjectCode || "N/A"}
            </p>
          </div>

          <div className="hidden sm:flex flex-col gap-3 shrink-0 ml-4">
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 min-w-50">
              <div className="p-2.5 bg-white rounded-xl shadow-sm">
                <Award size={24} className="text-[#4caf50]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Credits
                </p>
                <p className="text-2xl font-black text-gray-900 leading-none">
                  {subjectDetail?.credits || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
