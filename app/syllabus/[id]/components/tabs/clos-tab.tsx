import { useEffect, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import { CloPloMappingType } from "@/schemaValidations/subject.schema";
import { CloType } from "@/schemaValidations/subject.schema";
type Props = {
  subjectId: string;
};

export default function ClosTab({ subjectId }: Props) {
  const [clos, setClos] = useState<CloType[]>([]);
  const [mappings, setMappings] = useState<CloPloMappingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMappings = async () => {
      setLoading(true);
      try {
        const cloRes = await subjectApiRequest.getCloBySubjectId(subjectId);
        const mappingRes =
          await subjectApiRequest.getCloPloMappingsBySubjectId(subjectId);

        const unwrapArray = (payload: unknown) => {
          if (!payload || typeof payload !== "object") return [];

          const firstData = (payload as { data?: unknown }).data;
          if (Array.isArray(firstData)) return firstData;

          if (firstData && typeof firstData === "object") {
            const nestedData = (firstData as { data?: unknown }).data;
            if (Array.isArray(nestedData)) return nestedData;
          }

          return [];
        };

        const mappingData = unwrapArray(
          mappingRes?.payload,
        ) as CloPloMappingType[];
        const cloData = unwrapArray(cloRes?.payload) as CloType[];

        setMappings(mappingData);
        setClos(cloData);
      } catch (error) {
        console.error("Failed to fetch CLO-PLO mappings", error);
        setMappings([]);
        setClos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, [subjectId]);

  const cloById = new Map(clos.map((clo) => [clo.cloId, clo]));
  const uniqueMappingsByCloId = Array.from(
    new Map(mappings.map((mapping) => [mapping.cloId, mapping])).values(),
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">
          {/* CLO - PLO Mappings ({uniqueMappingsByCloId.length}) */}
          CLO - PLO Mappings
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {loading && (
          <div className="p-6 text-sm text-gray-500">Loading mappings...</div>
        )}
        {!loading && clos.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            No CLOs available for this subject.
          </div>
        )}
        {!loading && clos.length > 0 && uniqueMappingsByCloId.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            No CLO - PLO mappings found for this subject.
          </div>
        )}
        {!loading &&
          clos.length > 0 &&
          uniqueMappingsByCloId.map((mapping) => (
            <div
              key={mapping.cloId}
              className="p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-gray-50/30 transition-colors"
            >
              <div className="shrink-0">
                <span className="inline-flex px-3 py-1.5 rounded-xl border border-[#4caf50]/30 bg-white text-[#4caf50] font-bold text-sm min-w-20 justify-center tracking-widest">
                  {mapping.cloName}
                </span>
                <span className="inline-flex px-3 py-1.5 rounded-xl border border-[#4caf50]/30 bg-white text-[#4caf50] font-bold text-sm min-w-20 justify-center tracking-widest">
                  {cloById.get(mapping.cloId)?.description ||
                    "No description available"}
                </span>
              </div>
              <div className="flex-1 text-sm text-gray-700 leading-relaxed font-medium space-y-1">
                <p>
                  <span className="font-semibold text-gray-900">PLO:</span>{" "}
                  {mapping.ploName}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
