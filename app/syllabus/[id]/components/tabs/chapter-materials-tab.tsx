import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { SyllabusDetail } from "@/app/syllabus/[id]/types";

type Props = {
  syllabus: SyllabusDetail;
  subjectId: string;
};

export default function ChapterMaterialsTab({ syllabus, subjectId }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOpen className="text-[#4caf50]" size={24} />
        Lectures List
      </h3>
      {syllabus.chapterMaterials && syllabus.chapterMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {syllabus.chapterMaterials.map((chap) => (
            <div
              key={chap.chapterId}
              onClick={() =>
                router.push(`/syllabus/${subjectId}/chapter/${chap.chapterId}`)
              }
              className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#4caf50]/50 hover:shadow-lg hover:bg-[#4caf50]/5 transition-all cursor-pointer group flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#4caf50] group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                  {chap.blocks.length} blocks
                </span>
              </div>
              <h4 className="font-bold text-gray-800 leading-snug line-clamp-2 mt-2">
                {chap.chapterName}
              </h4>
              <p className="text-sm text-[#4caf50] font-medium mt-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                View material <ArrowLeft size={14} className="rotate-180" />
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3 text-center border-2 border-dashed border-gray-100 rounded-2xl">
          <BookOpen size={48} className="opacity-20 mb-2" />
          <p className="font-medium">No lecture materials uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
