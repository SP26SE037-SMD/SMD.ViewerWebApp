import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SubjectRow from "./subject-row";
import { DisplaySubjectRow } from "./types";

type Props = {
  semesterNo: number;
  rows: DisplaySubjectRow[];
  isExpanded: boolean;
  onToggle: (semester: number) => void;
  onNavigateSyllabus: (subjectId: string) => void;
  onOpenElectiveGroup: (row: DisplaySubjectRow) => void;
};

export default function SemesterSection({
  semesterNo,
  rows,
  isExpanded,
  onToggle,
  onNavigateSyllabus,
  onOpenElectiveGroup,
}: Props) {
  const semCredits = rows.reduce((sum, row) => sum + row.credits, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(semesterNo)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4caf50] flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {semesterNo === 0 ? "P" : semesterNo}
            </span>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900">
              {semesterNo === 0 ? "Preparatory Semester" : `Semester ${semesterNo}`}
            </h3>
            <p className="text-xs text-gray-400">
              {rows.length} subjects · {semCredits} credits
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100">
              <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-2">Subject Code</div>
                <div className="col-span-5">Subject Name</div>
                <div className="col-span-1 text-center">Credits</div>
                <div className="col-span-4">Pre-requisite</div>
              </div>

              {rows.map((row, idx) => (
                <SubjectRow
                  key={row.key}
                  row={row}
                  isLast={idx === rows.length - 1}
                  onNavigateSyllabus={onNavigateSyllabus}
                  onOpenElectiveGroup={onOpenElectiveGroup}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
