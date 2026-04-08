import { useEffect, useMemo, useState } from "react";
import curriculumApiRequest from "@/apiRequests/curriculum";
import { CurriculumDetail, Subject, TabKey } from "../types";

export function useCurriculumDetail(id: string) {
  const [curriculum, setCurriculum] = useState<CurriculumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [descExpanded, setDescExpanded] = useState(false);
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await curriculumApiRequest.getCurriculumById(id);
        if (res?.payload?.data) {
          setCurriculum(res.payload.data as CurriculumDetail);
          const semesters = new Set(
            ((res.payload.data as CurriculumDetail).subjects || []).map(
              (s: Subject) => s.semester,
            ),
          );
          setExpandedSemesters(semesters as Set<number>);
        } else {
          setCurriculum(null);
        }
      } catch (error) {
        console.error("Failed to fetch curriculum detail", error);
        setCurriculum(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const toggleSemester = (sem: number) => {
    setExpandedSemesters((prev) => {
      const next = new Set(prev);
      if (next.has(sem)) next.delete(sem);
      else next.add(sem);
      return next;
    });
  };

  const groupedSubjects = useMemo(() => {
    const result: Record<number, Subject[]> = {};
    if (!curriculum?.subjects) return result;

    curriculum.subjects.forEach((s) => {
      if (!result[s.semester]) result[s.semester] = [];
      result[s.semester].push(s);
    });
    return result;
  }, [curriculum?.subjects]);

  const sortedSemesters = useMemo(
    () =>
      Object.keys(groupedSubjects)
        .map(Number)
        .sort((a, b) => a - b),
    [groupedSubjects],
  );

  return {
    curriculum,
    loading,
    activeTab,
    setActiveTab,
    descExpanded,
    setDescExpanded,
    expandedSemesters,
    toggleSemester,
    groupedSubjects,
    sortedSemesters,
  };
}
