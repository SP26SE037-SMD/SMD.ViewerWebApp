import { useEffect, useMemo, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import curriculumApiRequest from "@/apiRequests/curriculum";
import TableSection from "@/components/table-section";
import { CloType } from "@/schemaValidations/subject.schema";
import {
  CurriculumDetailType,
  CloPloMappingDetailType,
} from "@/schemaValidations/curriculum.schema";

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

type CurriculumMappingGroup = {
  curriculumId: string;
  curriculum: CurriculumDetailType | null;
  mappings: CloPloMappingDetailType[];
};

const getCurriculumLabel = (
  curriculum: CurriculumDetailType | null,
  curriculumId: string,
) => {
  if (!curriculum) return curriculumId;

  return [curriculum.curriculumCode, curriculum.curriculumName]
    .filter(Boolean)
    .join(" - ");
};

const groupMappingsByCloId = (mappings: CloPloMappingDetailType[]) => {
  const grouped = new Map<string, CloPloMappingDetailType[]>();

  mappings.forEach((mapping) => {
    const current = grouped.get(mapping.cloId) || [];
    current.push(mapping);
    grouped.set(mapping.cloId, current);
  });

  return grouped;
};

export default function ClosTab({ subjectId }: Props) {
  const [clos, setClos] = useState<CloType[]>([]);
  const [curriculumGroups, setCurriculumGroups] = useState<
    CurriculumMappingGroup[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchMappings = async () => {
      setLoading(true);
      try {
        const [cloRes, curriculaRes] = await Promise.all([
          subjectApiRequest.getCloBySubjectId(subjectId),
          curriculumApiRequest.getCurriculaBySubjectId(subjectId),
        ]);

        const cloData = unwrapArray(cloRes?.payload) as CloType[];
        const curriculumIds = unwrapArray(curriculaRes?.payload).filter(
          (curriculumId): curriculumId is string =>
            typeof curriculumId === "string" && curriculumId.length > 0,
        );

        const curriculumResults = await Promise.allSettled(
          curriculumIds.map(async (curriculumId) => {
            const [curriculumRes, mappingRes] = await Promise.all([
              curriculumApiRequest.getCurriculumById(curriculumId),
              curriculumApiRequest.getCloPloMappingsBySubjectAndCurriculum(
                subjectId,
                curriculumId,
              ),
            ]);

            const curriculum =
              (curriculumRes?.payload?.data ?? null) as CurriculumDetailType | null;
            const mappings = unwrapArray(
              mappingRes?.payload,
            ) as CloPloMappingDetailType[];

            return {
              curriculumId,
              curriculum,
              mappings,
            };
          }),
        );

        const groups = curriculumResults
          .map((result) => (result.status === "fulfilled" ? result.value : null))
          .filter(
            (group): group is CurriculumMappingGroup => group !== null,
          );

        if (!isActive) return;

        setClos(cloData);
        setCurriculumGroups(groups);
      } catch (error) {
        console.error("Failed to fetch CLO-PLO mappings", error);
        if (!isActive) return;

        setClos([]);
        setCurriculumGroups([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchMappings();

    return () => {
      isActive = false;
    };
  }, [subjectId]);

  const cloById = useMemo(
    () => new Map(clos.map((clo) => [clo.cloId, clo])),
    [clos],
  );

  const hasAnyCurriculumMappings = curriculumGroups.length > 0;

  return (
    <div className="space-y-6">
      {loading && (
        <TableSection title="CLOs">
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="px-6 py-6 text-sm text-gray-500" colSpan={3}>
                Loading CLO mappings...
              </td>
            </tr>
          </tbody>
        </TableSection>
      )}

      {!loading && !hasAnyCurriculumMappings && (
        <TableSection title="CLOs">
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="px-6 py-6 text-sm text-gray-500" colSpan={3}>
                No curriculum-specific CLO mappings found for this subject.
              </td>
            </tr>
          </tbody>
        </TableSection>
      )}

      {!loading &&
        curriculumGroups.map((group) => {
          const mappingByCloId = groupMappingsByCloId(group.mappings);
          const allCloIds = Array.from(
            new Set([
              ...clos.map((clo) => clo.cloId),
              ...group.mappings.map((mapping) => mapping.cloId),
            ]),
          );
          const curriculumLabel = getCurriculumLabel(
            group.curriculum,
            group.curriculumId,
          );

          return (
            <TableSection
              key={group.curriculumId}
              title={`CLOs (${allCloIds.length}) - ${curriculumLabel}`}
            >
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">CLO Code</th>
                  <th className="px-6 py-4 w-220">CLO Description</th>
                  <th className="px-6 py-4">PLO Mapping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clos.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={3}>
                      No CLO found for this subject.
                    </td>
                  </tr>
                )}

                {clos.length > 0 &&
                  allCloIds.map((cloId) => {
                    const clo = cloById.get(cloId);
                    const mappingRows = mappingByCloId.get(cloId) || [];

                    return (
                      <tr
                        key={cloId}
                        className="align-top hover:bg-[#f8fff8] transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 font-medium text-[10px] rounded border border-orange-100">
                            {clo?.cloCode || "N/A"}
                          </span>{" "}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {clo?.description || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700 space-y-2">
                          {mappingRows.length > 0 ? (
                            mappingRows.map((mapping) => (
                              <div key={mapping.id} className="space-y-1">
                                <div className="font-semibold text-gray-900">
                                  {mapping.ploCode || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {mapping.contributionLevel || "N/A"}
                                  {mapping.ploDescription
                                    ? ` • ${mapping.ploDescription}`
                                    : ""}
                                </div>
                              </div>
                            ))
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
        })}
    </div>
  );
}
