import { FileText } from "lucide-react";
import { SubjectDetailType } from "@/schemaValidations/subject.schema";

type Props = {
  subjectDetail: SubjectDetailType;
};

export default function GeneralTab({ subjectDetail }: Props) {
  const preRequisites = subjectDetail?.preRequisite ?? [];

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
                Department
              </span>
              <p className="text-sm text-gray-800 font-medium">
                {subjectDetail?.department?.departmentCode || "N/A"} -{" "}
                {subjectDetail?.department?.departmentName || "N/A"}
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
              {preRequisites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preRequisites.map((item, index) => (
                    <span
                      key={`${item.prerequisiteSubjectCode}-${index}`}
                      className="inline-flex px-2.5 py-1 rounded bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider"
                    >
                      {item.prerequisiteSubjectCode} -{" "}
                      {item.prerequisiteSubjectName}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">
                  No pre-requisites
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#4caf50]" /> Additional
            Information
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
                {subjectDetail?.decisionNo || "N/A"} (Approved Date:{" "}
                {subjectDetail?.approvedDate || "N/A"})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
