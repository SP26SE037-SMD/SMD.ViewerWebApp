import http from "@/lib/http";
import { CurriculumBodyType, CurriculumResType } from "@/schemaValidations/curriculum.schema";

const curriculumApiRequest = {
  getList: (body: CurriculumBodyType) =>
    http.get<CurriculumResType>("/curriculums"),
};

export default curriculumApiRequest;
