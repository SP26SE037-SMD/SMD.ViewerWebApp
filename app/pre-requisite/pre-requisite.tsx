"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookMarked, Network } from "lucide-react";
import SearchBar from "@/components/search-bar";
import PageHeader from "@/components/page-header";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { CurriculumContentType } from "@/schemaValidations/curriculum.schema";

export default function PreRequisiteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const searchByQuery =
    searchParams.get("searchBy") ||
    (searchParams.get("code") ? "code" : "name");
  const page = Number(searchParams.get("page")) || 0;
  const size = 10;

  const [curriculums, setCurriculums] = useState<CurriculumContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchType, setSearchType] = useState<"name" | "code">(
    searchByQuery === "code" ? "code" : "name",
  );

  useEffect(() => {
    setLocalSearch(searchQuery);
    setSearchType(searchByQuery === "code" ? "code" : "name");
  }, [searchByQuery, searchQuery]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      setLoading(true);
      try {
        const res = await curriculumApiRequest.getCurriculums(
          searchQuery,
          searchByQuery === "code" ? "code" : "name",
          "PUBLISHED",
          page,
          size,
          "curriculumCode",
          "asc",
        );
        setCurriculums(res?.payload?.data?.content || []);
      } catch (error) {
        console.error("Failed to fetch curriculums for prerequisites", error);
        setCurriculums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, [page, searchByQuery, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
      params.set("searchBy", searchType);
    }
    params.set("page", "0");
    router.push(`/pre-requisite?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <PageHeader
        title="Pre-Requisite"
        description="Search pre-requisite of subject"
        icon={
          <Network size={22} className="text-[#4caf50]" strokeWidth={1.7} />
        }
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar
          className="mb-8"
          value={localSearch}
          onValueChange={setLocalSearch}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
          onSubmit={handleSearch}
          onClear={() => {
            setLocalSearch("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("search");
            params.delete("searchBy");
            params.delete("name");
            params.delete("code");
            router.push(`/pre-requisite?${params.toString()}`);
          }}
          namePlaceholder="Enter curriculum name..."
          codePlaceholder="Enter curriculum code..."
          inputWrapperClassName="focus-within:border-[#4caf50]/50 focus-within:ring-2 focus-within:ring-[#4caf50]/20"
          submitButtonClassName="bg-[#4caf50] hover:bg-[#43a047] shadow-xl shadow-[#4caf50]/20"
          activeOptionClassName="bg-[#4caf50]/10 text-[#4caf50]"
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-3"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4caf50]" />
              <p className="text-sm text-gray-400">Loading curriculums...</p>
            </motion.div>
          ) : curriculums.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {curriculums.map((curriculum, index) => (
                <motion.button
                  type="button"
                  key={curriculum.curriculumId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() =>
                    router.push(`/curriculum/${curriculum.curriculumId}/graph`)
                  }
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-[#4caf50]/10">
                      <BookMarked size={20} className="text-[#4caf50]" />
                    </div>
                    <ArrowRight size={18} className="text-[#4caf50]" />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    {curriculum.curriculumCode}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-gray-800">
                    {curriculum.curriculumName}
                  </h3>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-gray-500"
            >
              {searchQuery
                ? `No curriculum found for "${searchQuery}"`
                : "No curriculum data available"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
