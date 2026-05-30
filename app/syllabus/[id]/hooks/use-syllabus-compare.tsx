import { useEffect, useState } from "react";
import {
  SyllabusContentType,
  SyllabusAssessmentType,
  SyllabusSessionType,
} from "@/schemaValidations/syllabus.schema";
import { CloSessionMappingType } from "@/schemaValidations/syllabus.schema";

interface SyllabusComparison {
  published: {
    content: SyllabusContentType | null;
    sessions: SyllabusSessionType[];
    assessments: SyllabusAssessmentType[];
    clos: CloSessionMappingType[];
  };
  archived: {
    content: SyllabusContentType | null;
    sessions: SyllabusSessionType[];
    assessments: SyllabusAssessmentType[];
    clos: CloSessionMappingType[];
  };
}

export function useSyllabiCompare(subjectId: string) {
  const [comparison, setComparison] = useState<SyllabusComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      try {
       
        setComparison(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch comparison data",
        );
        setComparison(null);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchComparison();
    }
  }, [subjectId]);

  return { comparison, loading, error };
}
