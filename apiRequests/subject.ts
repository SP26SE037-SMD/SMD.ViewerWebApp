import http from "@/lib/http";
import {
  SubjectBodyType,
  CloPloMappingResType,
  SubjectDetailResType,
  SubjectPrerequisiteRequirementsResType,
  SubjectSourceResType,
  SubjectResType,
  CloResType,
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
  getSourcesBySubjectId: (subjectId: string) => {
    return http.get<SubjectSourceResType>(`/api/sources/subject/${subjectId}`);
  },
  getCloBySubjectId: (subjectId: string) => {
    return http.get<CloResType>(`/api/clos/subject/${subjectId}`);
  },
  getCloPloMappingsBySubjectId: (subjectId: string) => {
    return http.get<CloPloMappingResType>(
      `/api/clo-plo-mappings/subject/${subjectId}`,
    );
  },
  getPrerequisiteRequirementsByCode: (subjectCode: string) => {
    return http.get<SubjectPrerequisiteRequirementsResType>(
      `/api/prerequisites/code/${encodeURIComponent(subjectCode)}/requirements`,
      {
        headers: {
          accept: "*/*",
        },
      },
    );
  },
  getDependentSubjectsByPrerequisiteCode: (subjectCode: string) => {
    return http.get<SubjectPrerequisiteRequirementsResType>(
      `/api/prerequisites/dependents/code/${encodeURIComponent(subjectCode)}/dependents`,
      {
        headers: {
          accept: "*/*",
        },
      },
    );
  },
};

export default subjectApiRequest;
