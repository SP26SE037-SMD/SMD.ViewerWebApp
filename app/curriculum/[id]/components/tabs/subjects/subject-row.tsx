import { Clock } from "lucide-react";
import { DisplaySubjectRow } from "./types";

type Props = {
  row: DisplaySubjectRow;
  isLast: boolean;
  onNavigateSyllabus: (subjectId: string) => void;
  onOpenElectiveGroup: (row: DisplaySubjectRow) => void;
};

const getSubjectSummary = (subjectName: string) => {
  if (!subjectName.includes("_")) {
    return null;
  }

  const [, ...rest] = subjectName.split("_");
  const summary = rest.join("_").trim();
  return summary || null;
};

export default function SubjectRow({
  row,
  isLast,
  onNavigateSyllabus,
  onOpenElectiveGroup,
}: Props) {
  const prerequisiteText = row.prerequisiteSubjectCodes.length
    ? row.prerequisiteSubjectCodes.join(", ")
    : "—";
  const isElective = row.kind === "elective";
  const isCombo = row.kind === "combo";

  return (
    <div
      onClick={() => {
        if (isElective) {
          onOpenElectiveGroup(row);
          return;
        }

        onNavigateSyllabus(row.subjectId);
      }}
      className={`px-5 py-4 transition-colors group cursor-pointer ${
        isLast ? "" : "border-b border-gray-100"
      } ${
        isElective
          ? "hover:bg-blue-50"
          : isCombo
            ? "hover:bg-violet-50"
            : "hover:bg-[#4caf50]/5"
      }`}
    >
      <div className="hidden md:grid grid-cols-12 gap-2 items-center">
        <div className="col-span-2">
          <span
            className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold font-mono ${
              isElective
                ? "bg-blue-100 text-blue-700"
                : isCombo
                  ? "bg-violet-100 text-violet-700"
                  : "bg-[#4caf50]/10 text-[#4caf50]"
            }`}
          >
            {row.subjectCode}
          </span>
        </div>
        <div className="col-span-5 flex items-start gap-2">
          <div>
            <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
              {row.subjectName}
              {isElective && (
                <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                  Elective
                </span>
              )}
              {isCombo && (
                <span className="inline-flex px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                  Combo
                </span>
              )}
            </p>
            {isElective && row.subjects.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5 max-w-[90%] truncate">
                {row.subjects.length} subjects replaced by this group
              </p>
            )}
            {!isElective && getSubjectSummary(row.subjectName) && (
              <p className="text-xs text-gray-400 mt-0.5 max-w-[90%] truncate">
                {getSubjectSummary(row.subjectName)}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-1 text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
            {row.credits}
          </span>
        </div>
        <div className="col-span-4">
          {row.prerequisiteSubjectCodes.length > 0 ? (
            <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
              {prerequisiteText}
            </span>
          ) : (
            <span className="text-xs text-gray-300 italic">{prerequisiteText}</span>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold font-mono ${
                isElective
                  ? "bg-blue-100 text-blue-700"
                  : isCombo
                    ? "bg-violet-100 text-violet-700"
                    : "bg-[#4caf50]/10 text-[#4caf50]"
              }`}
            >
              {row.subjectCode}
            </span>
            {isElective && (
              <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                Elective
              </span>
            )}
            {isCombo && (
              <span className="inline-flex px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                Combo
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
            <Clock size={12} />
            {row.credits} credits
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-0.5">{row.subjectName}</p>
        {isElective && row.subjects.length > 0 && (
          <p className="text-xs text-gray-400 mb-2 truncate">
            {row.subjects.length} subjects replaced by this group
          </p>
        )}
        {!isElective && getSubjectSummary(row.subjectName) && (
          <p className="text-xs text-gray-400 mb-2 truncate">
            {getSubjectSummary(row.subjectName)}
          </p>
        )}
        {row.prerequisiteSubjectCodes.length > 0 && (
          <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mt-1 flex-wrap">
            Pre-requisite: {prerequisiteText}
          </span>
        )}
      </div>
    </div>
  );
}
