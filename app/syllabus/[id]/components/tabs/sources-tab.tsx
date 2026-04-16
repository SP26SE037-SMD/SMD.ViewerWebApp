import { useEffect, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import TableSection from "@/components/table-section";
import { SubjectSourceType } from "@/schemaValidations/subject.schema";
import { ExternalLink } from "lucide-react";

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
          <th className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
            Type
          </th>
          <th className="px-6 py-4">Description</th>
          <th className="px-6 py-4 hidden md:table-cell">Author</th>
          <th className="px-6 py-4 hidden lg:table-cell">Edition/ISBN</th>
          <th className="px-6 py-4 hidden lg:table-cell">Publisher</th>
          <th className="px-6 py-4 hidden md:table-cell">URL</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
              Loading sources...
            </td>
          </tr>
        )}
        {!loading && sources.length === 0 && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
              No sources found for this subject.
            </td>
          </tr>
        )}
        {!loading &&
          sources.map((source) => (
            <tr
              key={source.sourceId}
              className="hover:bg-[#f8fff8] transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap align-top hidden sm:table-cell">
                <span className="inline-flex px-2.5 py-1 bg-[#eaf7e8] text-[#3d6b2c] text-[10px] font-bold uppercase rounded-lg border border-[#3d6b2c]/20">
                  {source.type || "-"}
                </span>
              </td>
              <td className="px-6 py-4 align-top">
                <p className="text-sm font-semibold text-gray-900 leading-snug wrap-break-word">
                  {source.sourceName || "-"}
                </p>
                <div className="mt-2 sm:hidden">
                  <span className="inline-flex px-2.5 py-1 bg-[#eaf7e8] text-[#3d6b2c] text-[10px] font-bold uppercase rounded-lg border border-[#3d6b2c]/20">
                    {source.type || "N/A"}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-500 md:hidden">
                  <p className="wrap-break-word">
                    Author: {source.author || "-"}
                  </p>
                  <p className="wrap-break-word">
                    Publisher: {source.publisher || "-"}
                  </p>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={source.url}
                      className="inline-flex items-center gap-1.5 text-[#2f7dff] hover:text-[#1f5ed1] underline underline-offset-2 break-all"
                    >
                      <span className="line-clamp-2">{source.url}</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  ) : (
                    <p>URL: -</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 align-top hidden md:table-cell">
                <p className="text-sm text-gray-700 wrap-break-word">
                  {source.author || "-"}
                </p>
              </td>
              <td className="px-6 py-4 align-top hidden lg:table-cell">
                {source.publishedYear ? (
                  <p className="text-xs text-gray-500 mb-1">
                    Published: {source.publishedYear}
                  </p>
                ) : null}
                {source.isbn ? (
                  <p className="text-xs text-gray-500 font-mono break-all">
                    {source.isbn}
                  </p>
                ) : null}
                {!source.isbn && !source.publishedYear && (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="px-6 py-4 align-top hidden lg:table-cell">
                <p className="text-sm text-gray-600 wrap-break-word">
                  {source.publisher || "-"}
                </p>
              </td>
              <td className="px-6 py-4 align-top hidden md:table-cell">
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={source.url}
                    className="inline-flex items-center gap-1.5 text-sm text-[#2f7dff] hover:text-[#1f5ed1] underline underline-offset-2 break-all"
                  >
                    <span className="line-clamp-2">{source.url || "-"}</span>
                  </a>
                )}
                {!source.url && <span className="text-gray-300">-</span>}
              </td>
            </tr>
          ))}
      </tbody>
    </TableSection>
  );
}
