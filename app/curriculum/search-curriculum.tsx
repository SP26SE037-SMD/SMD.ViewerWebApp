"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  BookMarked,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { CurriculumContentType } from "@/schemaValidations/curriculum.schema";

function SearchContent() {
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 group transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-2xl bg-[#4caf50]/10">
              <BookMarked
                size={22}
                className="text-[#4caf50]"
                strokeWidth={1.7}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Curriculum
              </p>
              <h1 className="text-2xl font-bold text-gray-900 font-[Bricolage_Grotesque]">
                Curriculum
              </h1>
            </div>
          </div>
          {totalElements > 0 && (
            <p className="text-sm text-gray-500 mt-2 ml-14">
              {searchQuery ? `Search results — ` : ""}
              <span className="font-semibold text-gray-700">
                {totalElements}
              </span>{" "}
              curriculums
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center bg-white rounded-3xl border border-gray-200 focus-within:border-[#4caf50]/50 focus-within:ring-2 focus-within:ring-[#4caf50]/20 shadow-sm transition-all p-1.5 min-w-0">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold text-gray-700 transition-all min-w-20 justify-between"
                >
                  {searchType === "name" ? "Name" : "Code"}
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 5, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 z-50 mt-1 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSearchType("name");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${searchType === "name" ? "bg-[#4caf50]/10 text-[#4caf50]" : "hover:bg-gray-50 text-gray-600"}`}
                      >
                        Name
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchType("code");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${searchType === "code" ? "bg-[#4caf50]/10 text-[#4caf50]" : "hover:bg-gray-50 text-gray-600"}`}
                      >
                        Code
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 flex items-center px-4 gap-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={
                    searchType === "name"
                      ? "Enter curriculum name..."
                      : "Enter curriculum code..."
                  }
                  className="flex-1 text-sm outline-none text-gray-800 bg-transparent placeholder-gray-400"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch("");
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.delete("search");
                      params.delete("searchBy");
                      params.delete("name");
                      params.delete("code");
                      router.push(`/curriculum?${params.toString()}`);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="px-10 py-4 bg-[#4caf50] hover:bg-[#43a047] text-white text-sm font-bold rounded-3xl shadow-xl shadow-[#4caf50]/20 transition-all active:scale-95 shrink-0"
            >
              Search
            </button>
          </div>
        </form>

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

export default function SearchCurriculum() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3D7EE8]" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
