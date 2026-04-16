import { useEffect, useMemo, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import curriculumApiRequest from "@/apiRequests/curriculum";
import TableSection from "@/components/table-section";
import { CloPloMappingType, CloType } from "@/schemaValidations/subject.schema";
import { CurriculumPloType } from "@/schemaValidations/curriculum.schema";

type Props = {
  subjectId: string;
};

const unwrapArray = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return [];

  const firstData = (payload as { data?: unknown }).data;
  if (Array.isArray(firstData)) return firstData;

  if (firstData && typeof firstData === "object") {
    const nestedData = (firstData as { content?: unknown; data?: unknown })
      .content;
    if (Array.isArray(nestedData)) return nestedData;

    const nestedData2 = (firstData as { data?: unknown }).data;
    if (Array.isArray(nestedData2)) return nestedData2;
  }

  return [];
};

const unwrapSingle = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;

  const firstData = (payload as { data?: unknown }).data;
  if (!firstData || typeof firstData !== "object") return null;

  return firstData as Record<string, unknown>;
};

export default function ClosTab({ subjectId }: Props) {
  const [clos, setClos] = useState<CloType[]>([]);
  const [plos, setPlos] = useState<CurriculumPloType[]>([]);
  const [mappings, setMappings] = useState<CloPloMappingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMappings = async () => {
      setLoading(true);
      try {
        const [cloRes, mappingRes] = await Promise.all([
          subjectApiRequest.getCloBySubjectId(subjectId),
          subjectApiRequest.getCloPloMappingsBySubjectId(subjectId),
        ]);

        const mappingData = unwrapArray(
          mappingRes?.payload,
        ) as CloPloMappingType[];
        const cloData = unwrapArray(cloRes?.payload) as CloType[];

        const uniquePloIds = Array.from(
          new Set(mappingData.map((mapping) => mapping.ploId)),
        );

        const ploResults = await Promise.all(
          uniquePloIds.map(async (ploId) => {
            try {
              const ploRes = await curriculumApiRequest.getPloDetail(ploId);
              const ploPayload = unwrapSingle(ploRes?.payload);

              if (ploPayload && Array.isArray(ploPayload.content)) {
                return ploPayload.content[0] as CurriculumPloType | undefined;
              }

              return ploPayload as CurriculumPloType | null;
            } catch (error) {
              console.error(`Failed to fetch PLO detail for ${ploId}`, error);
              return null;
            }
          }),
        );

        setMappings(mappingData);
        setClos(cloData);
        setPlos(ploResults.filter(Boolean) as CurriculumPloType[]);
      } catch (error) {
        console.error("Failed to fetch CLO-PLO mappings", error);
        setMappings([]);
        setClos([]);
        setPlos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, [subjectId]);

  const cloById = useMemo(
    () => new Map(clos.map((clo) => [clo.cloId, clo])),
    [clos],
  );

  const ploById = useMemo(
    () => new Map(plos.map((plo) => [plo.ploId, plo])),
    [plos],
  );

  const mappingByCloId = useMemo(() => {
    const grouped = new Map<string, CloPloMappingType[]>();

    mappings.forEach((mapping) => {
      const current = grouped.get(mapping.cloId) || [];
      current.push(mapping);
      grouped.set(mapping.cloId, current);
    });

    return grouped;
  }, [mappings]);

  const allCloIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...clos.map((clo) => clo.cloId),
          ...mappings.map((mapping) => mapping.cloId),
        ]),
      ),
    [clos, mappings],
  );

  return (
    <TableSection title={`CLOs (${allCloIds.length})`}>
      <thead>
        <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="px-6 py-4">CLO Code</th>
          <th className="px-6 py-4 w-220">CLO Description</th>
          <th className="px-6 py-4">PLO Mapping</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {loading && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
              Loading clo...
            </td>
          </tr>
        )}
        {!loading && clos.length === 0 && (
          <tr>
            <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
              No clo found for this syllabus.
            </td>
          </tr>
        )}
        {!loading &&
          allCloIds.map((cloId) => {
            const clo = cloById.get(cloId);
            const mappingRows = mappingByCloId.get(cloId) || [];

            return (
              <tr
                key={cloId}
                className="align-top hover:bg-[#f8fff8] transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  {clo?.cloCode || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {clo?.description || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-700 space-y-2">
                  {mappingRows.length > 0 ? (
                    mappingRows.map((mapping) => {
                      const plo = ploById.get(mapping.ploId);
                      const ploDescription = plo?.description || "N/A";

                      return (
                        <div key={mapping.id} className="space-y-1">
                          <div
                            className="font-semibold text-gray-900 cursor-help"
                            title={ploDescription}
                          >
                            {plo?.ploCode || "N/A"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>
    </TableSection>
  );
}
