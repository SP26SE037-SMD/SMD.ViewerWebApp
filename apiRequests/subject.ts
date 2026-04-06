import http from "@/lib/http";
import {
  SubjectBodyType,
  SubjectDetailResType,
  SubjectResType,
} from "@/schemaValidations/subject.schema";

const subjectApiRequest = {
  getSubjects: (body: Partial<SubjectBodyType> = {}) => {
    const params = new URLSearchParams();
    if (body.search) params.set("search", body.search);
    if (body.searchBy) params.set("searchBy", body.searchBy);
    params.set("status", body.status ?? "COMPLETED");
    params.set("page", String(body.page ?? 0));
    params.set("size", String(body.size ?? 10));
    if (body.sortBy) params.set("sortBy", body.sortBy);
    if (body.departmentId) params.set("departmentId", body.departmentId);
    if (body.direction) params.set("direction", body.direction);

    return http.get<SubjectResType>(`/api/subjects?${params.toString()}`);
  },
  getSubjectDetail: (subjectId: string) => {
    return http.get<SubjectDetailResType>(`/api/subjects/${subjectId}`);
  },
};

export default subjectApiRequest;
