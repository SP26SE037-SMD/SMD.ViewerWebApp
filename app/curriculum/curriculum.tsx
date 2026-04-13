"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/search-bar";
import PageHeader from "@/components/page-header";
import {
  ArrowRight,
  BookMarked,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CurriculumContentType } from "@/schemaValidations/curriculum.schema";

export default function CurriculumContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery =
    searchParams.get("search") ||
    searchParams.get("name") ||
    searchParams.get("code") ||
    "";
  const searchByQuery =
    searchParams.get("searchBy") ||
    (searchParams.get("code") ? "code" : "name");
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 12;

  const [curriculums, setCurriculums] = useState<CurriculumContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
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
          10,
          "curriculumCode",
          "asc",
        );
        if (res?.payload?.data) {
          setCurriculums(res.payload.data.content || []);
          setTotalPages(res.payload.data.totalPages || 0);
          setTotalElements(res.payload.data.totalElements || 0);
        } else {
          setCurriculums([]);
        }
      } catch (error) {
        console.error("Failed to fetch curriculums", error);
        setCurriculums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, [searchQuery, searchByQuery, page, size]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
      params.set("searchBy", searchType);
    }
    params.set("page", "0");
    router.push(`/curriculum?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/curriculum?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <PageHeader
        title="Curriculum"
        description="Search Curriculum"
        icon={
          <BookMarked size={22} className="text-[#4caf50]" strokeWidth={1.7} />
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
            router.push(`/curriculum?${params.toString()}`);
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
              className="flex flex-col items-center justify-center py-32 gap-4"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4caf50]" />
              <p className="text-sm text-gray-400 font-medium">
                Loading data...
              </p>
            </motion.div>
          ) : curriculums.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {curriculums.map((curr, i) => (
                <motion.div
                  key={curr.curriculumId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() =>
                    router.push(`/curriculum/${curr.curriculumId}`)
                  }
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-2xl bg-[#4caf50]/10 transition-colors">
                      <BookMarked
                        size={20}
                        className="text-[#4caf50]"
                        strokeWidth={1.7}
                      />
                    </div>
                    <ArrowRight size={18} className="text-[#4caf50]" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {curr.curriculumCode}
                  </p>
                  <h3 className="text-base font-bold text-gray-800 leading-tight mb-4 transition-colors">
                    {curr.curriculumName}
                  </h3>
                  {curr.startYear !== null && curr.startYear !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 transition-colors">
                      <Calendar size={14} />
                      <span>
                        From year{" "}
                        <span className="font-semibold text-gray-700 transition-colors">
                          {curr.startYear}
                        </span>
                      </span>
                    </div>
                  )}
                  {curr.major?.majorName && (
                    <div className="mt-2 text-sm text-gray-500">
                      Major:{" "}
                      <span className="font-semibold text-gray-700">
                        {curr.major.majorName}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 gap-4"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#4caf50]/10 flex items-center justify-center">
                <BookMarked
                  size={40}
                  className="text-[#4caf50]/50"
                  strokeWidth={1}
                />
              </div>
              <p className="text-gray-500 font-medium text-center">
                {searchQuery
                  ? "No matching results found"
                  : "No curriculum data available"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => router.push("/curriculum")}
                  className="text-[#3D7EE8] text-sm font-semibold hover:underline"
                >
                  View all curriculums
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#3D7EE8]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 3 ? i : page - 3 + i;
              if (p >= totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    p === page
                      ? "bg-[#3D7EE8] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#3D7EE8]/40"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#3D7EE8]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
