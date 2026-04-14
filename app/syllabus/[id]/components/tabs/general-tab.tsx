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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
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
                Credits
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.credits || "N/A"}
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
                Scoring Scale
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.scoringScale || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Min to Pass
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.minToPass || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Pre-Requisite
              </span>
              {getPreRequisiteText(subjectDetail?.preRequisite) !== "None" ? (
                <span className="inline-flex px-2.5 py-1 rounded bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider">
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

        {/* <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-[#4caf50]" /> Course Description
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {subjectDetail?.description || "N/A"}
          </div>
        </div> */}
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#4caf50]" />
          </h2>
          <div className="space-y-4">
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
                Description
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.description || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Student Tasks
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.studentTasks || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Tools
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.tool || "N/A"}
              </p>
            </div>
            <hr className="border-gray-50" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Decision No
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.decisionNo || "N/A"} (Approved:{" "}
                {subjectDetail?.approvedDate || "N/A"})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
