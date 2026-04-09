import { useEffect, useState } from "react";
import subjectApiRequest from "@/apiRequests/subject";
import syllabusApiRequest from "@/apiRequests/syllabus";
import { SubjectDetailType } from "@/schemaValidations/subject.schema";
import { SyllabusContentType } from "@/schemaValidations/syllabus.schema";

export function useSyllabusDetail(subjectId: string) {
  const [syllabus, setSyllabus] = useState<SyllabusContentType | null>(null);
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetailType | null>(
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
          publishedSyllabusesRes.value?.payload?.data
        ) {
          const publishedData = publishedSyllabusesRes.value.payload.data;
          const publishedList = Array.isArray(publishedData)
            ? publishedData
            : [publishedData];
          const selectedSyllabusId = publishedList[0]?.syllabusId;
          if (selectedSyllabusId) {
            const syllabusRes =
              await syllabusApiRequest.getSyllabusDetail(selectedSyllabusId);
            setSyllabus(
              (syllabusRes?.payload?.data ??
                null) as SyllabusContentType | null,
            );
          } else {
            setSyllabus(null);
          }
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
