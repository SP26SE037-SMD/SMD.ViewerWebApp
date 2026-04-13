import {
  CurriculumGroupType,
  CurriculumSemesterMappingSubjectType,
} from "@/schemaValidations/curriculum.schema";

export type DisplaySubjectRow = {
  key: string;
  semesterNo: number;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  prerequisiteSubjectCodes: string[];
  subjects: CurriculumSemesterMappingSubjectType[];
  group?: CurriculumGroupType;
  kind: "subject" | "elective" | "combo";
};
