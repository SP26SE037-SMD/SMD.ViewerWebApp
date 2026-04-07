import http from "@/lib/http";
import {
  CloSessionMappingResType,
  SyllabusAssessmentResType,
  SyllabusResType,
  SyllabusSessionResType,
} from "@/schemaValidations/syllabus.schema";

const syllabusApiRequest = {
  getSyllabuses: (
    search?: string,
    name?: string,
    code?: string,
    page = 0,
    size = 12,
  ) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (name) params.set("name", name);
    if (code) params.set("code", code);
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<SyllabusResType>(`/api/syllabuses?${params.toString()}`, {
      baseUrl: "",
    });
  },
  getPublishedSyllabusesBySubjectId: (subjectId: string) => {
    return http.get<SyllabusResType>(
      `/api/syllabus/subject/${subjectId}?status=PUBLISHED`,
    );
  },
  getSyllabusDetail: (syllabusId: string) => {
    return http.get<SyllabusResType>(`/api/syllabus/${syllabusId}`);
  },
  getSessionsBySyllabusId: (syllabusId: string) => {
    return http.get<SyllabusSessionResType>(
      `/api/sessions/syllabus/${syllabusId}`,
    );
  },
  getCloSessionMappingsBySessionId: (sessionId: string) => {
    return http.get<CloSessionMappingResType>(
      `/api/clo-session-mappings/session/${sessionId}`,
    );
  },
  getAssessmentsBySyllabusId: (syllabusId: string) => {
    return http.get<SyllabusAssessmentResType>(
      `/api/assessments/syllabus/${syllabusId}`,
    );
  },
};

export default syllabusApiRequest;
