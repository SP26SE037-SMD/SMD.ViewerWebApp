import http from "@/lib/http";
import {
  CloSessionMappingResType,
  SyllabusAssessmentResType,
  SyllabusMaterialResType,
  SyllabusResType,
  MaterialBlockResType,
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
    return http.get<SyllabusResType>(`/api/syllabuses?${params.toString()}`);
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
  getMaterialsBySyllabusId: (syllabusId: string) => {
    return http.get<SyllabusMaterialResType>(
      `/api/materials/syllabus/${syllabusId}?status=PUBLISHED`,
    );
  },
  getMaterialBlocksByMaterialId: (
    materialId: string,
    page = 1,
    size = 10,
  ) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<MaterialBlockResType>(
      `/api/blocks/material/${materialId}?${params.toString()}`,
    );
  },
};

export default syllabusApiRequest;
