import http from "@/lib/http";
import {
  CloSessionMappingResType,
  CloAssessmentMappingResType,
  SyllabusAssessmentResType,
  SyllabusMaterialResType,
  SyllabusListResType,
  SyllabusCompareResType,
  SyllabusResType,
  MaterialBlockResType,
  SyllabusSessionResType,
  SessionMaterialBlockDetailResType,
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
    return http.get<SyllabusResType>(`/api/syllabuses?${params.toString()}`);
  },
  getPublishedSyllabusesBySubjectId: (subjectId: string) => {
    return http.get<SyllabusResType>(
      `/api/syllabus/subject/${subjectId}?status=PUBLISHED`,
    );
  },
  getSyllabusesBySubjectId: (subjectId: string) => {
    return http.get<SyllabusListResType>(`/api/syllabus/subject/${subjectId}`);
  },
  compareSyllabuses: (oldSyllabusId: string, newSyllabusId: string) => {
    const params = new URLSearchParams();
    params.set("oldSyllabusId", oldSyllabusId);
    params.set("newSyllabusId", newSyllabusId);
    return http.post<SyllabusCompareResType>(
      `/api/syllabus/compare?${params.toString()}`,
      null,
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
  getCloAssessmentMappingsByAssessmentId: (assessmentId: string) => {
    return http.get<CloAssessmentMappingResType>(
      `/api/clo-assessment-mappings/assessment/${assessmentId}`,
    );
  },
  getAssessmentsBySyllabusId: (syllabusId: string) => {
    return http.get<SyllabusAssessmentResType>(
      `/api/assessments/syllabus/${syllabusId}`,
    );
  },
  getMaterialsBySyllabusId: (syllabusId: string) => {
    return http.get<SyllabusMaterialResType>(
      `/api/materials/syllabus/${syllabusId}?status=PUBLISHED`,
    );
  },
  getMaterialBlocksByMaterialId: (materialId: string, page = 1, size = 10) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<MaterialBlockResType>(
      `/api/blocks/material/${materialId}?${params.toString()}`,
    );
  },
  getSessionMaterialBlockDetailBySessionId: (sessionId: string) => {
    const params = new URLSearchParams();
    params.set("sessionId", sessionId);
    return http.get<SessionMaterialBlockDetailResType>(
      `/api/session-material-blocks/detail?${params.toString()}`,
    );
  },
};

export default syllabusApiRequest;
