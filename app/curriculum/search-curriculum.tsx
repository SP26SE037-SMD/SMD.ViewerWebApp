"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import curriculumApiRequest from "@/apiRequests/curriculum";

function SearchContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 0;
    const size = Number(searchParams.get("size")) || 10;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurriculums = async () => {
            setLoading(true);
            try {
                const res = await curriculumApiRequest.getCurriculums(value);
                if (res) {
                    setCurriculums(res.payload?.content || []);
                }
            } catch (error) {
                console.error("Failed to fetch curriculums", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculums();
    }, [searchQuery, page, size]);

    return (
        <div className="min-h-screen bg-[#f0f7ed] p-6 lg:p-12 font-[Lexend]">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] text-olive-heading font-[Bricolage_Grotesque] mb-8">
                    Search Results for "{searchQuery}"
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-primary"></div>
                    </div>
                ) : curriculums.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {curriculums.map((curr) => (
                            <div
                                key={curr.curriculumId}
                                className="bg-white rounded-[20px] p-8 shadow-olive-shadow hover:-translate-y-1 hover:shadow-olive-glow transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-olive-heading">
                                        {curr.curriculumCode}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${curr.status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {curr.status}
                                    </span>
                                </div>
                                <p className="text-olive-body mb-4 font-light">
                                    {curr.curriculumName}
                                </p>
                                <div className="text-sm text-olive-body/80 mt-auto">
                                    <span>Years: </span>
                                    <span className="font-medium">
                                        {curr.startYear || "N/A"} - {curr.endYear || "N/A"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[20px] p-10 text-center shadow-olive-shadow">
                        <p className="text-olive-body text-lg">
                            No curriculums found for "{searchQuery}". Try adjusting your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchCurriculum() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f0f7ed] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-primary"></div></div>}>
            <SearchContent />
        </Suspense>
    );
}
