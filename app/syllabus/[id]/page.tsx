"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  Calendar,
  Layers,
  FileText,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SyllabusDetail = {
  syllabusId: string;
  syllabusCode: string;
  syllabusName: string;
  englishName: string;
  noCredit: number;
  degreeLevel: string;
  timeAllocation: string;
  preRequisite: string;
  description: string;
  studentTasks: string;
  tools: string;
  scoringScale: number;
  decisionNo: string;
  isApproved: boolean;
  note: string;
  minAvgMarkToPass: number;
  isActive: boolean;
  approvedDate: string;
  materials: any[];
  learningObjectives: any[];
  sessions: any[];
  constructiveQuestions: any[];
  assessments: any[];
  chapterMaterials?: {
    chapterId: string;
    chapterName: string;
    blocks: {
      id: string;
      type: "H1" | "H2" | "PARAGRAPH" | "ORDERED_LIST" | "BULLET_LIST" | "CODE_BLOCK" | "QUOTE" | "TABLE" | "DIVIDER" | "IMAGE";
      content: string;
    }[];
  }[];
};

const TABS = [
  { id: "general", label: "Chung", icon: FileText },
  { id: "materials", label: "Tài liệu", icon: BookOpen },
  { id: "los", label: "Chuẩn đầu ra (LOs)", icon: Award },
  { id: "sessions", label: "Kế hoạch giảng dạy", icon: Calendar },
  { id: "chapterMaterials", label: "Tài liệu môn học", icon: BookOpen },
  { id: "questions", label: "Câu hỏi xây dựng", icon: HelpCircle },
  { id: "assessments", label: "Đánh giá", icon: FileCheck2 },
];

