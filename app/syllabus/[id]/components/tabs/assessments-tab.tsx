import { SyllabusDetail } from "@/app/syllabus/[id]/types";
import SectionCard from "@/components/syllabus/section-card";

type Props = {
  syllabus: SyllabusDetail;
};

export default function AssessmentsTab({ syllabus }: Props) {
  return (
    <SectionCard>
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">
          Assessments ({syllabus.assessments.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {syllabus.assessments.map((ass, idx) => (
          <div
            key={idx}
            className="p-6 md:p-8 hover:bg-gray-50/30 transition-colors flex flex-col md:flex-row gap-6"
          >
            <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-2xl border border-blue-100 md:w-48 text-center gap-2">
              <span className="text-3xl font-black text-blue-600">
                {ass.weight}
              </span>
              <div className="w-8 h-1 bg-blue-200 rounded-full" />
              <span className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                {ass.category}
              </span>
              <span className="text-[10px] font-bold text-blue-500 uppercase px-2 py-0.5 bg-blue-100 rounded">
                Part {ass.part}
              </span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Type & Duration
                </span>
                <p className="text-sm text-gray-800 font-semibold">
                  {ass.type} • {ass.duration}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Completion Criteria
                </span>
                <p className="text-sm text-gray-800 font-semibold">
                  {ass.completionCriteria}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Question Type & Distribution
                </span>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {ass.questionType}
                </p>
                <p className="text-sm text-gray-600 mt-1 italic whitespace-pre-wrap">
                  {ass.noQuestion}
                </p>
              </div>
              <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Grading Guide
                </span>
                <p className="text-sm text-gray-600">{ass.gradingGuide}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
