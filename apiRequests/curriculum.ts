import http from "@/lib/http";
import {
  CurriculumPloResType,
  CurriculumResType,
  CurriculumSubjectResType,
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
    return http.get<CurriculumResType>(`/api/curriculums/${id}`);
  },
  getPlosByCurriculumId: (curriculumId: string, page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<CurriculumPloResType>(
      `/api/plos/curriculum/${curriculumId}?${params.toString()}`,
    );
  },
  getSubjectsByCurriculumId: (curriculumId: string, page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.set("searchType", "curriculum");
    params.set("searchId", curriculumId);
    params.set("page", String(page));
    params.set("size", String(size));
    params.append("sort", "semester");
    params.append("sort", "asc");
    return http.get<CurriculumSubjectResType>(
      `/api/curriculum-group-subjects/subjects?${params.toString()}`,
    );
  },
};

export default curriculumApiRequest;
