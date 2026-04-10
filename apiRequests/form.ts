import {
  FormContentResType,
  FormFullResType,
} from "./../schemaValidations/form.schema";
import http from "@/lib/http";

const formApiRequest = {
  getFormsByCurriculumId: async (curriculumId: string) => {
    return http.get<FormContentResType>(
      `/api/forms?curriculumId=${curriculumId}`,
    );
  },
  getFormDetailByFormId: async (formId: string) => {
    return http.get<FormFullResType>(`/api/forms/${formId}/full`);
  },
};

export default formApiRequest;
