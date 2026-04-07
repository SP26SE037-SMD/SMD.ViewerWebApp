import { useEffect, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import { CloPloMappingType } from "@/schemaValidations/subject.schema";

type Props = {
  subjectId: string;
};

export default function LosTab({ subjectId }: Props) {
  const [mappings, setMappings] = useState<CloPloMappingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMappings = async () => {
      setLoading(true);
      try {
        const res =
          await subjectApiRequest.getCloPloMappingsBySubjectId(subjectId);
        setMappings(res?.payload?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch CLO-PLO mappings", error);
        setMappings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, [subjectId]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">
          CLO - PLO Mappings ({mappings.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {loading && (
          <div className="p-6 text-sm text-gray-500">Loading mappings...</div>
        )}
        {!loading && mappings.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            No CLO - PLO mappings found for this subject.
          </div>
        )}
        {!loading &&
          mappings.map((mapping) => (
            <div
              key={mapping.id}
              className="p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:bg-gray-50/30 transition-colors"
            >
              <div className="shrink-0">
                <span className="inline-flex px-3 py-1.5 rounded-xl border border-[#4caf50]/30 bg-white text-[#4caf50] font-bold text-sm min-w-20 justify-center tracking-widest">
                  {mapping.cloName}
                </span>
              </div>
              <div className="flex-1 text-sm text-gray-700 leading-relaxed font-medium space-y-1">
                <p>
                  <span className="font-semibold text-gray-900">PLO:</span>{" "}
                  {mapping.ploName}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Level:</span>{" "}
                  {mapping.contributionLevel}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
