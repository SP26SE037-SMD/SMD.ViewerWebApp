import http from "@/lib/http";
import {
  CurriculumGroupResType,
  CurriculumDetailResType,
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
