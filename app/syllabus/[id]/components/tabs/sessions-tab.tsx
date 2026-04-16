import { useEffect, useState } from "react";
import syllabusApiRequest from "@/apiRequests/syllabus";
import {
  CloSessionMappingType,
  SyllabusSessionType,
} from "@/schemaValidations/syllabus.schema";
import TableSection from "@/components/table-section";

type Props = {
  syllabusId: string;
};

export default function SessionsTab({ syllabusId }: Props) {
  const [sessions, setSessions] = useState<SyllabusSessionType[]>([]);
  const [sessionCloMappings, setSessionCloMappings] = useState<
    Record<string, CloSessionMappingType[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res =
          await syllabusApiRequest.getSessionsBySyllabusId(syllabusId);
        const sessionData = res?.payload?.data ?? [];
        setSessions(sessionData);

        const cloMappingResults = await Promise.all(
          sessionData.map(async (session) => {
            try {
              const cloRes =
                await syllabusApiRequest.getCloSessionMappingsBySessionId(
                  session.sessionId,
                );
              return [session.sessionId, cloRes?.payload?.data ?? []] as const;
            } catch {
              return [session.sessionId, []] as const;
            }
          }),
        );

        setSessionCloMappings(Object.fromEntries(cloMappingResults));
      } catch (error) {
        console.error("Failed to fetch sessions", error);
        setSessions([]);
        setSessionCloMappings({});
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [syllabusId]);

  return (
    <TableSection
      title={`Sessions (${sessions.length})`}
      tableClassName="min-w-200"
    >
      <thead>
        <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="px-6 py-4 whitespace-nowrap text-center">No</th>
          <th className="px-6 py-4 w-1/4">Topic</th>
          <th className="px-6 py-4">Teaching Methods</th>
          <th className="px-6 py-4">CLO</th>
          <th className="px-6 py-4">Content</th>
          <th className="px-6 py-4">Duration</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
              Loading sessions...
            </td>
          </tr>
        )}
        {!loading && sessions.length === 0 && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
              No sessions found for this syllabus.
            </td>
          </tr>
        )}
        {!loading &&
          sessions.map((s) => (
            <tr
              key={s.sessionId}
              className="hover:bg-[#f8fff8] transition-colors group"
            >
              <td className="px-6 py-4 text-center align-top">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mx-auto">
                  {s.sessionNumber}
                </span>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {s.sessionTitle}
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {s.teachingMethods || "-"}
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="flex flex-wrap gap-1.5">
                  {(sessionCloMappings[s.sessionId] ?? []).length > 0 ? (
                    (sessionCloMappings[s.sessionId] ?? []).map((mapping) => (
                      <span
                        key={mapping.id}
                        title={mapping.cloName}
                        className="px-2 py-0.5 bg-orange-50 text-orange-600 font-medium text-[10px] rounded border border-orange-100"
                      >
                        {mapping.cloCode}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {s.content || "-"}
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <span className="inline-flex px-2.5 py-1 bg-[#eaf7e8] text-[#3d6b2c] font-bold text-[10px] uppercase rounded-lg border border-[#3d6b2c]/20">
                  {s.duration ?? 0} min
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </TableSection>
  );
}
