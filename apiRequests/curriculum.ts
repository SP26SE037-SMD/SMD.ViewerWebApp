import http from "@/lib/http";
import { CurriculumBodyType, CurriculumResType } from "@/schemaValidations/curriculum.schema";

const curriculumApiRequest = {
  geList: (body: CurriculumBodyType) =>
    http.get<CurriculumResType>("/api/auth/curriculums"),
};

export default curriculumApiRequest;
