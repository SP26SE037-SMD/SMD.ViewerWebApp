import http from "@/lib/http";
import {
  CloPloMappingsResType,
  CurriculumGroupResType,
  CurriculumDetailResType,
  CurriculumIdsResType,
  CurriculumPloResType,
  CurriculumResType,
  CurriculumSemesterMappingsResType,
} from "@/schemaValidations/curriculum.schema";

const curriculumApiRequest = {
  getCurriculums: (
    search?: string,
    searchBy: "name" | "code" = "name",
    status = "PUBLISHED",
    page = 0,
    size = 10,
    sortBy = "curriculumCode",
    direction: "asc" | "desc" = "asc",
  ) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("searchBy", searchBy);
    params.set("status", status);
    params.set("page", String(page));
    params.set("size", String(size));
    params.append("sort", sortBy);
    params.append("sort", direction);
    return http.get<CurriculumResType>(`/api/curriculums?${params.toString()}`);
  },
  getCurriculumById: (id: string) => {
    return http.get<CurriculumDetailResType>(`/api/curriculums/${id}`);
  },
  getSemesterMappingsByCurriculumId: (curriculumId: string) => {
    const params = new URLSearchParams();
    params.set("curriculumId", curriculumId);
    return http.get<CurriculumSemesterMappingsResType>(
      `/api/curriculum-group-subjects/semester-mappings?${params.toString()}`,
    );
  },
  getCurriculaBySubjectId: (subjectId: string) => {
    return http.get<CurriculumIdsResType>(
      `/api/curriculum-group-subjects/subjects/${subjectId}/curricula`,
    );
  },
  getCloPloMappingsBySubjectAndCurriculum: (
    subjectId: string,
    curriculumId: string,
  ) => {
    return http.get<CloPloMappingsResType>(
      `/api/clo-plo-mappings/subject/${subjectId}/curriculum/${curriculumId}`,
    );
  },
  getGroupById: (groupId: string) => {
    return http.get<CurriculumGroupResType>(`/api/group/${groupId}`);
  },
  getPlosByCurriculumId: (curriculumId: string, page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<CurriculumPloResType>(
      `/api/plos/curriculum/${curriculumId}?${params.toString()}`,
    );
  },
  getPloDetail: (ploId: string) => {
    return http.get<CurriculumPloResType>(`/api/plos/${ploId}`);
  },
};

export default curriculumApiRequest;
