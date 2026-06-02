import React, { useEffect, useMemo, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import curriculumApiRequest from "@/apiRequests/curriculum";
import TableSection from "@/components/table-section";
import * as Popover from "@radix-ui/react-popover";
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

// HoverPopover: small helper to show Popover on hover/focus for accessibility
function HoverPopover({
  children,
  content,
  maxWidth = "max-w-xs",
}: {
  children: React.ReactElement<any, any>;
  content: React.ReactNode;
  maxWidth?: string;
}) {
  const [open, setOpen] = useState(false);
  let enterTimer: number | undefined;
  let leaveTimer: number | undefined;

  const handleEnter = () => {
    window.clearTimeout(leaveTimer);
    enterTimer = window.setTimeout(() => setOpen(true), 50);
  };

  const handleLeave = () => {
    window.clearTimeout(enterTimer);
    leaveTimer = window.setTimeout(() => setOpen(false), 80);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              onPointerEnter: handleEnter,
              onPointerLeave: handleLeave,
              onFocus: handleEnter,
              onBlur: handleLeave,
            })
          : children}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content sideOffset={8} align="center" asChild>
          <div className={`z-50 ${maxWidth} rounded-xl bg-white border border-gray-100 p-4 shadow-lg text-sm text-gray-700`}>
            {content}
            <Popover.Arrow className="fill-white" />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default function ClosTab({ subjectId }: Props) {
  const [clos, setClos] = useState<CloType[]>([]);
  const [curricula, setCurricula] = useState<
    { curriculumId: string; curriculum: CurriculumDetailType | null }[]
  >([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(
    null,
  );
  const [mappings, setMappings] = useState<CloPloMappingDetailType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [cloRes, curriculaRes] = await Promise.all([
          subjectApiRequest.getCloBySubjectId(subjectId),
          curriculumApiRequest.getCurriculaBySubjectId(subjectId),
        ]);

        const cloData = unwrapArray(cloRes?.payload) as CloType[];
        const curriculumIds = unwrapArray(curriculaRes?.payload).filter(
          (id): id is string => typeof id === "string" && id.length > 0,
        );

        const curriculumDetails = await Promise.all(
          curriculumIds.map(async (curriculumId) => {
            try {
              const res = await curriculumApiRequest.getCurriculumById(curriculumId);
              const curriculum = (res?.payload?.data ?? null) as
                | CurriculumDetailType
                | null;
              return { curriculumId, curriculum };
            } catch {
              return { curriculumId, curriculum: null };
            }
          }),
        );

        const publishedCurricula = curriculumDetails.filter(
          (item): item is { curriculumId: string; curriculum: CurriculumDetailType } =>
            item.curriculum !== null,
        );

        if (!isActive) return;

        setClos(cloData);
        setCurricula(publishedCurricula);

        // auto-select first published curriculum if available
        if (publishedCurricula.length > 0) {
          setSelectedCurriculumId(publishedCurricula[0].curriculumId);
        } else {
          setSelectedCurriculumId(null);
          setMappings([]);
        }
      } catch (error) {
        console.error("Failed to fetch initial CLO/Curricula", error);
        if (!isActive) return;
        setClos([]);
        setCurricula([]);
        setSelectedCurriculumId(null);
        setMappings([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchInitial();

    return () => {
      isActive = false;
    };
  }, [subjectId]);

  useEffect(() => {
    if (!selectedCurriculumId) return;

    let isActive = true;
    const fetchMappingsFor = async () => {
      setLoading(true);
      try {
        const res = await curriculumApiRequest.getCloPloMappingsBySubjectAndCurriculum(
          subjectId,
          selectedCurriculumId,
        );

        const data = unwrapArray(res?.payload) as CloPloMappingDetailType[];
        if (!isActive) return;
        setMappings(data);
      } catch (error) {
        console.error("Failed to fetch mappings for curriculum", error);
        if (!isActive) return;
        setMappings([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchMappingsFor();

    return () => {
      isActive = false;
    };
  }, [selectedCurriculumId, subjectId]);

  const cloById = useMemo(
    () => new Map(clos.map((clo) => [clo.cloId, clo])),
    [clos],
  );

  // BUILD PLO COLUMNS and CLO rows for selected curriculum
  const ploList = useMemo(() => {
    const unique = new Map<string, { ploCode: string; ploDescription?: string }>();
    mappings.forEach((m) => {
      if (!unique.has(m.ploId))
        unique.set(m.ploId, { ploCode: m.ploCode, ploDescription: m.ploDescription });
    });
    return Array.from(unique.entries()).map(([ploId, info]) => ({ ploId, ...info }));
  }, [mappings]);

  const allCloIds = useMemo(
    () => Array.from(new Set([...clos.map((c) => c.cloId), ...mappings.map((m) => m.cloId)])),
    [clos, mappings],
  );

  const mappingSet = useMemo(() => {
    const set = new Set<string>();
    mappings.forEach((m) => set.add(`${m.cloId}::${m.ploId}`));
    return set;
  }, [mappings]);

  const selectedCurriculum = curricula.find((c) => c.curriculumId === selectedCurriculumId) || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Select curriculum:</label>
        <select
          value={selectedCurriculumId ?? ""}
          onChange={(e) => setSelectedCurriculumId(e.target.value || null)}
          className="px-3 py-2 border rounded bg-white"
        >
          <option value="">-- Select curriculum --</option>
          {curricula.map((c) => (
              <option key={c.curriculumId} value={c.curriculumId}>
                {c.curriculum?.curriculumName || c.curriculumId}
              </option>
          ))}
        </select>
      </div>

      {loading && (
        <TableSection title="CLOs">
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="px-6 py-6 text-sm text-gray-500" colSpan={1 + ploList.length}>
                Loading...
              </td>
            </tr>
          </tbody>
        </TableSection>
      )}

      {!loading && !selectedCurriculumId && (
        <div className="text-sm text-gray-500">No curriculum selected.</div>
      )}

      {!loading && selectedCurriculumId && (
        <TableSection title={`CLO-PLO mapping - ${selectedCurriculum?.curriculum?.curriculumName || selectedCurriculumId}`}>
          <thead>
            <tr className="bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4 text-left">CLO \ PLO</th>
              {ploList.map((plo) => (
                <th key={plo.ploId} className="px-6 py-4 text-left">
                  <HoverPopover content={plo.ploDescription || "No description"} maxWidth="max-w-sm">
                    <div className="cursor-help text-sm font-semibold text-gray-700">{plo.ploCode}</div>
                  </HoverPopover>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allCloIds.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-sm text-gray-500" colSpan={1 + ploList.length}>
                  No CLOs found for this subject.
                </td>
              </tr>
            )}

            {allCloIds.map((cloId) => {
              const clo = cloById.get(cloId);
              return (
                <tr key={cloId} className="align-top hover:bg-[#f8fff8] transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    <HoverPopover content={clo?.description || "No description"} maxWidth="max-w-xs">
                      <div>
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 font-medium text-[10px] rounded border border-orange-100 cursor-help">
                          {clo?.cloCode || "N/A"}
                        </span>
                      </div>
                    </HoverPopover>
                  </td>
                  {ploList.map((plo) => {
                    const key = `${cloId}::${plo.ploId}`;
                    const mapped = mappingSet.has(key);
                    return (
                      <td key={plo.ploId} className="px-6 py-4">
                        {mapped ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-md text-emerald-600">
                            ✓
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </TableSection>
      )}
    </div>
  );
}
