import { SyllabusDetail } from "@/app/syllabus/[id]/types";
import TableSection from "@/components/syllabus/table-section";

type Props = {
  syllabus: SyllabusDetail;
};

export default function SessionsTab({ syllabus }: Props) {
  return (
    <TableSection
      title={`${syllabus.sessions.length} Sessions (45\'/session)`}
      tableClassName="min-w-200"
    >
      <thead>
        <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="px-6 py-4 whitespace-nowrap text-center">No</th>
          <th className="px-6 py-4 w-1/3">Topic</th>
          <th className="px-6 py-4">Learning Type</th>
          <th className="px-6 py-4">CLO</th>
          <th className="px-6 py-4">Student&apos;s Tasks</th>
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
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-orange-50 text-orange-600 font-medium text-[10px] rounded border border-orange-100"
                    >
                      {cl}
                    </span>
                  );
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
    </TableSection>
  );
}
