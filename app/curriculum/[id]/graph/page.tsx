"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { ArrowLeft, X } from "lucide-react";
import Xarrow, { Xwrapper } from "react-xarrows";
import { motion, AnimatePresence } from "framer-motion";

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
  subjects: Subject[];
};

export default function PrerequisiteGraphPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [curriculum, setCurriculum] = useState<CurriculumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // For Xarrow updates when layout changes
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await curriculumApiRequest.getCurriculumById(id);
        if (res?.payload?.data) {
          setCurriculum(res.payload.data);
        }
      } catch (error) {
        console.error("Failed to fetch curriculum detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4caf50]" />
        <p className="text-sm text-gray-400 font-medium">Đang tải sơ đồ...</p>
      </div>
    );
  }

  if (!curriculum) {
    return null;
  }

  // Group subjects by semester
  const groupedSubjects: Record<number, Subject[]> = {};
  curriculum.subjects?.forEach((s) => {
    if (!groupedSubjects[s.semester]) groupedSubjects[s.semester] = [];
    groupedSubjects[s.semester].push(s);
  });
  
  const sortedSemesters = Object.keys(groupedSubjects)
    .map(Number)
    .sort((a, b) => a - b);

  // Extract all lines
  const lines: { start: string; end: string }[] = [];
  curriculum.subjects?.forEach((s) => {
    if (s.preRequisite) {
      const parts = s.preRequisite.split(",").map((p) => p.trim());
      parts.forEach((p) => {
        if (p) {
          // Verify if the start node exists in our subjects to avoid orphaned arrows
          if (curriculum.subjects.some((sub) => sub.subjectCode === p)) {
             lines.push({ start: p, end: s.subjectCode });
          }
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend] flex flex-col pb-20">
      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 font-[Bricolage_Grotesque] truncate">
                Sơ đồ môn tiên quyết
              </h1>
              <p className="text-xs text-gray-400 truncate">
                {curriculum.curriculumName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="max-w-6xl mx-auto w-full px-4 py-4 sticky top-[72px] z-40 bg-[#f8fafb]/90 backdrop-blur-md">
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[#4caf50]/10 flex items-center justify-center text-[#4caf50]">
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M17 11V3h-2v4H9V3H7v8H5v2h2v8h2v-4h6v4h2v-8h2v-2h-2zm-2 2H9v-4h6v4z"/></svg>
             </div>
             <span className="font-semibold text-gray-700 text-sm">Hiện đường kết nối</span>
           </div>
           
           {/* Custom Toggle Switch */}
           <button 
             onClick={() => setShowLines(!showLines)}
             className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${showLines ? 'bg-[#4caf50]' : 'bg-gray-200'}`}
           >
             <motion.div 
               className="w-4 h-4 bg-white rounded-full shadow-sm"
               animate={{ x: showLines ? 24 : 0 }}
               transition={{ type: "spring", stiffness: 500, damping: 30 }}
             />
           </button>
        </div>
      </div>

      {/* ── Graph Area ── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 relative overflow-x-auto" ref={containerRef}>
        <Xwrapper>
          <div className="space-y-12">
            {sortedSemesters.map((sem) => (
              <div key={sem} className="flex flex-col md:flex-row gap-6">
                {/* Semester Pill */}
                <div className="md:w-24 shrink-0 flex md:block items-center justify-start z-10">
                   <div className="sticky top-40 bg-gray-100 border border-gray-200 text-[#059669] font-bold text-sm px-4 py-2 rounded-full inline-block">
                     HK {sem}
                   </div>
                </div>

                {/* Subjects Grid */}
                <div className="flex-1 flex flex-wrap gap-6 items-start z-10">
                  {groupedSubjects[sem].map((subject) => {
                    const isCore = !subject.subjectName.includes("Anh") && !subject.subjectName.includes("Thể dục") && !subject.subjectName.includes("Quốc phòng");
                    const borderColor = isCore ? "border-[#4caf50]" : "border-gray-200";
                    const badgeBg = isCore ? "bg-[#4caf50]/10 text-[#4caf50]" : "bg-gray-100 text-gray-400";
                    const isCombo = subject.subjectCode.includes("_COM") || subject.subjectName.toLowerCase().includes("combo");
                    
                    return (
                      <div 
                        key={subject.subjectCode} 
                        id={subject.subjectCode}
                        onClick={() => setSelectedSubject(subject)}
                        className={`w-[140px] sm:w-[160px] cursor-pointer hover:shadow-md transition-shadow bg-white rounded-2xl p-4 shadow-sm border-2 ${borderColor} flex flex-col items-start gap-1`}
                      >
                         <div className="flex items-center gap-1.5 flex-wrap w-full">
                           <h3 className="font-bold text-gray-900 text-sm">{subject.subjectCode}</h3>
                           {isCombo && (
                             <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-widest shrink-0">
                               Combo
                             </span>
                           )}
                         </div>
                         <div className="flex-1 w-full mt-1">
                           <p className="text-[11px] text-gray-500 leading-snug mb-2 line-clamp-3">
                             {subject.subjectName}
                           </p>
                         </div>
                         <div className={`mt-auto px-2.5 py-1 text-[10px] font-bold rounded-full ${badgeBg}`}>
                           {subject.noCredit} TC
                         </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Render Lines */}
          {showLines && lines.map((line, i) => (
             <Xarrow
                key={i}
                start={line.start}
                end={line.end}
                color="#cbd5e1" // slate-300
                strokeWidth={2}
                path="grid"
                dashness={{ strokeLen: 4, nonStrokeLen: 4, animation: -1 }}
                showHead={true}
                headSize={4}
                startAnchor="bottom"
                endAnchor="top"
                zIndex={0}
             />
          ))}
        </Xwrapper>
      </div>
      
      {/* ── Subject Detail Modal ── */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl flex flex-col max-h-[90vh]"
            >
              {/* Drag Handle (Mobile) */}
              <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="px-3 py-1 bg-[#4caf50]/10 text-[#4caf50] font-bold text-sm rounded-full shrink-0">
                      {selectedSubject.subjectCode}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                        {selectedSubject.subjectName}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedSubject.noCredit} tín chỉ • Học kỳ {selectedSubject.semester}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Link to Combo detail if it's a Combo */}
                  {(selectedSubject.subjectCode.includes("_COM") || selectedSubject.subjectName.toLowerCase().includes("combo")) && (
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-blue-900 mb-0.5">Đây là môn Combo</h4>
                        <p className="text-xs text-blue-700">Nhấn để xem đầy đủ các môn nằm trong combo này.</p>
                      </div>
                      <button
                        onClick={() => router.push(`/curriculum/${id}/combo/${selectedSubject.subjectCode}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  )}

                  {/* Prerequisites */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Môn tiên quyết</h3>
                    {selectedSubject.preRequisite ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedSubject.preRequisite.split(",").map(p => {
                          const code = p.trim();
                          if (!code) return null;
                          return (
                            <span key={code} className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 font-bold text-xs rounded-lg">
                              {code}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Không có môn tiên quyết</p>
                    )}
                  </div>

                  {/* Dependents */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Môn phụ thuộc vào môn này</h3>
                    {(() => {
                      const dependents = curriculum.subjects.filter(s => 
                        s.preRequisite?.includes(selectedSubject.subjectCode)
                      );
                      if (dependents.length > 0) {
                        return (
                          <div className="flex flex-wrap gap-2">
                            {dependents.map(d => (
                              <span key={d.subjectCode} className="px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 font-bold text-xs rounded-lg">
                                {d.subjectCode}
                              </span>
                            ))}
                          </div>
                        );
                      }
                      return <p className="text-sm text-gray-500 italic">Không có môn phụ thuộc</p>;
                    })()}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="w-full mt-8 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
