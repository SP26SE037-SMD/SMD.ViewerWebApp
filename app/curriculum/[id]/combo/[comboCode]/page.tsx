"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Layers } from "lucide-react";

export default function ComboDetailPage({
  params,
}: {
  params: Promise<{ id: string; comboCode: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const curriculumId = resolvedParams.id;
  const comboCode = decodeURIComponent(resolvedParams.comboCode);

  // MOCK DATA for combo subjects (since there's no combo API yet)
  const mockSubjects = [
    { subjectCode: `${comboCode}_1`, subjectName: `Môn nền tảng của ${comboCode}`, noCredit: 3, semester: 5 },
    { subjectCode: `${comboCode}_2`, subjectName: `Môn cốt lõi nhóm ${comboCode}`, noCredit: 3, semester: 6 },
    { subjectCode: `${comboCode}_3`, subjectName: `Đồ án chuyên sâu ${comboCode}`, noCredit: 3, semester: 7 },
  ];

  const totalCredits = mockSubjects.reduce((sum, s) => sum + s.noCredit, 0);

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend] pb-24">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest shrink-0">
                  Combo
                </span>
                <span className="text-sm font-bold text-gray-500">
                  {comboCode}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Kho môn học Combo
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Combo Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Thông tin chi tiết
            </h2>
            <p className="text-gray-900 font-medium">
              Bạn đang xem danh sách các môn học thuộc {comboCode} của chương trình đào tạo hiện tại. 
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0 mt-4 sm:mt-0">
            <div className="bg-[#4caf50]/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px]">
              <BookOpen size={24} className="text-[#4caf50] mb-2" />
              <div className="text-2xl font-black text-[#4caf50] leading-none mb-1">
                {mockSubjects.length}
              </div>
              <div className="text-[10px] font-bold text-[#4caf50] uppercase tracking-wider">
                Môn học
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px]">
              <Layers size={24} className="text-blue-500 mb-2" />
              <div className="text-2xl font-black text-blue-500 leading-none mb-1">
                {totalCredits}
              </div>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                Tín chỉ
              </div>
            </div>
          </div>
        </div>

        {/* Subjects List */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
           {/* Desktop Table Header */}
           <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
             <div className="col-span-3">Mã môn</div>
             <div className="col-span-6">Tên môn học</div>
             <div className="col-span-2 text-center">Học kỳ</div>
             <div className="col-span-1 text-center">TC</div>
           </div>
           
           <div className="divide-y divide-gray-100">
             {mockSubjects.map((subject) => (
               <div key={subject.subjectCode} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                 
                 {/* Desktop Row */}
                 <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                   <div className="col-span-3">
                     <span className="inline-flex px-3 py-1.5 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-sm font-bold font-mono">
                       {subject.subjectCode}
                     </span>
                   </div>
                   <div className="col-span-6">
                     <p className="text-base font-semibold text-gray-900">
                       {subject.subjectName}
                     </p>
                   </div>
                   <div className="col-span-2 flex justify-center">
                     <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                       HK {subject.semester}
                     </span>
                   </div>
                   <div className="col-span-1 flex justify-center text-sm font-bold text-gray-700">
                     {subject.noCredit}
                   </div>
                 </div>

                 {/* Mobile Row */}
                 <div className="md:hidden flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <span className="inline-flex px-3 py-1 rounded-lg bg-[#4caf50]/10 text-[#4caf50] text-sm font-bold font-mono">
                       {subject.subjectCode}
                     </span>
                     <div className="flex gap-2">
                       <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg items-center uppercase">
                         HK {subject.semester}
                       </span>
                       <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg items-center">
                         <Clock size={10} className="mr-1" />
                         {subject.noCredit} TC
                       </span>
                     </div>
                   </div>
                   <p className="text-base font-semibold text-gray-900 mt-1">
                     {subject.subjectName}
                   </p>
                 </div>

               </div>
             ))}
           </div>
        </div>
      </main>
      
    </div>
  );
}
