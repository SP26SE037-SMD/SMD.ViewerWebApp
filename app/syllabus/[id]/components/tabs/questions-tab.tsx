import { SyllabusDetail } from "@/app/syllabus/[id]/types";
import TableSection from "@/components/syllabus/table-section";

type Props = {
  syllabus: SyllabusDetail;
};

export default function QuestionsTab({ syllabus }: Props) {
  return (
    <TableSection
      title={`Constructive Questions (${syllabus.constructiveQuestions.length})`}
    >
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
              <span className="font-mono text-sm font-bold text-[#4caf50]">
                {cq.name}
              </span>
            </td>
            <td className="px-6 py-4 align-top">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {cq.details}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </TableSection>
  );
}
