"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookMarked,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Hash,
  Target,
  Layers,
  Info,
  Globe,
  Clock,
  AlertCircle,
  GitMerge,
} from "lucide-react";

type PLO = { ploName: string; ploDescription: string };
type Subject = {
  subjectCode: string;
  subjectName: string;
  semester: number;
  noCredit: number;
  preRequisite: string;
};
type CurriculumDetail = {
  curriculumId: string;
  curriculumCode: string;
  curriculumName: string;
  englishName?: string;
  description: string;
  decisionNo?: string;
  totalCredits: number;
  totalSubjects: number;
  startYear?: number;
  status?: string;
  plos: PLO[];
  subjects: Subject[];
};

const TABS = [
  { key: "general", label: "Chung", icon: Info },
  { key: "plos", label: "PLOs", icon: Globe },
  { key: "subjects", label: "Môn học", icon: Layers },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function CurriculumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [curriculum, setCurriculum] = useState<CurriculumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [descExpanded, setDescExpanded] = useState(false);
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await curriculumApiRequest.getCurriculumById(id);
        if (res?.payload?.data) {
          setCurriculum(res.payload.data);
          const semesters = new Set(
            (res.payload.data.subjects || []).map((s: Subject) => s.semester)
          );
          setExpandedSemesters(semesters as Set<number>);
        }
      } catch (error) {
        console.error("Failed to fetch curriculum detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const toggleSemester = (sem: number) => {
    setExpandedSemesters((prev) => {
      const next = new Set(prev);
      if (next.has(sem)) next.delete(sem);
      else next.add(sem);
      return next;
    });
  };

  // Group subjects by semester
  const groupedSubjects: Record<number, Subject[]> = {};
  if (curriculum?.subjects) {
    curriculum.subjects.forEach((s) => {
      if (!groupedSubjects[s.semester]) groupedSubjects[s.semester] = [];
      groupedSubjects[s.semester].push(s);
    });
  }
  const sortedSemesters = Object.keys(groupedSubjects)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 font-[Lexend]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4caf50]" />
        <p className="text-sm text-gray-400 font-medium">Đang tải chương trình học...</p>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4 font-[Lexend]">
        <BookMarked size={48} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Không tìm thấy chương trình học</p>
        <button
          onClick={() => router.push("/curriculum")}
          className="text-[#4caf50] font-semibold text-sm hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const descriptionPreview = curriculum.description?.slice(0, 300);

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-5">
          {/* Back + Title Row */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
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
            <span className="shrink-0 px-4 py-1.5 rounded-full bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold border border-[#4caf50]/30">
              {curriculum.totalCredits} Tín chỉ
            </span>
          </div>

          {/* ── Tab Bar ── */}
          <div className="flex items-center gap-6 mt-4 relative">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#4caf50]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {/* Active Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4caf50] rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ═══ TAB: Chung (General) ═══ */}
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#4caf50]/10">
                    <BookMarked size={22} className="text-[#4caf50]" strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-semibold">Mã chương trình</p>
                    <p className="text-sm font-bold text-gray-900 font-mono truncate">{curriculum.curriculumCode}</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#4caf50]/10">
                    <Hash size={22} className="text-[#4caf50]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Tổng môn học</p>
                    <p className="text-xl font-bold text-gray-900">{curriculum.totalSubjects}</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#4caf50]/10">
                    <Award size={22} className="text-[#4caf50]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Tổng tín chỉ</p>
                    <p className="text-xl font-bold text-gray-900">{curriculum.totalCredits}</p>
                  </div>
                </div>
                {curriculum.decisionNo && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-3">
                    <div className="p-3 rounded-xl bg-[#4caf50]/10">
                      <FileText size={22} className="text-[#4caf50]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-semibold">Quyết định</p>
                      <p className="text-sm font-bold text-gray-900">{curriculum.decisionNo}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tên đầy đủ</p>
                <h2 className="text-base font-bold text-gray-900 leading-relaxed mb-1">
                  {curriculum.curriculumName}
                </h2>
                {curriculum.englishName && (
                  <p className="text-sm text-gray-500 italic">{curriculum.englishName}</p>
                )}
              </div>

              {/* Description */}
              {curriculum.description && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-[#4caf50]" />
                    <h3 className="text-sm font-bold text-gray-900">Mô tả chương trình</h3>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {descExpanded ? curriculum.description : descriptionPreview + "..."}
                  </div>
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-4 flex items-center gap-2 text-sm font-bold text-[#4caf50] hover:underline transition-colors"
                  >
                    {descExpanded ? (
                      <>Thu gọn <ChevronUp size={16} /></>
                    ) : (
                      <>Xem thêm <ChevronDown size={16} /></>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ TAB: PLOs ═══ */}
          {activeTab === "plos" && (
            <motion.div
              key="plos"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {curriculum.plos && curriculum.plos.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#4caf50]/10 text-[#4caf50]">
                      {curriculum.plos.length} PLOs
                    </span>
                    <p className="text-sm text-gray-400">Chuẩn đầu ra chương trình</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curriculum.plos.map((plo, i) => (
                      <motion.div
                        key={plo.ploName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-10 h-10 rounded-xl bg-[#4caf50]/10 flex items-center justify-center text-sm font-bold text-[#4caf50]">
                            {i + 1}
                          </span>
                          <span className="text-sm font-bold text-[#4caf50]">
                            {plo.ploName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                          {plo.ploDescription}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
                  <Target size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Chưa có dữ liệu PLO</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ TAB: Môn học ═══ */}
          {activeTab === "subjects" && (
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
                      {curriculum.totalSubjects} môn · {curriculum.totalCredits} tín chỉ
                    </span>
                  </div>

                  <div className="space-y-4">
                    {sortedSemesters.map((sem) => {
                      const subjects = groupedSubjects[sem];
                      const isExpanded = expandedSemesters.has(sem);
                      const semCredits = subjects.reduce((sum, s) => sum + s.noCredit, 0);

                      return (
                        <div
                          key={sem}
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                          {/* Semester Header */}
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
                                  {sem === 0 ? "Học kỳ chuẩn bị" : `Học kỳ ${sem}`}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {subjects.length} môn · {semCredits} tín chỉ
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

                          {/* Subject List */}
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
                                  {/* Desktop Table Header */}
                                  <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <div className="col-span-2">Mã môn</div>
                                    <div className="col-span-5">Tên môn học</div>
                                    <div className="col-span-1 text-center">TC</div>
                                    <div className="col-span-4">Tiên quyết</div>
                                  </div>

                                  {/* Subject Cards */}
                                  {subjects.map((subject, idx) => (
                                      <div
                                        key={subject.subjectCode}
                                        onClick={() => {
                                          if (subject.subjectCode.includes("_COM") || subject.subjectName.toLowerCase().includes("combo")) {
                                            router.push(`/curriculum/${id}/combo/${subject.subjectCode}`);
                                          } else {
                                            router.push(`/syllabus/${subject.subjectCode}`);
                                          }
                                        }}
                                        className={`px-5 py-4 transition-colors group cursor-pointer ${
                                          idx < subjects.length - 1 ? "border-b border-gray-100" : ""
                                        } ${(subject.subjectCode.includes("_COM") || subject.subjectName.toLowerCase().includes("combo")) ? "hover:bg-blue-50" : "hover:bg-[#4caf50]/5"}`}
                                      >
                                        {/* Desktop Row */}
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
                                                {(subject.subjectCode.includes("_COM") || subject.subjectName.toLowerCase().includes("combo")) && (
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
                                            {subject.noCredit}
                                          </span>
                                        </div>
                                        <div className="col-span-4">
                                          {subject.preRequisite && subject.preRequisite !== "None" && subject.preRequisite !== "Không" ? (
                                            <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                                              <AlertCircle size={12} />
                                              {subject.preRequisite}
                                            </span>
                                          ) : (
                                            <span className="text-xs text-gray-300 italic">—</span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Mobile Card */}
                                      <div className="md:hidden">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                          <div className="flex items-center gap-2">
                                            <span className="inline-flex px-3 py-1 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold font-mono">
                                              {subject.subjectCode}
                                            </span>
                                            {(subject.subjectCode.includes("_COM") || subject.subjectName.toLowerCase().includes("combo")) && (
                                              <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest shrink-0">
                                                Combo
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <Clock size={12} />
                                            {subject.noCredit} tín chỉ
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
                                        {subject.preRequisite && subject.preRequisite !== "None" && subject.preRequisite !== "Không" && (
                                          <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={12} />
                                            Tiên quyết: {subject.preRequisite}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
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
                  <p className="text-gray-500 font-medium">Chưa có dữ liệu môn học</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom Button: Xem sơ đồ môn học ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white to-transparent z-40 h-24 flex items-end">
        <div className="max-w-6xl mx-auto w-full">
          <button
            onClick={() => router.push(`/curriculum/${id}/graph`)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-base font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <GitMerge size={20} />
            Xem sơ đồ môn học
          </button>
        </div>
      </div>
    </div>
  );
}
