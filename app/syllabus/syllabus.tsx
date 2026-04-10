"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import subjectApiRequest from "@/apiRequests/subject";
import { SubjectContentType } from "@/schemaValidations/subject.schema";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/search-bar";
import PageHeader from "@/components/page-header";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function SyllabusContent() {
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

  const [subjects, setSubjects] = useState<SubjectContentType[]>([]);
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
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await subjectApiRequest.getSubjects({
          search: localSearch.trim() || undefined,
          searchBy: searchType,
          status: "COMPLETED",
          page,
          size,
          sortBy: "approvedDate",
          direction: "asc",
        });
        if (res?.payload?.data) {
          setSubjects(res.payload.data.content || []);
          setTotalPages(res.payload.data.totalPages || 0);
          setTotalElements(res.payload.data.totalElements || 0);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch subjects", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [localSearch, searchType, page, size]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
      params.set("searchBy", searchType);
    }
    params.set("page", "0");
    router.push(`/syllabus?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/syllabus?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <PageHeader
        title="Syllabus"
        description="Search syllabus of subject"
        icon={
          <BookOpen size={22} className="text-[#4caf50]" strokeWidth={1.7} />
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ── Search bar ── */}
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
            router.push(`/syllabus?${params.toString()}`);
          }}
          namePlaceholder="Enter subject name..."
          codePlaceholder="Enter subject code..."
          inputWrapperClassName="border-2 border-gray-100 focus-within:border-[#4caf50]/50"
          submitButtonClassName="bg-[#4caf50] hover:bg-[#388e3c] shadow-xl shadow-[#4caf50]/20"
          activeOptionClassName="bg-[#EBF5E4] text-[#4caf50]"
        />

        {/* ── Subject Content ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-4"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6AB04C]" />
              <p className="text-sm text-gray-400 font-medium">
                Loading data...
              </p>
            </motion.div>
          ) : subjects.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {subjects.map((subject, i) => {
                return (
                  <motion.div
                    key={subject.subjectId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() =>
                      router.push(`/syllabus/${subject.subjectId}`)
                    }
                    className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-2xl bg-[#4caf50]/10 transition-colors">
                        <BookOpen
                          size={20}
                          className="text-[#4caf50]"
                          strokeWidth={1.7}
                        />
                      </div>
                      <ArrowRight size={18} className="text-[#4caf50]" />
                    </div>

                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {subject.subjectCode}
                    </p>
                    <h3 className="text-base font-bold text-gray-800 leading-tight mb-4">
                      {subject.subjectName}
                    </h3>

                    {subject.approvedDate && (
                      <p className="text-xs text-gray-500 mb-3">
                        Approved: {subject.approvedDate}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {subject.department?.departmentName && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <FileText size={14} />
                          <span>{subject.department.departmentName}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 gap-4"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#EBF5E4] flex items-center justify-center">
                <BookOpen
                  size={40}
                  className="text-[#4caf50]/50"
                  strokeWidth={1}
                />
              </div>
              <p className="text-gray-500 font-medium text-center">
                {searchQuery
                  ? `No subject found for "${searchQuery}"`
                  : "No subject data available"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => router.push("/syllabus")}
                  className="text-[#4caf50] text-sm font-semibold hover:underline"
                >
                  View all subjects
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#6AB04C]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                      ? "bg-[#6AB04C] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#6AB04C]/40"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#6AB04C]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