export default function SyllabusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = decodeURIComponent(resolvedParams.id);

  const [syllabus, setSyllabus] = useState<SyllabusDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/syllabuses/${id}`);
        if (res.ok) {
          const json = await res.json();
          setSyllabus(json.data);
          if (json.data.chapterMaterials && json.data.chapterMaterials.length > 0) {
            setSelectedChapterId(json.data.chapterMaterials[0].chapterId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch syllabus details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4caf50]" />
        <p className="text-sm text-gray-400">Đang tải thông tin đề cương...</p>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
          <AlertCircle size={40} className="text-red-400" strokeWidth={1.5} />
        </div>
        <p className="text-gray-500 font-medium text-center">Không tìm thấy thông tin đề cương môn học</p>
        <button onClick={() => router.back()} className="text-[#4caf50] text-sm font-semibold hover:underline mt-2">
          Quay lại trang trước
        </button>
      </div>
    );
  }

  // Helper to render blocks
  const renderBlock = (block: any) => {
    switch (block.type) {
      case "H1":
        return <h1 key={block.id} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{block.content}</h1>;
      case "H2":
        return <h2 key={block.id} className="text-xl font-bold text-gray-800 mt-6 mb-3">{block.content}</h2>;
      case "PARAGRAPH":
        return <p key={block.id} className="text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">{block.content}</p>;
      case "ORDERED_LIST": {
        let items = [];
        try { items = JSON.parse(block.content); } catch { items = [block.content]; }
        return (
          <ol key={block.id} className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
            {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ol>
        );
      }
      case "BULLET_LIST": {
        let items = [];
        try { items = JSON.parse(block.content); } catch { items = [block.content]; }
        return (
          <ul key={block.id} className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
            {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        );
      }
      case "CODE_BLOCK":
        return (
          <div key={block.id} className="mb-4 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800">
            <div className="flex px-4 py-2 bg-[#2d2d2d] border-b border-gray-700 items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Code</span>
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
            </div>
            <pre className="p-4 text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
              {block.content}
            </pre>
          </div>
        );
      case "QUOTE":
        return (
          <blockquote key={block.id} className="pl-4 border-l-4 border-[#4caf50] mb-4 text-gray-600 italic bg-[#4caf50]/5 py-2 pr-4 rounded-r-lg">
            {block.content}
          </blockquote>
        );
      case "TABLE": {
        let rows = [];
        try { rows = JSON.parse(block.content); } catch { return <p key={block.id} className="text-red-500">Invalid Table Data</p>; }
        if (!rows || rows.length === 0) return null;
        const [headerRow, ...bodyRows] = rows;
        return (
          <div key={block.id} className="overflow-x-auto mb-6 rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {headerRow.map((cell: string, i: number) => (
                    <th key={i} className="px-4 py-3 text-sm font-bold text-gray-700">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {bodyRows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="px-4 py-3 text-sm text-gray-600">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      case "DIVIDER":
        return <hr key={block.id} className="my-8 border-gray-200" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend] pb-24">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 -mt-1 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-800 shrink-0"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex px-2.5 py-1 rounded bg-[#4caf50]/10 text-[#4caf50] text-xs font-bold uppercase tracking-widest shrink-0">
                  {syllabus.syllabusCode}
                </span>

              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {syllabus.syllabusName}
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {syllabus.englishName}
              </p>
            </div>

            <div className="hidden sm:flex flex-col gap-3 shrink-0 ml-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100 min-w-[200px]">
                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                  <Award size={24} className="text-[#4caf50]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Tín chỉ</p>
                  <p className="text-2xl font-black text-gray-900 leading-none">{syllabus.noCredit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Desktop Tabs Navigation ── */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-3 scrollbar-green scroll-smooth">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 ${isActive ? "text-[#4caf50]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  <TabIcon size={18} className={isActive ? "text-[#4caf50]" : "opacity-50"} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="syllabusTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#4caf50] rounded-t-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile Tabs Horizontal Scroll ── */}
      <div className="md:hidden bg-white border-b border-gray-100 sticky top-[138px] z-40 mb-6 shadow-sm shadow-[#4caf50]/5">
        <div className="flex overflow-x-auto no-scrollbar px-2 py-2 snap-x">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap snap-start ${isActive ? "bg-[#4caf50]/10 text-[#4caf50]" : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <TabIcon size={16} className={isActive ? "text-[#4caf50]" : "opacity-70"} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Contents ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >

            {/* ═══ TAB: CHUNG ═══ */}
            {activeTab === "general" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-[#4caf50]" /> Thông tin cơ bản
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Decison No</span>
                        <p className="text-sm text-gray-800 font-medium">{syllabus.decisionNo} (Approved: {syllabus.approvedDate})</p>
                      </div>
                      <hr className="border-gray-50" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Degree Level</span>
                        <p className="text-sm text-gray-800 font-medium">{syllabus.degreeLevel}</p>
                      </div>
                      <hr className="border-gray-50" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Time Allocation</span>
                        <p className="text-sm text-gray-800 font-medium">{syllabus.timeAllocation}</p>
                      </div>
                      <hr className="border-gray-50" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Pre-Requisite</span>
                        {syllabus.preRequisite !== "None" ? (
                          <span className="inline-flex px-2.5 py-1 rounded bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                            {syllabus.preRequisite}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Không có môn tiên quyết</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen size={20} className="text-[#4caf50]" /> Mô tả môn học (Description)
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {syllabus.description}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-[#4caf50]" /> Student Tasks
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {syllabus.studentTasks}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Layers size={20} className="text-[#4caf50]" /> Tools & Software
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {syllabus.tools}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Scoring Scale</h2>
                      <p className="text-2xl font-black text-gray-900">{syllabus.scoringScale}</p>
                    </div>
                    <div className="w-px h-12 bg-gray-100 mx-4" />
                    <div>
                      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Min Passing Mark</h2>
                      <p className="text-2xl font-black text-[#4caf50]">{syllabus.minAvgMarkToPass}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ TAB: MATERIALS ═══ */}
            {activeTab === "materials" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Danh sách Tài liệu ({syllabus.materials.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4 whitespace-nowrap hidden md:table-cell">Type</th>
                        <th className="px-6 py-4">Mô tả tài liệu</th>
                        <th className="px-6 py-4">Tác giả</th>
                        <th className="px-6 py-4 hidden sm:table-cell">ISBN / Editon</th>
                        <th className="px-6 py-4 hidden lg:table-cell">Nhà xuất bản</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {syllabus.materials.map((m, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell align-top">
                            {m.isMainMaterial ? (
                              <span className="inline-flex px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-lg">Main</span>
                            ) : m.isOnline ? (
                              <span className="inline-flex px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg">Online</span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-lg">Reference</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug break-all">
                              {m.description}
                            </p>
                            {/* Mobile tags */}
                            <div className="flex gap-2 mt-2 md:hidden">
                              {m.isMainMaterial && <span className="inline-flex px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold uppercase rounded">Main</span>}
                              {m.isOnline && <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase rounded">Online</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <p className="text-sm text-gray-700">{m.author || "—"}</p>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell align-top">
                            {m.isbn ? <p className="text-xs text-gray-500 font-mono mb-1">{m.isbn}</p> : null}
                            {m.edition ? <p className="text-xs text-gray-500">Edition: {m.edition}</p> : null}
                            {!m.isbn && !m.edition && <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell align-top">
                            <p className="text-sm text-gray-600">{m.publisher || "—"}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ TAB: LOs ═══ */}
            {activeTab === "los" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Learning Objectives ({syllabus.learningObjectives.length})</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {syllabus.learningObjectives.map((lo, idx) => (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-gray-50/30 transition-colors">
                      <div className="shrink-0">
                        <span className="inline-flex px-3 py-1.5 rounded-xl border border-[#4caf50]/30 bg-white text-[#4caf50] font-bold text-sm min-w-[80px] justify-center tracking-widest">
                          {lo.name}
                        </span>
                      </div>
                      <div className="flex-1 text-sm text-gray-700 leading-relaxed font-medium">
                        {lo.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ TAB: SESSIONS ═══ */}
            {activeTab === "sessions" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">{syllabus.sessions.length} Sessions (45'/session)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4 whitespace-nowrap text-center">No</th>
                        <th className="px-6 py-4 w-1/3">Topic</th>
                        <th className="px-6 py-4">Learning Type</th>
                        <th className="px-6 py-4">CLO</th>
                        <th className="px-6 py-4">Student's Tasks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {syllabus.sessions.map((s, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4 text-center align-top">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mx-auto">
                              {s.sessionNo}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {s.topic}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="inline-flex px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-[10px] uppercase rounded-lg">
                              {s.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-wrap gap-1">
                              {s.lo.split(",").map((l: string, i: number) => {
                                const cl = l.trim();
                                if (!cl) return null;
                                return (
                                  <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-600 font-medium text-[10px] rounded border border-orange-100">
                                    {cl}
                                  </span>
                                )
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {s.studentTasks}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ TAB: CHAPTER MATERIALS ═══ */}
            {activeTab === "chapterMaterials" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="text-[#4caf50]" size={24} />
                  Danh sách Bài giảng
                </h3>
                {syllabus.chapterMaterials && syllabus.chapterMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {syllabus.chapterMaterials.map((chap) => (
                      <div
                        key={chap.chapterId}
                        onClick={() => router.push(`/syllabus/${id}/chapter/${chap.chapterId}`)}
                        className="p-5 rounded-2xl border-2 border-gray-100 hover:border-[#4caf50]/50 hover:shadow-lg hover:bg-[#4caf50]/5 transition-all cursor-pointer group flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#4caf50] group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                            {chap.blocks.length} blocks
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 leading-snug line-clamp-2 mt-2">
                          {chap.chapterName}
                        </h4>
                        <p className="text-sm text-[#4caf50] font-medium mt-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem tài liệu <ArrowLeft size={14} className="rotate-180" />
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <BookOpen size={48} className="opacity-20 mb-2" />
                    <p className="font-medium">Chưa có tài liệu bài giảng nào được tải lên.</p>
                  </div>
                )}
              </div>
            )}

            {/* ═══ TAB: QUESTIONS ═══ */}
            {activeTab === "questions" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Constructive Questions ({syllabus.constructiveQuestions.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4 whitespace-nowrap text-center">Session</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4 w-3/4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {syllabus.constructiveQuestions.map((cq, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-center align-top">
                            <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg">
                              Ses {cq.sessionNo}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top whitespace-nowrap">
                            <span className="font-mono text-sm font-bold text-[#4caf50]">{cq.name}</span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{cq.details}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ TAB: ASSESSMENTS ═══ */}
            {activeTab === "assessments" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Assessments ({syllabus.assessments.length})</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {syllabus.assessments.map((ass, idx) => (
                    <div key={idx} className="p-6 md:p-8 hover:bg-gray-50/30 transition-colors flex flex-col md:flex-row gap-6">
                      <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100 md:w-48 text-center gap-2">
                        <span className="text-3xl font-black text-blue-600">{ass.weight}</span>
                        <div className="w-8 h-1 bg-blue-200 rounded-full" />
                        <span className="text-sm font-bold text-blue-800 uppercase tracking-widest">{ass.category}</span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-100 rounded">Part {ass.part}</span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Type & Duration</span>
                          <p className="text-sm text-gray-800 font-semibold">{ass.type} • {ass.duration}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Completion Criteria</span>
                          <p className="text-sm text-gray-800 font-semibold">{ass.completionCriteria}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Question Type & Distribution</span>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{ass.questionType}</p>
                          <p className="text-sm text-gray-600 mt-1 italic whitespace-pre-wrap">{ass.noQuestion}</p>
                        </div>
                        <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Grading Guide</span>
                          <p className="text-sm text-gray-600">{ass.gradingGuide}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
