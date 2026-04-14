import { SubjectDetailType } from "@/schemaValidations/subject.schema";
import { SyllabusContentType } from "@/schemaValidations/syllabus.schema";
import { ArrowLeft, BellPlus } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  syllabus: SyllabusContentType | null;
  subjectDetail: SubjectDetailType | null;
  isWishlisted?: boolean;
};

export default function SyllabusHeader({
  syllabus,
  subjectDetail,
  isWishlisted = false,
}: Props) {
  const router = useRouter();

  const wishlistButtonClassName = isWishlisted
    ? "shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-white bg-[#059669] text-white text-xs font-bold shadow-sm transition-colors hover:bg-[#047857]"
    : "shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#059669] bg-white text-[#059669] text-xs font-bold transition-colors hover:bg-[#ecfdf5]";

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
          </div>
          <button
            type="button"
            className={wishlistButtonClassName}
            aria-label="Subscribe subject"
            title="Subscribe subject"
          >
            <BellPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
