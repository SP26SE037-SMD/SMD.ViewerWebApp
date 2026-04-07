import { useEffect, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import syllabusApiRequest from "@/apiRequests/syllabus";
import { SubjectDetailData, SyllabusDetail } from "../types";

export function useSyllabusDetail(subjectId: string) {
  const [syllabus, setSyllabus] = useState<SyllabusDetail | null>(null);
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetailData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [publishedSyllabusesRes, subjectRes] = await Promise.allSettled([
          syllabusApiRequest.getPublishedSyllabusesBySubjectId(subjectId),
          subjectApiRequest.getSubjectDetail(subjectId),
        ]);

        if (
          publishedSyllabusesRes.status === "fulfilled" &&
          publishedSyllabusesRes.value?.payload?.data?.length
        ) {
          const selectedSyllabusId =
            publishedSyllabusesRes.value.payload.data[0].syllabusId;
          const syllabusRes =
            await syllabusApiRequest.getSyllabusDetail(selectedSyllabusId);
          setSyllabus(
            (syllabusRes?.payload?.data ?? null) as SyllabusDetail | null,
          );
        } else {
          setSyllabus(null);
        }

        if (
          subjectRes.status === "fulfilled" &&
          subjectRes.value?.payload?.data
        ) {
          setSubjectDetail(subjectRes.value.payload.data);
        } else {
          setSubjectDetail(null);
        }
      } catch (error) {
        console.error("Failed to fetch syllabus details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [subjectId]);

  return {
    loading,
    syllabus,
    subjectDetail,
  };
}
