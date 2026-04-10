import { ArrowLeft } from "lucide-react";
import { CurriculumDetailType } from "@/schemaValidations/curriculum.schema";

type Props = {
  curriculum: CurriculumDetailType;
  onBack: () => void;
};

export default function CurriculumHeader({ curriculum, onBack }: Props) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 font-[Bricolage_Grotesque] truncate">
              {curriculum.curriculumCode}
            </h1>
            <p className="text-xs text-gray-400 truncate">
              {curriculum.curriculumName.split("(")[0].trim()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
