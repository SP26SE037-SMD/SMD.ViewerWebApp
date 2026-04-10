"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Route } from "lucide-react";
import SearchBar from "@/components/search-bar";
import PageHeader from "@/components/page-header";
import subjectApiRequest from "@/apiRequests/subject";
import { SubjectContentType } from "@/schemaValidations/subject.schema";

export default function LearningPathContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const searchByQuery =
    searchParams.get("searchBy") ||
    (searchParams.get("code") ? "code" : "name");
  const page = Number(searchParams.get("page")) || 0;
  const size = 10;

  const [subjects, setSubjects] = useState<SubjectContentType[]>([]);
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
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await subjectApiRequest.getSubjects({
          search: searchQuery.trim() || undefined,
          searchBy: searchByQuery === "code" ? "code" : "name",
          status: "COMPLETED",
          page,
          size,
          sortBy: "approvedDate",
          direction: "asc",
        });
        setSubjects(res?.payload?.data?.content || []);
      } catch (error) {
        console.error("Failed to fetch learning path subjects", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [page, searchByQuery, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
      params.set("searchBy", searchType);
    }
    params.set("page", "0");
    router.push(`/learning-path?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <PageHeader
        title="Learning Path"
        description="Search Learning path of subject"
        icon={<Route size={22} className="text-[#4caf50]" strokeWidth={1.7} />}
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
            router.push(`/learning-path?${params.toString()}`);
          }}
          namePlaceholder="Enter subject name..."
          codePlaceholder="Enter subject code..."
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
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6AB04C]" />
              <p className="text-sm text-gray-400">Loading subjects...</p>
            </motion.div>
          ) : subjects.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {subjects.map((subject, index) => (
                <motion.button
                  type="button"
                  key={subject.subjectId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/syllabus/${subject.subjectId}`)}
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-[#4caf50]/10 transition-colors">
                      <BookOpen size={20} className="text-[#4caf50]" />
                    </div>
                    <ArrowRight size={18} className="text-[#4caf50]" />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    {subject.subjectCode}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-gray-800">
                    {subject.subjectName}
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
                ? `No subject found for "${searchQuery}"`
                : "No subject data available"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
