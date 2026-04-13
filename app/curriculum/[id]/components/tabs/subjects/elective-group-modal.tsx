import { AnimatePresence, motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { DisplaySubjectRow } from "./types";

type Props = {
  selectedElectiveGroup: DisplaySubjectRow | null;
  onClose: () => void;
  onNavigateSyllabus: (subjectId: string) => void;
};

export default function ElectiveGroupModal({
  selectedElectiveGroup,
  onClose,
  onNavigateSyllabus,
}: Props) {
  return (
    <AnimatePresence>
      {selectedElectiveGroup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.button
            type="button"
            aria-label="Close elective group modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Elective group
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                    {selectedElectiveGroup.subjectName}
                  </h2>
                  {selectedElectiveGroup.group?.description && (
                    <p className="text-sm text-gray-500 mb-2">
                      {selectedElectiveGroup.group.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                      {selectedElectiveGroup.subjectCode}
                    </span>
                    <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                      {selectedElectiveGroup.subjects.length} subjects
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <div className="col-span-2">Subject Code</div>
                  <div className="col-span-6">Subject Name</div>
                  <div className="col-span-1 text-center">Credits</div>
                  <div className="col-span-3">Pre-requisite</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {selectedElectiveGroup.subjects.map((subject) => {
                    const prerequisiteText = subject.prerequisiteSubjectCodes.length
                      ? subject.prerequisiteSubjectCodes.join(", ")
                      : "—";

                    return (
                      <button
                        key={subject.subjectId}
                        type="button"
                        onClick={() => onNavigateSyllabus(subject.subjectId)}
                        className="w-full text-left px-5 py-4 hover:bg-[#4caf50]/5 transition-colors"
                      >
                        <div className="hidden md:grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-2">
                            <span className="inline-flex px-3 py-1 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold font-mono">
                              {subject.subjectCode}
                            </span>
                          </div>
                          <div className="col-span-6 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {subject.subjectName}
                            </p>
                          </div>
                          <div className="col-span-1 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                              {subject.credit}
                            </span>
                          </div>
                          <div className="col-span-3">
                            {subject.prerequisiteSubjectCodes.length > 0 ? (
                              <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                                {prerequisiteText}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-300 italic">
                                {prerequisiteText}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="md:hidden">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="inline-flex px-3 py-1 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold font-mono">
                              {subject.subjectCode}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                              <Clock size={12} />
                              {subject.credit} credits
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">
                            {subject.subjectName}
                          </p>
                          {subject.prerequisiteSubjectCodes.length > 0 && (
                            <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 flex-wrap">
                              Pre-requisite: {prerequisiteText}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
