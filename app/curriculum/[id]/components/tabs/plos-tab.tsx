import { useEffect, useState } from "react";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { CurriculumPloType } from "@/schemaValidations/curriculum.schema";
import TableSection from "@/components/table-section";

type Props = {
  curriculumId: string;
};

export default function PlosTab({ curriculumId }: Props) {
  const [plos, setPlos] = useState<CurriculumPloType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlos = async () => {
      if (!curriculumId) {
        setPlos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allPlos: CurriculumPloType[] = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
          const res = await curriculumApiRequest.getPlosByCurriculumId(
            curriculumId,
            page,
            10,
          );
          const data = res?.payload?.data;

          if (data?.content?.length) {
            allPlos.push(...data.content);
          }

          totalPages = data?.totalPages ?? 0;
          if (totalPages === 0) break;
          page += 1;
        }

        setPlos(allPlos);
      } catch (error) {
        console.error("Failed to fetch curriculum PLOs", error);
        setPlos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlos();
  }, [curriculumId]);

  return (
    <TableSection title={`${plos.length} PLOs`} tableClassName="min-w-200">
      <thead>
        <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="px-6 py-4 whitespace-nowrap text-center">No</th>
          <th className="px-6 py-4 w-48">PLO Code</th>
          <th className="px-6 py-4">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={3}>
              Loading PLO data...
            </td>
          </tr>
        )}
        {!loading && plos.length === 0 && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={3}>
              No PLO found for this syllabus.
            </td>
          </tr>
        )}
        {!loading &&
          plos.map((plo, i) => (
            <tr
              key={plo.ploId}
              className="hover:bg-gray-50/50 transition-colors group"
            >
              <td className="px-6 py-4 text-center align-top">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mx-auto">
                  {i + 1}
                </span>
              </td>
              <td className="px-6 py-4 align-top">
                <span className="inline-flex px-2.5 py-1 bg-[#eaf7e8] text-[#3d6b2c] font-bold text-[10px] uppercase rounded-lg border border-[#3d6b2c]/20">
                  {plo.ploCode}
                </span>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {plo.description || "-"}
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </TableSection>
  );
}
