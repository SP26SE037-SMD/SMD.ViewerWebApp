import http from "@/lib/http";
import { CurriculumBodyType, CurriculumResType } from "@/schemaValidations/curriculum.schema";

const curriculumApiRequest = {
  getList: (body: CurriculumBodyType) =>
    http.get<CurriculumResType>("/curriculums"),
  // Uses local Next.js proxy at /api/curriculums to avoid CORS
  getCurriculums: (search?: string, name?: string, code?: string, page = 0, size = 12) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (name) params.set("name", name);
    if (code) params.set("code", code);
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<CurriculumResType>(`/api/curriculums?${params.toString()}`, { baseUrl: "" });
  },
  getCurriculumById: (id: string) => {
    return http.get<any>(`/api/curriculums/${id}`, { baseUrl: "" });
  },
};

export default curriculumApiRequest;

