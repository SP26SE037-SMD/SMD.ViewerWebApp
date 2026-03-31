import http from "@/lib/http";
import { SyllabusResType } from "@/schemaValidations/syllabus.schema";

const syllabusApiRequest = {
  // Uses local Next.js proxy at /api/syllabuses to avoid CORS
  getSyllabuses: (search?: string, name?: string, code?: string, page = 0, size = 12) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (name) params.set("name", name);
    if (code) params.set("code", code);
    params.set("page", String(page));
    params.set("size", String(size));
    return http.get<SyllabusResType>(`/api/syllabuses?${params.toString()}`, { baseUrl: "" });
  },
};

export default syllabusApiRequest;
