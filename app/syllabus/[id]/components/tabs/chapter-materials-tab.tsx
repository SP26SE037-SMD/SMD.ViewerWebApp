import { useEffect, useState } from "react";
import { BookOpen, CalendarClock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import syllabusApiRequest from "@/apiRequests/syllabus";
import { SyllabusMaterialType } from "@/schemaValidations/syllabus.schema";
import { SyllabusDetail } from "@/app/syllabus/[id]/types";

type Props = {
  syllabus: SyllabusDetail;
  subjectId: string;
};

export default function ChapterMaterialsTab({ syllabus, subjectId }: Props) {
  const router = useRouter();
  const [materials, setMaterials] = useState<SyllabusMaterialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!syllabus?.syllabusId) {
        setMaterials([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await syllabusApiRequest.getMaterialsBySyllabusId(
          syllabus.syllabusId,
        );
        setMaterials(res?.payload?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch syllabus materials", error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [syllabus?.syllabusId]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOpen className="text-[#4caf50]" size={24} />
        Course Materials ({materials.length})
      </h3>
      {loading ? (
        <div className="py-8 text-sm text-gray-500">Loading materials...</div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <div
              key={material.materialId}
              onClick={() =>
                router.push(
                  `/syllabus/${encodeURIComponent(subjectId)}/chapter/${material.materialId}`,
                )
              }
              className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#4caf50]/50 hover:shadow-lg hover:bg-[#4caf50]/5 transition-all flex flex-col gap-3 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#4caf50] shrink-0">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d6b2c] bg-[#eaf7e8] px-2.5 py-1 rounded-lg border border-[#3d6b2c]/20">
                  {material.materialType || "UNKNOWN"}
                </span>
              </div>
              <h4 className="font-bold text-gray-800 leading-snug line-clamp-2 mt-2">
                {material.title}
              </h4>
              <p className="text-xs text-gray-500 mt-auto flex items-center gap-1.5">
                <CalendarClock size={14} />
                Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3 text-center border-2 border-dashed border-gray-100 rounded-2xl">
          <BookOpen size={48} className="opacity-20 mb-2" />
          <p className="font-medium">No published materials found.</p>
        </div>
      )}
    </div>
  );
}
