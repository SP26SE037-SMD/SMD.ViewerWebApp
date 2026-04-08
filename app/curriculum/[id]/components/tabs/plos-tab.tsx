import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { CurriculumPloType } from "@/schemaValidations/curriculum.schema";

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

  if (loading) {
    return (
      <motion.div
        key="plos"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
          <p className="text-gray-500 font-medium">Loading PLO data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="plos"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      {plos && plos.length > 0 ? (
        <>
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#4caf50]/10 text-[#4caf50]">
              {plos.length} PLOs
            </span>
            <p className="text-sm text-gray-400">Program Learning Outcomes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plos.map((plo, i) => (
              <motion.div
                key={plo.ploId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-[#4caf50]/10 flex items-center justify-center text-sm font-bold text-[#4caf50]">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-[#4caf50]">
                    {plo.ploCode}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                  {plo.description}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
          <Target size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No PLO data</p>
        </div>
      )}
    </motion.div>
  );
}
