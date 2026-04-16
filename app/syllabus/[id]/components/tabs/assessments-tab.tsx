import { useEffect, useState } from "react";
import syllabusApiRequest from "@/apiRequests/syllabus";
import TableSection from "@/components/table-section";
import {
  SyllabusAssessmentType,
  CloAssessmentMappingType,
} from "@/schemaValidations/syllabus.schema";

type Props = {
  syllabusId: string;
};

export default function AssessmentsTab({ syllabusId }: Props) {
  const [assessments, setAssessments] = useState<SyllabusAssessmentType[]>([]);
  const [cloMappings, setCloMappings] = useState<
    Record<string, CloAssessmentMappingType[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const res =
          await syllabusApiRequest.getAssessmentsBySyllabusId(syllabusId);
        const assessmentsList = res?.payload?.data ?? [];
        setAssessments(assessmentsList);

        // Fetch CLO mappings for all assessments in parallel
        const mappingsMap: Record<string, CloAssessmentMappingType[]> = {};
        const promises = assessmentsList.map((ass) =>
          syllabusApiRequest
            .getCloAssessmentMappingsByAssessmentId(ass.assessmentId)
            .then((res) => {
              mappingsMap[ass.assessmentId] = res?.payload?.data ?? [];
            })
            .catch(() => {
              mappingsMap[ass.assessmentId] = [];
            }),
        );

        await Promise.all(promises);
        setCloMappings(mappingsMap);
      } catch (error) {
        console.error("Failed to fetch assessments", error);
        setAssessments([]);
        setCloMappings({});
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [syllabusId]);

  return (
    <TableSection title={`Assessments (${assessments.length})`}>
      <thead>
        <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="px-4 py-4">Category</th>
          <th className="px-4 py-4">Type</th>
          <th className="px-4 py-4">Part</th>
          <th className="px-4 py-4">Weight</th>
          <th className="px-4 py-4">Completion Criteria</th>
          <th className="px-4 py-4">Duration</th>
          <th className="px-4 py-4">CLO</th>
          <th className="px-4 py-4">Question Type</th>
          <th className="px-4 py-4">Knowledge Skill</th>
          <th className="px-4 py-4">Grading Guide</th>
          <th className="px-4 py-4">Note</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading && (
          <tr>
            <td className="px-4 py-6 text-sm text-gray-500" colSpan={11}>
              Loading assessments...
            </td>
          </tr>
        )}
        {!loading && assessments.length === 0 && (
          <tr>
            <td className="px-4 py-6 text-sm text-gray-500" colSpan={11}>
              No assessments found for this syllabus.
            </td>
          </tr>
        )}
        {!loading &&
          assessments.map((ass) => {
            const cloCodes = (cloMappings[ass.assessmentId] ?? [])
              .map((mapping) => mapping.cloCode)
              .join(", ");

            return (
              <tr
                key={ass.assessmentId}
                className="align-top hover:bg-[#f8fff8] transition-colors"
              >
                <td className="px-4 py-4 text-sm text-gray-800">
                  {ass.categoryName || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {ass.typeName || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {ass.part ?? "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800 font-semibold">
                  {ass.weight ?? "-"}%
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {ass.completionCriteria || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  <span className="inline-flex px-2.5 py-1 bg-[#eaf7e8] text-[#3d6b2c] font-bold text-[10px] uppercase rounded-lg border border-[#3d6b2c]/20">
                    {ass.duration ?? 0} min
                  </span>{" "}
                </td>
                <td
                  className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate"
                  title={cloCodes || "N/A"}
                >
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 font-medium text-[10px] rounded border border-orange-100">
                    {cloCodes || "N/A"}
                  </span>
                </td>
                <td
                  className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate"
                  title={ass.questionType || "-"}
                >
                  {ass.questionType || "-"}
                </td>
                <td
                  className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate"
                  title={(ass as any).knowledgeSkill || "-"}
                >
                  {(ass as any).knowledgeSkill || "-"}
                </td>
                <td
                  className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate"
                  title={ass.gradingGuide || "-"}
                >
                  {ass.gradingGuide || "-"}
                </td>
                <td
                  className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate"
                  title={(ass as any).note || "-"}
                >
                  {(ass as any).note || "-"}
                </td>
              </tr>
            );
          })}
      </tbody>
    </TableSection>
  );
}
