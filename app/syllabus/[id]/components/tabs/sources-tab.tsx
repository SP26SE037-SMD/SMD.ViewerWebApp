import { useEffect, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import TableSection from "@/components/syllabus/table-section";
import { SubjectSourceType } from "@/schemaValidations/subject.schema";

type Props = {
  subjectId: string;
};

export default function SourcesTab({ subjectId }: Props) {
  const [sources, setSources] = useState<SubjectSourceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const res = await subjectApiRequest.getSourcesBySubjectId(subjectId);
        setSources(res?.payload?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch sources", error);
        setSources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [subjectId]);

  return (
    <TableSection title={`Source List (${sources.length})`}>
      <thead>
        <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
            Type
          </th>
          <th className="px-6 py-4">Description</th>
          <th className="px-6 py-4">Author</th>
          <th className="px-6 py-4 hidden sm:table-cell">ISBN / Edition</th>
          <th className="px-6 py-4 hidden lg:table-cell">Publisher</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={5}>
              Loading sources...
            </td>
          </tr>
        )}
        {!loading && sources.length === 0 && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={5}>
              No sources found for this subject.
            </td>
          </tr>
        )}
        {!loading &&
          sources.map((source) => (
            <tr
              key={source.sourceId}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell align-top">
                <span className="inline-flex px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg">
                  {source.type || "Unknown"}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug break-all">
                  {source.sourceName || "-"}
                </p>
                <div className="flex gap-2 mt-2 md:hidden">
                  <span className="inline-flex px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase rounded">
                    {source.type || "Unknown"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 align-top">
                <p className="text-sm text-gray-700">{source.author || "-"}</p>
              </td>
              <td className="px-6 py-4 hidden sm:table-cell align-top">
                {source.isbn ? (
                  <p className="text-xs text-gray-500 font-mono mb-1">
                    {source.isbn}
                  </p>
                ) : null}
                {source.publishedYear ? (
                  <p className="text-xs text-gray-500">
                    Published: {source.publishedYear}
                  </p>
                ) : null}
                {!source.isbn && !source.publishedYear && (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="px-6 py-4 hidden lg:table-cell align-top">
                <p className="text-sm text-gray-600">
                  {source.publisher || "-"}
                </p>
              </td>
            </tr>
          ))}
      </tbody>
    </TableSection>
  );
}
