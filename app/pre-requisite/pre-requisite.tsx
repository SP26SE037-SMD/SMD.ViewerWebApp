"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Network, Search } from "lucide-react";
import PageHeader from "@/components/page-header";
import subjectApiRequest from "@/apiRequests/subject";
import {
  SubjectContentType,
  SubjectPrerequisiteRequirementType,
} from "@/schemaValidations/subject.schema";

export default function PreRequisiteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectCodeQuery = (
    searchParams.get("code") ||
    searchParams.get("search") ||
    ""
  ).trim();

  const [subject, setSubject] = useState<SubjectContentType | null>(null);
  const [dependents, setDependents] = useState<
    SubjectPrerequisiteRequirementType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [localSearchCode, setLocalSearchCode] = useState(subjectCodeQuery);

  useEffect(() => {
    setLocalSearchCode(subjectCodeQuery);
  }, [subjectCodeQuery]);

  useEffect(() => {
    const fetchDependents = async () => {
      setLoading(true);

      if (!subjectCodeQuery) {
        setSubject(null);
        setDependents([]);
        setLoading(false);
        return;
      }

      try {
        const [dependentsRes, subjectRes] = await Promise.all([
          subjectApiRequest.getDependentSubjectsByPrerequisiteCode(
            subjectCodeQuery,
          ),
          subjectApiRequest.getSubjects({
            search: subjectCodeQuery,
            searchBy: "code",
            status: "COMPLETED",
            page: 0,
            size: 1,
          }),
        ]);

        setDependents(dependentsRes?.payload?.data || []);
        setSubject(subjectRes?.payload?.data?.content?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch dependent subjects", error);
        setSubject(null);
        setDependents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDependents();
  }, [subjectCodeQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearchCode.trim()) {
      params.set("code", localSearchCode.trim().toUpperCase());
    }

    const query = params.toString();
    router.push(query ? `/pre-requisite?${query}` : "/pre-requisite");
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] font-[Lexend]">
      <PageHeader
        title="Is Pre-Requisite"
        description="Search a subject is pre-requisite of"
        icon={
          <Network size={22} className="text-[#4caf50]" strokeWidth={1.7} />
        }
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center bg-white rounded-3xl border border-gray-200 shadow-sm transition-all p-1.5 min-w-0 focus-within:border-[#4caf50]/50 focus-within:ring-2 focus-within:ring-[#4caf50]/20">
              <div className="px-4 py-2 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700">
                Code
              </div>
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  value={localSearchCode}
                  onChange={(e) => setLocalSearchCode(e.target.value)}
                  placeholder="Enter subject code..."
                  className="flex-1 text-sm outline-none text-gray-800 bg-transparent placeholder-gray-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-10 py-4 text-white text-sm font-bold rounded-3xl transition-all active:scale-95 shrink-0 bg-[#4caf50] hover:bg-[#43a047] shadow-xl shadow-[#4caf50]/20"
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
              className="flex flex-col items-center justify-center py-24 gap-3"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4caf50]" />
              <p className="text-sm text-gray-400">Loading dependents...</p>
            </motion.div>
          ) : subjectCodeQuery ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {subject ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => router.push(`/syllabus/${subject.subjectId}`)}
                  className="w-full bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Subject
                      </p>
                      <h3 className="mt-1 text-base font-bold text-gray-800">
                        {subject.subjectCode} - {subject.subjectName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[#4caf50]">
                      <BookOpen size={18} className="text-[#4caf50]" />
                      <ArrowRight size={18} className="text-[#4caf50]" />
                    </div>
                  </div>
                </motion.button>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                  There is no syllabus for Subject{" "}
                  {subjectCodeQuery.toUpperCase()}.
                </div>
              )}

              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 bg-[#4caf50]/10 px-6 py-3 text-sm font-bold text-[#2f7a33]">
                  <p>Subjects learn after {subjectCodeQuery.toUpperCase()}</p>
                </div>
                {dependents.length > 0 ? (
                  dependents.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-2 px-6 py-4 border-t border-gray-100 text-sm text-gray-700"
                    >
                      <p className="font-semibold">
                        Subject Code: {item.subjectCode}
                      </p>
                      <p>Subject Name: {item.subjectName}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-6 text-sm text-gray-500">
                    No dependent subjects found.
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-gray-500"
            >
              Search by subject code to view dependent subjects.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
