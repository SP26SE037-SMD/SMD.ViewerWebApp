import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import subjectApiRequest from "@/apiRequests/subject";
import { ChevronDown, Clock, Layers } from "lucide-react";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { CurriculumSubjectType } from "@/schemaValidations/curriculum.schema";

type Props = {
  curriculumId: string;
  onNavigateSyllabus: (subjectCode: string) => void;
  onNavigateCombo: (subjectCode: string) => void;
};

const isComboSubject = (subject: CurriculumSubjectType) =>
  subject.subjectCode.includes("_COM") ||
  subject.subjectName.toLowerCase().includes("combo");

export default function SubjectsTab({
  curriculumId,
  onNavigateSyllabus,
  onNavigateCombo,
}: Props) {
  const [subjects, setSubjects] = useState<CurriculumSubjectType[]>([]);
  const [subjectPrerequisites, setSubjectPrerequisites] = useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!curriculumId) {
        setSubjects([]);
        setExpandedSemesters(new Set());
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allSubjects: CurriculumSubjectType[] = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
          const res = await curriculumApiRequest.getSubjectsByCurriculumId(
            curriculumId,
            page,
            10,
          );
          const data = res?.payload?.data;

          if (data?.content?.length) {
            allSubjects.push(...data.content);
          }

          totalPages = data?.totalPages ?? 0;
          if (totalPages === 0) break;
          page += 1;
        }

        setSubjects(allSubjects);
        const semesters = new Set(allSubjects.map((s) => s.semester));
        setExpandedSemesters(semesters);

        const prerequisiteEntries = await Promise.all(
          allSubjects.map(async (subject) => {
            try {
              const prerequisiteRes =
                await subjectApiRequest.getPrerequisitesBySubjectId(
                  subject.subjectId,
                );
              const prerequisiteCodes =
                prerequisiteRes?.payload?.data
                  ?.map((item) => item.prerequisiteSubjectCode)
                  .filter(Boolean) ?? [];

              return [subject.subjectId, prerequisiteCodes] as const;
            } catch {
              return [subject.subjectId, []] as const;
            }
          }),
        );

        setSubjectPrerequisites(Object.fromEntries(prerequisiteEntries));
      } catch (error) {
        console.error("Failed to fetch curriculum subjects", error);
        setSubjects([]);
        setSubjectPrerequisites({});
        setExpandedSemesters(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [curriculumId]);

  const groupedSubjects = useMemo(() => {
    const result: Record<number, CurriculumSubjectType[]> = {};
    subjects.forEach((s) => {
      if (!result[s.semester]) result[s.semester] = [];
      result[s.semester].push(s);
    });
    return result;
  }, [subjects]);

  const sortedSemesters = useMemo(
    () =>
      Object.keys(groupedSubjects)
        .map(Number)
        .sort((a, b) => a - b),
    [groupedSubjects],
  );

  const toggleSemester = (semester: number) => {
    setExpandedSemesters((prev) => {
      const next = new Set(prev);
      if (next.has(semester)) next.delete(semester);
      else next.add(semester);
      return next;
    });
  };

  const totalSubjects = subjects.length;
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  if (loading) {
    return (
      <motion.div
        key="subjects"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
          <p className="text-gray-500 font-medium">Loading subject data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="subjects"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      {sortedSemesters.length > 0 ? (
        <>
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#4caf50]/10 text-[#4caf50]">
              {totalSubjects} subjects · {totalCredits} credits
            </span>
          </div>

          <div className="space-y-4">
            {sortedSemesters.map((sem) => {
              const subjects = groupedSubjects[sem];
              const isExpanded = expandedSemesters.has(sem);
              const semCredits = subjects.reduce(
                (sum, s) => sum + s.credits,
                0,
              );

              return (
                <div
                  key={sem}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleSemester(sem)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#4caf50] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {sem === 0 ? "P" : sem}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-gray-900">
                          {sem === 0
                            ? "Preparatory Semester"
                            : `Semester ${sem}`}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {subjects.length} subjects · {semCredits} credits
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
                            <div className="col-span-1 text-center">
                              Credits
                            </div>
                            <div className="col-span-4">Pre-requisite</div>
                          </div>

                          {subjects.map((subject, idx) => {
                            const isCombo = isComboSubject(subject);
                            const prerequisiteCodes =
                              subjectPrerequisites[subject.subjectId] ?? [];
                            const prerequisiteText = prerequisiteCodes.length
                              ? prerequisiteCodes.join(", ")
                              : "—";

                            return (
                              <div
                                key={subject.subjectCode}
                                onClick={() => {
                                  if (isCombo) {
                                    onNavigateCombo(subject.subjectCode);
                                  } else {
                                    onNavigateSyllabus(subject.subjectCode);
                                  }
                                }}
                                className={`px-5 py-4 transition-colors group cursor-pointer ${
                                  idx < subjects.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                                } ${isCombo ? "hover:bg-blue-50" : "hover:bg-[#4caf50]/5"}`}
                              >
                                <div className="hidden md:grid grid-cols-12 gap-2 items-center">
                                  <div className="col-span-2">
                                    <span className="inline-flex px-3 py-1 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold font-mono">
                                      {subject.subjectCode}
                                    </span>
                                  </div>
                                  <div className="col-span-5 flex items-start gap-2">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                        {subject.subjectName.split("_")[0]}
                                        {isCombo && (
                                          <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                                            Combo
                                          </span>
                                        )}
                                      </p>
                                      {subject.subjectName.includes("_") && (
                                        <p className="text-xs text-gray-400 mt-0.5 max-w-[90%] truncate">
                                          {subject.subjectName.split("_")[1]}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-span-1 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                                      {subject.credits}
                                    </span>
                                  </div>
                                  <div className="col-span-4">
                                    {prerequisiteCodes.length > 0 ? (
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
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex px-3 py-1 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold font-mono">
                                        {subject.subjectCode}
                                      </span>
                                      {isCombo && (
                                        <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                                          Combo
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                      <Clock size={12} />
                                      {subject.credits} credits
                                    </div>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800 mb-0.5">
                                    {subject.subjectName.split("_")[0]}
                                  </p>
                                  {subject.subjectName.includes("_") && (
                                    <p className="text-xs text-gray-400 mb-2 truncate">
                                      {subject.subjectName.split("_")[1]}
                                    </p>
                                  )}
                                  {prerequisiteCodes.length > 0 && (
                                    <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mt-1">
                                      Pre-requisite: {prerequisiteText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
          <Layers size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No subject data</p>
        </div>
      )}
    </motion.div>
  );
}
