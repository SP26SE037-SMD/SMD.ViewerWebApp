import { BookOpen, CheckCircle2, FileText, Layers } from "lucide-react";
import { SubjectDetailType } from "@/schemaValidations/subject.schema";

type Props = {
  subjectDetail: SubjectDetailType;
};

function getPreRequisiteText(
  preRequisite:
    | SubjectDetailType["preRequisite"]
    | { prerequisiteSubjectCode?: string }[]
    | null
    | undefined,
) {
  if (!preRequisite) return "None";
  if (Array.isArray(preRequisite)) {
    const codes = preRequisite
      .map((item) => item?.prerequisiteSubjectCode)
      .filter(Boolean);
    return codes.length ? codes.join(", ") : "None";
  }
  return preRequisite.prerequisiteSubjectCode || "None";
}

export default function GeneralTab({ subjectDetail }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#4caf50]" /> Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Subject Name{" "}
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.subjectName || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Decison No
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.decisionNo || "N/A"} (Approved:{" "}
                {subjectDetail?.approvedDate || "N/A"})
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Degree Level
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.degreeLevel || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Time Allocation
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.timeAllocation || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Pre-Requisite
              </span>
              {getPreRequisiteText(subjectDetail?.preRequisite) !== "None" ? (
                <span className="inline-flex px-2.5 py-1 rounded bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                  {getPreRequisiteText(subjectDetail?.preRequisite)}
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic">
                  No pre-requisites
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-[#4caf50]" /> Course Description
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {subjectDetail?.description || "N/A"}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#4caf50]" /> Student Tasks
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {subjectDetail?.studentTasks || "N/A"}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Layers size={20} className="text-[#4caf50]" /> Tools & Software
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {subjectDetail?.tool || "N/A"}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Scoring Scale
            </h2>
            <p className="text-2xl font-black text-gray-900">
              {subjectDetail?.scoringScale || "N/A"}
            </p>
          </div>
          <div className="w-px h-12 bg-gray-100 mx-4" />
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Min Passing Mark
            </h2>
            <p className="text-2xl font-black text-[#4caf50]">
              {subjectDetail?.minToPass || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
