import http from "@/lib/http";
import { CurriculumResType } from "@/schemaValidations/curriculum.schema";

const curriculumApiRequest = {
  // Uses local Next.js proxy at /api/curriculums to avoid CORS
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
    return http.get<unknown>(`/api/curriculums/${id}`, { baseUrl: "" });
  },
};

export default curriculumApiRequest;
